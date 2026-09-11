import { generateInsertionSortSteps } from '../engine/generators/sorting';
import { AlgoConfig } from '../types/algo';

export const insertionSortConfig: AlgoConfig = {
  id: 'insertion-sort',
  title: 'Insertion Sort',
  subtitle: 'Build the sorted array one item at a time by repeatedly picking the next item and inserting it into its correct position',
  category: 'Sorting',
  renderer: 'array',
  aspectRatio: '16:9',
  data: {
    elements: [12, 11, 13, 5, 6],
  },
  code: {
    language: 'python',
    lines: [
      'def insertion_sort(arr):',
      '    for i in range(1, len(arr)):',
      '        key = arr[i]',
      '        j = i - 1',
      '        while j >= 0 and arr[j] > key:',
      '            arr[j + 1] = arr[j]',
      '            j -= 1',
      '        arr[j + 1] = key',
      '    return arr',
    ],
  },
  panels: {
    why: false,
    formula: false,
    distanceMap: false,
    code: true,
  },
  steps: generateInsertionSortSteps([12, 11, 13, 5, 6]),
};
