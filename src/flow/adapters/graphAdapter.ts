import type { Node, Edge } from 'reactflow';
import type { GraphData, GraphState } from '../../renderers/graphRenderer';
import type { FlowAdapter, NodeVisualState } from '../types';
import type { GraphFlowNodeData } from '../nodes/GraphFlowNode';
import type { ArrowEdgeData } from '../edges/ArrowEdge';

const RADIUS = 30;

function calculateCircularLayout(
  nodes: GraphData['nodes'],
  width: number,
  height: number
): Record<string | number, { x: number; y: number }> {
  const layout: Record<string | number, { x: number; y: number }> = {};
  const n = nodes.length;
  if (n === 0) return layout;

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.32;

  nodes.forEach((node, index) => {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2;
    layout[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return layout;
}

function resolveNodeState(
  id: string | number,
  state: GraphState
): NodeVisualState {
  if (state.currentNode === id) return 'active';
  if (state.visitedNodes?.has(id)) return 'visited';
  if (state.highlightNodes?.includes(id)) return 'highlight';
  return 'default';
}

export const graphAdapter: FlowAdapter<GraphData, GraphState> = {
  toFlow(data, state, width, height) {
    if (!data?.nodes?.length) return { nodes: [], edges: [] };

    const layout = data.layout || calculateCircularLayout(data.nodes, width, height);

    const nodes: Node<GraphFlowNodeData>[] = data.nodes.map((n) => {
      const pos = layout[n.id] ?? { x: width / 2, y: height / 2 };
      const pointer = state.pointers?.[n.id];
      return {
        id: String(n.id),
        type: 'graphNode',
        position: { x: pos.x - RADIUS, y: pos.y - RADIUS },
        data: {
          label: n.label || String(n.val ?? n.id),
          state: resolveNodeState(n.id, state),
          pointers: pointer,
          radius: RADIUS,
        },
        draggable: true,
      };
    });

    const positionMap = new Map(data.nodes.map((n) => [n.id, layout[n.id] ?? { x: width / 2, y: height / 2 }]));

    const edges: Edge<ArrowEdgeData>[] = (data.edges ?? []).map((e, i) => {
      const from = positionMap.get(e.from)!;
      const to = positionMap.get(e.to)!;
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const x1 = from.x + RADIUS * Math.cos(angle);
      const y1 = from.y + RADIUS * Math.sin(angle);
      const x2 = to.x - RADIUS * Math.cos(angle);
      const y2 = to.y - RADIUS * Math.sin(angle);

      const edgeKey = `${e.from}-${e.to}`;
      const highlighted = state.processedEdges?.has(edgeKey) ?? false;

      return {
        id: `e-${i}-${e.from}-${e.to}`,
        source: String(e.from),
        target: String(e.to),
        type: 'arrow',
        data: { x1, y1, x2, y2, label: e.weight, highlighted },
      };
    });

    return { nodes, edges };
  },
};
