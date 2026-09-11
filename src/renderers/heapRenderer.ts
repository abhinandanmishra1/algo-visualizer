import { AlgoRenderer, RenderOptions } from './types';
import { drawArrow, drawPointerBadge, drawBurnInCaption } from './canvasUtils';

/**
 * Heap data: array representation with optional type annotation
 */
export interface HeapData {
  items: any[];
  type?: 'min' | 'max';
}

/**
 * Heap visualization state
 */
export interface HeapState {
  highlightedIndices?: Set<number>;
  activeIndex?: number;
  nodeStates?: Record<number, 'unvisited' | 'visiting' | 'visited'>;
  pointers?: Record<number, any>;
}

/**
 * Tree node for internal representation
 */
interface TreeNode {
  value: any;
  index: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
}

/**
 * Convert heap array to tree structure
 * For index i: left child = 2*i+1, right child = 2*i+2, parent = floor((i-1)/2)
 */
function arrayToTree(items: any[]): TreeNode | undefined {
  if (items.length === 0) return undefined;

  const nodes: (TreeNode | undefined)[] = items.map((value, index) => ({
    value,
    index,
  }));

  // Link parent-child relationships
  for (let i = 0; i < items.length; i++) {
    const leftChildIdx = 2 * i + 1;
    const rightChildIdx = 2 * i + 2;

    if (nodes[i]) {
      if (leftChildIdx < items.length && nodes[leftChildIdx]) {
        nodes[i]!.left = nodes[leftChildIdx];
      }
      if (rightChildIdx < items.length && nodes[rightChildIdx]) {
        nodes[i]!.right = nodes[rightChildIdx];
      }
    }
  }

  return nodes[0];
}

/**
 * Calculate tree node positions using level-order layout
 */
function calculateTreePositions(
  root: TreeNode | undefined,
  width: number,
  height: number
): Map<number, { x: number; y: number }> {
  const positions = new Map<number, { x: number; y: number }>();

  if (!root) return positions;

  const queue: { node: TreeNode; level: number; position: number; levelSize: number }[] = [];
  const levelNodes: TreeNode[][] = [];

  // BFS to collect nodes by level
  queue.push({ node: root, level: 0, position: 0, levelSize: 1 });
  let qIndex = 0;

  while (qIndex < queue.length) {
    const { node, level } = queue[qIndex];
    qIndex++;

    if (!levelNodes[level]) levelNodes[level] = [];
    levelNodes[level].push(node);

    let nextLevelSize = 0;
    if (node.left) {
      nextLevelSize++;
      queue.push({ node: node.left, level: level + 1, position: nextLevelSize - 1, levelSize: 0 });
    }
    if (node.right) {
      nextLevelSize++;
      queue.push({ node: node.right, level: level + 1, position: nextLevelSize - 1, levelSize: 0 });
    }
  }

  // Calculate actual level sizes
  queue.length = 0;
  queue.push({ node: root, level: 0, position: 0, levelSize: levelNodes[0].length });
  qIndex = 0;

  while (qIndex < queue.length) {
    const { node, level } = queue[qIndex];
    qIndex++;

    const position = levelNodes[level].indexOf(node);

    const verticalPadding = 60;
    const verticalSpacing = (height - 2 * verticalPadding) / Math.max(1, levelNodes.length - 1);
    const y = verticalPadding + level * verticalSpacing;

    const horizontalPadding = 60;
    const maxLevelWidth = Math.max(1, Math.pow(2, level));
    const horizontalSpacing = (width - 2 * horizontalPadding) / Math.max(1, maxLevelWidth - 1);
    const x = horizontalPadding + (position + 0.5) * (horizontalSpacing * 2);

    positions.set(node.index, { x, y });

    if (node.left) queue.push({ node: node.left, level: level + 1, position: 0, levelSize: 1 });
    if (node.right) queue.push({ node: node.right, level: level + 1, position: 0, levelSize: 1 });
  }

  return positions;
}

/**
 * HeapRenderer: Binary heap visualization
 * Converts heap array to tree structure and renders it with node states
 */
export class HeapRenderer implements AlgoRenderer<HeapData, HeapState> {
  render(
    ctx: CanvasRenderingContext2D,
    data: HeapData,
    state: HeapState,
    options: RenderOptions
  ): void {
    const { width, height, burnInCaption } = options;

    ctx.clearRect(0, 0, width, height);

    if (!data.items || data.items.length === 0) return;

    // Convert array to tree
    const root = arrayToTree(data.items);
    if (!root) return;

    // Calculate positions
    const positions = calculateTreePositions(root, width, height);
    const nodeRadius = 28;

    // Helper to collect all nodes in order
    const getAllNodes = (node: TreeNode | undefined): TreeNode[] => {
      if (!node) return [];
      return [node, ...getAllNodes(node.left), ...getAllNodes(node.right)];
    };

    const allNodes = getAllNodes(root);

    // 1. Draw edges (parent-to-child)
    allNodes.forEach((node) => {
      const nodePos = positions.get(node.index);
      if (!nodePos) return;

      const drawChildEdge = (child: TreeNode | undefined) => {
        if (!child) return;
        const childPos = positions.get(child.index);
        if (!childPos) return;

        const angle = Math.atan2(childPos.y - nodePos.y, childPos.x - nodePos.x);
        const startX = nodePos.x + nodeRadius * Math.cos(angle);
        const startY = nodePos.y + nodeRadius * Math.sin(angle);
        const endX = childPos.x - nodeRadius * Math.cos(angle);
        const endY = childPos.y - nodeRadius * Math.sin(angle);

        drawArrow(ctx, startX, startY, endX, endY, '#64748b', 9, 2.5);
      };

      drawChildEdge(node.left);
      drawChildEdge(node.right);
    });

    // 2. Draw nodes
    allNodes.forEach((node) => {
      const pos = positions.get(node.index);
      if (!pos) return;

      const isHighlighted = state.highlightedIndices?.has(node.index);
      const isActive = state.activeIndex === node.index;
      const nodeState = state.nodeStates?.[node.index];

      ctx.save();

      // Determine node coloring based on state
      let fillColor = '#1e293b';
      let strokeColor = '#475569';
      let lineWidth = 2;
      let shadowColor = 'transparent';
      let shadowBlur = 0;

      if (isActive) {
        fillColor = '#0284c7';
        strokeColor = '#38bdf8';
        lineWidth = 3;
        shadowColor = '#0ea5e9';
        shadowBlur = 12;
      } else if (nodeState === 'visited') {
        fillColor = '#10b981';
        strokeColor = '#34d399';
        lineWidth = 3;
        shadowColor = '#10b981';
        shadowBlur = 8;
      } else if (nodeState === 'visiting') {
        fillColor = '#f59e0b';
        strokeColor = '#fbbf24';
        lineWidth = 3;
        shadowColor = '#f59e0b';
        shadowBlur = 12;
      } else if (isHighlighted) {
        fillColor = '#a855f7';
        strokeColor = '#d8b4fe';
        lineWidth = 3;
        shadowColor = '#a855f7';
        shadowBlur = 12;
      }

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Draw node value
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 16px Inter, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(node.value), pos.x, pos.y);

      // Draw array index below
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, monospace';
      ctx.fillText(`[${node.index}]`, pos.x, pos.y + nodeRadius + 14);
      ctx.restore();
    });

    // 3. Draw custom pointers
    const customPointers = state.pointers;
    if (customPointers && typeof customPointers === 'object') {
      Object.entries(customPointers).forEach(([indexStr, ptr]: [string, any]) => {
        const index = parseInt(indexStr, 10);
        const pos = positions.get(index);
        if (!pos) return;

        const ptrList = Array.isArray(ptr) ? ptr : [ptr];
        ptrList.forEach((p: any, pIdx: number) => {
          const isTop = p.position === 'top' || p.position === undefined;
          const py = isTop ? pos.y - nodeRadius - 20 - pIdx * 24 : pos.y + nodeRadius + 28 + pIdx * 24;
          drawPointerBadge(ctx, pos.x, py, p.label, p.color || '#6366f1', '#ffffff', p.icon || '📍');
        });
      });
    }

    // 4. Draw heap type label
    if (data.type) {
      ctx.save();
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = data.type === 'min' ? '#06b6d4' : '#f43f5e';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`${data.type.toUpperCase()}-HEAP`, 24, 20);
      ctx.restore();
    }

    // 5. Draw burn-in caption
    if (burnInCaption) {
      drawBurnInCaption(ctx, burnInCaption, width, height);
    }
  }
}
