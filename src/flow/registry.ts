import type { RendererType } from '../types/algo';
import type { FlowRendererModule } from './types';

import { graphAdapter } from './adapters/graphAdapter';
import { graphNodeTypes } from './nodes/GraphFlowNode';

import { treeAdapter } from './adapters/treeAdapter';
import { treeNodeTypes } from './nodes/TreeFlowNode';

import { arrayAdapter } from './adapters/arrayAdapter';
import { arrayNodeTypes } from './nodes/ArrayFlowNode';

import { linkedListAdapter } from './adapters/linkedListAdapter';
import { linkedListNodeTypes } from './nodes/LinkedListFlowNode';

import { matrixAdapter } from './adapters/matrixAdapter';
import { matrixNodeTypes } from './nodes/MatrixFlowNode';

import { stackQueueAdapter } from './adapters/stackQueueAdapter';
import { stackQueueNodeTypes } from './nodes/StackQueueFlowNode';

import { heapAdapter } from './adapters/heapAdapter';
import { heapNodeTypes } from './nodes/HeapFlowNode';

import { hashTableAdapter } from './adapters/hashTableAdapter';
import { hashBucketNodeTypes } from './nodes/HashBucketFlowNode';
import { hashChainNodeTypes } from './nodes/HashChainFlowNode';

import { diagramAdapter } from './adapters/diagramAdapter';
import { diagramNodeTypes } from './nodes/DiagramFlowNode';

const flowRegistry: Record<RendererType, FlowRendererModule> = {
  graph: { adapter: graphAdapter, nodeTypes: graphNodeTypes },
  tree: { adapter: treeAdapter, nodeTypes: treeNodeTypes },
  array: { adapter: arrayAdapter, nodeTypes: arrayNodeTypes },
  'linked-list': { adapter: linkedListAdapter, nodeTypes: linkedListNodeTypes },
  matrix: { adapter: matrixAdapter, nodeTypes: matrixNodeTypes },
  'stack-queue': { adapter: stackQueueAdapter, nodeTypes: stackQueueNodeTypes },
  heap: { adapter: heapAdapter, nodeTypes: heapNodeTypes },
  'hash-table': {
    adapter: hashTableAdapter,
    nodeTypes: { ...hashBucketNodeTypes, ...hashChainNodeTypes },
  },
  diagram: { adapter: diagramAdapter, nodeTypes: diagramNodeTypes },
};

export function getFlowModule(type: RendererType): FlowRendererModule {
  return flowRegistry[type] || flowRegistry.array;
}
