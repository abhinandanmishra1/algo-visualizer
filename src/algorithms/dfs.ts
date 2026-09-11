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

const graphEdges = Object.entries(exampleGraph).flatMap(([from, tos]) =>
  tos.map((to) => ({ from, to }))
);

export const dfsConfig: AlgoConfig = {
  id: 'dfs',
  title: 'Depth-First Search (DFS)',
  subtitle: 'Explore as deep as possible along each branch before backtracking using recursion or a call stack',
  category: 'Graph',
  renderer: 'graph',
  aspectRatio: '16:9',
  data: {
    nodes: Object.keys(exampleGraph).map((id) => ({ id, label: id })),
    edges: graphEdges,
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
