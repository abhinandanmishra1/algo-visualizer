import { AlgoRenderer, RenderOptions } from './types';
import { drawArrow, drawPointerBadge, drawBurnInCaption } from './canvasUtils';
import * as d3 from 'd3-hierarchy';

/**
 * Binary tree node definition
 */
export interface TreeData {
  value: any;
  left?: TreeData;
  right?: TreeData;
  id?: string | number;
}

/**
 * Tree visualization state
 */
export interface TreeState {
  highlightedNodeIds?: Set<string | number>;
  activeNodeId?: string | number;
  nodeStates?: Record<string | number, 'unvisited' | 'visiting' | 'visited'>;
}

/**
 * Computed node position
 */
interface NodePosition {
  id: string | number;
  value: any;
  x: number;
  y: number;
  radius: number;
  state: 'unvisited' | 'visiting' | 'visited';
  highlighted: boolean;
  active: boolean;
}

/**
 * Auto-generate IDs for tree nodes if not provided
 */
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

/**
 * Tree visualization renderer
 */
export class TreeRenderer implements AlgoRenderer<TreeData, TreeState> {

  render(
    ctx: CanvasRenderingContext2D,
    data: TreeData,
    state: TreeState,
    options: RenderOptions
  ): void {
    const { width, height, burnInCaption } = options;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Assign IDs if needed
    const dataWithIds = assignNodeIds(data, { value: 0 });
    if (!dataWithIds) return;

    // Build d3 hierarchy
    const root = d3.hierarchy(dataWithIds, (d: TreeData) => {
      const children: TreeData[] = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children.length > 0 ? children : undefined;
    });

    // Compute tree layout
    const treeLayout = d3.tree<TreeData>().size([width * 0.9, height * 0.8]);
    const layoutRoot = treeLayout(root);

    // Shift layout to center
    const offsetX = width * 0.05;
    const offsetY = height * 0.1;

    // Collect all node positions
    const nodePositions: NodePosition[] = [];

    layoutRoot.each((node: any) => {
      const id = node.data.id!;
      const posX = (node.x as number) + offsetX;
      const posY = (node.y as number) + offsetY;

      // Determine node radius based on value length
      const valueStr = String(node.data.value);
      const radius = Math.max(24, 12 + valueStr.length * 3);

      // Determine node state
      const nodeState = state.nodeStates?.[id] || 'unvisited';
      const highlighted = state.highlightedNodeIds?.has(id) || false;
      const active = state.activeNodeId === id;

      nodePositions.push({
        id,
        value: node.data.value,
        x: posX,
        y: posY,
        radius,
        state: nodeState,
        highlighted,
        active,
      });
    });

    // Draw edges first (parent to child)
    layoutRoot.links().forEach((link: any) => {
      const source = link.source.x! + offsetX;
      const sourceY = link.source.y! + offsetY;
      const target = link.target.x! + offsetX;
      const targetY = link.target.y! + offsetY;

      const sourceRadius = nodePositions.find((n) => n.id === link.source.data.id)?.radius || 24;
      const targetRadius = nodePositions.find((n) => n.id === link.target.data.id)?.radius || 24;

      // Calculate line endpoints (from node edge to node edge)
      const angle = Math.atan2(targetY - sourceY, target - source);
      const startX = source + sourceRadius * Math.cos(angle);
      const startY = sourceY + sourceRadius * Math.sin(angle);
      const endX = target - targetRadius * Math.cos(angle);
      const endY = targetY - targetRadius * Math.sin(angle);

      drawArrow(ctx, startX, startY, endX, endY, '#64748b', 9, 2.5);
    });

    // Draw nodes
    nodePositions.forEach((pos) => {
      ctx.save();

      // Determine node color based on state
      let fillColor = '#1e293b';
      let strokeColor = '#475569';
      let strokeWidth = 2;
      let shadowColor = 'transparent';
      let shadowBlur = 0;

      if (pos.highlighted) {
        // Amber for highlighted
        fillColor = '#92400e';
        strokeColor = '#f59e0b';
        strokeWidth = 4;
        shadowColor = '#f59e0b';
        shadowBlur = 15;
      } else if (pos.active) {
        // Purple for active
        fillColor = '#581c87';
        strokeColor = '#a855f7';
        strokeWidth = 3;
        shadowColor = '#a855f7';
        shadowBlur = 12;
      } else if (pos.state === 'visited') {
        // Emerald for visited
        fillColor = '#064e3b';
        strokeColor = '#10b981';
        strokeWidth = 2;
        shadowColor = '#10b981';
        shadowBlur = 8;
      } else if (pos.state === 'visiting') {
        // Sky for visiting
        fillColor = '#082f49';
        strokeColor = '#38bdf8';
        strokeWidth = 2;
        shadowColor = '#38bdf8';
        shadowBlur = 8;
      } else {
        // Gray for unvisited (default)
        fillColor = '#1e293b';
        strokeColor = '#475569';
        strokeWidth = 2;
      }

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Draw node value
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px Inter, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(pos.value), pos.x, pos.y);
      ctx.restore();
    });

    // Draw active/pointer badges if applicable
    if (state.activeNodeId !== undefined) {
      const activeNode = nodePositions.find((n) => n.id === state.activeNodeId);
      if (activeNode) {
        drawPointerBadge(
          ctx,
          activeNode.x,
          activeNode.y - activeNode.radius - 20,
          'Current',
          '#a855f7',
          '#ffffff',
          '📍'
        );
      }
    }

    // Draw burn-in caption
    if (burnInCaption) {
      drawBurnInCaption(ctx, burnInCaption, width, height);
    }
  }
}
