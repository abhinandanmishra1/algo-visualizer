import { AlgoConfig } from '../types/algo';
import { generateSlidingWindowSteps } from '../engine/generators/searching';

export const slidingWindowConfig: AlgoConfig = {
  id: 'sliding-window',
  title: 'Sliding Window: Max Sum Subarray',
  subtitle: 'Find maximum sum of any contiguous subarray of fixed size k by adding incoming and subtracting outgoing elements',
  category: 'Array',
  renderer: 'array',
  aspectRatio: '16:9',
  data: {
    elements: [2, 1, 5, 1, 3, 2],
  },
  code: {
    language: 'python',
    lines: [
      'def max_sub_array_of_size_k(k, arr):',
      '    max_sum = 0',
      '    window_sum = sum(arr[:k])',
      '    max_sum = window_sum',
      '    for i in range(k, len(arr)):',
      '        window_sum += arr[i] - arr[i - k]',
      '        max_sum = max(max_sum, window_sum)',
      '    return max_sum',
    ],
  },
  panels: {
    why: false,
    formula: false,
    distanceMap: false,
    code: true,
  },
  steps: generateSlidingWindowSteps([2, 1, 5, 1, 3, 2], 3),
};
