import { generateQuickSortSteps } from '../engine/generators/sorting';
import { AlgoConfig } from '../types/algo';

const DEFAULT_INPUT = [10, 7, 8, 9, 1, 5];

export function buildQuickSortConfig(input: number[] = DEFAULT_INPUT): AlgoConfig {
  return {
    id: 'quick-sort',
    title: 'Quick Sort',
    subtitle: 'Partition around a pivot, then recursively sort the values on either side',
    category: 'Sorting',
    renderer: 'array',
    aspectRatio: '16:9',
    data: { elements: [...input] },
    code: {
      language: 'python',
      lines: [
        'def quick_sort(arr, low, high):',
        '    pivot = arr[high]',
        '    i = low - 1',
        '    for j in range(low, high):',
        '        if arr[j] < pivot:',
        '            i += 1',
        '            arr[i], arr[j] = arr[j], arr[i]',
        '    arr[i + 1], arr[high] = arr[high], arr[i + 1]',
        '    return i + 1  # pivot position',
      ],
    },
    panels: {
      why: true,
      formula: false,
      distanceMap: false,
      code: true,
    },
    steps: generateQuickSortSteps(input),
  };
}

export const quickSortConfig = buildQuickSortConfig();
