import { AlgoConfig } from '../types/algo';

export const binarySearchConfig: AlgoConfig = {
  id: 'binary-search',
  title: 'Binary Search',
  subtitle: 'Logarithmic search on a sorted array by repeatedly halving the search space',
  category: 'Array',
  renderer: 'array',
  aspectRatio: '16:9',
  data: {
    elements: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
    target: 23,
  },
  code: {
    language: 'python',
    lines: [
      'def binary_search(arr, target):',
      '    left = 0',
      '    right = len(arr) - 1',
      '    while left <= right:',
      '        mid = (left + right) // 2',
      '        if arr[mid] == target:',
      '            return mid  # Found!',
      '        elif arr[mid] < target:',
      '            left = mid + 1',
      '        else:',
      '            right = mid - 1',
      '    return -1  # Not found',
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
      title: 'Initialize Boundaries',
      state: { left: 0, right: 9, target: 23 },
      codeLines: [2, 3],
      why: 'Search window spans entire sorted array. left = 0, right = 9, target = 23.',
      caption: 'Initialize left = 0, right = 9 for target 23',
      formulaActive: [
        { label: 'Search Space Size', math: 'N = 10', active: true },
        { label: 'Complexity Ceiling', math: '⌈log₂ 10⌉ = 4 comparisons', active: true },
      ],
      distanceMap: [
        { label: 'Search Range', value: '[0 .. 9]' },
        { label: 'Elements Left', value: 10 },
        { label: 'Target', value: 23 },
      ],
    },
    {
      stepIndex: 1,
      title: 'Calculate Midpoint',
      state: { left: 0, right: 9, mid: 4, target: 23 },
      codeLines: [4, 5],
      why: 'mid = (0 + 9) // 2 = 4. Element at mid is arr[4] = 16.',
      caption: 'Calculate mid = (0 + 9) // 2 = 4 (value: 16)',
      formulaActive: [
        { label: 'Mid Formula', math: 'mid = ⌊(0 + 9) / 2⌋ = 4', active: true },
        { label: 'Comparison', math: 'arr[4] = 16 < 23', active: true },
      ],
      distanceMap: [
        { label: 'Mid Index', value: 4 },
        { label: 'Mid Value', value: 16 },
        { label: 'Target', value: 23 },
      ],
    },
    {
      stepIndex: 2,
      title: 'Target Greater -> Shift Left',
      state: { left: 5, right: 9, target: 23 },
      codeLines: [8, 9],
      why: '16 < 23: target must reside in right half. Discard indices 0..4, set left = mid + 1 = 5.',
      caption: 'arr[mid] < target: discard left half, left = 5',
      formulaActive: [
        { label: 'Branch Taken', math: 'arr[mid] < target  ⟹  left = mid + 1', active: true },
        { label: 'Halved Space', math: 'N_new = 5 ≈ 10 / 2', active: true },
      ],
      distanceMap: [
        { label: 'Search Range', value: '[5 .. 9]', highlight: true },
        { label: 'Elements Left', value: 5 },
      ],
    },
    {
      stepIndex: 3,
      title: 'Calculate New Midpoint',
      state: { left: 5, right: 9, mid: 7, target: 23 },
      codeLines: [4, 5],
      why: 'mid = (5 + 9) // 2 = 7. Element at mid is arr[7] = 56.',
      caption: 'Calculate mid = (5 + 9) // 2 = 7 (value: 56)',
      formulaActive: [
        { label: 'Mid Formula', math: 'mid = ⌊(5 + 9) / 2⌋ = 7', active: true },
        { label: 'Comparison', math: 'arr[7] = 56 > 23', active: true },
      ],
      distanceMap: [
        { label: 'Mid Index', value: 7 },
        { label: 'Mid Value', value: 56 },
      ],
    },
    {
      stepIndex: 4,
      title: 'Target Smaller -> Shift Right',
      state: { left: 5, right: 6, target: 23 },
      codeLines: [10, 11],
      why: '56 > 23: target must reside to the left of 56. Discard indices 7..9, set right = mid - 1 = 6.',
      caption: 'arr[mid] > target: discard right half, right = 6',
      formulaActive: [
        { label: 'Branch Taken', math: 'arr[mid] > target  ⟹  right = mid − 1', active: true },
        { label: 'Remaining Space', math: 'N_new = 2', active: true },
      ],
      distanceMap: [
        { label: 'Search Range', value: '[5 .. 6]', highlight: true },
        { label: 'Elements Left', value: 2 },
      ],
    },
    {
      stepIndex: 5,
      title: 'Final Midpoint: Target Found!',
      state: { left: 5, right: 6, mid: 5, target: 23, found: true },
      codeLines: [5, 6, 7],
      why: 'mid = (5 + 6) // 2 = 5. arr[5] == 23 == target! Match found at index 5.',
      caption: 'TARGET FOUND! arr[5] == 23',
      formulaActive: [
        { label: 'Success Match', math: 'arr[mid] == target  ⟹  return 5', active: true },
        { label: 'Total Steps', math: '3 comparisons ≤ ⌈log₂ 10⌉', active: true },
      ],
      distanceMap: [
        { label: 'Found Index', value: 5, highlight: true },
        { label: 'Value', value: 23, highlight: true },
        { label: 'Comparisons', value: 3 },
      ],
    },
  ],
};
