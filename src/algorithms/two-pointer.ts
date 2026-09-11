import { AlgoConfig } from '../types/algo';
import { generateTwoPointerSteps } from '../engine/generators/searching';

export const twoPointerConfig: AlgoConfig = {
  id: 'two-pointer',
  title: 'Two Pointers: Container With Most Water',
  subtitle: 'Find two lines that together with the x-axis form a container holding the most water',
  category: 'Two Pointers',
  renderer: 'array',
  visualComponent: 'water-container',
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
  steps: generateTwoPointerSteps([1, 8, 6, 2, 5, 4, 8, 3, 7]),
};
