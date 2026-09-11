import { AlgoStep } from '../../types/algo';

/**
 * Generate DFS (Depth-First Search) steps from a graph and start node.
 *
 * @param graph Adjacency list representation: { 'A': ['B', 'C'], 'B': ['D'], ... }
 * @param start Starting node for DFS traversal
 * @returns Array of AlgoStep objects representing each step of DFS
 *
 * DFS uses a stack-based approach to visit nodes as deep as possible before backtracking.
 * Steps are emitted on: visit (add to stack), process (pop and mark visited), and transitions.
 */
export function generateDFSSteps(
  graph: Record<string | number, (string | number)[]>,
  start: string | number
): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const visited = new Set<string | number>();
  const stack: (string | number)[] = [start];
  const traversalOrder: (string | number)[] = [];

  let stepIndex = 0;
  let codeLineCounter = 1;

  // Step 0: Initialize DFS - push start node onto stack
  steps.push({
    stepIndex: stepIndex++,
    title: `Initialize DFS: Push ${start}`,
    state: {
      currentNode: start,
      visited: new Set<string | number>(),
      stack: [start],
      traversalOrder: [],
      action: 'push_to_stack',
    },
    codeLines: [codeLineCounter],
    why: `Start DFS at node ${start}. Push it onto the stack and prepare for traversal.`,
    caption: `Initialize: stack = [${start}]`,
    formulaActive: [
      {
        label: 'Stack State',
        math: `stack = [${start}]`,
        active: true,
      },
      {
        label: 'Status',
        math: 'Initializing DFS',
        active: true,
      },
    ],
    distanceMap: [
      { label: 'Stack Size', value: 1 },
      { label: 'Visited Count', value: 0 },
      { label: 'Total Nodes', value: Object.keys(graph).length },
    ],
  });

  // Perform iterative DFS
  while (stack.length > 0) {
    const node = stack.pop()!;

    if (visited.has(node)) {
      // Node already visited, skip
      steps.push({
        stepIndex: stepIndex++,
        title: `Skip Already Visited: ${node}`,
        state: {
          currentNode: node,
          visited: new Set(visited),
          stack: [...stack],
          traversalOrder: [...traversalOrder],
          action: 'skip_visited',
        },
        codeLines: [codeLineCounter],
        why: `Node ${node} already in visited set. Skip and pop next node from stack.`,
        caption: `Already visited: ${node} (skip)`,
        formulaActive: [
          {
            label: 'Visited Set',
            math: `visited = {${Array.from(visited).join(', ')}}`,
            active: true,
          },
        ],
        distanceMap: [
          { label: 'Stack Size', value: stack.length },
          { label: 'Visited Count', value: visited.size },
          { label: 'Skipped Node', value: node },
        ],
      });
      continue;
    }

    // Mark node as visited and add to traversal order
    visited.add(node);
    traversalOrder.push(node);

    // Step: Process node
    steps.push({
      stepIndex: stepIndex++,
      title: `Visit & Process: ${node}`,
      state: {
        currentNode: node,
        visited: new Set(visited),
        stack: [...stack],
        traversalOrder: [...traversalOrder],
        action: 'visit_process',
      },
      codeLines: [codeLineCounter + 1, codeLineCounter + 2],
      why: `Pop ${node} from stack. Mark as visited and add to traversal order.`,
      caption: `Visit: ${node} ⟹ traversal = [${traversalOrder.join(' → ')}]`,
      formulaActive: [
        {
          label: 'Visited Set',
          math: `visited = {${Array.from(visited).join(', ')}}`,
          active: true,
        },
        {
          label: 'Traversal Order',
          math: `[${traversalOrder.join(', ')}]`,
          active: true,
        },
      ],
      distanceMap: [
        { label: 'Current Node', value: node },
        { label: 'Visited Count', value: visited.size },
        { label: 'Stack Size', value: stack.length },
        { label: 'Traversal Progress', value: `${visited.size}/${Object.keys(graph).length}` },
      ],
    });

    // Get neighbors and push unvisited ones onto stack (in reverse order for consistent DFS)
    const neighbors = graph[node] || [];
    const unvisitedNeighbors = neighbors.filter(n => !visited.has(n));

    if (unvisitedNeighbors.length > 0) {
      // Add unvisited neighbors to stack in reverse order (so left-most is processed first)
      for (let i = unvisitedNeighbors.length - 1; i >= 0; i--) {
        stack.push(unvisitedNeighbors[i]);
      }

      // Step: Push neighbors to stack
      steps.push({
        stepIndex: stepIndex++,
        title: `Explore Neighbors: Add ${unvisitedNeighbors.join(', ')} to Stack`,
        state: {
          currentNode: node,
          visited: new Set(visited),
          stack: [...stack],
          traversalOrder: [...traversalOrder],
          action: 'push_neighbors',
        },
        codeLines: [codeLineCounter + 3],
        why: `Node ${node} has unvisited neighbors: ${unvisitedNeighbors.join(', ')}. Push them onto stack for future exploration.`,
        caption: `Push neighbors: ${unvisitedNeighbors.join(', ')} ⟹ stack = [${stack.join(', ')}]`,
        formulaActive: [
          {
            label: 'Neighbors of ' + node,
            math: `[${unvisitedNeighbors.join(', ')}]`,
            active: true,
          },
          {
            label: 'Stack',
            math: `[${stack.join(', ')}]`,
            active: true,
          },
        ],
        distanceMap: [
          { label: 'Current Node', value: node },
          { label: 'Unvisited Neighbors', value: unvisitedNeighbors.length },
          { label: 'Stack Size', value: stack.length },
        ],
      });
    }
  }

  // Final step: DFS Complete
  steps.push({
    stepIndex: stepIndex++,
    title: 'DFS Traversal Complete',
    state: {
      currentNode: null,
      visited: new Set(visited),
      stack: [],
      traversalOrder: [...traversalOrder],
      action: 'complete',
    },
    codeLines: [codeLineCounter],
    why: `Stack is empty. DFS has visited all reachable nodes from ${start} in depth-first order.`,
    caption: `Complete! Traversal order: ${traversalOrder.join(' → ')}`,
    formulaActive: [
      {
        label: 'Final Visited Set',
        math: `{${Array.from(visited).join(', ')}}`,
        active: true,
      },
      {
        label: 'Time Complexity',
        math: 'O(V + E)',
        active: true,
      },
      {
        label: 'Space Complexity',
        math: 'O(V) call stack / recursion',
        active: true,
      },
    ],
    distanceMap: [
      { label: 'Total Visited', value: visited.size, highlight: true },
      { label: 'Total Nodes', value: Object.keys(graph).length },
      { label: 'Status', value: 'Complete', highlight: true },
    ],
  });

  return steps;
}

/**
 * Generate BFS (Breadth-First Search) steps from a graph and start node.
 *
 * @param graph Adjacency list representation: { 'A': ['B', 'C'], 'B': ['D'], ... }
 * @param start Starting node for BFS traversal
 * @returns Array of AlgoStep objects representing each step of BFS
 *
 * BFS uses a queue to visit nodes level-by-level, guaranteeing shortest paths in unweighted graphs.
 * Steps are emitted on: enqueue (add to queue), dequeue and mark visited, and transitions.
 */
export function generateBFSSteps(
  graph: Record<string | number, (string | number)[]>,
  start: string | number
): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const visited = new Set<string | number>([start]);
  const queue: (string | number)[] = [start];
  const traversalOrder: (string | number)[] = [];
  const distances: Record<string | number, number> = { [start]: 0 };

  let stepIndex = 0;
  let codeLineCounter = 1;

  // Step 0: Initialize BFS - enqueue start node
  steps.push({
    stepIndex: stepIndex++,
    title: `Initialize BFS: Enqueue ${start}`,
    state: {
      currentNode: start,
      visited: new Set([start]),
      queue: [start],
      traversalOrder: [],
      distances,
      action: 'enqueue',
      level: 0,
    },
    codeLines: [codeLineCounter],
    why: `Start BFS at node ${start}. Mark as visited and enqueue for processing.`,
    caption: `Initialize: queue = [${start}], visited = {${start}}, distance[${start}] = 0`,
    formulaActive: [
      {
        label: 'Queue',
        math: `[${start}]`,
        active: true,
      },
      {
        label: 'Level',
        math: '0 (distance)',
        active: true,
      },
    ],
    distanceMap: [
      { label: 'Queue Size', value: 1 },
      { label: 'Visited Count', value: 1 },
      { label: 'Current Level', value: 0 },
      { label: 'Total Nodes', value: Object.keys(graph).length },
    ],
  });

  // Perform BFS
  let currentLevel = 0;
  while (queue.length > 0) {
    const levelSize = queue.length;
    const nextLevelNodes: (string | number)[] = [];

    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      traversalOrder.push(node);

      // Step: Dequeue and process node
      steps.push({
        stepIndex: stepIndex++,
        title: `Dequeue & Process: ${node} (Level ${distances[node]})`,
        state: {
          currentNode: node,
          visited: new Set(visited),
          queue: [...queue],
          traversalOrder: [...traversalOrder],
          distances: { ...distances },
          action: 'dequeue_process',
          level: distances[node],
        },
        codeLines: [codeLineCounter + 3, codeLineCounter + 4],
        why: `Dequeue ${node} from front of queue (level ${distances[node]}). Process its neighbors.`,
        caption: `Process: ${node} ⟹ queue = [${queue.join(', ')}]`,
        formulaActive: [
          {
            label: 'Current Node',
            math: String(node),
            active: true,
          },
          {
            label: 'Distance',
            math: `${distances[node]}`,
            active: true,
          },
          {
            label: 'Queue',
            math: `[${queue.join(', ') || 'empty'}]`,
            active: true,
          },
        ],
        distanceMap: [
          { label: 'Current Node', value: node },
          { label: 'Distance from Start', value: distances[node] },
          { label: 'Visited Count', value: visited.size },
          { label: 'Queue Size', value: queue.length },
        ],
      });

      // Get neighbors
      const neighbors = graph[node] || [];

      // Enqueue unvisited neighbors
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          distances[neighbor] = distances[node] + 1;
          nextLevelNodes.push(neighbor);
        }
      }
    }

    // Step: Show level transition if there are more nodes to process
    if (queue.length > 0 && nextLevelNodes.length > 0) {
      currentLevel++;
      steps.push({
        stepIndex: stepIndex++,
        title: `Enqueue Level ${currentLevel}: ${nextLevelNodes.join(', ')}`,
        state: {
          currentNode: null,
          visited: new Set(visited),
          queue: [...queue],
          traversalOrder: [...traversalOrder],
          distances: { ...distances },
          action: 'enqueue_next_level',
          level: currentLevel,
        },
        codeLines: [codeLineCounter + 5, codeLineCounter + 6],
        why: `Discovered ${nextLevelNodes.length} new neighbor(s) at distance ${currentLevel}. All enqueued for level-order exploration.`,
        caption: `Level ${currentLevel}: Added ${nextLevelNodes.join(', ')} ⟹ queue = [${queue.join(', ')}]`,
        formulaActive: [
          {
            label: 'Current Level',
            math: String(currentLevel),
            active: true,
          },
          {
            label: 'Nodes at This Level',
            math: `[${nextLevelNodes.join(', ')}]`,
            active: true,
          },
          {
            label: 'Queue',
            math: `[${queue.join(', ')}]`,
            active: true,
          },
        ],
        distanceMap: [
          { label: 'Current Level', value: currentLevel },
          { label: 'Nodes Discovered', value: nextLevelNodes.length },
          { label: 'Visited Count', value: visited.size },
          { label: 'Queue Size', value: queue.length },
        ],
      });
    }
  }

  // Final step: BFS Complete
  steps.push({
    stepIndex: stepIndex++,
    title: 'BFS Traversal Complete',
    state: {
      currentNode: null,
      visited: new Set(visited),
      queue: [],
      traversalOrder: [...traversalOrder],
      distances: { ...distances },
      action: 'complete',
    },
    codeLines: [codeLineCounter + 7],
    why: `Queue is empty. BFS has visited all reachable nodes from ${start} in level-order (shortest path guaranteed).`,
    caption: `Complete! Traversal order: ${traversalOrder.join(' → ')}`,
    formulaActive: [
      {
        label: 'Final Traversal',
        math: `[${traversalOrder.join(', ')}]`,
        active: true,
      },
      {
        label: 'Time Complexity',
        math: 'O(V + E)',
        active: true,
      },
      {
        label: 'Space Complexity',
        math: 'O(V) queue + visited set',
        active: true,
      },
      {
        label: 'Shortest Path Guarantee',
        math: 'Yes (unweighted)',
        active: true,
      },
    ],
    distanceMap: [
      { label: 'Total Visited', value: visited.size, highlight: true },
      { label: 'Total Nodes', value: Object.keys(graph).length },
      { label: 'Max Distance', value: currentLevel, highlight: true },
      { label: 'Status', value: 'Complete', highlight: true },
    ],
  });

  return steps;
}
