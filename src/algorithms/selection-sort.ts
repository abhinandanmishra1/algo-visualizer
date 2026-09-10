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
  steps: [
    {
      stepIndex: 0,
      title: 'Pass 1: Find Min Element',
      state: {
        activeIndices: [0, 4],
        pointers: {
          0: { label: 'i (64)', color: '#06b6d4', icon: '📍', position: 'top' },
          4: { label: 'min (11)', color: '#10b981', icon: '🔍', position: 'bottom' },
        },
      },
      codeLines: [2, 3, 4, 5, 6],
      why: 'Scanning from index 0 to 4: minimum element found is 11 at index 4.',
      caption: 'Find minimum in [64, 25, 12, 22, 11] ⟹ min = 11 at index 4',
      formulaActive: [
        { label: 'Min Found', math: 'min_idx = 4 (value: 11)', active: true },
      ],
      distanceMap: [
        { label: 'Unsorted Window', value: '[0 .. 4]' },
        { label: 'Min Value', value: 11, highlight: true },
      ],
    },
    {
      stepIndex: 1,
      title: 'Pass 1: Swap 64 and 11',
      state: {
        activeIndices: [0, 4],
        swappedIndices: [0, 4],
        pointers: {
          0: { label: 'Sorted (11)', color: '#10b981', icon: '✅', position: 'top' },
        },
      },
      codeLines: [7],
      why: 'Swap arr[0] (64) with arr[4] (11). Index 0 is now permanently sorted!',
      caption: 'Swap arr[0] and arr[4]: [11, 25, 12, 22, 64]',
      formulaActive: [
        { label: 'Swap Action', math: 'arr[0], arr[4] = 11, 64', active: true },
      ],
      distanceMap: [
        { label: 'Sorted Count', value: 1 },
      ],
    },
    {
      stepIndex: 2,
      title: 'Pass 2: Find Min in [25, 12, 22, 64]',
      state: {
        activeIndices: [1, 2],
        pointers: {
          1: { label: 'i (25)', color: '#06b6d4', icon: '📍', position: 'top' },
          2: { label: 'min (12)', color: '#10b981', icon: '🔍', position: 'bottom' },
        },
      },
      codeLines: [4, 5, 6],
      why: 'Scanning from index 1 to 4: min is 12 at index 2.',
      caption: 'Scan [25, 12, 22, 64] ⟹ min = 12 at index 2',
      formulaActive: [
        { label: 'Min Found', math: 'min_idx = 2 (value: 12)', active: true },
      ],
      distanceMap: [
        { label: 'Min Value', value: 12, highlight: true },
      ],
    },
    {
      stepIndex: 3,
      title: 'Pass 2: Swap 25 and 12',
      state: {
        activeIndices: [1, 2],
        swappedIndices: [1, 2],
      },
      codeLines: [7],
      why: 'Swap arr[1] (25) with arr[2] (12). First two elements [11, 12] are sorted.',
      caption: 'Swap arr[1] and arr[2]: [11, 12, 25, 22, 64]',
      formulaActive: [
        { label: 'Swap Action', math: 'arr[1], arr[2] = 12, 25', active: true },
      ],
      distanceMap: [
        { label: 'Sorted Count', value: 2 },
      ],
    },
    {
      stepIndex: 4,
      title: 'Pass 3 & 4: Place 22 and 25',
      state: {
        activeIndices: [2, 3],
        pointers: {
          2: { label: '22', color: '#10b981', icon: '✅', position: 'top' },
          3: { label: '25', color: '#10b981', icon: '✅', position: 'top' },
        },
      },
      codeLines: [7],
      why: 'Min of [25, 22, 64] is 22 at index 3. Swap 25 and 22. Array is now [11, 12, 22, 25, 64].',
      caption: 'Swap arr[2] and arr[3] ⟹ [11, 12, 22, 25, 64]',
      formulaActive: [
        { label: 'Sorted Prefix', math: '[11, 12, 22, 25]', active: true },
      ],
      distanceMap: [
        { label: 'Sorted Count', value: 4 },
      ],
    },
    {
      stepIndex: 5,
      title: 'Selection Sort Complete',
      state: {
        found: true,
        activeIndices: [0, 1, 2, 3, 4],
      },
      codeLines: [8],
      why: 'Last element 64 is already in position. Array is completely sorted in O(N²) comparisons and O(N) swaps.',
      caption: 'Selection sort complete: [11, 12, 22, 25, 64]',
      formulaActive: [
        { label: 'Time Complexity', math: 'O(N²) all cases (always scans full subarray)', active: true },
        { label: 'Swaps', math: 'O(N) minimum swaps of any comparison sort', active: true },
        { label: 'Space Complexity', math: 'O(1) in-place', active: true },
      ],
      distanceMap: [
        { label: 'Status', value: 'Sorted', highlight: true },
        { label: 'Total Swaps', value: 3 },
        { label: 'Complexity', value: 'O(N²)' },
      ],
    },
  ],
};
