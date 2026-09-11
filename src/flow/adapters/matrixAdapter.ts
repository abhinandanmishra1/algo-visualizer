import type { Node, Edge } from 'reactflow';
import type { MatrixData, MatrixState } from '../../renderers/matrixRenderer';
import type { FlowAdapter, NodeVisualState } from '../types';
import type { MatrixFlowNodeData, MatrixLabelNodeData } from '../nodes/MatrixFlowNode';
import type { ArrowEdgeData } from '../edges/ArrowEdge';
import { BOX_GAP } from '../BoxCellShell';

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

function getHeatmapColor(value: number): string {
  const v = Math.max(0, Math.min(1, value));
  return interpolateColor('#0284c7', '#dc2626', v);
}

function resolveCellState(key: string, state: MatrixState): NodeVisualState {
  if (state.activeCells?.has(key)) return 'active';
  if (state.highlightedCells?.has(key)) return 'highlight';
  return 'default';
}

export const matrixAdapter: FlowAdapter<MatrixData, MatrixState> = {
  toFlow(data, state, width, height) {
    const { rows, cols, cells, rowLabels, colLabels, rowLengths } = data;
    if (!rows || !cols) return { nodes: [], edges: [] };

    const labelWidth = rowLabels ? 60 : 20;
    const labelHeight = colLabels ? 50 : 20;
    const padding = 20;
    const contentWidth = width - labelWidth - padding * 2;
    const contentHeight = height - labelHeight - padding * 2;

    const cellW = contentWidth / cols;
    const cellH = contentHeight / rows;

    const gridStartX = labelWidth + padding;
    const gridStartY = labelHeight + padding;

    const nodes: Node[] = [];
    const centers: Record<string, { x: number; y: number }> = {};

    if (colLabels) {
      for (let c = 0; c < cols; c++) {
        nodes.push({
          id: `col-label-${c}`,
          type: 'matrixLabelNode',
          position: { x: gridStartX + c * cellW, y: 0 },
          style: { width: cellW, height: labelHeight },
          data: { label: String(colLabels[c] ?? c) } satisfies MatrixLabelNodeData,
          draggable: false,
          selectable: false,
        });
      }
    }

    if (rowLabels) {
      for (let r = 0; r < rows; r++) {
        nodes.push({
          id: `row-label-${r}`,
          type: 'matrixLabelNode',
          position: { x: 0, y: gridStartY + r * cellH },
          style: { width: labelWidth - 10, height: cellH },
          data: { label: String(rowLabels[r] ?? r) } satisfies MatrixLabelNodeData,
          draggable: false,
          selectable: false,
        });
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`;
        const cellX = gridStartX + c * cellW;
        const cellY = gridStartY + r * cellH;
        centers[key] = { x: cellX + cellW / 2, y: cellY + cellH / 2 };

        if (rowLengths && c >= rowLengths[r]) continue;

        const cellValue = state.cellValues?.[key] ?? cells[key];
        const heatmapVal = state.heatmap?.[key];
        const cellState = resolveCellState(key, state);

        nodes.push({
          id: `cell-${key}`,
          type: 'matrixNode',
          position: { x: cellX + BOX_GAP / 2, y: cellY + BOX_GAP / 2 },
          data: {
            value: cellValue === undefined || cellValue === null || cellValue === '' ? undefined : cellValue,
            state: cellState,
            heatmapColor: heatmapVal !== undefined ? getHeatmapColor(heatmapVal) : undefined,
            width: cellW - BOX_GAP,
            height: cellH - BOX_GAP,
          } satisfies MatrixFlowNodeData,
          draggable: false,
        });
      }
    }

    const edges: Edge<ArrowEdgeData>[] = [];
    if (state.visitedPath && state.visitedPath.length > 1) {
      for (let i = 0; i < state.visitedPath.length - 1; i++) {
        const fromKey = state.visitedPath[i];
        const toKey = state.visitedPath[i + 1];
        const from = centers[fromKey];
        const to = centers[toKey];
        if (!from || !to) continue;

        const isVisited = state.activeIndex !== undefined && i < state.activeIndex;
        const color = isVisited ? '#10b981' : '#6366f1';

        edges.push({
          id: `path-${i}-${fromKey}-${toKey}`,
          source: `cell-${fromKey}`,
          target: `cell-${toKey}`,
          type: 'arrow',
          data: { x1: from.x, y1: from.y, x2: to.x, y2: to.y, color },
        });
      }
    }

    return { nodes, edges };
  },
};
