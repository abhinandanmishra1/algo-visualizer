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
      { id: '5', val: 'F' },
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
  steps: generateBFSSteps(exampleGraph, 'A'),
};
