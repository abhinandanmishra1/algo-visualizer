import { AlgoConfig } from '../types/algo';
import { generateMergeTwoSortedListsSteps } from '../engine/generators/merging';

const list1 = [1, 4, 7];
const list2 = [2, 5, 8];
const mergeCols = Math.max(list1.length, list2.length, list1.length + list2.length);

export const mergeTwoSortedListsConfig: AlgoConfig = {
  id: 'merge-two-sorted-lists',
  title: 'Merge Two Sorted Lists',
  subtitle: 'Merge two sorted arrays into one sorted result by comparing head elements',
  category: 'Two Pointers',
  renderer: 'matrix',
  aspectRatio: '16:9',
  data: {
    rows: 3,
    cols: mergeCols,
    cells: {
      ...Object.fromEntries(list1.map((value, idx) => [`0,${idx}`, value])),
      ...Object.fromEntries(list2.map((value, idx) => [`1,${idx}`, value])),
    },
    rowLabels: ['List 1', 'List 2', 'Result'],
    rowLengths: [list1.length, list2.length, list1.length + list2.length],
  },
  code: {
    language: 'python',
    lines: [
      'def merge(list1, list2):',
      '    result = []',
      '    i = j = 0',
      '    while i < len(list1) and j < len(list2):',
      '        if list1[i] <= list2[j]:',
      '            result.append(list1[i]); i += 1',
      '        else:',
      '            result.append(list2[j]); j += 1',
      '    result.extend(list1[i:] or list2[j:])',
      '    return result',
    ],
  },
  panels: {
    why: false,
    formula: false,
    distanceMap: false,
    code: true,
  },
  steps: generateMergeTwoSortedListsSteps(list1, list2),
};
