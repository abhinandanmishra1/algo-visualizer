import { AlgoConfig } from '../types/algo';

export const reverseLinkedListConfig: AlgoConfig = {
  id: 'reverse-linked-list',
  title: 'Reverse Linked List',
  subtitle: 'Iteratively rewire next pointers in-place using three pointers (prev, curr, next)',
  category: 'Linked List',
  renderer: 'linked-list',
  aspectRatio: '16:9',
  data: {
    nodes: [
      { id: '0', val: 1 },
      { id: '1', val: 2 },
      { id: '2', val: 3 },
      { id: '3', val: 4 },
      { id: '4', val: 5 },
    ],
    cycleStartIndex: -1, // Linear linked list
  },
  code: {
    language: 'python',
    lines: [
      'def reverseList(head):',
      '    prev = None',
      '    curr = head',
      '    while curr:',
      '        nxt = curr.next   # Save next node',
      '        curr.next = prev  # Reverse pointer',
      '        prev = curr       # Advance prev',
      '        curr = nxt        # Advance curr',
      '    return prev           # New head',
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
      title: 'Initialize Pointers',
      state: {
        slowIndex: 0,
        fastIndex: 0,
        pointers: {
          0: { label: 'curr (1)', color: '#06b6d4', icon: '👉', position: 'top' },
        },
      },
      codeLines: [1, 2],
      why: 'prev is initialized to null; curr points to head node [0] (val 1).',
      caption: 'Initialize prev = null, curr = Node 1',
      formulaActive: [
        { label: 'Pointers', math: 'prev = null, curr = head', active: true },
      ],
      distanceMap: [
        { label: 'Current Node', value: '1' },
        { label: 'Prev Node', value: 'null' },
        { label: 'Processed', value: '0 / 5' },
      ],
    },
    {
      stepIndex: 1,
      title: 'Reverse Node 1',
      state: {
        slowIndex: 0,
        fastIndex: 1,
        pointers: {
          0: { label: 'prev (1)', color: '#8b5cf6', icon: '📍', position: 'bottom' },
          1: { label: 'curr (2)', color: '#06b6d4', icon: '👉', position: 'top' },
        },
      },
      codeLines: [4, 5, 6, 7],
      why: 'nxt = Node 2 saved. Node 1 now points back to null. prev advances to Node 1, curr moves to Node 2.',
      caption: 'Node 1 reversed ⟹ prev = Node 1, curr = Node 2',
      formulaActive: [
        { label: 'Rewire', math: 'Node 1.next = null', active: true },
        { label: 'Advance', math: 'prev = Node 1, curr = Node 2', active: true },
      ],
      distanceMap: [
        { label: 'Current Node', value: '2' },
        { label: 'Prev Node', value: '1' },
        { label: 'Processed', value: '1 / 5' },
      ],
    },
    {
      stepIndex: 2,
      title: 'Reverse Node 2',
      state: {
        slowIndex: 1,
        fastIndex: 2,
        pointers: {
          1: { label: 'prev (2)', color: '#8b5cf6', icon: '📍', position: 'bottom' },
          2: { label: 'curr (3)', color: '#06b6d4', icon: '👉', position: 'top' },
        },
      },
      codeLines: [4, 5, 6, 7],
      why: 'Node 2.next rewired to point to Node 1. prev advances to Node 2, curr moves to Node 3.',
      caption: 'Node 2 reversed ⟹ prev = Node 2, curr = Node 3',
      formulaActive: [
        { label: 'Rewire', math: 'Node 2.next = Node 1', active: true },
        { label: 'Reversed Chain', math: '2 ⟶ 1 ⟶ null', active: true },
      ],
      distanceMap: [
        { label: 'Current Node', value: '3' },
        { label: 'Prev Node', value: '2' },
        { label: 'Processed', value: '2 / 5' },
      ],
    },
    {
      stepIndex: 3,
      title: 'Reverse Node 3',
      state: {
        slowIndex: 2,
        fastIndex: 3,
        pointers: {
          2: { label: 'prev (3)', color: '#8b5cf6', icon: '📍', position: 'bottom' },
          3: { label: 'curr (4)', color: '#06b6d4', icon: '👉', position: 'top' },
        },
      },
      codeLines: [4, 5, 6, 7],
      why: 'Node 3.next rewired to point to Node 2. prev advances to Node 3, curr moves to Node 4.',
      caption: 'Node 3 reversed ⟹ prev = Node 3, curr = Node 4',
      formulaActive: [
        { label: 'Rewire', math: 'Node 3.next = Node 2', active: true },
        { label: 'Reversed Chain', math: '3 ⟶ 2 ⟶ 1 ⟶ null', active: true },
      ],
      distanceMap: [
        { label: 'Current Node', value: '4' },
        { label: 'Prev Node', value: '3' },
        { label: 'Processed', value: '3 / 5' },
      ],
    },
    {
      stepIndex: 4,
      title: 'Reverse Node 4',
      state: {
        slowIndex: 3,
        fastIndex: 4,
        pointers: {
          3: { label: 'prev (4)', color: '#8b5cf6', icon: '📍', position: 'bottom' },
          4: { label: 'curr (5)', color: '#06b6d4', icon: '👉', position: 'top' },
        },
      },
      codeLines: [4, 5, 6, 7],
      why: 'Node 4.next rewired to point to Node 3. prev advances to Node 4, curr moves to Node 5.',
      caption: 'Node 4 reversed ⟹ prev = Node 4, curr = Node 5',
      formulaActive: [
        { label: 'Rewire', math: 'Node 4.next = Node 3', active: true },
      ],
      distanceMap: [
        { label: 'Current Node', value: '5' },
        { label: 'Prev Node', value: '4' },
        { label: 'Processed', value: '4 / 5' },
      ],
    },
    {
      stepIndex: 5,
      title: 'Reverse Node 5 & Complete',
      state: {
        slowIndex: 4,
        fastIndex: 4,
        collision: true,
        pointers: {
          4: { label: 'NEW HEAD (5)', color: '#10b981', icon: '👑', position: 'top' },
        },
      },
      codeLines: [8],
      why: 'Node 5 points to Node 4. curr is now null, loop terminates. Return prev (Node 5) as the new head!',
      caption: 'Reversal complete! New head is Node 5: 5 ⟶ 4 ⟶ 3 ⟶ 2 ⟶ 1',
      formulaActive: [
        { label: 'Final Chain', math: '5 ⟶ 4 ⟶ 3 ⟶ 2 ⟶ 1 ⟶ null', active: true },
        { label: 'Time Complexity', math: 'O(N) single traversal', active: true },
        { label: 'Space Complexity', math: 'O(1) auxiliary pointers', active: true },
      ],
      distanceMap: [
        { label: 'New Head', value: 'Node 5', highlight: true },
        { label: 'Status', value: 'Reversed!', highlight: true },
        { label: 'Complexity', value: 'O(N) / O(1)' },
      ],
    },
  ],
};
