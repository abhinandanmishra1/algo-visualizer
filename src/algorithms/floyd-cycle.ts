import { AlgoConfig } from '../types/algo';

export const floydCycleConfig: AlgoConfig = {
  id: 'floyd-cycle',
  title: "Floyd's Cycle Detection",
  subtitle: 'Tortoise and Hare algorithm for linked list loop detection and cycle start finding',
  category: 'Linked List',
  renderer: 'linked-list',
  aspectRatio: '16:9',
  data: {
    nodes: [
      { id: '0', val: 3 },
      { id: '1', val: 2 },
      { id: '2', val: 0 },
      { id: '3', val: -4 },
    ],
    cycleStartIndex: 1, // Node with val: 2
  },
  code: {
    language: 'python',
    lines: [
      'def detectCycle(head):',
      '    # Phase 1: Detect whether a cycle exists',
      '    slow = fast = head',
      '    while fast and fast.next:',
      '        slow = slow.next',
      '        fast = fast.next.next',
      '        if slow == fast: break',
      '    else:',
      '        return None  # No cycle',
      '',
      '    # Phase 2: Find cycle start node',
      '    slow = head',
      '    while slow != fast:',
      '        slow = slow.next',
      '        fast = fast.next',
      '    return slow  # Start of cycle',
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
      state: { slowIndex: 0, fastIndex: 0, phase: 'detection' },
      codeLines: [3],
      why: 'Both Slow (tortoise) and Fast (hare) pointers start at the head node [0].',
      caption: 'Both Slow and Fast pointers initialize at head (node 0)',
      formulaActive: [
        { label: 'Relative Speed', math: 'v_fast = 2 × v_slow', active: true, explanation: 'Fast covers double distance each tick' },
        { label: 'Distance Traveled', math: 'd_fast = 2 × d_slow', active: true },
        { label: 'Meeting Equation', math: '2k − k = nC  ⟹  k = nC', active: false },
      ],
      distanceMap: [
        { label: 'Slow Distance (k)', value: 0 },
        { label: 'Fast Distance (2k)', value: 0 },
        { label: 'Cycle Length (C)', value: 3 },
        { label: 'Phase', value: 'Phase 1: Detection' },
      ],
    },
    {
      stepIndex: 1,
      title: 'Check Loop Guard',
      state: { slowIndex: 0, fastIndex: 0, phase: 'detection' },
      codeLines: [4],
      why: 'fast and fast.next are non-null. Safe to advance both pointers without null pointer error.',
      caption: 'Check fast and fast.next are valid',
      formulaActive: [
        { label: 'Guard Condition', math: 'fast ≠ null ∧ fast.next ≠ null', active: true },
      ],
      distanceMap: [
        { label: 'Slow Distance (k)', value: 0 },
        { label: 'Fast Distance (2k)', value: 0 },
        { label: 'Status', value: 'Guard valid' },
      ],
    },
    {
      stepIndex: 2,
      title: 'Advance Slow 1 Step',
      state: { slowIndex: 1, fastIndex: 0, phase: 'detection' },
      codeLines: [5],
      why: 'slow = slow.next: Slow pointer advances 1 node forward to node 1.',
      caption: 'Slow advances 1 step to node 1',
      formulaActive: [
        { label: 'Slow Distance', math: 'd_slow = 1', active: true },
      ],
      distanceMap: [
        { label: 'Slow Distance (k)', value: 1 },
        { label: 'Fast Distance (2k)', value: 0 },
      ],
    },
    {
      stepIndex: 3,
      title: 'Advance Fast 2 Steps',
      state: { slowIndex: 1, fastIndex: 2, phase: 'detection' },
      codeLines: [6],
      why: 'fast = fast.next.next: Fast pointer advances 2 nodes forward to node 2.',
      caption: 'Fast advances 2 steps to node 2',
      formulaActive: [
        { label: 'Speed Ratio', math: 'd_fast = 2 × d_slow = 2', active: true },
      ],
      distanceMap: [
        { label: 'Slow Distance (k)', value: 1 },
        { label: 'Fast Distance (2k)', value: 2 },
      ],
    },
    {
      stepIndex: 4,
      title: 'Compare Pointers',
      state: { slowIndex: 1, fastIndex: 2, phase: 'detection' },
      codeLines: [7],
      why: 'slow (node 1) != fast (node 2). No collision yet. Continue while loop.',
      caption: 'slow (1) != fast (2) -> continue loop',
      formulaActive: [
        { label: 'Collision Check', math: 'slow ≠ fast  ⟹  continue', active: true },
      ],
      distanceMap: [
        { label: 'Gap in loop', value: '1 step' },
      ],
    },
    {
      stepIndex: 5,
      title: 'Advance Slow to Node 2',
      state: { slowIndex: 2, fastIndex: 2, phase: 'detection' },
      codeLines: [5],
      why: 'Slow advances 1 step to node 2. Total slow distance = 2.',
      caption: 'Slow advances 1 step to node 2',
      formulaActive: [
        { label: 'Slow Distance', math: 'd_slow = 2', active: true },
      ],
      distanceMap: [
        { label: 'Slow Distance (k)', value: 2 },
        { label: 'Fast Distance (2k)', value: 2 },
      ],
    },
    {
      stepIndex: 6,
      title: 'Advance Fast Around Loop',
      state: { slowIndex: 2, fastIndex: 1, phase: 'detection' },
      codeLines: [6],
      why: 'Fast advances 2 steps: node 2 -> node 3 -> loops back to node 1! Fast is now inside the loop.',
      caption: 'Fast loops back around to node 1',
      formulaActive: [
        { label: 'Cycle Wrap', math: 'fast wrapped back to node 1', active: true },
        { label: 'Distance Traveled', math: 'd_fast = 4, d_slow = 2', active: true },
      ],
      distanceMap: [
        { label: 'Slow Distance (k)', value: 2 },
        { label: 'Fast Distance (2k)', value: 4 },
      ],
    },
    {
      stepIndex: 7,
      title: 'Advance Slow to Node 3',
      state: { slowIndex: 3, fastIndex: 1, phase: 'detection' },
      codeLines: [5],
      why: 'Slow moves to node 3. Total slow distance = 3.',
      caption: 'Slow moves to node 3',
      formulaActive: [
        { label: 'Slow Distance', math: 'd_slow = 3', active: true },
      ],
      distanceMap: [
        { label: 'Slow Distance (k)', value: 3 },
      ],
    },
    {
      stepIndex: 8,
      title: 'Advance Fast to Node 3 (Collision)',
      state: { slowIndex: 3, fastIndex: 3, phase: 'detection', collision: true, meetingIndex: 3 },
      codeLines: [6, 7],
      why: 'Fast advances 2 steps: node 1 -> node 2 -> node 3. COLLISION! Both pointers meet at node 3.',
      caption: 'COLLISION DETECTED! Slow and Fast meet at node 3',
      formulaActive: [
        { label: 'Collision Equation', math: '2k − k = nC  ⟹  6 − 3 = 3', active: true, explanation: 'Relative difference is exactly 1 full cycle length (C=3)' },
        { label: 'Loop Theorem', math: 'k = nC', active: true },
      ],
      distanceMap: [
        { label: 'Slow Distance (k)', value: 3, highlight: true },
        { label: 'Fast Distance (2k)', value: 6, highlight: true },
        { label: 'Collision Node', value: 'Node 3', highlight: true },
      ],
    },
    {
      stepIndex: 9,
      title: 'Phase 2: Reset Slow to Head',
      state: { slowIndex: 0, fastIndex: 3, phase: 'find_start', meetingIndex: 3 },
      codeLines: [12],
      why: 'Phase 2 begins: reset Slow to the head node (node 0) while keeping Fast at meeting point (node 3). Both will now move 1 step at a time.',
      caption: 'Reset Slow to head node 0; Fast stays at meeting node 3',
      formulaActive: [
        { label: 'Cycle Start Math', math: 'a = nC − b', active: true, explanation: 'Distance from head to cycle start equals distance from meeting point to cycle start' },
        { label: 'Equal Velocity', math: 'v_slow = v_fast = 1', active: true },
      ],
      distanceMap: [
        { label: 'Head to Start (a)', value: '1 step' },
        { label: 'Meeting to Start (C-b)', value: '1 step' },
        { label: 'Phase', value: 'Phase 2: Find Start', highlight: true },
      ],
    },
    {
      stepIndex: 10,
      title: 'Advance Both Pointers 1 Step',
      state: { slowIndex: 1, fastIndex: 1, phase: 'completed', cycleStartIndex: 1, collision: true },
      codeLines: [14, 15, 16],
      why: 'Slow moves 1 step (node 0 -> node 1). Fast moves 1 step (node 3 -> node 1). They meet at node 1 — the START OF THE CYCLE!',
      caption: 'Cycle start confirmed at Node 1 (value 2)!',
      formulaActive: [
        { label: 'Cycle Start Proved', math: 'slow == fast  ⟹  Start = Node 1', active: true },
        { label: 'Time Complexity', math: 'O(N)', active: true, explanation: 'Visits each node at most twice' },
        { label: 'Space Complexity', math: 'O(1)', active: true, explanation: 'Only two pointer references' },
      ],
      distanceMap: [
        { label: 'Cycle Start Node', value: 'Node 1 (val: 2)', highlight: true },
        { label: 'Status', value: 'Cycle detected & start found!', highlight: true },
        { label: 'Complexity', value: 'O(N) Time / O(1) Space' },
      ],
    },
  ],
};
