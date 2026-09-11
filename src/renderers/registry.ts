import { RendererType } from '../types/algo';
import { AlgoRenderer } from './types';
import { ArrayRenderer } from './arrayRenderer';
import { LinkedListRenderer } from './linkedListRenderer';
import { TreeRenderer } from './treeRenderer';
import { GraphRenderer } from './graphRenderer';
import { MatrixRenderer } from './matrixRenderer';
import { StackQueueRenderer } from './stackQueueRenderer';
import { HeapRenderer } from './heapRenderer';
import { HashTableRenderer } from './hashTableRenderer';
import { DiagramRenderer } from './diagramRenderer';

const rendererRegistry: Record<RendererType, AlgoRenderer> = {
  'array': new ArrayRenderer(),
  'linked-list': new LinkedListRenderer(),
  'tree': new TreeRenderer(),
  'graph': new GraphRenderer(),
  'matrix': new MatrixRenderer(),
  'stack-queue': new StackQueueRenderer(),
  'heap': new HeapRenderer(),
  'hash-table': new HashTableRenderer(),
  'diagram': new DiagramRenderer(),
};

export function getRenderer(type: RendererType): AlgoRenderer {
  return rendererRegistry[type] || rendererRegistry['array'];
}
