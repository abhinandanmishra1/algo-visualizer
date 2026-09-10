import { AlgoConfig } from '../types/algo';

export const linearSearchConfig: AlgoConfig = {
  id: 'linear-search',
  title: 'Linear Search',
  subtitle: 'Sequentially check each element of the list until a match is found or the whole list has been searched',
  category: 'Search',
  renderer: 'array',
  aspectRatio: '16:9',
  data: {
    elements: [4, 2, 7, 1, 9, 3, 8],
    target: 9,
  },
  code: {
    language: 'python',
    lines: [
      'def linear_search(arr, target):',
      '    for i in range(len(arr)):',
      '        if arr[i] == target:',
      '            return i  # Found!',
      '    return -1         # Not found',
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
      title: 'Check Index 0',
      state: {
        target: 9,
        activeIndices: [0],
        pointers: {
          0: { label: 'i=0 (4)', color: '#06b6d4', icon: '🔍', position: 'top' },
        },
      },
      codeLines: [1, 2],
      why: 'Compare arr[0] (4) with target (9). 4 ≠ 9, continue to next index.',
      caption: 'arr[0] = 4 ≠ 9 ⟹ advance',
      formulaActive: [
        { label: 'Comparison', math: 'arr[0] = 4 ≠ 9', active: true },
      ],
      distanceMap: [
        { label: 'Current Value', value: 4 },
        { label: 'Target', value: 9 },
        { label: 'Checked', value: '1 / 7' },
      ],
    },
    {
      stepIndex: 1,
      title: 'Check Index 1 & 2',
      state: {
        target: 9,
        activeIndices: [2],
        eliminatedIndices: [0, 1],
        pointers: {
          2: { label: 'i=2 (7)', color: '#06b6d4', icon: '🔍', position: 'top' },
        },
      },
      codeLines: [1, 2],
      why: 'arr[1] = 2 ≠ 9. arr[2] = 7 ≠ 9. Neither matches target. Continue searching.',
      caption: 'arr[2] = 7 ≠ 9 ⟹ advance',
      formulaActive: [
        { label: 'Comparison', math: 'arr[2] = 7 ≠ 9', active: true },
      ],
      distanceMap: [
        { label: 'Current Value', value: 7 },
        { label: 'Target', value: 9 },
        { label: 'Checked', value: '3 / 7' },
      ],
    },
    {
      stepIndex: 2,
      title: 'Check Index 3',
      state: {
        target: 9,
        activeIndices: [3],
        eliminatedIndices: [0, 1, 2],
        pointers: {
          3: { label: 'i=3 (1)', color: '#06b6d4', icon: '🔍', position: 'top' },
        },
      },
      codeLines: [1, 2],
      why: 'arr[3] = 1 ≠ 9. Target not yet found.',
      caption: 'arr[3] = 1 ≠ 9 ⟹ advance',
      formulaActive: [
        { label: 'Comparison', math: 'arr[3] = 1 ≠ 9', active: true },
      ],
      distanceMap: [
        { label: 'Current Value', value: 1 },
        { label: 'Checked', value: '4 / 7' },
      ],
    },
    {
      stepIndex: 3,
      title: 'Check Index 4: Target Found!',
      state: {
        target: 9,
        found: true,
        activeIndices: [4],
        eliminatedIndices: [0, 1, 2, 3],
        pointers: {
          4: { label: 'TARGET (9)', color: '#10b981', icon: '🎯', position: 'top' },
        },
      },
      codeLines: [2, 3],
      why: 'arr[4] == 9 == target! Match found at index 4. Return 4 immediately.',
      caption: 'MATCH FOUND! arr[4] == 9 at index 4',
      formulaActive: [
        { label: 'Success', math: 'arr[4] == 9  ⟹  return 4', active: true },
        { label: 'Time Complexity', math: 'O(N) worst, O(1) best', active: true },
        { label: 'Space Complexity', math: 'O(1) auxiliary', active: true },
      ],
      distanceMap: [
        { label: 'Found Index', value: 4, highlight: true },
        { label: 'Target', value: 9, highlight: true },
        { label: 'Comparisons', value: 5 },
      ],
    },
  ],
};
