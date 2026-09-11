import type { Node, Edge } from 'reactflow';
import type { HeapData, HeapState } from '../../renderers/heapRenderer';
import type { FlowAdapter, NodeVisualState, PointerBadge } from '../types';
import type { HeapFlowNodeData, HeapLabelNodeData } from '../nodes/HeapFlowNode';
import type { ArrowEdgeData } from '../edges/ArrowEdge';

const RADIUS = 28;

interface TreeNode {
  value: unknown;
  index: number;
  left?: TreeNode;
  right?: TreeNode;
}

function arrayToTree(items: unknown[]): TreeNode | undefined {
  if (items.length === 0) return undefined;

  const nodes: (TreeNode | undefined)[] = items.map((value, index) => ({ value, index }));

  for (let i = 0; i < items.length; i++) {
    const leftChildIdx = 2 * i + 1;
    const rightChildIdx = 2 * i + 2;

    if (nodes[i]) {
      if (leftChildIdx < items.length && nodes[leftChildIdx]) {
        nodes[i]!.left = nodes[leftChildIdx];
      }
      if (rightChildIdx < items.length && nodes[rightChildIdx]) {
        nodes[i]!.right = nodes[rightChildIdx];
      }
    }
  }

  return nodes[0];
}

function calculateTreePositions(
  root: TreeNode | undefined,
  width: number,
  height: number
): Map<number, { x: number; y: number }> {
  const positions = new Map<number, { x: number; y: number }>();
  if (!root) return positions;

  const queue: { node: TreeNode; level: number }[] = [];
  const levelNodes: TreeNode[][] = [];

  queue.push({ node: root, level: 0 });
  let qIndex = 0;

  while (qIndex < queue.length) {
    const { node, level } = queue[qIndex];
    qIndex++;

    if (!levelNodes[level]) levelNodes[level] = [];
    levelNodes[level].push(node);

    if (node.left) queue.push({ node: node.left, level: level + 1 });
    if (node.right) queue.push({ node: node.right, level: level + 1 });
  }

  queue.length = 0;
  queue.push({ node: root, level: 0 });
  qIndex = 0;

  while (qIndex < queue.length) {
    const { node, level } = queue[qIndex];
    qIndex++;

    const position = levelNodes[level].indexOf(node);

    const verticalPadding = 60;
    const verticalSpacing = (height - 2 * verticalPadding) / Math.max(1, levelNodes.length - 1);
    const y = verticalPadding + level * verticalSpacing;

    const horizontalPadding = 60;
    const maxLevelWidth = Math.max(1, Math.pow(2, level));
    const horizontalSpacing = (width - 2 * horizontalPadding) / Math.max(1, maxLevelWidth - 1);
    const x = horizontalPadding + (position + 0.5) * (horizontalSpacing * 2);

    positions.set(node.index, { x, y });

    if (node.left) queue.push({ node: node.left, level: level + 1 });
    if (node.right) queue.push({ node: node.right, level: level + 1 });
  }

  return positions;
}

function getAllNodes(node: TreeNode | undefined): TreeNode[] {
  if (!node) return [];
  return [node, ...getAllNodes(node.left), ...getAllNodes(node.right)];
}

function resolveNodeState(index: number, state: HeapState): NodeVisualState {
  if (state.activeIndex === index) return 'active';
  const nodeState = state.nodeStates?.[index];
  if (nodeState === 'visited') return 'visited';
  if (nodeState === 'visiting') return 'visiting';
  if (state.highlightedIndices?.has(index)) return 'highlight';
  return 'default';
}

export const heapAdapter: FlowAdapter<HeapData, HeapState> = {
  toFlow(data, state, width, height) {
    if (!data?.items?.length) return { nodes: [], edges: [] };

    const root = arrayToTree(data.items);
    if (!root) return { nodes: [], edges: [] };

    const positions = calculateTreePositions(root, width, height);
    const allNodes = getAllNodes(root);

    const nodes: Node[] = allNodes.map((node) => {
      const pos = positions.get(node.index) ?? { x: width / 2, y: height / 2 };
      const rawPointer = state.pointers?.[node.index];
      const pointers: PointerBadge | PointerBadge[] | undefined = rawPointer
        ? (Array.isArray(rawPointer) ? rawPointer : [rawPointer]).map((p: any) => ({
            label: p.label,
            color: p.color || '#6366f1',
            icon: p.icon || '📍',
            position: p.position === 'bottom' ? 'bottom' : 'top',
          }))
        : undefined;

      return {
        id: `heap-${node.index}`,
        type: 'heapNode',
        position: { x: pos.x - RADIUS, y: pos.y - RADIUS },
        data: {
          label: String(node.value),
          index: node.index,
          state: resolveNodeState(node.index, state),
          pointers,
          radius: RADIUS,
        } satisfies HeapFlowNodeData,
        draggable: true,
      };
    });

    if (data.type) {
      nodes.push({
        id: 'heap-type-label',
        type: 'heapLabelNode',
        position: { x: 24, y: 4 },
        data: {
          label: `${data.type.toUpperCase()}-HEAP`,
          color: data.type === 'min' ? '#06b6d4' : '#f43f5e',
        } satisfies HeapLabelNodeData,
        draggable: false,
        selectable: false,
      });
    }

    const edges: Edge<ArrowEdgeData>[] = [];
    allNodes.forEach((node) => {
      const nodePos = positions.get(node.index);
      if (!nodePos) return;

      const addEdge = (child: TreeNode | undefined) => {
        if (!child) return;
        const childPos = positions.get(child.index);
        if (!childPos) return;

        const angle = Math.atan2(childPos.y - nodePos.y, childPos.x - nodePos.x);
        const x1 = nodePos.x + RADIUS * Math.cos(angle);
        const y1 = nodePos.y + RADIUS * Math.sin(angle);
        const x2 = childPos.x - RADIUS * Math.cos(angle);
        const y2 = childPos.y - RADIUS * Math.sin(angle);

        edges.push({
          id: `heap-e-${node.index}-${child.index}`,
          source: `heap-${node.index}`,
          target: `heap-${child.index}`,
          type: 'arrow',
          data: { x1, y1, x2, y2 },
        });
      };

      addEdge(node.left);
      addEdge(node.right);
    });

    return { nodes, edges };
  },
};
