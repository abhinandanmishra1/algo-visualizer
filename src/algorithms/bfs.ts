import { AlgoConfig } from '../types/algo';

export const bfsConfig: AlgoConfig = {
  id: 'bfs',
  title: 'Breadth-First Search (BFS)',
  subtitle: 'Explore the graph level by level in concentric waves using a FIFO queue',
  category: 'Graph',
  renderer: 'linked-list',
  aspectRatio: '16:9',
  data: {
    nodes: [
      { id: '0', val: 'A' },
      { id: '1', val: 'B' },
      { id: '2', val: 'C' },
      { id: '3', val: 'D' },
      { id: '4', val: 'E' },
    ],
    cycleStartIndex: -1,
  },
  code: {
    language: 'python',
    lines: [
      'from collections import deque',
      'def bfs(graph, start):',
      '    visited = {start}',
      '    queue = deque([start])',
      '    while queue:',
      '        node = queue.popleft()',
      '        for neighbor in graph[node]:',
      '            if neighbor not in visited:',
      '                visited.add(neighbor)',
      '                queue.append(neighbor)',
      '    return visited',
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
      title: 'Level 0: Enqueue Source A',
      state: {
        slowIndex: 0,
        fastIndex: 0,
        pointers: {
          0: { label: 'Level 0: A', color: '#06b6d4', icon: '📍', position: 'top' },
        },
      },
      codeLines: [2, 3],
      why: 'Start BFS at source node A. Mark visited and enqueue A. Queue = [A].',
      caption: 'Enqueue Level 0: Node A ⟹ queue = [A]',
      formulaActive: [
        { label: 'Queue State', math: 'queue = [A]', active: true },
        { label: 'Level', math: 'Level 0 (distance = 0)', active: true },
      ],
      distanceMap: [
        { label: 'Queue Size', value: 1 },
        { label: 'Current Level', value: 0 },
        { label: 'Visited Count', value: 1 },
      ],
    },
    {
      stepIndex: 1,
      title: 'Level 1: Enqueue Neighbors B & C',
      state: {
        slowIndex: 1,
        fastIndex: 2,
        pointers: {
          1: { label: 'B (Lv 1)', color: '#8b5cf6', icon: '🌊', position: 'top' },
          2: { label: 'C (Lv 1)', color: '#8b5cf6', icon: '🌊', position: 'top' },
        },
      },
      codeLines: [5, 6, 8, 9],
      why: 'Dequeue A. Discover direct neighbors B and C. Both are at distance 1 from source. Queue = [B, C].',
      caption: 'Explore Level 1: Discover B & C ⟹ queue = [B, C]',
      formulaActive: [
        { label: 'Queue State', math: 'queue = [B, C]', active: true },
        { label: 'Wavefront', math: 'Distance = 1', active: true },
      ],
      distanceMap: [
        { label: 'Queue Size', value: 2 },
        { label: 'Current Level', value: 1 },
        { label: 'Visited Count', value: 3 },
      ],
    },
    {
      stepIndex: 2,
      title: 'Level 2: Enqueue Neighbors D & E',
      state: {
        slowIndex: 3,
        fastIndex: 4,
        pointers: {
          3: { label: 'D (Lv 2)', color: '#ec4899', icon: '🌊', position: 'top' },
          4: { label: 'E (Lv 2)', color: '#ec4899', icon: '🌊', position: 'top' },
        },
      },
      codeLines: [5, 6, 8, 9],
      why: 'Dequeue B and C. Discover level-2 neighbors D and E. Queue = [D, E].',
      caption: 'Explore Level 2: Discover D & E ⟹ queue = [D, E]',
      formulaActive: [
        { label: 'Queue State', math: 'queue = [D, E]', active: true },
        { label: 'Wavefront', math: 'Distance = 2 (Shortest Path)', active: true },
      ],
      distanceMap: [
        { label: 'Queue Size', value: 2 },
        { label: 'Current Level', value: 2 },
        { label: 'Visited Count', value: 5 },
      ],
    },
    {
      stepIndex: 3,
      title: 'BFS Traversal Complete',
      state: {
        slowIndex: 0,
        fastIndex: 4,
        collision: true,
        pointers: {
          0: { label: 'A (Lv0)', color: '#10b981', icon: '✅', position: 'top' },
          1: { label: 'B (Lv1)', color: '#10b981', icon: '✅', position: 'top' },
          2: { label: 'C (Lv1)', color: '#10b981', icon: '✅', position: 'top' },
          3: { label: 'D (Lv2)', color: '#10b981', icon: '✅', position: 'top' },
          4: { label: 'E (Lv2)', color: '#10b981', icon: '✅', position: 'top' },
        },
      },
      codeLines: [10],
      why: 'Queue is empty. BFS guarantees shortest path in unweighted graphs! Order: A, B, C, D, E.',
      caption: 'BFS complete! Shortest paths to all nodes found',
      formulaActive: [
        { label: 'Wave Order', math: 'Level 0 {A} ⟶ Level 1 {B, C} ⟶ Level 2 {D, E}', active: true },
        { label: 'Time Complexity', math: 'O(V + E) linear in graph size', active: true },
        { label: 'Space Complexity', math: 'O(V) queue + visited set', active: true },
      ],
      distanceMap: [
        { label: 'Status', value: 'Complete', highlight: true },
        { label: 'Max Distance', value: '2 levels' },
        { label: 'Shortest Path Guarantee', value: 'Yes', highlight: true },
      ],
    },
  ],
};
