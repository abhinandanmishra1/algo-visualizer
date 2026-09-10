import { AlgoRenderer, RenderOptions } from './types';
import { drawArrow, drawPointerBadge, drawBurnInCaption } from './canvasUtils';

/**
 * Graph node definition
 */
export interface GraphNode {
  id: string | number;
  label?: string;
  val?: string | number; // backward compat with linked-list format
}

/**
 * Graph edge definition
 */
export interface GraphEdge {
  from: string | number;
  to: string | number;
  weight?: number;
}

/**
 * Position of a node in 2D space
 */
export interface GraphNodePosition {
  id: string | number;
  label: string;
  x: number;
  y: number;
  radius: number;
}

/**
 * Graph visualization data
 */
export interface GraphData {
  nodes: GraphNode[];
  edges?: GraphEdge[];
  layout?: Record<string | number, { x: number; y: number }>;
}

/**
 * Graph visualization state
 */
export interface GraphState {
  visitedNodes?: Set<string | number>;
  currentNode?: string | number;
  processedEdges?: Set<string>;
  highlightNodes?: (string | number)[];
  // Backward compat with pointers system
  pointers?: Record<string | number, any>;
}

/**
 * Calculate circular layout for graph nodes
 */
function calculateCircularLayout(
  nodes: GraphNode[],
  width: number,
  height: number
): Record<string | number, { x: number; y: number }> {
  const layout: Record<string | number, { x: number; y: number }> = {};
  const n = nodes.length;
  if (n === 0) return layout;

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.3;

  nodes.forEach((node, index) => {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2; // Start from top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    layout[node.id] = { x, y };
  });

  return layout;
}

/**
 * Get node positions for rendering
 */
function getNodePositions(
  nodes: GraphNode[],
  providedLayout: Record<string | number, { x: number; y: number }> | undefined,
  width: number,
  height: number
): GraphNodePosition[] {
  const layout = providedLayout || calculateCircularLayout(nodes, width, height);
  const radius = 28;

  return nodes.map((node) => {
    const pos = layout[node.id];
    const label = node.label || String(node.val || node.id);
    return {
      id: node.id,
      label,
      x: pos ? pos.x : width / 2,
      y: pos ? pos.y : height / 2,
      radius,
    };
  });
}

/**
 * GraphRenderer: Minimal graph visualization with circular layout
 * Supports nodes and edges with customizable state coloring.
 */
export class GraphRenderer implements AlgoRenderer<GraphData, GraphState> {
  render(
    ctx: CanvasRenderingContext2D,
    data: GraphData,
    state: GraphState,
    options: RenderOptions
  ): void {
    const { width, height, burnInCaption } = options;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    if (!data.nodes || data.nodes.length === 0) return;

    // Get node positions
    const positions = getNodePositions(data.nodes, data.layout, width, height);

    // 1. Draw Edges
    if (data.edges && data.edges.length > 0) {
      const positionMap = new Map(positions.map((p) => [p.id, p]));

      data.edges.forEach((edge) => {
        const fromPos = positionMap.get(edge.from);
        const toPos = positionMap.get(edge.to);

        if (!fromPos || !toPos) return;

        // Calculate arrow start and end with node radius offset
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        const startX = fromPos.x + fromPos.radius * Math.cos(angle);
        const startY = fromPos.y + fromPos.radius * Math.sin(angle);
        const endX = toPos.x - toPos.radius * Math.cos(angle);
        const endY = toPos.y - toPos.radius * Math.sin(angle);

        // Draw arrow
        drawArrow(ctx, startX, startY, endX, endY, '#64748b', 9, 2.5);

        // Draw edge weight if present
        if (edge.weight !== undefined) {
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          ctx.save();
          ctx.fillStyle = '#94a3b8';
          ctx.font = '11px Inter, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(edge.weight), midX, midY - 12);
          ctx.restore();
        }
      });
    }

    // 2. Draw Nodes
    positions.forEach((pos) => {
      const isVisited = state.visitedNodes?.has(pos.id);
      const isCurrent = state.currentNode === pos.id;
      const isHighlight = state.highlightNodes?.includes(pos.id);

      ctx.save();

      // Determine node color based on state
      let fillColor = '#1e293b'; // default dark slate
      let strokeColor = '#475569'; // default stroke
      let lineWidth = 2;
      let shadowColor = 'transparent';
      let shadowBlur = 0;

      if (isCurrent) {
        fillColor = '#0284c7';
        strokeColor = '#38bdf8';
        lineWidth = 3;
        shadowColor = '#0ea5e9';
        shadowBlur = 12;
      } else if (isVisited) {
        fillColor = '#10b981';
        strokeColor = '#34d399';
        lineWidth = 3;
        shadowColor = '#10b981';
        shadowBlur = 8;
      } else if (isHighlight) {
        fillColor = '#f59e0b';
        strokeColor = '#fbbf24';
        lineWidth = 3;
        shadowColor = '#f59e0b';
        shadowBlur = 12;
      }

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Draw node label
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pos.label, pos.x, pos.y);
      ctx.restore();

      // Draw node id below if different from label
      if (pos.id !== pos.label) {
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`[${pos.id}]`, pos.x, pos.y + pos.radius + 8);
        ctx.restore();
      }
    });

    // 3. Draw Custom Pointers
    const customPointers = state.pointers;
    if (customPointers && typeof customPointers === 'object') {
      const positionMap = new Map(positions.map((p) => [p.id, p]));

      Object.entries(customPointers).forEach(([nodeIdStr, ptr]: [string, any]) => {
        const nodeId = isNaN(Number(nodeIdStr)) ? nodeIdStr : Number(nodeIdStr);
        const nodePos = positionMap.get(nodeId);
        if (!nodePos) return;

        const ptrList = Array.isArray(ptr) ? ptr : [ptr];
        ptrList.forEach((p: any, pIdx: number) => {
          const isTop = p.position === 'top' || p.position === undefined;
          const py = isTop
            ? nodePos.y - nodePos.radius - 20 - pIdx * 24
            : nodePos.y + nodePos.radius + 28 + pIdx * 24;
          drawPointerBadge(
            ctx,
            nodePos.x,
            py,
            p.label,
            p.color || '#6366f1',
            '#ffffff',
            p.icon || '📍'
          );
        });
      });
    }

    // 4. Draw burn-in caption
    if (burnInCaption) {
      drawBurnInCaption(ctx, burnInCaption, width, height);
    }
  }
}
