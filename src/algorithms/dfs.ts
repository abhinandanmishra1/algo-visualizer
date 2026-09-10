import { AlgoConfig } from '../types/algo';

export const dfsConfig: AlgoConfig = {
  id: 'dfs',
  title: 'Depth-First Search (DFS)',
  subtitle: 'Explore as deep as possible along each branch before backtracking using recursion or a call stack',
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
      'def dfs(graph, node, visited):',
      '    if node not in visited:',
      '        visited.add(node)',
      '        for neighbor in graph[node]:',
      '            dfs(graph, neighbor, visited)',
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
      title: 'Visit Root Node A',
      state: {
        slowIndex: 0,
        fastIndex: 0,
        pointers: {
          0: { label: 'DFS: A', color: '#06b6d4', icon: '📍', position: 'top' },
        },
      },
      codeLines: [1, 2],
      why: 'Start DFS at root Node A. Add A to visited set and push onto call stack.',
      caption: 'Visit Node A ⟹ visited = {A}, stack = [A]',
      formulaActive: [
        { label: 'Visited Set', math: 'visited = {A}', active: true },
        { label: 'Call Stack', math: 'stack = [A]', active: true },
      ],
      distanceMap: [
        { label: 'Current Node', value: 'A' },
        { label: 'Visited Count', value: 1 },
        { label: 'Stack Depth', value: 1 },
      ],
    },
    {
      stepIndex: 1,
      title: 'Deeper: Visit Node B',
      state: {
        slowIndex: 1,
        fastIndex: 1,
        pointers: {
          1: { label: 'DFS: B', color: '#06b6d4', icon: '📍', position: 'top' },
        },
      },
      codeLines: [3, 4],
      why: 'Traverse first unvisited neighbor: Node B. Push B onto call stack.',
      caption: 'Deepen to Node B ⟹ visited = {A, B}, stack = [A, B]',
      formulaActive: [
        { label: 'Visited Set', math: 'visited = {A, B}', active: true },
        { label: 'Call Stack', math: 'stack = [A, B]', active: true },
      ],
      distanceMap: [
        { label: 'Current Node', value: 'B' },
        { label: 'Visited Count', value: 2 },
        { label: 'Stack Depth', value: 2 },
      ],
    },
    {
      stepIndex: 2,
      title: 'Deeper: Visit Node C',
      state: {
        slowIndex: 2,
        fastIndex: 2,
        pointers: {
          2: { label: 'DFS: C', color: '#06b6d4', icon: '📍', position: 'top' },
        },
      },
      codeLines: [3, 4],
      why: 'Traverse neighbor Node C. Depth increases to 3.',
      caption: 'Deepen to Node C ⟹ visited = {A, B, C}, stack = [A, B, C]',
      formulaActive: [
        { label: 'Visited Set', math: 'visited = {A, B, C}', active: true },
        { label: 'Call Stack', math: 'stack = [A, B, C]', active: true },
      ],
      distanceMap: [
        { label: 'Current Node', value: 'C' },
        { label: 'Visited Count', value: 3 },
        { label: 'Stack Depth', value: 3 },
      ],
    },
    {
      stepIndex: 3,
      title: 'Branch Out: Visit Node D & E',
      state: {
        slowIndex: 3,
        fastIndex: 4,
        pointers: {
          3: { label: 'D (Visited)', color: '#10b981', icon: '✅', position: 'top' },
          4: { label: 'E (Visiting)', color: '#06b6d4', icon: '📍', position: 'top' },
        },
      },
      codeLines: [3, 4],
      why: 'Backtrack and explore other branches: Node D and Node E visited.',
      caption: 'Explore remaining branches: D and E visited',
      formulaActive: [
        { label: 'Visited Set', math: 'visited = {A, B, C, D, E}', active: true },
      ],
      distanceMap: [
        { label: 'Visited Count', value: 5 },
      ],
    },
    {
      stepIndex: 4,
      title: 'DFS Traversal Complete',
      state: {
        slowIndex: 0,
        fastIndex: 4,
        collision: true,
        pointers: {
          0: { label: 'A', color: '#10b981', icon: '✅', position: 'top' },
          1: { label: 'B', color: '#10b981', icon: '✅', position: 'top' },
          2: { label: 'C', color: '#10b981', icon: '✅', position: 'top' },
          3: { label: 'D', color: '#10b981', icon: '✅', position: 'top' },
          4: { label: 'E', color: '#10b981', icon: '✅', position: 'top' },
        },
      },
      codeLines: [5],
      why: 'All nodes visited in depth-first order: A ⟶ B ⟶ C ⟶ D ⟶ E.',
      caption: 'DFS complete! All nodes visited in O(V + E) time',
      formulaActive: [
        { label: 'Traversal Order', math: 'A ⟶ B ⟶ C ⟶ D ⟶ E', active: true },
        { label: 'Time Complexity', math: 'O(V + E)', active: true },
        { label: 'Space Complexity', math: 'O(V) recursion stack', active: true },
      ],
      distanceMap: [
        { label: 'Status', value: 'Complete', highlight: true },
        { label: 'Total Nodes', value: 5 },
        { label: 'Complexity', value: 'O(V + E)' },
      ],
    },
  ],
};
