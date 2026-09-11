import { AlgoRenderer, RenderOptions } from './types';
import { drawArrow, drawBurnInCaption } from './canvasUtils';

export interface HashTableData {
  buckets: any[][]; // array of bucket chains, each bucket is [key, value][]
  size: number;
  loadFactor?: number;
}

export interface HashTableState {
  highlightedBuckets?: Set<number>;
  activeBucketIndex?: number;
  nodeStates?: Record<string, 'unvisited' | 'visiting' | 'found'>;
}

interface BucketNodePos {
  bucketIndex: number;
  chainIndex: number;
  x: number;
  y: number;
  radius: number;
  key?: string | number;
  value?: string | number;
}

export class HashTableRenderer implements AlgoRenderer<HashTableData, HashTableState> {
  private getNodeColor(state: HashTableState, bucketIndex: number, chainIndex: number): string {
    const nodeKey = `${bucketIndex}-${chainIndex}`;
    const nodeState = state.nodeStates?.[nodeKey];

    if (nodeState === 'found') return '#10b981'; // emerald
    if (nodeState === 'visiting') return '#f59e0b'; // amber
    if (nodeState === 'unvisited') return '#6b7280'; // gray

    // Default: different colors for first node vs collisions
    return chainIndex === 0 ? '#10b981' : '#f59e0b';
  }

  private calculateBucketNodePositions(
    data: HashTableData,
    _width: number,
    height: number
  ): BucketNodePos[] {
    const positions: BucketNodePos[] = [];
    const radius = 24;

    const numBuckets = data.buckets.length;
    const bucketBoxWidth = 64;
    const bucketBoxHeight = 48;
    const bucketSpacing = 12;

    // Bucket array column on the left side
    const bucketColumnX = 80;
    const bucketColumnStartY = 60;
    const totalBucketHeight = numBuckets * (bucketBoxHeight + bucketSpacing);
    const bucketColumnStartY_adj =
      Math.max(bucketColumnStartY, (height - totalBucketHeight) / 2);

    // Draw bucket positions and collect node positions
    for (let i = 0; i < numBuckets; i++) {
      const bucket = data.buckets[i];
      const bucketY = bucketColumnStartY_adj + i * (bucketBoxHeight + bucketSpacing);

      if (bucket.length === 0) {
        // Empty bucket - no nodes to draw, just a marker
        continue;
      }

      // Collision chain extends downward from the bucket
      const chainStartX = bucketColumnX + bucketBoxWidth + 40;
      const chainStartY = bucketY + bucketBoxHeight / 2;
      const chainSpacing = 60;

      bucket.forEach((item, chainIdx) => {
        positions.push({
          bucketIndex: i,
          chainIndex: chainIdx,
          x: chainStartX,
          y: chainStartY + chainIdx * chainSpacing,
          radius,
          key: item[0] ?? item.key ?? chainIdx,
          value: item[1] ?? item.value ?? `val${chainIdx}`,
        });
      });
    }

    return positions;
  }

  render(
    ctx: CanvasRenderingContext2D,
    data: HashTableData,
    state: HashTableState,
    options: RenderOptions
  ): void {
    const { width, height, burnInCaption } = options;

    ctx.clearRect(0, 0, width, height);

    const numBuckets = data.buckets.length;
    const bucketBoxWidth = 64;
    const bucketBoxHeight = 48;
    const bucketSpacing = 12;

    const bucketColumnX = 80;
    const bucketColumnStartY = 60;
    const totalBucketHeight = numBuckets * (bucketBoxHeight + bucketSpacing);
    const bucketColumnStartY_adj =
      Math.max(bucketColumnStartY, (height - totalBucketHeight) / 2);

    // 1. Draw Bucket Array
    for (let i = 0; i < numBuckets; i++) {
      const bucket = data.buckets[i];
      const bucketY = bucketColumnStartY_adj + i * (bucketBoxHeight + bucketSpacing);
      const isActive = state.activeBucketIndex === i;
      const isHighlighted = state.highlightedBuckets?.has(i);

      ctx.save();

      // Bucket box background and border
      if (isActive) {
        ctx.fillStyle = '#3b82f6'; // blue for active
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 12;
      } else if (isHighlighted) {
        ctx.fillStyle = '#06b6d4'; // cyan for highlighted
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
      } else if (bucket.length === 0) {
        ctx.fillStyle = '#e5e7eb'; // light gray for empty
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
      } else {
        ctx.fillStyle = '#f3f4f6'; // very light gray for occupied
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2;
      }

      ctx.beginPath();
      ctx.rect(bucketColumnX, bucketY, bucketBoxWidth, bucketBoxHeight);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Bucket label (index)
      ctx.save();
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 13px Inter, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i), bucketColumnX + bucketBoxWidth / 2, bucketY + bucketBoxHeight / 2);

      // Collision count if applicable
      if (bucket.length > 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(
          `(${bucket.length})`,
          bucketColumnX + bucketBoxWidth / 2,
          bucketY + bucketBoxHeight / 2 + 14
        );
      }
      ctx.restore();
    }

    // 2. Draw Collision Chains
    const nodePositions = this.calculateBucketNodePositions(data, width, height);

    // Draw edges first (so they appear behind nodes)
    nodePositions.forEach((pos, _idx) => {
      const bucket = data.buckets[pos.bucketIndex];
      if (pos.chainIndex < bucket.length - 1) {
        // Edge to next node in chain
        const nextPos = nodePositions.find(
          (p) => p.bucketIndex === pos.bucketIndex && p.chainIndex === pos.chainIndex + 1
        );
        if (nextPos) {
          const startX = pos.x;
          const startY = pos.y + pos.radius;
          const endX = nextPos.x;
          const endY = nextPos.y - nextPos.radius;

          drawArrow(ctx, startX, startY, endX, endY, '#64748b', 8, 2);
        }
      } else if (pos.chainIndex === bucket.length - 1) {
        // Draw null terminator
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('null', pos.x, pos.y + pos.radius + 8);
        ctx.restore();
      }
    });

    // Draw nodes
    nodePositions.forEach((pos) => {
      const nodeColor = this.getNodeColor(state, pos.bucketIndex, pos.chainIndex);

      ctx.save();

      // Node circle
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = nodeColor;
      ctx.lineWidth = 3;

      if (state.nodeStates?.[`${pos.bucketIndex}-${pos.chainIndex}`] === 'visiting') {
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur = 12;
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Node content (key: value)
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px Inter, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const contentText =
        pos.chainIndex === 0
          ? `${pos.key}`
          : `${pos.key}\n${pos.value}`.split('\n')[0];
      ctx.fillText(contentText, pos.x, pos.y - 2);

      if (pos.value !== undefined && pos.chainIndex !== 0) {
        ctx.font = '10px Inter, monospace';
        ctx.fillText(String(pos.value), pos.x, pos.y + 8);
      }

      // Chain position indicator
      if (pos.chainIndex > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.fillText(`c${pos.chainIndex}`, pos.x, pos.y - pos.radius - 12);
      }

      ctx.restore();
    });

    // 3. Draw Bucket Info and Load Factor
    ctx.save();
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';

    const infoY = bucketColumnStartY_adj + totalBucketHeight + 30;
    ctx.fillText(`Size: ${data.size}`, bucketColumnX, infoY);
    ctx.fillText(`Buckets: ${numBuckets}`, bucketColumnX, infoY + 20);

    if (data.loadFactor !== undefined) {
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`Load Factor: ${data.loadFactor.toFixed(2)}`, bucketColumnX, infoY + 40);
    }
    ctx.restore();

    // 4. Draw Collision Count
    let totalCollisions = 0;
    data.buckets.forEach((bucket) => {
      if (bucket.length > 1) {
        totalCollisions += bucket.length - 1;
      }
    });

    ctx.save();
    ctx.fillStyle = totalCollisions > 0 ? '#f59e0b' : '#6b7280';
    ctx.font = `${totalCollisions > 0 ? 'bold ' : ''}12px Inter, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(`Collisions: ${totalCollisions}`, bucketColumnX, infoY + 60);
    ctx.restore();

    // 5. Burn-in caption
    if (burnInCaption) {
      drawBurnInCaption(ctx, burnInCaption, width, height);
    }
  }
}
