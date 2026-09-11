import { AlgoConfig } from '../types/algo';
import { generateDFSSteps } from '../engine/generators/graph';

const exampleGraph = {
  'A': ['B', 'C'],
  'B': ['D', 'E'],
  'C': ['F'],
  'D': [],
  'E': ['F'],
  'F': []
};

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
      { id: '5', val: 'F' },
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
  steps: generateDFSSteps(exampleGraph, 'A'),
};
