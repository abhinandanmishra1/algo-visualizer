import { AlgoRenderer, RenderOptions } from './types';
import { drawArrow, drawBurnInCaption } from './canvasUtils';

/**
 * Node definition for diagram
 */
export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  shape?: 'box' | 'circle' | 'db' | 'cloud'; // box=default, circle=actor/node, db=database, cloud=service
  group?: string; // optional grouping/lane for sequence diagrams
}

/**
 * Edge definition for diagram
 */
export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'bidirectional';
}

/**
 * Lane definition for sequence diagrams
 */
export interface DiagramLane {
  id: string;
  label: string;
}

/**
 * Diagram visualization data
 */
export interface DiagramData {
  nodes: DiagramNode[];
  edges?: DiagramEdge[];
  lanes?: DiagramLane[];
}

/**
 * Diagram visualization state
 */
export interface DiagramState {
  highlightedNodeIds?: Set<string>;
  highlightedEdges?: Set<string>;
  activeNodeId?: string;
}

/**
 * Dimensions and position of a rendered node
 */
interface RenderedNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'box' | 'circle' | 'db' | 'cloud';
}

/**
 * DiagramRenderer: Generic diagram renderer for LLD/HLD/Networking/OS diagrams
 * Supports boxes, circles, databases, clouds with edges and optional lanes.
 * Uses hand-authored x/y coordinates for clean, readable layouts.
 */
export class DiagramRenderer implements AlgoRenderer<DiagramData, DiagramState> {
  render(
    ctx: CanvasRenderingContext2D,
    data: DiagramData,
    state: DiagramState,
    options: RenderOptions
  ): void {
    const { width, height, burnInCaption } = options;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    if (!data.nodes || data.nodes.length === 0) return;

    // Compute node dimensions
    const renderedNodes = this.computeNodeDimensions(data.nodes);

    // 1. Draw Lanes (if present)
    if (data.lanes && data.lanes.length > 0) {
      this.drawLanes(ctx, data.lanes, width, height, renderedNodes);
    }

    // 2. Draw Edges
    if (data.edges && data.edges.length > 0) {
      this.drawEdges(ctx, data.edges, renderedNodes, state);
    }

    // 3. Draw Nodes
    this.drawNodes(ctx, renderedNodes, state);

    // 4. Draw burn-in caption
    if (burnInCaption) {
      drawBurnInCaption(ctx, burnInCaption, width, height);
    }
  }

  /**
   * Compute dimensions for each node based on shape and label
   */
  private computeNodeDimensions(nodes: DiagramNode[]): RenderedNode[] {
    return nodes.map((node) => {
      const shape = node.shape || 'box';
      let width: number, height: number;

      if (shape === 'circle') {
        width = height = 56; // 28pt radius * 2
      } else if (shape === 'db') {
        width = 80;
        height = 70;
      } else if (shape === 'cloud') {
        width = 100;
        height = 60;
      } else {
        // box (default)
        width = 100;
        height = 56;
      }

      return {
        id: node.id,
        label: node.label,
        x: node.x,
        y: node.y,
        width,
        height,
        shape,
      };
    });
  }

  /**
   * Draw optional lanes as vertical bands
   */
  private drawLanes(
    ctx: CanvasRenderingContext2D,
    lanes: DiagramLane[],
    width: number,
    height: number,
    nodes: RenderedNode[]
  ): void {
    if (lanes.length === 0) return;

    // Calculate lane widths based on min/max x positions
    const nodesByGroup = new Map<string, RenderedNode[]>();
    nodes.forEach((node) => {
      const group = node.id; // Use node id as fallback grouping for now
      if (!nodesByGroup.has(group)) {
        nodesByGroup.set(group, []);
      }
      nodesByGroup.get(group)!.push(node);
    });

    const laneWidth = width / lanes.length;
    const laneHeaderHeight = 50;
    const laneStartY = laneHeaderHeight;
    const laneBodyHeight = height - laneHeaderHeight;

    lanes.forEach((lane, idx) => {
      const laneX = idx * laneWidth;

      // Draw lane background
      ctx.save();
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(30, 41, 59, 0.3)' : 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(laneX, laneStartY, laneWidth, laneBodyHeight);

      // Draw lane border
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(laneX, laneStartY, laneWidth, laneBodyHeight);

      // Draw lane header
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.fillRect(laneX, 0, laneWidth, laneHeaderHeight);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.strokeRect(laneX, 0, laneWidth, laneHeaderHeight);

      // Draw lane label
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lane.label, laneX + laneWidth / 2, laneHeaderHeight / 2);

      ctx.restore();
    });
  }

  /**
   * Draw edges with labels and different styles
   */
  private drawEdges(
    ctx: CanvasRenderingContext2D,
    edges: DiagramEdge[],
    nodes: RenderedNode[],
    state: DiagramState
  ): void {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    edges.forEach((edge) => {
      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);

      if (!fromNode || !toNode) return;

      const style = edge.style || 'solid';
      const isHighlighted =
        state.highlightedEdges?.has(`${edge.from}→${edge.to}`) ||
        state.highlightedEdges?.has(`${edge.to}→${edge.from}`);

      // Calculate edge endpoints (from node boundary to to node boundary)
      const { startX, startY } = this.getNodeExitPoint(fromNode);
      const { endX, endY } = this.getNodeEntryPoint(toNode);

      ctx.save();

      // Determine edge color and style
      const strokeColor = isHighlighted ? '#0284c7' : '#64748b';
      const lineWidth = isHighlighted ? 3 : 2;

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (style === 'dashed') {
        ctx.setLineDash([6, 3]);
      }

      // Draw line/arrow
      if (style === 'bidirectional') {
        // Draw two arrows
        const offsetAngle = Math.atan2(endY - startY, endX - startX);
        const offsetDist = 8;
        const offsetX = Math.sin(offsetAngle) * offsetDist;
        const offsetY = -Math.cos(offsetAngle) * offsetDist;

        // Forward arrow
        this.drawArrowLine(
          ctx,
          startX + offsetX,
          startY + offsetY,
          endX + offsetX,
          endY + offsetY,
          strokeColor,
          lineWidth
        );

        // Reverse arrow
        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([]);
        this.drawArrowLine(
          ctx,
          endX - offsetX,
          endY - offsetY,
          startX - offsetX,
          startY - offsetY,
          strokeColor,
          lineWidth
        );
        ctx.restore();
      } else {
        // Single arrow
        drawArrow(ctx, startX, startY, endX, endY, strokeColor, 8, lineWidth);
      }

      ctx.restore();

      // Draw edge label if present
      if (edge.label) {
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        ctx.save();
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px Inter, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        // Background for label
        const metrics = ctx.measureText(edge.label);
        const labelPadX = 6;
        const labelPadY = 3;
        const labelWidth = metrics.width + labelPadX * 2;
        const labelHeight = 18 + labelPadY * 2;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(midX - labelWidth / 2, midY - 12 - labelHeight / 2, labelWidth, labelHeight);

        // Label text
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(edge.label, midX, midY - 6);

        ctx.restore();
      }
    });
  }

  /**
   * Draw all nodes
   */
  private drawNodes(ctx: CanvasRenderingContext2D, nodes: RenderedNode[], state: DiagramState): void {
    nodes.forEach((node) => {
      const isActive = state.activeNodeId === node.id;
      const isHighlighted = state.highlightedNodeIds?.has(node.id);

      // Determine colors
      const isFocused = isActive || isHighlighted;
      const fillColor = isFocused ? '#0284c7' : '#1e293b';
      const strokeColor = isFocused ? '#38bdf8' : '#64748b';
      const lineWidth = isFocused ? 3 : 2;
      const shadowColor = isFocused ? '#0ea5e9' : 'transparent';
      const shadowBlur = isFocused ? 10 : 0;

      ctx.save();
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;

      // Draw shape
      switch (node.shape) {
        case 'circle':
          this.drawCircleNode(ctx, node);
          break;
        case 'db':
          this.drawDatabaseNode(ctx, node);
          break;
        case 'cloud':
          this.drawCloudNode(ctx, node);
          break;
        default:
          this.drawBoxNode(ctx, node);
      }

      ctx.restore();

      // Draw label
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
      ctx.restore();
    });
  }

  /**
   * Draw a box-shaped node
   */
  private drawBoxNode(ctx: CanvasRenderingContext2D, node: RenderedNode): void {
    const x = node.x - node.width / 2;
    const y = node.y - node.height / 2;

    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, node.width, node.height, 6);
    } else {
      ctx.beginPath();
      ctx.rect(x, y, node.width, node.height);
    }

    ctx.fill();
    ctx.stroke();
  }

  /**
   * Draw a circle-shaped node
   */
  private drawCircleNode(ctx: CanvasRenderingContext2D, node: RenderedNode): void {
    const radius = node.width / 2;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Draw a database-shaped node (cylinder approximation)
   */
  private drawDatabaseNode(ctx: CanvasRenderingContext2D, node: RenderedNode): void {
    const x = node.x - node.width / 2;
    const y = node.y - node.height / 2;
    const w = node.width;
    const h = node.height;
    const capHeight = h * 0.25;

    // Draw main rectangle body
    ctx.fillRect(x, y + capHeight, w, h - capHeight);
    ctx.strokeRect(x, y + capHeight, w, h - capHeight);

    // Draw top ellipse cap
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + capHeight, w / 2, capHeight / 2, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw bottom ellipse cap
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h, w / 2, capHeight / 2, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Draw a cloud-shaped node
   */
  private drawCloudNode(ctx: CanvasRenderingContext2D, node: RenderedNode): void {
    const x = node.x - node.width / 2;
    const y = node.y - node.height / 2;
    const w = node.width;
    const h = node.height;

    // Draw a simple cloud with rounded bumps
    ctx.beginPath();
    const bumpRadius = w * 0.2;
    const leftBump = x + bumpRadius;
    const rightBump = x + w - bumpRadius;
    const topY = y + h * 0.3;
    const bottomY = y + h;

    // Start from bottom left
    ctx.moveTo(x + bumpRadius, bottomY);

    // Bottom left to bottom
    ctx.quadraticCurveTo(x, bottomY - bumpRadius, leftBump, y + h * 0.5);

    // Left side bump
    ctx.quadraticCurveTo(x - bumpRadius / 2, topY, x + bumpRadius * 0.7, topY);

    // Top left to top center
    ctx.quadraticCurveTo(x + w / 2 - bumpRadius * 0.5, y, x + w / 2, y + bumpRadius * 0.5);

    // Top center to top right
    ctx.quadraticCurveTo(x + w / 2 + bumpRadius * 0.5, y, rightBump + bumpRadius * 0.3, topY);

    // Right side bump
    ctx.quadraticCurveTo(x + w + bumpRadius / 2, topY, rightBump, y + h * 0.5);

    // Bottom right to bottom
    ctx.quadraticCurveTo(x + w, bottomY - bumpRadius, x + w - bumpRadius, bottomY);

    // Bottom line back to start
    ctx.lineTo(x + bumpRadius, bottomY);

    ctx.fill();
    ctx.stroke();
  }

  /**
   * Get the exit point of a node for drawing edges
   */
  private getNodeExitPoint(node: RenderedNode): { startX: number; startY: number } {
    // For simplicity, exit from the right side of the node
    return {
      startX: node.x + node.width / 2,
      startY: node.y,
    };
  }

  /**
   * Get the entry point of a node for drawing edges
   */
  private getNodeEntryPoint(node: RenderedNode): { endX: number; endY: number } {
    // For simplicity, enter from the left side of the node
    return {
      endX: node.x - node.width / 2,
      endY: node.y,
    };
  }

  /**
   * Draw an arrow line (helper for bidirectional edges)
   */
  private drawArrowLine(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    lineWidth: number
  ): void {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const arrowSize = 8;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - arrowSize * Math.cos(angle - Math.PI / 6),
      toY - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - arrowSize * Math.cos(angle + Math.PI / 6),
      toY - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  }
}
