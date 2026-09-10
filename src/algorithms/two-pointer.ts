import { AlgoConfig } from '../types/algo';

export const twoPointerConfig: AlgoConfig = {
  id: 'two-pointer',
  title: 'Two Pointers: Container With Most Water',
  subtitle: 'Find two lines that together with the x-axis form a container holding the most water',
  category: 'Two Pointers',
  renderer: 'array',
  aspectRatio: '16:9',
  data: {
    elements: [1, 8, 6, 2, 5, 4, 8, 3, 7],
  },
  code: {
    language: 'python',
    lines: [
      'def maxArea(height):',
      '    left, right = 0, len(height) - 1',
      '    max_water = 0',
      '    while left < right:',
      '        width = right - left',
      '        h = min(height[left], height[right])',
      '        max_water = max(max_water, width * h)',
      '        if height[left] < height[right]:',
      '            left += 1',
      '        else:',
      '            right -= 1',
      '    return max_water',
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
      title: 'Initialize Left & Right Pointers',
      state: {
        left: 0,
        right: 8,
        activeIndices: [0, 8],
        pointers: {
          0: { label: 'L (h=1)', color: '#06b6d4', icon: '👈', position: 'bottom' },
          8: { label: 'R (h=7)', color: '#f43f5e', icon: '👉', position: 'bottom' },
        },
      },
      codeLines: [1, 2],
      why: 'Initialize left pointer at start (index 0) and right pointer at end (index 8). Initial max_water = 0.',
      caption: 'Initialize left = 0 (h=1), right = 8 (h=7)',
      formulaActive: [
        { label: 'Current Area', math: 'min(1, 7) × (8 − 0) = 8', active: true },
        { label: 'Max Water', math: 'max_water = 8', active: true },
      ],
      distanceMap: [
        { label: 'Left Height', value: 1 },
        { label: 'Right Height', value: 7 },
        { label: 'Width', value: 8 },
        { label: 'Max Water', value: 8, highlight: true },
      ],
    },
    {
      stepIndex: 1,
      title: 'Calculate Area & Advance Left',
      state: {
        left: 1,
        right: 8,
        activeIndices: [1, 8],
        pointers: {
          1: { label: 'L (h=8)', color: '#06b6d4', icon: '👈', position: 'bottom' },
          8: { label: 'R (h=7)', color: '#f43f5e', icon: '👉', position: 'bottom' },
        },
      },
      codeLines: [7, 8],
      why: 'height[0] (1) < height[8] (7). The shorter line limits capacity; advance left to 1 hoping for taller height.',
      caption: 'height[0] < height[8] ⟹ advance left to index 1',
      formulaActive: [
        { label: 'Comparison', math: 'height[0] < height[8]  ⟹  left += 1', active: true },
        { label: 'Current Area', math: 'min(8, 7) × (8 − 1) = 49', active: true },
      ],
      distanceMap: [
        { label: 'Left Height', value: 8 },
        { label: 'Right Height', value: 7 },
        { label: 'Width', value: 7 },
        { label: 'Max Water', value: 49, highlight: true },
      ],
    },
    {
      stepIndex: 2,
      title: 'Record New Max (49) & Shift Right',
      state: {
        left: 1,
        right: 7,
        activeIndices: [1, 7],
        pointers: {
          1: { label: 'L (h=8)', color: '#06b6d4', icon: '👈', position: 'bottom' },
          7: { label: 'R (h=3)', color: '#f43f5e', icon: '👉', position: 'bottom' },
        },
      },
      codeLines: [6, 9, 10],
      why: 'New max_water = 49 recorded! height[1] (8) > height[8] (7), so decrement right pointer to index 7.',
      caption: 'New max = 49! height[8] < height[1] ⟹ right = 7',
      formulaActive: [
        { label: 'Best Area', math: 'max_water = 49', active: true },
        { label: 'Next Comparison', math: 'min(8, 3) × (7 − 1) = 18', active: true },
      ],
      distanceMap: [
        { label: 'Left Height', value: 8 },
        { label: 'Right Height', value: 3 },
        { label: 'Area', value: 18 },
        { label: 'Max Water', value: 49, highlight: true },
      ],
    },
    {
      stepIndex: 3,
      title: 'Area 18 < 49: Shift Right Again',
      state: {
        left: 1,
        right: 6,
        activeIndices: [1, 6],
        pointers: {
          1: { label: 'L (h=8)', color: '#06b6d4', icon: '👈', position: 'bottom' },
          6: { label: 'R (h=8)', color: '#f43f5e', icon: '👉', position: 'bottom' },
        },
      },
      codeLines: [9, 10],
      why: 'Area 18 is less than max 49. height[7] (3) is smaller, so decrement right to index 6 (h=8).',
      caption: 'Area 18 < 49. Advance right pointer to index 6',
      formulaActive: [
        { label: 'Current Area', math: 'min(8, 8) × (6 − 1) = 40', active: true },
        { label: 'Max Water', math: 'max_water = 49', active: true },
      ],
      distanceMap: [
        { label: 'Left Height', value: 8 },
        { label: 'Right Height', value: 8 },
        { label: 'Width', value: 5 },
        { label: 'Current Area', value: 40 },
      ],
    },
    {
      stepIndex: 4,
      title: 'Optimal Container Found',
      state: {
        left: 1,
        right: 8,
        found: true,
        activeIndices: [1, 8],
        pointers: {
          1: { label: 'Optimal L (h=8)', color: '#10b981', icon: '🏆', position: 'bottom' },
          8: { label: 'Optimal R (h=7)', color: '#10b981', icon: '🏆', position: 'bottom' },
        },
      },
      codeLines: [11],
      why: 'Max area of 49 between index 1 and index 8 is optimal! O(N) single pass completes.',
      caption: 'Optimal max water container = 49 (indices [1] and [8])',
      formulaActive: [
        { label: 'Max Water Result', math: 'max_water = 49', active: true },
        { label: 'Time Complexity', math: 'O(N) single scan', active: true },
        { label: 'Space Complexity', math: 'O(1) extra space', active: true },
      ],
      distanceMap: [
        { label: 'Max Capacity', value: 49, highlight: true },
        { label: 'Optimal Pair', value: '[1] & [8]', highlight: true },
        { label: 'Complexity', value: 'O(N) / O(1)' },
      ],
    },
  ],
};
