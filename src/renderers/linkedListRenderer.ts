import { AlgoRenderer, RenderOptions } from './types';
import {
  drawArrow,
  drawCurvedArrow,
  drawPointerBadge,
  drawBurnInCaption,
} from './canvasUtils';

export interface LinkedListNode {
  id: string;
  val: string | number;
}

export interface LinkedListData {
  nodes: LinkedListNode[];
  cycleStartIndex: number; // -1 if no cycle
}

export interface LinkedListState {
  slowIndex: number;
  fastIndex: number;
  meetingIndex?: number;
  cycleStartIndex?: number;
  phase?: 'detection' | 'find_start' | 'completed';
  collision?: boolean;
}

export interface NodePosition {
  id: string;
  val: string | number;
  x: number;
  y: number;
  radius: number;
}

export function calculateNodePositions(
  nodes: LinkedListNode[],
  cycleStartIndex: number,
  width: number,
  height: number,
  isVertical: boolean = false
): NodePosition[] {
  const positions: NodePosition[] = [];
  const radius = isVertical ? 22 : 28;

  if (cycleStartIndex < 0 || cycleStartIndex >= nodes.length) {
    // Pure linear linked list
    const spacing = (width - 140) / Math.max(1, nodes.length - 1);
    nodes.forEach((node, i) => {
      positions.push({
        id: node.id,
        val: node.val,
        x: isVertical ? width / 2 : 70 + i * spacing,
        y: isVertical ? 80 + i * ((height - 160) / Math.max(1, nodes.length - 1)) : height / 2,
        radius,
      });
    });
    return positions;
  }

  // Linear segment before cycle
  const linearCount = cycleStartIndex;
  const cycleCount = nodes.length - cycleStartIndex;

  const cycleCenterX = isVertical ? width / 2 : width * 0.65;
  const cycleCenterY = isVertical ? height * 0.58 : height * 0.5;
  const cycleRadius = isVertical
    ? Math.min(width * 0.32, 110)
    : Math.min(width * 0.22, height * 0.36, 120);

  const linearStartX = isVertical ? width / 2 : 70;
  const linearStartY = isVertical ? 65 : height * 0.5;

  const entryX = cycleCenterX - cycleRadius;
  const entryY = cycleCenterY;

  for (let i = 0; i < linearCount; i++) {
    const t = linearCount > 0 ? i / linearCount : 0;
    positions.push({
      id: nodes[i].id,
      val: nodes[i].val,
      x: isVertical ? linearStartX : linearStartX + t * (entryX - linearStartX),
      y: isVertical ? linearStartY + t * (entryY - linearStartY) : linearStartY,
      radius,
    });
  }

  // Circular cycle segment
  for (let j = 0; j < cycleCount; j++) {
    const angle = Math.PI + (j / cycleCount) * (2 * Math.PI);
    positions.push({
      id: nodes[linearCount + j].id,
      val: nodes[linearCount + j].val,
      x: cycleCenterX + cycleRadius * Math.cos(angle),
      y: cycleCenterY + cycleRadius * Math.sin(angle),
      radius,
    });
  }

  return positions;
}

export class LinkedListRenderer implements AlgoRenderer<LinkedListData, LinkedListState> {
  render(
    ctx: CanvasRenderingContext2D,
    data: LinkedListData,
    state: LinkedListState,
    options: RenderOptions
  ): void {
    const { width, height, aspectRatio, burnInCaption } = options;
    const isVertical = aspectRatio === '9:16';

    // Clear background
    ctx.clearRect(0, 0, width, height);

    const positions = calculateNodePositions(
      data.nodes,
      data.cycleStartIndex,
      width,
      height,
      isVertical
    );

    // 1. Draw Edges
    for (let i = 0; i < positions.length; i++) {
      const curr = positions[i];

      if (i < positions.length - 1) {
        // Normal linear edge or in-cycle edge
        const next = positions[i + 1];
        const angle = Math.atan2(next.y - curr.y, next.x - curr.x);
        const startX = curr.x + curr.radius * Math.cos(angle);
        const startY = curr.y + curr.radius * Math.sin(angle);
        const endX = next.x - next.radius * Math.cos(angle);
        const endY = next.y - next.radius * Math.sin(angle);

        drawArrow(ctx, startX, startY, endX, endY, '#64748b', 9, 2.5);
      } else if (data.cycleStartIndex >= 0 && data.cycleStartIndex < positions.length) {
        // Cycle back edge from last node to cycle start node
        const cycleTarget = positions[data.cycleStartIndex];
        const angle = Math.atan2(cycleTarget.y - curr.y, cycleTarget.x - curr.x);
        const startX = curr.x + curr.radius * Math.cos(angle);
        const startY = curr.y + curr.radius * Math.sin(angle);
        const endX = cycleTarget.x - cycleTarget.radius * Math.cos(angle);
        const endY = cycleTarget.y - cycleTarget.radius * Math.sin(angle);

        // Calculate control point arching outwards
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const normalX = -(endY - startY);
        const normalY = endX - startX;
        const normLen = Math.hypot(normalX, normalY) || 1;
        const curveOffset = isVertical ? 70 : 80;
        const ctrlX = midX + (normalX / normLen) * curveOffset;
        const ctrlY = midY + (normalY / normLen) * curveOffset;

        drawCurvedArrow(ctx, startX, startY, endX, endY, ctrlX, ctrlY, '#38bdf8', 10, 3);
      }
    }

    // 2. Draw Nodes
    positions.forEach((pos, idx) => {
      const isSlowHere = state.slowIndex === idx;
      const isFastHere = state.fastIndex === idx;
      const isMeetingPoint = state.meetingIndex === idx;
      const isCycleStart = data.cycleStartIndex === idx;

      ctx.save();

      // Node outer glow / highlight
      if (state.collision && isSlowHere && isFastHere) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 18;
      } else if (isMeetingPoint) {
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 12;
      } else if (isCycleStart) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
      }

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Node value
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.font = `bold ${isVertical ? 14 : 16}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(pos.val), pos.x, pos.y);

      // Node index / label above or below
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, monospace';
      ctx.fillText(`[${idx}]`, pos.x, pos.y + pos.radius + 14);

      if (isCycleStart) {
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('CYCLE START', pos.x, pos.y - pos.radius - 12);
      }
      ctx.restore();
    });

    // 3. Draw Pointers (Slow 🐢 & Fast 🐇)
    const slowNode = positions[state.slowIndex];
    const fastNode = positions[state.fastIndex];

    if (slowNode && fastNode && state.slowIndex === state.fastIndex) {
      // Both at the same node!
      const badgeY = slowNode.y - slowNode.radius - 22;
      if (state.collision) {
        drawPointerBadge(
          ctx,
          slowNode.x,
          badgeY,
          'COLLISION! (Slow == Fast)',
          '#f59e0b',
          '#0f172a',
          '⚡'
        );
      } else {
        drawPointerBadge(
          ctx,
          slowNode.x,
          badgeY,
          'Slow & Fast',
          '#6366f1',
          '#ffffff',
          '🐢🐇'
        );
      }
    } else {
      if (slowNode) {
        drawPointerBadge(
          ctx,
          slowNode.x,
          slowNode.y - slowNode.radius - 20,
          'Slow',
          '#10b981',
          '#ffffff',
          '🐢'
        );
      }
      if (fastNode) {
        drawPointerBadge(
          ctx,
          fastNode.x,
          fastNode.y + fastNode.radius + 28,
          'Fast',
          '#f43f5e',
          '#ffffff',
          '🐇'
        );
      }
    }

    // 4. Burn-in caption for Reels
    if (burnInCaption) {
      drawBurnInCaption(ctx, burnInCaption, width, height);
    }
  }
}
