import { AlgoConfig } from '../types/algo';

export const mergeTwoSortedListsConfig: AlgoConfig = {
  id: 'merge-two-sorted-lists',
  title: 'Merge Two Sorted Lists',
  subtitle: 'Merge two sorted arrays into one sorted result by comparing head elements',
  category: 'Two Pointers',
  renderer: 'array',
  aspectRatio: '16:9',
  data: {
    elements: [1, 4, 7, 2, 5, 8],
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
  steps: [
    {
      stepIndex: 0,
      title: 'Compare L1[0] and L2[0]',
      state: {
        activeIndices: [0, 3],
        pointers: {
          0: { label: 'i (1)', color: '#06b6d4', icon: '👈', position: 'top' },
          3: { label: 'j (2)', color: '#f59e0b', icon: '👉', position: 'top' },
        },
      },
      codeLines: [2, 3, 4],
      why: 'Compare list1[0] (1) and list2[0] (2). 1 <= 2, so pick 1 from list1 and advance pointer i.',
      caption: '1 <= 2: Append 1 to result, advance pointer i',
      formulaActive: [
        { label: 'Comparison', math: '1 ≤ 2  ⟹  pick list1[0]', active: true },
        { label: 'Result So Far', math: 'result = [1]', active: true },
      ],
      distanceMap: [
        { label: 'Next Picked', value: 1, highlight: true },
        { label: 'Result Size', value: 1 },
      ],
    },
    {
      stepIndex: 1,
      title: 'Compare L1[1] and L2[0]',
      state: {
        activeIndices: [1, 3],
        pointers: {
          1: { label: 'i (4)', color: '#06b6d4', icon: '👈', position: 'top' },
          3: { label: 'j (2)', color: '#f59e0b', icon: '👉', position: 'top' },
        },
      },
      codeLines: [4, 6, 7],
      why: 'Compare list1[1] (4) and list2[0] (2). 2 < 4, so pick 2 from list2 and advance pointer j.',
      caption: '2 < 4: Append 2 to result, advance pointer j',
      formulaActive: [
        { label: 'Comparison', math: '2 < 4  ⟹  pick list2[0]', active: true },
        { label: 'Result So Far', math: 'result = [1, 2]', active: true },
      ],
      distanceMap: [
        { label: 'Next Picked', value: 2, highlight: true },
        { label: 'Result Size', value: 2 },
      ],
    },
    {
      stepIndex: 2,
      title: 'Compare L1[1] and L2[1]',
      state: {
        activeIndices: [1, 4],
        pointers: {
          1: { label: 'i (4)', color: '#06b6d4', icon: '👈', position: 'top' },
          4: { label: 'j (5)', color: '#f59e0b', icon: '👉', position: 'top' },
        },
      },
      codeLines: [4, 5],
      why: 'Compare list1[1] (4) and list2[1] (5). 4 <= 5, so pick 4 from list1 and advance pointer i.',
      caption: '4 <= 5: Append 4 to result, advance pointer i',
      formulaActive: [
        { label: 'Comparison', math: '4 ≤ 5  ⟹  pick list1[1]', active: true },
        { label: 'Result So Far', math: 'result = [1, 2, 4]', active: true },
      ],
      distanceMap: [
        { label: 'Next Picked', value: 4, highlight: true },
        { label: 'Result Size', value: 3 },
      ],
    },
    {
      stepIndex: 3,
      title: 'Compare L1[2] and L2[1]',
      state: {
        activeIndices: [2, 4],
        pointers: {
          2: { label: 'i (7)', color: '#06b6d4', icon: '👈', position: 'top' },
          4: { label: 'j (5)', color: '#f59e0b', icon: '👉', position: 'top' },
        },
      },
      codeLines: [4, 6, 7],
      why: 'Compare list1[2] (7) and list2[1] (5). 5 < 7, so pick 5 from list2 and advance pointer j.',
      caption: '5 < 7: Append 5 to result, advance pointer j',
      formulaActive: [
        { label: 'Comparison', math: '5 < 7  ⟹  pick list2[1]', active: true },
        { label: 'Result So Far', math: 'result = [1, 2, 4, 5]', active: true },
      ],
      distanceMap: [
        { label: 'Next Picked', value: 5, highlight: true },
        { label: 'Result Size', value: 4 },
      ],
    },
    {
      stepIndex: 4,
      title: 'Merge Complete',
      state: {
        found: true,
        activeIndices: [0, 1, 2, 3, 4, 5],
      },
      codeLines: [8, 9],
      why: 'Remaining elements [7, 8] are attached. All items are merged in sorted order: [1, 2, 4, 5, 7, 8].',
      caption: 'Merged result: [1, 2, 4, 5, 7, 8] complete in O(M + N)',
      formulaActive: [
        { label: 'Sorted Output', math: '[1, 2, 4, 5, 7, 8]', active: true },
        { label: 'Time Complexity', math: 'O(M + N) linear time', active: true },
        { label: 'Space Complexity', math: 'O(M + N) output buffer', active: true },
      ],
      distanceMap: [
        { label: 'Total Merged', value: 6, highlight: true },
        { label: 'Status', value: 'Complete', highlight: true },
        { label: 'Complexity', value: 'O(M + N)' },
      ],
    },
  ],
};
