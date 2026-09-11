import { AlgoConfig } from '../types/algo';
import { generateLinearSearchSteps } from '../engine/generators/searching';

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
  steps: generateLinearSearchSteps([4, 2, 7, 1, 9, 3, 8], 9),
};
