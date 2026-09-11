import { AlgoConfig } from '../types/algo';
import { generateBFSSteps } from '../engine/generators/graph';

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

export const bfsConfig: AlgoConfig = {
  id: 'bfs',
  title: 'Breadth-First Search (BFS)',
  subtitle: 'Explore the graph level by level in concentric waves using a FIFO queue',
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
  steps: generateBFSSteps(exampleGraph, 'A'),
};
