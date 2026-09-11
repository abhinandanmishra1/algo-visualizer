import { generateSelectionSortSteps } from '../engine/generators/sorting';
import { AlgoConfig } from '../types/algo';

export const selectionSortConfig: AlgoConfig = {
  id: 'selection-sort',
  title: 'Selection Sort',
  subtitle: 'Repeatedly find the minimum element from the unsorted part and put it at the beginning',
  category: 'Sorting',
  renderer: 'array',
  aspectRatio: '16:9',
  data: {
    elements: [64, 25, 12, 22, 11],
  },
  code: {
    language: 'python',
    lines: [
      'def selection_sort(arr):',
      '    n = len(arr)',
      '    for i in range(n):',
      '        min_idx = i',
      '        for j in range(i + 1, n):',
      '            if arr[j] < arr[min_idx]:',
      '                min_idx = j',
      '        arr[i], arr[min_idx] = arr[min_idx], arr[i]',
      '    return arr',
    ],
  },
  panels: {
    why: false,
    formula: false,
    distanceMap: false,
    code: true,
  },
  steps: generateSelectionSortSteps([64, 25, 12, 22, 11]),
};
