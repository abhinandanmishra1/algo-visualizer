import { generateMergeSortSteps } from '../engine/generators/sorting';
import { AlgoConfig } from '../types/algo';

const DEFAULT_INPUT = [38, 27, 43, 3, 9, 82, 10];

export function buildMergeSortConfig(input: number[] = DEFAULT_INPUT): AlgoConfig {
  return {
    id: 'merge-sort',
    title: 'Merge Sort',
    subtitle: 'Divide the array into smaller halves, sort them, then merge the sorted halves',
    category: 'Sorting',
    renderer: 'array',
    aspectRatio: '16:9',
    data: { elements: [...input] },
    code: {
      language: 'python',
      lines: [
        'def merge_sort(arr, left, right):',
        '    if left >= right:',
        '        return',
        '    mid = (left + right) // 2',
        '    merge_sort(arr, left, mid)',
        '    merge_sort(arr, mid + 1, right)',
        '    # Merge the two sorted halves',
        '    # Compare the front values and place the smaller one',
        '    # Copy any values that remain in either half',
        '    return arr',
      ],
    },
    panels: {
      why: true,
      formula: false,
      distanceMap: false,
      code: true,
    },
    steps: generateMergeSortSteps(input),
  };
}

export const mergeSortConfig = buildMergeSortConfig();
