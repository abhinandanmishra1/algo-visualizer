import { AlgoRenderer, RenderOptions } from './types';
import { drawPointerBadge, drawBurnInCaption } from './canvasUtils';

export interface ArrayData {
  elements: (number | string)[];
  target?: number | string;
}

export interface ArrayState {
  left?: number;
  right?: number;
  mid?: number;
  target?: number | string;
  found?: boolean;
  activeIndices?: number[];
  eliminatedIndices?: number[];
}

export class ArrayRenderer implements AlgoRenderer<ArrayData, ArrayState> {
  render(
    ctx: CanvasRenderingContext2D,
    data: ArrayData,
    state: ArrayState,
    options: RenderOptions
  ): void {
    const { width, height, burnInCaption } = options;

    ctx.clearRect(0, 0, width, height);

    const elements = data.elements;
    const n = elements.length;
    if (n === 0) return;

    const maxBoxWidth = 64;
    const boxHeight = 56;
    const spacing = 8;
    const totalContentWidth = n * maxBoxWidth + (n - 1) * spacing;
    const scale = totalContentWidth > width - 80 ? (width - 80) / totalContentWidth : 1;

    const boxWidth = maxBoxWidth * scale;
    const cellSpacing = spacing * scale;
    const startX = (width - (n * boxWidth + (n - 1) * cellSpacing)) / 2;
    const startY = height * 0.45;

    // Draw Target Info at Top Left
    if (state.target !== undefined) {
      ctx.save();
      ctx.font = 'bold 15px Inter, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Target: ${state.target}`, 40, 48);
      ctx.restore();
    }

    // Draw Array Cells
    for (let i = 0; i < n; i++) {
      const x = startX + i * (boxWidth + cellSpacing);
      const y = startY;

      const isLeft = state.left === i;
      const isRight = state.right === i;
      const isMid = state.mid === i;
      const isFound = state.found && isMid;
      const isEliminated =
        (state.left !== undefined && i < state.left) ||
        (state.right !== undefined && i > state.right);

      const isActive = state.activeIndices?.includes(i);
      const isSwapped = (state as any).swappedIndices?.includes(i);

      ctx.save();
      // Background & border
      if (isFound) {
        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 15;
      } else if (isSwapped) {
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
      } else if (isActive) {
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 12;
      } else if (isMid) {
        ctx.fillStyle = '#818cf8';
        ctx.strokeStyle = '#c7d2fe';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 12;
      } else if (isEliminated) {
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
      }

      ctx.beginPath();
      ctx.roundRect(x, y, boxWidth, boxHeight, 8);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Value
      ctx.save();
      ctx.fillStyle = isEliminated ? '#475569' : '#f8fafc';
      ctx.font = `bold ${Math.max(12, Math.floor(18 * scale))}px Inter, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(elements[i]), x + boxWidth / 2, y + boxHeight / 2);

      // Index label
      ctx.fillStyle = isEliminated ? '#334155' : '#94a3b8';
      ctx.font = `${Math.max(10, Math.floor(12 * scale))}px Inter, sans-serif`;
      ctx.fillText(`[${i}]`, x + boxWidth / 2, y + boxHeight + 16);
      ctx.restore();

      // Custom pointers from state.pointers if provided
      const customPointers = (state as any).pointers?.[i];
      if (customPointers) {
        const ptrs = Array.isArray(customPointers) ? customPointers : [customPointers];
        ptrs.forEach((p: any, pIdx: number) => {
          const isTop = p.position === 'top' || p.position === undefined;
          const py = isTop ? y - 20 - pIdx * 24 : y + boxHeight + 36 + pIdx * 24;
          drawPointerBadge(ctx, x + boxWidth / 2, py, p.label, p.color || '#6366f1', '#ffffff', p.icon || '📍');
        });
      }

      // Default L / R / MID Pointers above / below if no custom pointer for this cell
      if (!customPointers) {
        if (isMid) {
          drawPointerBadge(
            ctx,
            x + boxWidth / 2,
            y - 20,
            'MID',
            isFound ? '#10b981' : '#6366f1',
            '#ffffff',
            isFound ? '🎯' : '📍'
          );
        }
        if (isLeft && !isMid) {
          drawPointerBadge(ctx, x + boxWidth / 2, y + boxHeight + 36, 'L', '#06b6d4', '#ffffff', '👈');
        }
        if (isRight && !isMid) {
          drawPointerBadge(ctx, x + boxWidth / 2, y + boxHeight + 36, 'R', '#f43f5e', '#ffffff', '👉');
        }
      }
    }

    if (burnInCaption) {
      drawBurnInCaption(ctx, burnInCaption, width, height);
    }
  }
}
