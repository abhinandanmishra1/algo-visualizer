import type { Node, Edge } from 'reactflow';
import type { DiagramData, DiagramState, DiagramNode } from '../../renderers/diagramRenderer';
import type { FlowAdapter, NodeVisualState } from '../types';
import type { DiagramFlowNodeData } from '../nodes/DiagramFlowNode';
import type { ArrowEdgeData } from '../edges/ArrowEdge';

const BIDIRECTIONAL_OFFSET = 8;

function shapeDimensions(shape: DiagramNode['shape']): { width: number; height: number } {
  switch (shape) {
    case 'circle':
      return { width: 56, height: 56 };
    case 'db':
      return { width: 80, height: 70 };
    case 'cloud':
      return { width: 100, height: 60 };
    default:
      return { width: 100, height: 56 };
  }
}

function resolveNodeState(id: string, state: DiagramState): NodeVisualState {
  if (state.activeNodeId === id) return 'active';
  if (state.highlightedNodeIds?.has(id)) return 'active';
  return 'default';
}

export const diagramAdapter: FlowAdapter<DiagramData, DiagramState> = {
  toFlow(data, state) {
    if (!data?.nodes?.length) return { nodes: [], edges: [] };

    const dims = new Map(data.nodes.map((n) => [n.id, shapeDimensions(n.shape || 'box')]));
    const positions = new Map(data.nodes.map((n) => [n.id, { x: n.x, y: n.y }]));

    const nodes: Node[] = data.nodes.map((n) => {
      const shape = n.shape || 'box';
      const { width, height } = dims.get(n.id)!;
      return {
        id: n.id,
        type: 'diagramNode',
        position: { x: n.x - width / 2, y: n.y - height / 2 },
        data: {
          label: n.label,
          shape,
          state: resolveNodeState(n.id, state),
          width,
          height,
        } satisfies DiagramFlowNodeData,
        draggable: true,
      };
    });

    const edges: Edge<ArrowEdgeData>[] = [];

    (data.edges ?? []).forEach((e, i) => {
      const from = positions.get(e.from);
      const to = positions.get(e.to);
      if (!from || !to) return;

      const fromRadius = dims.get(e.from)!.width / 2;
      const toRadius = dims.get(e.to)!.width / 2;
      const angle = Math.atan2(to.y - from.y, to.x - from.x);

      const startX = from.x + fromRadius * Math.cos(angle);
      const startY = from.y + fromRadius * Math.sin(angle);
      const endX = to.x - toRadius * Math.cos(angle);
      const endY = to.y - toRadius * Math.sin(angle);

      const isHighlighted =
        state.highlightedEdges?.has(`${e.from}→${e.to}`) ||
        state.highlightedEdges?.has(`${e.to}→${e.from}`) ||
        false;

      if (e.style === 'bidirectional') {
        const offsetX = Math.sin(angle) * BIDIRECTIONAL_OFFSET;
        const offsetY = -Math.cos(angle) * BIDIRECTIONAL_OFFSET;

        edges.push({
          id: `e-${i}-${e.from}-${e.to}-fwd`,
          source: e.from,
          target: e.to,
          type: 'arrow',
          data: {
            x1: startX + offsetX,
            y1: startY + offsetY,
            x2: endX + offsetX,
            y2: endY + offsetY,
            label: e.label,
            highlighted: isHighlighted,
          },
        });
        edges.push({
          id: `e-${i}-${e.from}-${e.to}-rev`,
          source: e.to,
          target: e.from,
          type: 'arrow',
          data: {
            x1: endX - offsetX,
            y1: endY - offsetY,
            x2: startX - offsetX,
            y2: startY - offsetY,
            highlighted: isHighlighted,
          },
        });
        return;
      }

      edges.push({
        id: `e-${i}-${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        type: 'arrow',
        data: {
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          label: e.label,
          highlighted: isHighlighted,
          dashed: e.style === 'dashed',
        },
      });
    });

    return { nodes, edges };
  },
};
