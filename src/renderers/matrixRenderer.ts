import { AlgoRenderer, RenderOptions } from './types';
import { drawArrow, drawPointerBadge, drawBurnInCaption } from './canvasUtils';

export interface MatrixData {
  rows: number;
  cols: number;
  cells: Record<string, any>; // { "r,c": value }
  rowLabels?: string[];
  colLabels?: string[];
}

export interface MatrixState {
  highlightedCells?: Set<string>; // { "r,c" }
  activeCells?: Set<string>;
  cellValues?: Record<string, any>; // override or enhance cells
  heatmap?: Record<string, number>; // 0-1 normalized for color gradient
  visitedPath?: string[]; // ["r,c", "r,c", ...] ordered path
  activeIndex?: number; // current position in visitedPath
}

/**
 * Interpolate color between two hex colors at a given ratio (0-1)
 */
function interpolateColor(color1: string, color2: string, ratio: number): string {
  const hex = (c: string) => {
    const v = parseInt(c.substring(1), 16);
    return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
  };

  const c1 = hex(color1);
  const c2 = hex(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
  const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
  const b = Math.round(c1.b + (c2.b - c1.b) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Get color for heatmap value (0=cool blue, 1=hot red)
 */
function getHeatmapColor(value: number): string {
  // Clamp value to 0-1 range
  const v = Math.max(0, Math.min(1, value));

  // Cool blue: #0284c7 -> Hot red: #dc2626
  return interpolateColor('#0284c7', '#dc2626', v);
}

export class MatrixRenderer implements AlgoRenderer<MatrixData, MatrixState> {
  render(
    ctx: CanvasRenderingContext2D,
    data: MatrixData,
    state: MatrixState,
    options: RenderOptions
  ): void {
    const { width, height, burnInCaption } = options;

    ctx.clearRect(0, 0, width, height);

    const { rows, cols, cells, rowLabels, colLabels } = data;
    if (rows <= 0 || cols <= 0) return;

    // Layout params
    const labelWidth = rowLabels ? 60 : 20;
    const labelHeight = colLabels ? 50 : 20;
    const padding = 20;
    const contentWidth = width - labelWidth - padding * 2;
    const contentHeight = height - labelHeight - padding * 2;

    const cellW = contentWidth / cols;
    const cellH = contentHeight / rows;

    const gridStartX = labelWidth + padding;
    const gridStartY = labelHeight + padding;

    // Draw column labels (top)
    if (colLabels) {
      ctx.save();
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let c = 0; c < cols; c++) {
        const x = gridStartX + c * cellW + cellW / 2;
        const y = padding / 2 + 10;
        ctx.fillText(String(colLabels[c] || c), x, y);
      }
      ctx.restore();
    }

    // Draw row labels (left)
    if (rowLabels) {
      ctx.save();
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      for (let r = 0; r < rows; r++) {
        const x = labelWidth - 10;
        const y = gridStartY + r * cellH + cellH / 2;
        ctx.fillText(String(rowLabels[r] || r), x, y);
      }
      ctx.restore();
    }

    // Draw grid cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellKey = `${r},${c}`;
        const cellX = gridStartX + c * cellW;
        const cellY = gridStartY + r * cellH;

        const isHighlighted = state.highlightedCells?.has(cellKey) ?? false;
        const isActive = state.activeCells?.has(cellKey) ?? false;
        const heatmapVal = state.heatmap?.[cellKey];
        const hasHeatmap = heatmapVal !== undefined;

        // Background color
        let bgColor = '#1e293b';
        let borderColor = '#64748b';
        let lineWidth = 1;
        let shadowColor = 'transparent';
        let shadowBlur = 0;

        if (isActive) {
          bgColor = '#0284c7';
          borderColor = '#38bdf8';
          lineWidth = 2;
          shadowColor = '#0ea5e9';
          shadowBlur = 12;
        } else if (isHighlighted) {
          bgColor = '#2563eb';
          borderColor = '#60a5fa';
          lineWidth = 2;
          shadowColor = '#3b82f6';
          shadowBlur = 10;
        } else if (hasHeatmap) {
          bgColor = getHeatmapColor(heatmapVal);
          borderColor = '#475569';
          lineWidth = 1;
        }

        // Draw cell rectangle
        ctx.save();
        ctx.fillStyle = bgColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;

        ctx.fillRect(cellX, cellY, cellW, cellH);
        ctx.strokeRect(cellX, cellY, cellW, cellH);
        ctx.restore();

        // Draw cell value
        const cellValue = state.cellValues?.[cellKey] ?? cells[cellKey];
        if (cellValue !== undefined && cellValue !== null && cellValue !== '') {
          ctx.save();
          ctx.fillStyle = '#f8fafc';
          ctx.font = '13px Inter, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(cellValue), cellX + cellW / 2, cellY + cellH / 2);
          ctx.restore();
        }
      }
    }

    // Draw visited path with arrows
    if (state.visitedPath && state.visitedPath.length > 1) {
      for (let i = 0; i < state.visitedPath.length - 1; i++) {
        const [r1, c1] = state.visitedPath[i].split(',').map(Number);
        const [r2, c2] = state.visitedPath[i + 1].split(',').map(Number);

        const fromX = gridStartX + c1 * cellW + cellW / 2;
        const fromY = gridStartY + r1 * cellH + cellH / 2;
        const toX = gridStartX + c2 * cellW + cellW / 2;
        const toY = gridStartY + r2 * cellH + cellH / 2;

        // Use different color for visited vs future path
        const isVisited = state.activeIndex !== undefined && i < state.activeIndex;
        const arrowColor = isVisited ? '#10b981' : '#6366f1';

        drawArrow(ctx, fromX, fromY, toX, toY, arrowColor, 8, 2);
      }
    }

    // Draw active position badge if in visited path
    if (
      state.visitedPath &&
      state.activeIndex !== undefined &&
      state.activeIndex < state.visitedPath.length
    ) {
      const [r, c] = state.visitedPath[state.activeIndex].split(',').map(Number);
      const cellX = gridStartX + c * cellW + cellW / 2;
      const cellY = gridStartY + r * cellH + cellH / 2;

      drawPointerBadge(ctx, cellX, cellY - cellH / 2 - 12, '🔍', '#0ea5e9', '#ffffff', '');
    }

    if (burnInCaption) {
      drawBurnInCaption(ctx, burnInCaption, width, height);
    }
  }
}
