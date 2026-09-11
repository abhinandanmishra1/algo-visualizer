import type { Node, Edge } from 'reactflow';
import type { HashTableData, HashTableState } from '../../renderers/hashTableRenderer';
import type { FlowAdapter, NodeVisualState } from '../types';
import type { HashBucketFlowNodeData } from '../nodes/HashBucketFlowNode';
import type { HashChainFlowNodeData } from '../nodes/HashChainFlowNode';
import type { ArrowEdgeData } from '../edges/ArrowEdge';

const RADIUS = 24;
const BUCKET_BOX_WIDTH = 64;
const BUCKET_BOX_HEIGHT = 48;
const BUCKET_SPACING = 12;
const BUCKET_COLUMN_X = 80;
const BUCKET_COLUMN_START_Y = 60;
const CHAIN_SPACING = 60;

interface ChainNodePos {
  bucketIndex: number;
  chainIndex: number;
  x: number;
  y: number;
  key: string | number;
  value?: string | number;
}

function resolveBucketState(index: number, state: HashTableState): NodeVisualState {
  if (state.activeBucketIndex === index) return 'active';
  if (state.highlightedBuckets?.has(index)) return 'highlight';
  return 'default';
}

function resolveChainState(
  bucketIndex: number,
  chainIndex: number,
  state: HashTableState
): NodeVisualState {
  const nodeKey = `${bucketIndex}-${chainIndex}`;
  const nodeState = state.nodeStates?.[nodeKey];

  if (nodeState === 'found') return 'found';
  if (nodeState === 'visiting') return 'visiting';
  if (nodeState === 'unvisited') return 'default';

  return chainIndex === 0 ? 'visited' : 'highlight';
}

export const hashTableAdapter: FlowAdapter<HashTableData, HashTableState> = {
  toFlow(data, state, _width, height) {
    if (!data?.buckets?.length) return { nodes: [], edges: [] };

    const numBuckets = data.buckets.length;
    const totalBucketHeight = numBuckets * (BUCKET_BOX_HEIGHT + BUCKET_SPACING);
    const bucketColumnStartY = Math.max(BUCKET_COLUMN_START_Y, (height - totalBucketHeight) / 2);

    const nodes: Node[] = [];
    const chainPositions: ChainNodePos[] = [];

    for (let i = 0; i < numBuckets; i++) {
      const bucket = data.buckets[i];
      const bucketY = bucketColumnStartY + i * (BUCKET_BOX_HEIGHT + BUCKET_SPACING);

      nodes.push({
        id: `bucket-${i}`,
        type: 'hashBucketNode',
        position: { x: BUCKET_COLUMN_X, y: bucketY },
        data: {
          index: i,
          collisionCount: bucket.length,
          state: resolveBucketState(i, state),
          isEmpty: bucket.length === 0,
          width: BUCKET_BOX_WIDTH,
          height: BUCKET_BOX_HEIGHT,
        } satisfies HashBucketFlowNodeData,
        draggable: true,
      });

      if (bucket.length === 0) continue;

      const chainStartX = BUCKET_COLUMN_X + BUCKET_BOX_WIDTH + 40 + RADIUS;
      const chainStartY = bucketY + BUCKET_BOX_HEIGHT / 2;

      bucket.forEach((item: any, chainIdx: number) => {
        chainPositions.push({
          bucketIndex: i,
          chainIndex: chainIdx,
          x: chainStartX,
          y: chainStartY + chainIdx * CHAIN_SPACING,
          key: item[0] ?? item.key ?? chainIdx,
          value: item[1] ?? item.value,
        });
      });
    }

    chainPositions.forEach((pos) => {
      nodes.push({
        id: `chain-${pos.bucketIndex}-${pos.chainIndex}`,
        type: 'hashChainNode',
        position: { x: pos.x - RADIUS, y: pos.y - RADIUS },
        data: {
          key: pos.key,
          value: pos.value,
          chainIndex: pos.chainIndex,
          state: resolveChainState(pos.bucketIndex, pos.chainIndex, state),
          radius: RADIUS,
        } satisfies HashChainFlowNodeData,
        draggable: true,
      });
    });

    const edges: Edge<ArrowEdgeData>[] = [];
    chainPositions.forEach((pos) => {
      const bucket = data.buckets[pos.bucketIndex];
      if (pos.chainIndex >= bucket.length - 1) return;

      const next = chainPositions.find(
        (p) => p.bucketIndex === pos.bucketIndex && p.chainIndex === pos.chainIndex + 1
      );
      if (!next) return;

      edges.push({
        id: `e-chain-${pos.bucketIndex}-${pos.chainIndex}`,
        source: `chain-${pos.bucketIndex}-${pos.chainIndex}`,
        target: `chain-${pos.bucketIndex}-${pos.chainIndex + 1}`,
        type: 'arrow',
        data: {
          x1: pos.x,
          y1: pos.y + RADIUS,
          x2: next.x,
          y2: next.y - RADIUS,
        },
      });
    });

    return { nodes, edges };
  },
};
