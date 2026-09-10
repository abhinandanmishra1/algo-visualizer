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
  steps: [
    {
      stepIndex: 0,
      title: 'Pass 1: Compare [0] and [1]',
      state: {
        activeIndices: [0, 1],
        pointers: {
          0: { label: 'j (64)', color: '#06b6d4', icon: '👈', position: 'top' },
          1: { label: 'j+1 (34)', color: '#f59e0b', icon: '👉', position: 'top' },
        },
      },
      codeLines: [2, 3, 4],
      why: '64 > 34: out of order! Swap required.',
      caption: 'Compare 64 and 34: 64 > 34 ⟹ SWAP!',
      formulaActive: [
        { label: 'Condition', math: 'arr[0] > arr[1] (64 > 34)  ⟹  Swap', active: true },
      ],
      distanceMap: [
        { label: 'Pass', value: '1 / 6' },
        { label: 'Comparison', value: '64 > 34' },
      ],
    },
    {
      stepIndex: 1,
      title: 'Pass 1: Swapped [0] and [1]',
      state: {
        activeIndices: [0, 1],
        swappedIndices: [0, 1],
      },
      codeLines: [5],
      why: 'Array after swap: [34, 64, 25, 12, 22, 11, 90]. 64 has moved one step right.',
      caption: 'Swapped: [34, 64, ...]',
      formulaActive: [
        { label: 'Swap Action', math: 'arr[0], arr[1] = 34, 64', active: true },
      ],
      distanceMap: [
        { label: 'Status', value: 'Swapped', highlight: true },
      ],
    },
    {
      stepIndex: 2,
      title: 'Pass 1: Compare [1] and [2]',
      state: {
        activeIndices: [1, 2],
        pointers: {
          1: { label: 'j (64)', color: '#06b6d4', icon: '👈', position: 'top' },
          2: { label: 'j+1 (25)', color: '#f59e0b', icon: '👉', position: 'top' },
        },
      },
      codeLines: [4],
      why: '64 > 25: 64 bubbles up further right.',
      caption: 'Compare 64 and 25: 64 > 25 ⟹ SWAP!',
      formulaActive: [
        { label: 'Condition', math: '64 > 25  ⟹  Swap', active: true },
      ],
      distanceMap: [
        { label: 'Pass', value: '1 / 6' },
      ],
    },
    {
      stepIndex: 3,
      title: 'Pass 1: Bubble 64 Across',
      state: {
        activeIndices: [5, 6],
        pointers: {
          5: { label: 'j (64)', color: '#06b6d4', icon: '👈', position: 'top' },
          6: { label: 'j+1 (90)', color: '#f59e0b', icon: '👉', position: 'top' },
        },
      },
      codeLines: [4],
      why: '64 < 90: no swap! 90 is already largest at the end.',
      caption: '64 < 90: no swap. Pass 1 complete: 90 is in sorted position!',
      formulaActive: [
        { label: 'Condition', math: '64 ≤ 90  ⟹  No swap', active: true },
      ],
      distanceMap: [
        { label: 'Sorted at End', value: '90', highlight: true },
      ],
    },
    {
      stepIndex: 4,
      title: 'Pass 2: Bubble 34 Across',
      state: {
        activeIndices: [0, 1],
        eliminatedIndices: [6],
        pointers: {
          0: { label: '34', color: '#06b6d4', icon: '👈', position: 'top' },
          1: { label: '25', color: '#f59e0b', icon: '👉', position: 'top' },
        },
      },
      codeLines: [2, 3, 4],
      why: '34 > 25: swap! In pass 2, 64 bubbles up to index 5.',
      caption: 'Pass 2: 34 and 64 bubble up toward end',
      formulaActive: [
        { label: 'Invariants', math: 'Largest 2 elements in place', active: true },
      ],
      distanceMap: [
        { label: 'Pass', value: '2 / 6' },
      ],
    },
    {
      stepIndex: 5,
      title: 'All Passes Complete: Sorted!',
      state: {
        found: true,
        activeIndices: [0, 1, 2, 3, 4, 5, 6],
      },
      codeLines: [6],
      why: 'Array is fully sorted: [11, 12, 22, 25, 34, 64, 90] in O(N²) time!',
      caption: 'Bubble sort complete! Sorted array: [11, 12, 22, 25, 34, 64, 90]',
      formulaActive: [
        { label: 'Time Complexity', math: 'O(N²) worst/average, O(N) best', active: true },
        { label: 'Space Complexity', math: 'O(1) in-place', active: true },
        { label: 'Stability', math: 'Stable sort', active: true },
      ],
      distanceMap: [
        { label: 'Status', value: 'Fully Sorted', highlight: true },
        { label: 'Time Complexity', value: 'O(N²)' },
        { label: 'Space Complexity', value: 'O(1)' },
      ],
    },
  ],
};
