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
  steps: [
    {
      stepIndex: 0,
      title: 'Step 1: Insert arr[1] (11)',
      state: {
        activeIndices: [0, 1],
        pointers: {
          1: { label: 'key (11)', color: '#06b6d4', icon: '🔑', position: 'top' },
          0: { label: '12 > 11', color: '#f59e0b', icon: '👈', position: 'bottom' },
        },
      },
      codeLines: [1, 2, 4],
      why: 'Key = 11. 12 > 11, so shift 12 right and insert 11 at index 0.',
      caption: 'Key = 11: 12 > 11 ⟹ shift 12 right and insert 11',
      formulaActive: [
        { label: 'Condition', math: '12 > 11  ⟹  shift right', active: true },
      ],
      distanceMap: [
        { label: 'Key', value: 11, highlight: true },
        { label: 'Sorted Size', value: 1 },
      ],
    },
    {
      stepIndex: 1,
      title: 'Step 1: After Inserting 11',
      state: {
        activeIndices: [0, 1],
        pointers: {
          0: { label: '11', color: '#10b981', icon: '✅', position: 'top' },
          1: { label: '12', color: '#10b981', icon: '✅', position: 'top' },
        },
      },
      codeLines: [7],
      why: 'Sorted subarray: [11, 12]. Array is [11, 12, 13, 5, 6].',
      caption: 'Subarray [11, 12] is now sorted',
      formulaActive: [
        { label: 'Sorted Prefix', math: '[11, 12]', active: true },
      ],
      distanceMap: [
        { label: 'Sorted Size', value: 2 },
      ],
    },
    {
      stepIndex: 2,
      title: 'Step 2: Insert arr[2] (13)',
      state: {
        activeIndices: [1, 2],
        pointers: {
          2: { label: 'key (13)', color: '#06b6d4', icon: '🔑', position: 'top' },
          1: { label: '12 < 13', color: '#10b981', icon: '✅', position: 'bottom' },
        },
      },
      codeLines: [1, 2, 4],
      why: 'Key = 13. 12 < 13: 13 is already in its correct sorted position!',
      caption: 'Key = 13: 12 < 13 ⟹ no shift needed',
      formulaActive: [
        { label: 'Comparison', math: '12 ≤ 13  ⟹  keep in place', active: true },
      ],
      distanceMap: [
        { label: 'Key', value: 13 },
        { label: 'Sorted Size', value: 3 },
      ],
    },
    {
      stepIndex: 3,
      title: 'Step 3: Insert arr[3] (5)',
      state: {
        activeIndices: [0, 1, 2, 3],
        pointers: {
          3: { label: 'key (5)', color: '#06b6d4', icon: '🔑', position: 'top' },
        },
      },
      codeLines: [4, 5, 6],
      why: 'Key = 5 is smaller than all elements [11, 12, 13]. Shift all three right and insert 5 at index 0.',
      caption: 'Key = 5: shift 13, 12, 11 right ⟹ insert 5 at front',
      formulaActive: [
        { label: 'Shifts', math: '5 < 11, 12, 13  ⟹  shift all right', active: true },
        { label: 'Subarray', math: '[5, 11, 12, 13, 6]', active: true },
      ],
      distanceMap: [
        { label: 'Key', value: 5, highlight: true },
        { label: 'Sorted Size', value: 4 },
      ],
    },
    {
      stepIndex: 4,
      title: 'Insertion Sort Complete',
      state: {
        found: true,
        activeIndices: [0, 1, 2, 3, 4],
      },
      codeLines: [8],
      why: 'Key = 6 inserted between 5 and 11. Fully sorted array: [5, 6, 11, 12, 13]!',
      caption: 'Insertion sort complete: [5, 6, 11, 12, 13]',
      formulaActive: [
        { label: 'Time Complexity', math: 'O(N) best (already sorted), O(N²) worst', active: true },
        { label: 'Space Complexity', math: 'O(1) auxiliary', active: true },
        { label: 'Adaptivity', math: 'Adaptive & online sort', active: true },
      ],
      distanceMap: [
        { label: 'Status', value: 'Sorted', highlight: true },
        { label: 'Best Time', value: 'O(N)' },
        { label: 'Worst Time', value: 'O(N²)' },
      ],
    },
  ],
};
