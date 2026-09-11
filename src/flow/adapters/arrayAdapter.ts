import type { Node } from 'reactflow';
import type { ArrayData, ArrayState } from '../../renderers/arrayRenderer';
import type { FlowAdapter, NodeVisualState, PointerBadge } from '../types';
import type { ArrayFlowNodeData, ArrayLabelFlowNodeData } from '../nodes/ArrayFlowNode';

const MAX_BOX_WIDTH = 64;
const BOX_HEIGHT = 56;
const SPACING = 8;

function resolveNodeState(i: number, state: ArrayState): NodeVisualState {
  const isMid = state.mid === i;
  const isFound = state.found && isMid;
  const isSwapped = (state as { swappedIndices?: number[] }).swappedIndices?.includes(i);
  const isActive = state.activeIndices?.includes(i);
  const isEliminated =
    (state.left !== undefined && i < state.left) ||
    (state.right !== undefined && i > state.right);

  if (isFound) return 'found';
  if (isSwapped) return 'highlight';
  if (isActive) return 'active';
  if (isMid) return 'active';
  if (isEliminated) return 'eliminated';
  return 'default';
}

function defaultPointers(i: number, state: ArrayState): PointerBadge[] | undefined {
  const isLeft = state.left === i;
  const isRight = state.right === i;
  const isMid = state.mid === i;
  const isFound = state.found && isMid;

  const badges: PointerBadge[] = [];
  if (isMid) {
    badges.push({
      label: 'MID',
      color: isFound ? '#10b981' : '#6366f1',
      icon: isFound ? '🎯' : '📍',
      position: 'top',
    });
  }
  if (isLeft && !isMid) {
    badges.push({ label: 'L', color: '#06b6d4', icon: '👈', position: 'bottom' });
  }
  if (isRight && !isMid) {
    badges.push({ label: 'R', color: '#f43f5e', icon: '👉', position: 'bottom' });
  }
  return badges.length > 0 ? badges : undefined;
}

export const arrayAdapter: FlowAdapter<ArrayData, ArrayState> = {
  toFlow(data, state, width, height) {
    const elements = state.elements ?? data.elements;
    const n = elements.length;
    if (n === 0) return { nodes: [], edges: [] };

    const totalContentWidth = n * MAX_BOX_WIDTH + (n - 1) * SPACING;
    const scale = totalContentWidth > width - 80 ? (width - 80) / totalContentWidth : 1;

    const boxWidth = MAX_BOX_WIDTH * scale;
    const cellSpacing = SPACING * scale;
    const startX = (width - (n * boxWidth + (n - 1) * cellSpacing)) / 2;
    const startY = height * 0.45;

    const nodes: Node<ArrayFlowNodeData | ArrayLabelFlowNodeData>[] = [];

    if (state.target !== undefined) {
      nodes.push({
        id: 'array-target-label',
        type: 'arrayLabel',
        position: { x: 40, y: 24 },
        data: { text: `Target: ${state.target}` },
        draggable: false,
        selectable: false,
      });
    }

    for (let i = 0; i < n; i++) {
      const x = startX + i * (boxWidth + cellSpacing);
      const customPointers = (state as { pointers?: Record<number, PointerBadge | PointerBadge[]> }).pointers?.[i];
      const pointers = customPointers ?? defaultPointers(i, state);

      nodes.push({
        id: `arr-${i}`,
        type: 'arrayNode',
        position: { x, y: startY },
        data: {
          label: String(elements[i]),
          index: i,
          state: resolveNodeState(i, state),
          pointers,
          width: boxWidth,
          height: BOX_HEIGHT,
        },
        draggable: true,
      });
    }

    return { nodes, edges: [] };
  },
};
