import type { Node, Edge } from 'reactflow';
import type { LinkedListData, LinkedListState } from '../../renderers/linkedListRenderer';
import { calculateNodePositions } from '../../renderers/linkedListRenderer';
import type { FlowAdapter, NodeVisualState, PointerBadge } from '../types';
import type { LinkedListFlowNodeData } from '../nodes/LinkedListFlowNode';
import type { ArrowEdgeData } from '../edges/ArrowEdge';

function resolveNodeState(
  idx: number,
  isCycleStart: boolean,
  state: LinkedListState
): NodeVisualState {
  const isSlowHere = state.slowIndex === idx;
  const isFastHere = state.fastIndex === idx;
  const isMeetingPoint = state.meetingIndex === idx;

  if (state.collision && isSlowHere && isFastHere) return 'highlight';
  if (isMeetingPoint) return 'highlight';
  if (isCycleStart) return 'active';
  return 'default';
}

function buildPointerMap(
  positions: { id: string }[],
  state: LinkedListState
): Map<number, PointerBadge | PointerBadge[]> {
  const map = new Map<number, PointerBadge | PointerBadge[]>();
  const customPointers = (state as { pointers?: Record<number, PointerBadge | PointerBadge[]> }).pointers;

  if (customPointers && typeof customPointers === 'object') {
    Object.entries(customPointers).forEach(([nodeIdxStr, ptr]) => {
      const nodeIdx = parseInt(nodeIdxStr, 10);
      if (positions[nodeIdx]) map.set(nodeIdx, ptr);
    });
    return map;
  }

  if (
    state.slowIndex !== undefined &&
    state.fastIndex !== undefined &&
    state.slowIndex === state.fastIndex &&
    positions[state.slowIndex]
  ) {
    map.set(
      state.slowIndex,
      state.collision
        ? { label: 'COLLISION! (Slow == Fast)', color: '#f59e0b', icon: '⚡', position: 'top' }
        : { label: 'Slow & Fast', color: '#6366f1', icon: '🐢🐇', position: 'top' }
    );
    return map;
  }

  if (state.slowIndex !== undefined && positions[state.slowIndex]) {
    map.set(state.slowIndex, { label: 'Slow', color: '#10b981', icon: '🐢', position: 'top' });
  }
  if (state.fastIndex !== undefined && positions[state.fastIndex]) {
    map.set(state.fastIndex, { label: 'Fast', color: '#f43f5e', icon: '🐇', position: 'bottom' });
  }
  return map;
}

export const linkedListAdapter: FlowAdapter<LinkedListData, LinkedListState> = {
  toFlow(data, state, width, height) {
    if (!data?.nodes?.length) return { nodes: [], edges: [] };

    const isVertical = height > width;
    const positions = calculateNodePositions(data.nodes, data.cycleStartIndex, width, height, isVertical);
    const pointerMap = buildPointerMap(positions, state);

    const nodes: Node<LinkedListFlowNodeData>[] = positions.map((pos, idx) => {
      const isCycleStart = data.cycleStartIndex === idx;
      return {
        id: pos.id,
        type: 'linkedListNode',
        position: { x: pos.x - pos.radius, y: pos.y - pos.radius },
        data: {
          label: String(pos.val),
          index: idx,
          state: resolveNodeState(idx, isCycleStart, state),
          isCycleStart,
          pointers: pointerMap.get(idx),
          radius: pos.radius,
        },
        draggable: true,
      };
    });

    const edges: Edge<ArrowEdgeData>[] = [];
    const reversedUpTo = state.reversedUpTo ?? 0;

    for (let i = 0; i < positions.length - 1; i++) {
      const curr = positions[i];
      const next = positions[i + 1];
      const isReversed = reversedUpTo > i;
      const from = isReversed ? next : curr;
      const to = isReversed ? curr : next;
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const x1 = from.x + from.radius * Math.cos(angle);
      const y1 = from.y + from.radius * Math.sin(angle);
      const x2 = to.x - to.radius * Math.cos(angle);
      const y2 = to.y - to.radius * Math.sin(angle);

      edges.push({
        id: `e-${i}-${curr.id}-${next.id}`,
        source: isReversed ? next.id : curr.id,
        target: isReversed ? curr.id : next.id,
        type: 'arrow',
        data: { x1, y1, x2, y2, color: isReversed ? '#a855f7' : undefined, highlighted: isReversed },
      });
    }

    if (data.cycleStartIndex >= 0 && data.cycleStartIndex < positions.length && positions.length > 0) {
      const last = positions[positions.length - 1];
      const cycleTarget = positions[data.cycleStartIndex];
      const angle = Math.atan2(cycleTarget.y - last.y, cycleTarget.x - last.x);
      const x1 = last.x + last.radius * Math.cos(angle);
      const y1 = last.y + last.radius * Math.sin(angle);
      const x2 = cycleTarget.x - cycleTarget.radius * Math.cos(angle);
      const y2 = cycleTarget.y - cycleTarget.radius * Math.sin(angle);

      edges.push({
        id: `e-cycle-${last.id}-${cycleTarget.id}`,
        source: last.id,
        target: cycleTarget.id,
        type: 'arrow',
        data: { x1, y1, x2, y2, curved: true, color: '#38bdf8' },
      });
    }

    return { nodes, edges };
  },
};
