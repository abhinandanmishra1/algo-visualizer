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
        'def merge_sort(arr):',
        '    if len(arr) <= 1:',
        '        return arr',
        '    mid = len(arr) // 2',
        '    left = merge_sort(arr[:mid])',
        '    right = merge_sort(arr[mid:])',
        '    return merge(left, right)',
        '',
        'def merge(left, right):',
        '    # Repeatedly take the smaller front element',
        '    ...',
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
