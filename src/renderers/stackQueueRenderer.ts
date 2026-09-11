import { AlgoRenderer, RenderOptions } from './types';
import { drawPointerBadge, drawBurnInCaption } from './canvasUtils';

export interface StackQueueData {
  type: 'stack' | 'queue';
  items: any[];
  size?: number; // max capacity if bounded
}

export interface StackQueueState {
  highlightedIndices?: Set<number>;
  activeIndex?: number; // head/top pointer
  lastOp?: 'push' | 'pop' | 'enqueue' | 'dequeue';
  recentOpIndex?: number; // which item was affected by lastOp
}

interface BoxLayout {
  index: number;
  value: any;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class StackQueueRenderer implements AlgoRenderer<StackQueueData, StackQueueState> {
  render(
    ctx: CanvasRenderingContext2D,
    data: StackQueueData,
    state: StackQueueState,
    options: RenderOptions
  ): void {
    const { width, height, burnInCaption } = options;

    ctx.clearRect(0, 0, width, height);

    const { type, items } = data;
    if (!items || items.length === 0) {
      ctx.save();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Empty', width / 2, height / 2);
      ctx.restore();
      return;
    }

    const layouts =
      type === 'stack'
        ? this.calculateStackLayout(items, width, height)
        : this.calculateQueueLayout(items, width, height);

    // Draw boxes
    layouts.forEach((layout) => {
      this.drawBox(ctx, layout, state, data.type);
    });

    // Draw operation arrow if there was a recent operation
    if (state.lastOp && state.recentOpIndex !== undefined) {
      const layout = layouts.find((l) => l.index === state.recentOpIndex);
      if (layout) {
        this.drawOperationArrow(ctx, layout, state.lastOp, data.type);
      }
    }

    // Draw active/head pointer badge
    if (state.activeIndex !== undefined) {
      const layout = layouts.find((l) => l.index === state.activeIndex);
      if (layout) {
        const label =
          data.type === 'stack' ? 'TOP' : 'HEAD';
        const icon = data.type === 'stack' ? '📦' : '🔗';
        const badgeY = data.type === 'stack'
          ? layout.y - layout.height / 2 - 24
          : layout.y + layout.height / 2 + 28;
        drawPointerBadge(ctx, layout.x, badgeY, label, '#3b82f6', '#ffffff', icon);
      }
    }

    // Draw capacity info if bounded
    if (data.size !== undefined) {
      ctx.save();
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Inter, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Capacity: ${items.length} / ${data.size}`, width - 24, 36);
      ctx.restore();
    }

    // Burn-in caption for Reels
    if (burnInCaption) {
      drawBurnInCaption(ctx, burnInCaption, width, height);
    }
  }

  private calculateStackLayout(items: any[], width: number, height: number): BoxLayout[] {
    const boxHeight = 56;
    const boxWidth = 120;
    const spacing = 12;
    const totalHeight = items.length * boxHeight + (items.length - 1) * spacing;

    const startX = width / 2 - boxWidth / 2;
    const maxAvailableHeight = height - 120;
    const scale = totalHeight > maxAvailableHeight ? maxAvailableHeight / totalHeight : 1;

    const scaledBoxHeight = boxHeight * scale;
    const scaledSpacing = spacing * scale;
    const scaledBoxWidth = boxWidth * scale;

    const totalScaledHeight =
      items.length * scaledBoxHeight + (items.length - 1) * scaledSpacing;
    const startY = (height - totalScaledHeight) / 2 + 30;

    const layouts: BoxLayout[] = [];
    items.forEach((item, i) => {
      // Stack grows upward: bottom item at index 0, top item at index n-1
      const reverseIdx = items.length - 1 - i;
      layouts.push({
        index: i,
        value: item,
        x: startX,
        y: startY + reverseIdx * (scaledBoxHeight + scaledSpacing),
        width: scaledBoxWidth,
        height: scaledBoxHeight,
      });
    });

    return layouts;
  }

  private calculateQueueLayout(items: any[], width: number, height: number): BoxLayout[] {
    const boxHeight = 56;
    const boxWidth = 80;
    const spacing = 8;
    const totalWidth = items.length * boxWidth + (items.length - 1) * spacing;

    const scale = totalWidth > width - 80 ? (width - 80) / totalWidth : 1;
    const scaledBoxWidth = boxWidth * scale;
    const scaledSpacing = spacing * scale;
    const scaledBoxHeight = boxHeight * scale;

    const totalScaledWidth = items.length * scaledBoxWidth + (items.length - 1) * scaledSpacing;
    const startX = (width - totalScaledWidth) / 2;
    const startY = height / 2 - scaledBoxHeight / 2;

    const layouts: BoxLayout[] = [];
    items.forEach((item, i) => {
      layouts.push({
        index: i,
        value: item,
        x: startX + i * (scaledBoxWidth + scaledSpacing),
        y: startY,
        width: scaledBoxWidth,
        height: scaledBoxHeight,
      });
    });

    return layouts;
  }

  private drawBox(
    ctx: CanvasRenderingContext2D,
    layout: BoxLayout,
    state: StackQueueState,
    _type: 'stack' | 'queue'
  ): void {
    const { x, y, width, height, value, index } = layout;

    const isActive = state.activeIndex === index;
    const isHighlighted = state.highlightedIndices?.has(index);
    const isRecent = state.recentOpIndex === index;

    ctx.save();

    // Determine colors
    let fillColor = '#1e293b';
    let strokeColor = '#475569';
    let lineWidth = 2;
    let shadowColor = 'transparent';
    let shadowBlur = 0;
    let textColor = '#f8fafc';

    if (isRecent && state.lastOp) {
      // Amber flash for recent operation
      fillColor = '#78350f';
      strokeColor = '#f59e0b';
      lineWidth = 3;
      shadowColor = '#f59e0b';
      shadowBlur = 12;
      textColor = '#fef3c7';
    } else if (isActive) {
      // Bright blue for active/head
      fillColor = '#0c4a6e';
      strokeColor = '#0284c7';
      lineWidth = 3;
      shadowColor = '#0284c7';
      shadowBlur = 12;
      textColor = '#f0f9ff';
    } else if (isHighlighted) {
      fillColor = '#1e3a8a';
      strokeColor = '#3b82f6';
      lineWidth = 2.5;
      shadowColor = '#3b82f6';
      shadowBlur = 8;
      textColor = '#dbeafe';
    }

    // Draw box
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;

    const cornerRadius = 6;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x - width / 2, y - height / 2, width, height, cornerRadius);
    } else {
      ctx.rect(x - width / 2, y - height / 2, width, height);
    }
    ctx.fill();
    ctx.stroke();

    // Draw value inside box
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = textColor;
    ctx.font = `bold ${layout.width > 100 ? 14 : 12}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const valueStr = String(value);
    const displayValue = valueStr.length > 10 ? valueStr.substring(0, 10) + '...' : valueStr;
    ctx.fillText(displayValue, x, y + 2);

    // Draw index below or above box
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, monospace';
    ctx.fillText(`[${index}]`, x, y + height / 2 + 14);

    ctx.restore();
  }

  private drawOperationArrow(
    ctx: CanvasRenderingContext2D,
    layout: BoxLayout,
    op: 'push' | 'pop' | 'enqueue' | 'dequeue',
    type: 'stack' | 'queue'
  ): void {
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.lineWidth = 2.5;

    const arrowLength = 24;
    const { x, y, width, height } = layout;

    if (type === 'stack') {
      if (op === 'push') {
        // Arrow pointing down into the stack
        const startY = y - height / 2 - arrowLength;
        const endY = y - height / 2 - 4;
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x, endY);
        ctx.lineTo(x - 6, endY - 8);
        ctx.lineTo(x + 6, endY - 8);
        ctx.closePath();
        ctx.fill();
      } else if (op === 'pop') {
        // Arrow pointing up out of the stack
        const startY = y - height / 2 - 4;
        const endY = y - height / 2 - arrowLength;
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x, endY);
        ctx.lineTo(x - 6, endY + 8);
        ctx.lineTo(x + 6, endY + 8);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      // Queue
      if (op === 'enqueue') {
        // Arrow pointing right
        const startX = x + width / 2 + 4;
        const endX = x + width / 2 + arrowLength;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(endX, y);
        ctx.lineTo(endX - 8, y - 6);
        ctx.lineTo(endX - 8, y + 6);
        ctx.closePath();
        ctx.fill();
      } else if (op === 'dequeue') {
        // Arrow pointing left
        const startX = x - width / 2 - 4;
        const endX = x - width / 2 - arrowLength;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(endX, y);
        ctx.lineTo(endX + 8, y - 6);
        ctx.lineTo(endX + 8, y + 6);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
