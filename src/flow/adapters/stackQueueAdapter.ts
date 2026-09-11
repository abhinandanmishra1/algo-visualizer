import type { Node } from 'reactflow';
import type { StackQueueData, StackQueueState } from '../../renderers/stackQueueRenderer';
import type { FlowAdapter, NodeVisualState, PointerBadge } from '../types';
import type { StackQueueFlowNodeData } from '../nodes/StackQueueFlowNode';

interface BoxLayout {
  index: number;
  value: unknown;
  x: number;
  y: number;
  width: number;
  height: number;
}

function calculateStackLayout(items: unknown[], width: number, height: number): BoxLayout[] {
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

  const totalScaledHeight = items.length * scaledBoxHeight + (items.length - 1) * scaledSpacing;
  const startY = (height - totalScaledHeight) / 2 + 30;

  return items.map((item, i) => {
    const reverseIdx = items.length - 1 - i;
    return {
      index: i,
      value: item,
      x: startX,
      y: startY + reverseIdx * (scaledBoxHeight + scaledSpacing),
      width: scaledBoxWidth,
      height: scaledBoxHeight,
    };
  });
}

function calculateQueueLayout(items: unknown[], width: number, height: number): BoxLayout[] {
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

  return items.map((item, i) => ({
    index: i,
    value: item,
    x: startX + i * (scaledBoxWidth + scaledSpacing),
    y: startY,
    width: scaledBoxWidth,
    height: scaledBoxHeight,
  }));
}

function resolveBoxState(index: number, state: StackQueueState): NodeVisualState {
  if (state.recentOpIndex === index && state.lastOp) return 'visiting';
  if (state.activeIndex === index) return 'active';
  if (state.highlightedIndices?.has(index)) return 'active';
  return 'default';
}

export const stackQueueAdapter: FlowAdapter<StackQueueData, StackQueueState> = {
  toFlow(data, state, width, height) {
    const { type, items } = data;
    if (!items || items.length === 0) return { nodes: [], edges: [] };

    const layouts = type === 'stack' ? calculateStackLayout(items, width, height) : calculateQueueLayout(items, width, height);

    const nodes: Node<StackQueueFlowNodeData>[] = layouts.map((layout) => {
      let pointers: PointerBadge | undefined;
      if (state.activeIndex === layout.index) {
        pointers = {
          label: type === 'stack' ? 'TOP' : 'HEAD',
          color: '#3b82f6',
          icon: type === 'stack' ? '📦' : '🔗',
          position: type === 'stack' ? 'top' : 'bottom',
        };
      }

      return {
        id: `item-${layout.index}`,
        type: 'stackQueueNode',
        position: { x: layout.x - layout.width / 2, y: layout.y - layout.height / 2 },
        data: {
          value: layout.value,
          index: layout.index,
          state: resolveBoxState(layout.index, state),
          pointers,
          width: layout.width,
          height: layout.height,
        },
        draggable: false,
      };
    });

    return { nodes, edges: [] };
  },
};
