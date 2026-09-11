import { generateBubbleSortSteps } from '../engine/generators/sorting';
import { AlgoConfig } from '../types/algo';

export const bubbleSortConfig: AlgoConfig = {
  id: 'bubble-sort',
  title: 'Bubble Sort',
  subtitle: 'Repeatedly step through the list, compare adjacent elements and swap them if they are in the wrong order',
  category: 'Sorting',
  renderer: 'array',
  aspectRatio: '16:9',
  data: {
    elements: [64, 34, 25, 12, 22, 11, 90],
  },
  code: {
    language: 'python',
    lines: [
      'def bubble_sort(arr):',
      '    n = len(arr)',
      '    for i in range(n):',
      '        for j in range(0, n - i - 1):',
      '            if arr[j] > arr[j + 1]:',
      '                arr[j], arr[j + 1] = arr[j + 1], arr[j]',
      '    return arr',
    ],
  },
  panels: {
    why: false,
    formula: false,
    distanceMap: false,
    code: true,
  },
  steps: generateBubbleSortSteps([64, 34, 25, 12, 22, 11, 90]),
};
