import { AlgoConfig, RendererType } from '../types/algo';
import { floydCycleConfig } from './floyd-cycle';
import { binarySearchConfig } from './binary-search';
import { AlgoRenderer } from '../renderers/types';
import { LinkedListRenderer } from '../renderers/linkedListRenderer';
import { ArrayRenderer } from '../renderers/arrayRenderer';

const algorithmRegistry: Record<string, AlgoConfig> = {
  'floyd-cycle': floydCycleConfig,
  'binary-search': binarySearchConfig,
};

const rendererRegistry: Record<RendererType, AlgoRenderer> = {
  'linked-list': new LinkedListRenderer(),
  array: new ArrayRenderer(),
  tree: new ArrayRenderer(), // fallback
  graph: new LinkedListRenderer(), // fallback
  'component-diagram': new LinkedListRenderer(), // fallback
};

export function getAlgorithm(id: string): AlgoConfig | undefined {
  return algorithmRegistry[id];
}

export function getAllAlgorithms(): AlgoConfig[] {
  return Object.values(algorithmRegistry);
}

export function getRenderer(type: RendererType): AlgoRenderer {
  return rendererRegistry[type] || rendererRegistry['linked-list'];
}
