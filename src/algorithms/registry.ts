import { AlgoConfig } from '../types/algo';
import { floydCycleConfig } from './floyd-cycle';
import { binarySearchConfig } from './binary-search';
import { twoPointerConfig } from './two-pointer';
import { reverseLinkedListConfig } from './reverse-linked-list';
import { mergeTwoSortedListsConfig } from './merge-two-sorted-lists';
import { bubbleSortConfig } from './bubble-sort';
import { selectionSortConfig } from './selection-sort';
import { insertionSortConfig } from './insertion-sort';
import { linearSearchConfig } from './linear-search';
import { slidingWindowConfig } from './sliding-window';
import { dfsConfig } from './dfs';
import { bfsConfig } from './bfs';

export { getRenderer } from '../renderers/registry';

const algorithmRegistry: Record<string, AlgoConfig> = {
  'floyd-cycle': floydCycleConfig,
  'binary-search': binarySearchConfig,
  'two-pointer': twoPointerConfig,
  'reverse-linked-list': reverseLinkedListConfig,
  'merge-two-sorted-lists': mergeTwoSortedListsConfig,
  'bubble-sort': bubbleSortConfig,
  'selection-sort': selectionSortConfig,
  'insertion-sort': insertionSortConfig,
  'linear-search': linearSearchConfig,
  'sliding-window': slidingWindowConfig,
  dfs: dfsConfig,
  bfs: bfsConfig,
};

export function getAlgorithm(id: string): AlgoConfig | undefined {
  return algorithmRegistry[id];
}

export function getAllAlgorithms(): AlgoConfig[] {
  return Object.values(algorithmRegistry);
}
