import { AlgoStep } from '../../types/algo';

/**
 * Binary tree node definition
 */
export interface TreeData {
  value: any;
  left?: TreeData;
  right?: TreeData;
  id?: string | number;
}

/**
 * Helper: Assign IDs to tree nodes if not provided
 */
function assignNodeIds(node: TreeData | undefined, counter: { value: number }): TreeData | undefined {
  if (!node) return undefined;

  if (!node.id) {
    node.id = `node_${counter.value++}`;
  }

  return {
    ...node,
    left: assignNodeIds(node.left, counter),
    right: assignNodeIds(node.right, counter),
  };
}

/**
 * Helper: Flatten tree to Set of all node IDs
 */
function getAllNodeIds(node: TreeData | undefined, ids: Set<string | number> = new Set()): Set<string | number> {
  if (!node) return ids;
  if (node.id) ids.add(node.id);
  getAllNodeIds(node.left, ids);
  getAllNodeIds(node.right, ids);
  return ids;
}

/**
 * Inorder Traversal (Left, Root, Right)
 */
export function generateInorderTraversalSteps(root: TreeData): AlgoStep[] {
  const rootWithIds = assignNodeIds(root, { value: 0 });
  if (!rootWithIds) return [];

  const steps: AlgoStep[] = [];
  const visitedNodeIds = new Set<string | number>();
  const traversalOrder: any[] = [];
  let stepIndex = 0;
  const allNodeIds = getAllNodeIds(rootWithIds);

  function traverse(node: TreeData | undefined): void {
    if (!node) return;

    // Visit left subtree
    if (node.left) traverse(node.left);

    // Process current node
    if (node.id) {
      visitedNodeIds.add(node.id);
      traversalOrder.push(node.value);

      steps.push({
        stepIndex: stepIndex++,
        title: `Visit Node ${node.value}`,
        state: {
          currentNodeId: node.id,
          visitedNodeIds: new Set(visitedNodeIds),
          traversalOrder: [...traversalOrder],
          nodeStates: createNodeStates(allNodeIds, node.id, visitedNodeIds),
          activeNodeId: node.id,
        },
        codeLines: [3],
        why: `Processing node with value ${node.value} in inorder traversal (left subtree already processed).`,
        caption: `Inorder: Process node ${node.value}. Traversal order so far: [${traversalOrder.join(', ')}]`,
        distanceMap: [
          { label: 'Current Node', value: node.value },
          { label: 'Nodes Visited', value: `${visitedNodeIds.size} / ${allNodeIds.size}` },
          { label: 'Traversal Order', value: `[${traversalOrder.join(', ')}]` },
        ],
      });
    }

    // Visit right subtree
    if (node.right) traverse(node.right);
  }

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Start Inorder Traversal',
    state: {
      currentNodeId: null,
      visitedNodeIds: new Set(),
      traversalOrder: [],
      nodeStates: createNodeStates(allNodeIds, null, new Set()),
    },
    codeLines: [1],
    why: 'Begin inorder traversal: visit left subtree, then root, then right subtree.',
    caption: 'Starting inorder traversal (Left-Root-Right)...',
    distanceMap: [
      { label: 'Algorithm', value: 'Inorder (DFS)' },
      { label: 'Time Complexity', value: 'O(n)' },
      { label: 'Space Complexity', value: 'O(h)' },
    ],
  });

  traverse(rootWithIds);

  // Final step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Inorder Traversal Complete',
    state: {
      visitedNodeIds: new Set(visitedNodeIds),
      traversalOrder: [...traversalOrder],
      nodeStates: createNodeStates(allNodeIds, null, visitedNodeIds, true),
    },
    codeLines: [],
    why: `Traversal complete! Inorder sequence: [${traversalOrder.join(', ')}]`,
    caption: `Inorder traversal finished: [${traversalOrder.join(', ')}]`,
    distanceMap: [
      { label: 'Status', value: 'Complete', highlight: true },
      { label: 'Final Order', value: `[${traversalOrder.join(', ')}]` },
      { label: 'Nodes Processed', value: `${visitedNodeIds.size} / ${allNodeIds.size}` },
    ],
  });

  return steps;
}

/**
 * Preorder Traversal (Root, Left, Right)
 */
export function generatePreorderTraversalSteps(root: TreeData): AlgoStep[] {
  const rootWithIds = assignNodeIds(root, { value: 0 });
  if (!rootWithIds) return [];

  const steps: AlgoStep[] = [];
  const visitedNodeIds = new Set<string | number>();
  const traversalOrder: any[] = [];
  let stepIndex = 0;
  const allNodeIds = getAllNodeIds(rootWithIds);

  function traverse(node: TreeData | undefined): void {
    if (!node) return;

    // Process current node
    if (node.id) {
      visitedNodeIds.add(node.id);
      traversalOrder.push(node.value);

      steps.push({
        stepIndex: stepIndex++,
        title: `Visit Node ${node.value}`,
        state: {
          currentNodeId: node.id,
          visitedNodeIds: new Set(visitedNodeIds),
          traversalOrder: [...traversalOrder],
          nodeStates: createNodeStates(allNodeIds, node.id, visitedNodeIds),
          activeNodeId: node.id,
        },
        codeLines: [2],
        why: `Processing node with value ${node.value} before visiting its children.`,
        caption: `Preorder: Process node ${node.value}. Traversal order so far: [${traversalOrder.join(', ')}]`,
        distanceMap: [
          { label: 'Current Node', value: node.value },
          { label: 'Nodes Visited', value: `${visitedNodeIds.size} / ${allNodeIds.size}` },
          { label: 'Traversal Order', value: `[${traversalOrder.join(', ')}]` },
        ],
      });
    }

    // Visit left subtree
    if (node.left) traverse(node.left);

    // Visit right subtree
    if (node.right) traverse(node.right);
  }

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Start Preorder Traversal',
    state: {
      currentNodeId: null,
      visitedNodeIds: new Set(),
      traversalOrder: [],
      nodeStates: createNodeStates(allNodeIds, null, new Set()),
    },
    codeLines: [1],
    why: 'Begin preorder traversal: visit root, then left subtree, then right subtree.',
    caption: 'Starting preorder traversal (Root-Left-Right)...',
    distanceMap: [
      { label: 'Algorithm', value: 'Preorder (DFS)' },
      { label: 'Time Complexity', value: 'O(n)' },
      { label: 'Space Complexity', value: 'O(h)' },
    ],
  });

  traverse(rootWithIds);

  // Final step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Preorder Traversal Complete',
    state: {
      visitedNodeIds: new Set(visitedNodeIds),
      traversalOrder: [...traversalOrder],
      nodeStates: createNodeStates(allNodeIds, null, visitedNodeIds, true),
    },
    codeLines: [],
    why: `Traversal complete! Preorder sequence: [${traversalOrder.join(', ')}]`,
    caption: `Preorder traversal finished: [${traversalOrder.join(', ')}]`,
    distanceMap: [
      { label: 'Status', value: 'Complete', highlight: true },
      { label: 'Final Order', value: `[${traversalOrder.join(', ')}]` },
      { label: 'Nodes Processed', value: `${visitedNodeIds.size} / ${allNodeIds.size}` },
    ],
  });

  return steps;
}

/**
 * Postorder Traversal (Left, Right, Root)
 */
export function generatePostorderTraversalSteps(root: TreeData): AlgoStep[] {
  const rootWithIds = assignNodeIds(root, { value: 0 });
  if (!rootWithIds) return [];

  const steps: AlgoStep[] = [];
  const visitedNodeIds = new Set<string | number>();
  const traversalOrder: any[] = [];
  let stepIndex = 0;
  const allNodeIds = getAllNodeIds(rootWithIds);

  function traverse(node: TreeData | undefined): void {
    if (!node) return;

    // Visit left subtree
    if (node.left) traverse(node.left);

    // Visit right subtree
    if (node.right) traverse(node.right);

    // Process current node
    if (node.id) {
      visitedNodeIds.add(node.id);
      traversalOrder.push(node.value);

      steps.push({
        stepIndex: stepIndex++,
        title: `Visit Node ${node.value}`,
        state: {
          currentNodeId: node.id,
          visitedNodeIds: new Set(visitedNodeIds),
          traversalOrder: [...traversalOrder],
          nodeStates: createNodeStates(allNodeIds, node.id, visitedNodeIds),
          activeNodeId: node.id,
        },
        codeLines: [4],
        why: `Processing node with value ${node.value} after both children have been visited.`,
        caption: `Postorder: Process node ${node.value}. Traversal order so far: [${traversalOrder.join(', ')}]`,
        distanceMap: [
          { label: 'Current Node', value: node.value },
          { label: 'Nodes Visited', value: `${visitedNodeIds.size} / ${allNodeIds.size}` },
          { label: 'Traversal Order', value: `[${traversalOrder.join(', ')}]` },
        ],
      });
    }
  }

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Start Postorder Traversal',
    state: {
      currentNodeId: null,
      visitedNodeIds: new Set(),
      traversalOrder: [],
      nodeStates: createNodeStates(allNodeIds, null, new Set()),
    },
    codeLines: [1],
    why: 'Begin postorder traversal: visit left subtree, right subtree, then root.',
    caption: 'Starting postorder traversal (Left-Right-Root)...',
    distanceMap: [
      { label: 'Algorithm', value: 'Postorder (DFS)' },
      { label: 'Time Complexity', value: 'O(n)' },
      { label: 'Space Complexity', value: 'O(h)' },
    ],
  });

  traverse(rootWithIds);

  // Final step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Postorder Traversal Complete',
    state: {
      visitedNodeIds: new Set(visitedNodeIds),
      traversalOrder: [...traversalOrder],
      nodeStates: createNodeStates(allNodeIds, null, visitedNodeIds, true),
    },
    codeLines: [],
    why: `Traversal complete! Postorder sequence: [${traversalOrder.join(', ')}]`,
    caption: `Postorder traversal finished: [${traversalOrder.join(', ')}]`,
    distanceMap: [
      { label: 'Status', value: 'Complete', highlight: true },
      { label: 'Final Order', value: `[${traversalOrder.join(', ')}]` },
      { label: 'Nodes Processed', value: `${visitedNodeIds.size} / ${allNodeIds.size}` },
    ],
  });

  return steps;
}

/**
 * Level Order Traversal (BFS)
 */
export function generateLevelOrderTraversalSteps(root: TreeData): AlgoStep[] {
  const rootWithIds = assignNodeIds(root, { value: 0 });
  if (!rootWithIds) return [];

  const steps: AlgoStep[] = [];
  const visitedNodeIds = new Set<string | number>();
  const traversalOrder: any[] = [];
  let stepIndex = 0;
  const allNodeIds = getAllNodeIds(rootWithIds);

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Start Level Order Traversal',
    state: {
      currentNodeId: null,
      visitedNodeIds: new Set(),
      traversalOrder: [],
      nodeStates: createNodeStates(allNodeIds, null, new Set()),
    },
    codeLines: [1, 2],
    why: 'Begin level order traversal (BFS): use a queue to visit nodes level by level.',
    caption: 'Starting level order traversal (BFS)...',
    distanceMap: [
      { label: 'Algorithm', value: 'Level Order (BFS)' },
      { label: 'Time Complexity', value: 'O(n)' },
      { label: 'Space Complexity', value: 'O(w)' },
    ],
  });

  const queue: TreeData[] = [rootWithIds];
  let level = 0;
  let nodesAtCurrentLevel = 1;
  let nodesProcessedInLevel = 0;

  while (queue.length > 0) {
    const node = queue.shift()!;

    if (node.id) {
      visitedNodeIds.add(node.id);
      traversalOrder.push(node.value);
      nodesProcessedInLevel++;

      steps.push({
        stepIndex: stepIndex++,
        title: `Visit Node ${node.value} (Level ${level})`,
        state: {
          currentNodeId: node.id,
          visitedNodeIds: new Set(visitedNodeIds),
          traversalOrder: [...traversalOrder],
          nodeStates: createNodeStates(allNodeIds, node.id, visitedNodeIds),
          activeNodeId: node.id,
        },
        codeLines: [3, 4],
        why: `Processing node ${node.value} at level ${level} (BFS processes nodes level by level).`,
        caption: `Level ${level}: Process node ${node.value}. Traversal order so far: [${traversalOrder.join(', ')}]`,
        distanceMap: [
          { label: 'Current Node', value: node.value },
          { label: 'Level', value: `${level}` },
          { label: 'Nodes Visited', value: `${visitedNodeIds.size} / ${allNodeIds.size}` },
          { label: 'Traversal Order', value: `[${traversalOrder.join(', ')}]` },
        ],
      });
    }

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);

    // Move to next level when all nodes at current level are processed
    if (nodesProcessedInLevel === nodesAtCurrentLevel) {
      nodesAtCurrentLevel = queue.length;
      nodesProcessedInLevel = 0;
      level++;
    }
  }

  // Final step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Level Order Traversal Complete',
    state: {
      visitedNodeIds: new Set(visitedNodeIds),
      traversalOrder: [...traversalOrder],
      nodeStates: createNodeStates(allNodeIds, null, visitedNodeIds, true),
    },
    codeLines: [],
    why: `Traversal complete! Level order sequence: [${traversalOrder.join(', ')}]`,
    caption: `Level order traversal finished: [${traversalOrder.join(', ')}]`,
    distanceMap: [
      { label: 'Status', value: 'Complete', highlight: true },
      { label: 'Final Order', value: `[${traversalOrder.join(', ')}]` },
      { label: 'Nodes Processed', value: `${visitedNodeIds.size} / ${allNodeIds.size}` },
      { label: 'Levels Traversed', value: `${level}` },
    ],
  });

  return steps;
}

/**
 * BST Insert
 */
export function generateBSTInsertSteps(root: TreeData | null, value: number): AlgoStep[] {
  const workingRoot = root || { value, id: 'node_0', left: undefined, right: undefined };
  const rootWithIds = assignNodeIds(workingRoot, { value: 0 });
  if (!rootWithIds) return [];

  const steps: AlgoStep[] = [];
  let stepIndex = 0;
  const visitedNodeIds = new Set<string | number>();
  let insertedNodeId: string | number | null = null;
  const allNodeIds = new Set<string | number>();

  function collectAllNodeIds(node: TreeData | undefined): void {
    if (!node) return;
    if (node.id) allNodeIds.add(node.id);
    collectAllNodeIds(node.left);
    collectAllNodeIds(node.right);
  }

  collectAllNodeIds(rootWithIds);

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    title: `Start BST Insert: ${value}`,
    state: {
      currentNodeId: null,
      visitedNodeIds: new Set(),
      insertedNodeId: null,
      value,
      nodeStates: createNodeStates(allNodeIds, null, new Set()),
    },
    codeLines: [1],
    why: `Begin inserting value ${value} into BST. Start at root and compare.`,
    caption: `Inserting ${value} into BST...`,
    distanceMap: [
      { label: 'Value to Insert', value: value },
      { label: 'Algorithm', value: 'BST Insert' },
      { label: 'Time Complexity', value: 'O(log n) avg, O(n) worst' },
    ],
  });

  function insert(node: TreeData, val: number): TreeData {
    if (!node) {
      const newNode: TreeData = {
        value: val,
        id: `node_${Math.random().toString(36).substr(2, 9)}`,
      };
      insertedNodeId = newNode.id!;
      allNodeIds.add(newNode.id!);
      return newNode;
    }

    if (!node.id) {
      node.id = `node_${Math.random().toString(36).substr(2, 9)}`;
      allNodeIds.add(node.id);
    }

    visitedNodeIds.add(node.id);

    const comparison = val < node.value ? 'less' : val > node.value ? 'greater' : 'equal';
    let _direction = '';
    let _codeLineNum = 0;

    if (val < node.value) {
      _direction = 'left';
      _codeLineNum = 3;
    } else if (val > node.value) {
      _direction = 'right';
      _codeLineNum = 5;
    } else {
      return node; // Duplicate, don't insert
    }

    steps.push({
      stepIndex: stepIndex++,
      title: `Compare ${val} with ${node.value}`,
      state: {
        currentNodeId: node.id,
        visitedNodeIds: new Set(visitedNodeIds),
        value,
        insertedNodeId,
        comparison,
        nodeStates: createNodeStates(allNodeIds, node.id, visitedNodeIds),
        activeNodeId: node.id,
      },
      codeLines: [2, _codeLineNum],
      why: `${val} ${comparison} ${node.value}: go ${_direction}.`,
      caption: `Compare: ${val} ${comparison === 'less' ? '<' : '>'} ${node.value} ⟹ go ${_direction}`,
      distanceMap: [
        { label: 'Comparing', value: `${val} vs ${node.value}` },
        { label: 'Result', value: comparison },
        { label: 'Direction', value: _direction },
        { label: 'Nodes Visited', value: `${visitedNodeIds.size}` },
      ],
    });

    if (val < node.value) {
      node.left = insert(node.left!, val);
    } else {
      node.right = insert(node.right!, val);
    }

    return node;
  }

  insert(rootWithIds, value);

  // Final step
  steps.push({
    stepIndex: stepIndex++,
    title: `BST Insert Complete: ${value}`,
    state: {
      visitedNodeIds: new Set(visitedNodeIds),
      value,
      insertedNodeId,
      nodeStates: createNodeStates(allNodeIds, insertedNodeId, visitedNodeIds, true),
    },
    codeLines: [],
    why: `Insertion of ${value} complete at correct BST position.`,
    caption: `Insert complete! ${value} inserted at correct BST position.`,
    distanceMap: [
      { label: 'Status', value: 'Inserted', highlight: true },
      { label: 'Value', value: value },
      { label: 'Comparisons Made', value: `${visitedNodeIds.size}` },
    ],
  });

  return steps;
}

/**
 * BST Search
 */
export function generateBSTSearchSteps(root: TreeData | null, value: number): AlgoStep[] {
  if (!root) {
    return [
      {
        stepIndex: 0,
        title: 'BST Search Failed',
        state: {
          found: false,
          value,
        },
        codeLines: [1],
        why: 'Tree is empty, value not found.',
        caption: `${value} not found in empty tree.`,
        distanceMap: [
          { label: 'Status', value: 'Not Found' },
          { label: 'Value', value: value },
        ],
      },
    ];
  }

  const rootWithIds = assignNodeIds(root, { value: 0 });
  const steps: AlgoStep[] = [];
  let stepIndex = 0;
  const visitedNodeIds = new Set<string | number>();
  let found = false;
  let foundNodeId: string | number | null = null;
  const allNodeIds = new Set<string | number>();

  function collectAllNodeIds(node: TreeData | undefined): void {
    if (!node) return;
    if (node.id) allNodeIds.add(node.id);
    collectAllNodeIds(node.left);
    collectAllNodeIds(node.right);
  }

  collectAllNodeIds(rootWithIds);

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    title: `Start BST Search: ${value}`,
    state: {
      currentNodeId: null,
      visitedNodeIds: new Set(),
      found: false,
      value,
      nodeStates: createNodeStates(allNodeIds, null, new Set()),
    },
    codeLines: [1],
    why: `Begin searching for ${value} in BST. Start at root.`,
    caption: `Searching for ${value} in BST...`,
    distanceMap: [
      { label: 'Value to Find', value: value },
      { label: 'Algorithm', value: 'BST Search' },
      { label: 'Time Complexity', value: 'O(log n) avg, O(n) worst' },
    ],
  });

  function search(node: TreeData | undefined): boolean {
    if (!node) return false;

    if (!node.id) {
      node.id = `node_${Math.random().toString(36).substr(2, 9)}`;
    }

    visitedNodeIds.add(node.id);

    const comparison = value < node.value ? 'less' : value > node.value ? 'greater' : 'equal';

    steps.push({
      stepIndex: stepIndex++,
      title: `Compare ${value} with ${node.value}`,
      state: {
        currentNodeId: node.id,
        visitedNodeIds: new Set(visitedNodeIds),
        found: value === node.value,
        value,
        nodeStates: createNodeStates(allNodeIds, node.id, visitedNodeIds),
        activeNodeId: node.id,
      },
      codeLines: [2, 3],
      why:
        value === node.value
          ? `${value} found!`
          : `${value} ${comparison} ${node.value}: continue ${value < node.value ? 'left' : 'right'}.`,
      caption:
        value === node.value
          ? `Found ${value}!`
          : `Compare: ${value} ${comparison === 'less' ? '<' : '>'} ${node.value} ⟹ continue ${value < node.value ? 'left' : 'right'}`,
      distanceMap: [
        { label: 'Comparing', value: `${value} vs ${node.value}` },
        { label: 'Result', value: comparison },
        { label: 'Nodes Visited', value: `${visitedNodeIds.size}` },
      ],
    });

    if (value === node.value) {
      found = true;
      foundNodeId = node.id;
      return true;
    }

    if (value < node.value) {
      return search(node.left);
    } else {
      return search(node.right);
    }
  }

  search(rootWithIds);

  // Final step
  steps.push({
    stepIndex: stepIndex++,
    title: `BST Search ${found ? 'Found' : 'Not Found'}`,
    state: {
      visitedNodeIds: new Set(visitedNodeIds),
      found,
      value,
      foundNodeId,
      nodeStates: createNodeStates(allNodeIds, foundNodeId, visitedNodeIds, true),
    },
    codeLines: [],
    why: found ? `${value} found in BST!` : `${value} not found in BST.`,
    caption: found ? `Search complete! ${value} found.` : `Search complete! ${value} not found.`,
    distanceMap: [
      { label: 'Status', value: found ? 'Found' : 'Not Found', highlight: found },
      { label: 'Value', value: value },
      { label: 'Comparisons Made', value: `${visitedNodeIds.size}` },
    ],
  });

  return steps;
}

/**
 * Helper: Create node states map for rendering
 */
function createNodeStates(
  allNodeIds: Set<string | number>,
  currentNodeId: string | number | null,
  visitedNodeIds: Set<string | number>,
  finished: boolean = false
): Record<string | number, 'unvisited' | 'visiting' | 'visited'> {
  const states: Record<string | number, 'unvisited' | 'visiting' | 'visited'> = {};

  allNodeIds.forEach((id) => {
    if (id === currentNodeId && !finished) {
      states[id] = 'visiting';
    } else if (visitedNodeIds.has(id)) {
      states[id] = 'visited';
    } else {
      states[id] = 'unvisited';
    }
  });

  return states;
}
