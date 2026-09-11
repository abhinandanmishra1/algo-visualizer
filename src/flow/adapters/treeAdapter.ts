import type { Node, Edge } from 'reactflow';
import * as d3 from 'd3-hierarchy';
import type { TreeData, TreeState } from '../../renderers/treeRenderer';
import type { FlowAdapter, NodeVisualState } from '../types';
import type { TreeFlowNodeData } from '../nodes/TreeFlowNode';
import type { ArrowEdgeData } from '../edges/ArrowEdge';

function assignNodeIds(
  node: TreeData | undefined,
  counter: { value: number }
): TreeData | undefined {
  if (!node) return undefined;

  if (!node.id) {
    node.id = `node_${counter.value++}`;
  }

  return {
    ...node,
    left: assignNodeIds(node.left, counter),
    right: assignNodeIds(node.right, counter),
  };
}

function resolveNodeState(
  id: string | number,
  state: TreeState
): NodeVisualState {
  if (state.activeNodeId === id) return 'active';
  if (state.highlightedNodeIds?.has(id)) return 'highlight';
  const nodeState = state.nodeStates?.[id];
  if (nodeState === 'visiting') return 'visiting';
  if (nodeState === 'visited') return 'visited';
  return 'default';
}

export const treeAdapter: FlowAdapter<TreeData, TreeState> = {
  toFlow(data, state, width, height) {
    const dataWithIds = assignNodeIds(data, { value: 0 });
    if (!dataWithIds) return { nodes: [], edges: [] };

    const root = d3.hierarchy(dataWithIds, (d: TreeData) => {
      const children: TreeData[] = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children.length > 0 ? children : undefined;
    });

    const treeLayout = d3.tree<TreeData>().size([width * 0.9, height * 0.8]);
    const layoutRoot = treeLayout(root);

    const offsetX = width * 0.05;
    const offsetY = height * 0.1;

    interface Positioned {
      id: string | number;
      value: unknown;
      x: number;
      y: number;
      radius: number;
    }

    const positioned: Positioned[] = [];
    const nodes: Node<TreeFlowNodeData>[] = [];

    layoutRoot.each((node) => {
      const id = node.data.id!;
      const posX = (node.x as number) + offsetX;
      const posY = (node.y as number) + offsetY;
      const valueStr = String(node.data.value);
      const radius = Math.max(24, 12 + valueStr.length * 3);

      positioned.push({ id, value: node.data.value, x: posX, y: posY, radius });

      nodes.push({
        id: String(id),
        type: 'treeNode',
        position: { x: posX - radius, y: posY - radius },
        data: {
          label: valueStr,
          state: resolveNodeState(id, state),
          radius,
        },
        draggable: true,
      });
    });

    const positionMap = new Map(positioned.map((p) => [p.id, p]));

    const edges: Edge<ArrowEdgeData>[] = layoutRoot.links().map((link, i) => {
      const source = positionMap.get(link.source.data.id!)!;
      const target = positionMap.get(link.target.data.id!)!;

      const angle = Math.atan2(target.y - source.y, target.x - source.x);
      const x1 = source.x + source.radius * Math.cos(angle);
      const y1 = source.y + source.radius * Math.sin(angle);
      const x2 = target.x - target.radius * Math.cos(angle);
      const y2 = target.y - target.radius * Math.sin(angle);

      return {
        id: `e-${i}-${source.id}-${target.id}`,
        source: String(source.id),
        target: String(target.id),
        type: 'arrow',
        data: { x1, y1, x2, y2 },
      };
    });

    return { nodes, edges };
  },
};
