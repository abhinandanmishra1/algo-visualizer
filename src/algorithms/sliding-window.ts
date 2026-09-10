import { AlgoConfig } from '../types/algo';

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
  steps: [
    {
      stepIndex: 0,
      title: 'Initial Window: [0..2]',
      state: {
        activeIndices: [0, 1, 2],
        pointers: {
          0: { label: 'Start', color: '#06b6d4', icon: '🪟', position: 'bottom' },
          2: { label: 'End', color: '#06b6d4', icon: '🪟', position: 'bottom' },
        },
      },
      codeLines: [2, 3],
      why: 'Compute initial sum of first k=3 elements: 2 + 1 + 5 = 8. Set max_sum = 8.',
      caption: 'Initial window [2, 1, 5] ⟹ sum = 8, max_sum = 8',
      formulaActive: [
        { label: 'Initial Sum', math: '2 + 1 + 5 = 8', active: true },
        { label: 'Max Sum', math: 'max_sum = 8', active: true },
      ],
      distanceMap: [
        { label: 'Window Sum', value: 8 },
        { label: 'Max Sum', value: 8, highlight: true },
        { label: 'Window Size (k)', value: 3 },
      ],
    },
    {
      stepIndex: 1,
      title: 'Slide Window to [1..3]',
      state: {
        activeIndices: [1, 2, 3],
        eliminatedIndices: [0],
        pointers: {
          1: { label: 'Start', color: '#06b6d4', icon: '🪟', position: 'bottom' },
          3: { label: 'End', color: '#06b6d4', icon: '🪟', position: 'bottom' },
        },
      },
      codeLines: [4, 5, 6],
      why: 'Slide window right: subtract outgoing element arr[0] (2) and add incoming arr[3] (1). New sum = 8 - 2 + 1 = 7.',
      caption: 'Slide right: 8 − 2 + 1 = 7 (max remains 8)',
      formulaActive: [
        { label: 'Slide Update', math: '8 − 2 + 1 = 7', active: true },
        { label: 'Max Check', math: 'max(8, 7) = 8', active: true },
      ],
      distanceMap: [
        { label: 'Window Sum', value: 7 },
        { label: 'Max Sum', value: 8 },
      ],
    },
    {
      stepIndex: 2,
      title: 'Slide Window to [2..4]',
      state: {
        activeIndices: [2, 3, 4],
        eliminatedIndices: [0, 1],
        pointers: {
          2: { label: 'Start', color: '#06b6d4', icon: '🪟', position: 'bottom' },
          4: { label: 'End', color: '#06b6d4', icon: '🪟', position: 'bottom' },
        },
      },
      codeLines: [4, 5, 6],
      why: 'Slide right: subtract arr[1] (1) and add arr[4] (3). New sum = 7 - 1 + 3 = 9. NEW MAX = 9!',
      caption: 'Slide right: 7 − 1 + 3 = 9 ⟹ NEW MAX = 9!',
      formulaActive: [
        { label: 'Slide Update', math: '7 − 1 + 3 = 9', active: true },
        { label: 'New Max!', math: 'max(8, 9) = 9', active: true },
      ],
      distanceMap: [
        { label: 'Window Sum', value: 9, highlight: true },
        { label: 'Max Sum', value: 9, highlight: true },
      ],
    },
    {
      stepIndex: 3,
      title: 'Slide Window to [3..5]',
      state: {
        activeIndices: [3, 4, 5],
        eliminatedIndices: [0, 1, 2],
        pointers: {
          3: { label: 'Start', color: '#06b6d4', icon: '🪟', position: 'bottom' },
          5: { label: 'End', color: '#06b6d4', icon: '🪟', position: 'bottom' },
        },
      },
      codeLines: [4, 5, 6],
      why: 'Slide right: subtract arr[2] (5) and add arr[5] (2). New sum = 9 - 5 + 2 = 6.',
      caption: 'Slide right: 9 − 5 + 2 = 6 (max remains 9)',
      formulaActive: [
        { label: 'Slide Update', math: '9 − 5 + 2 = 6', active: true },
        { label: 'Max Check', math: 'max(9, 6) = 9', active: true },
      ],
      distanceMap: [
        { label: 'Window Sum', value: 6 },
        { label: 'Max Sum', value: 9 },
      ],
    },
    {
      stepIndex: 4,
      title: 'Optimal Subarray Complete',
      state: {
        found: true,
        activeIndices: [2, 3, 4],
        pointers: {
          2: { label: 'MAX [5', color: '#10b981', icon: '🏆', position: 'bottom' },
          3: { label: '1', color: '#10b981', icon: '', position: 'bottom' },
          4: { label: '3]', color: '#10b981', icon: '🏆', position: 'bottom' },
        },
      },
      codeLines: [7],
      why: 'Maximum sum subarray of size k=3 is [5, 1, 3] with sum = 9. O(N) single pass!',
      caption: 'Optimal max sum = 9 from subarray [5, 1, 3]',
      formulaActive: [
        { label: 'Optimal Window', math: 'arr[2..4] = [5, 1, 3], sum = 9', active: true },
        { label: 'Time Complexity', math: 'O(N) single pass vs O(N × k) brute force', active: true },
        { label: 'Space Complexity', math: 'O(1) constant auxiliary space', active: true },
      ],
      distanceMap: [
        { label: 'Max Sum', value: 9, highlight: true },
        { label: 'Best Window', value: '[5, 1, 3]', highlight: true },
        { label: 'Complexity', value: 'O(N) / O(1)' },
      ],
    },
  ],
};
