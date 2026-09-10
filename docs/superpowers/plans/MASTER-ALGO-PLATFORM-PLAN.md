# Master Plan: Production-Grade Algorithm & Data Structure Visualizer Platform

> **Instructions for Claude / Agent:**
> This document is an end-to-end technical blueprint for transforming `algo-visualizer` into a complete, mathematically and algorithmically rigorous visual learning and reel-generation platform. Follow every architectural phase and guarantee algorithmic correctness for all implementations.

---

## 1. Vision & Core Requirements

1. **Complete Coverage of Computer Science Curricula**: Cover every foundational Data Structure (Arrays, Stacks, Queues, Linked Lists, Trees, Heaps, Hash Tables, Tries, Graphs, Disjoint Sets) and Algorithm family (Sorting, Searching, Two Pointers, Sliding Window, Greedy, Dynamic Programming, Backtracking, Graph Algorithms).
2. **Absolute Algorithmic Correctness**: Zero visual bugs or misleading representations. Every step must strictly adhere to formal invariants (e.g., Red-Black Tree recoloring/rotation rules, Dijkstra non-negative edge constraints, AVL balance factors, Quicksort pivot partitioning).
3. **Dedicated Canvas Renderers**: No fallback approximations. Dedicated 2D canvas renderers for Trees (hierarchical layouts), Graphs (force-directed or concentric radial layouts), 2D Matrices/Grids, and Stacks/Queues.
4. **Interactive Custom Inputs**: Allow users to type their own inputs (custom arrays, custom search targets, custom graph edges, custom trees) and automatically generate valid step sequences.
5. **Multi-Language Code Sync**: Tabbed code walkthroughs in Python, Java, C++, and TypeScript with synchronized active line highlighting.

---

## 2. Dedicated Canvas Renderers Architecture

Replace fallback renderers with specialized renderers implementing `AlgoRenderer<TData, TState>`:

```
src/renderers/
├── types.ts                   # Unified render interfaces & theme tokens
├── canvasUtils.ts             # Shapes, curved Bezier arrows, glow effects, badge labels
├── arrayRenderer.ts           # 1D Array, sliding window brackets, two-pointer badges
├── matrixRenderer.ts          # [NEW] 2D Grid / Matrix (DP tables, BFS maze, Island counting)
├── linkedListRenderer.ts      # Singly/Doubly linked lists, cycle loops, sentinel dummy nodes
├── treeRenderer.ts            # [NEW] Binary Trees, BST, AVL balance factors, Red-Black colors
├── heapRenderer.ts            # [NEW] Dual representation: binary tree + flat array index mapping
├── graphRenderer.ts           # [NEW] Directed/Undirected weighted graphs, edge weights, node visited halos
├── stackQueueRenderer.ts      # [NEW] Vertical stack (push/pop top) & horizontal FIFO queue
└── hashTableRenderer.ts       # [NEW] Buckets with chained collision nodes / open addressing slots
```

### Key Technical Specs for New Renderers:
- **`TreeRenderer`**:
  - Reingold-Tilford tidy tree layout or geometric recursive coordinate allocation.
  - Smooth link curves or clean diagonal connecting lines.
  - Node color coding: red/black badges for RBT, height diff badges for AVL, null leaf indicators.
- **`GraphRenderer`**:
  - Pre-computed static planar layout coordinates with circular node arrangement or Spring-Embedder simulation.
  - Directed edges with weights drawn along Bezier tangents.
  - Node halos: unvisited (`slate-700`), in-queue (`sky-500`), processing (`amber-500`), finalized (`emerald-500`).
- **`MatrixRenderer`**:
  - Grid cells with coordinate `(r, c)`, row/col headers, visited path tracing, gradient heatmaps for DP values.

---

## 3. Comprehensive Curriculum & Algorithmic Catalog

### Module A: Arrays, Two Pointers & Sliding Window
- [ ] **Two Sum (Sorted)**: Left/right converging pointers with sum checks against target.
- [ ] **3Sum**: Sorting + outer iteration + two-pointer inner scan avoiding duplicates.
- [ ] **Container With Most Water**: Shorter bar optimization invariant.
- [ ] **Trapping Rain Water**: Dual maximums `left_max` and `right_max` tracking.
- [ ] **Sliding Window Maximum (Monotonic Deque)**: Sliding window with deque maintaining decreasing elements.
- [ ] **Longest Substring Without Repeating Characters**: Dynamic window resizing with character frequency hash map.

### Module B: Linked Lists
- [ ] **Reverse Linked List (Iterative & Recursive)**: Detailed pointer rewiring.
- [ ] **Floyd's Cycle Finding & Entry Point**: Phase 1 meeting point + Phase 2 head reset mathematical proof.
- [ ] **Merge Two Sorted Lists**: Dummy head sentinel node, head comparison, tail pointer advancement.
- [ ] **LRU Cache**: Doubly Linked List coupled with a Hash Map demonstrating O(1) eviction and updates.
- [ ] **Palindrome Linked List**: Fast/slow pointer midpoint find + second-half reversal + dual traversal.

### Module C: Stacks & Queues
- [ ] **Valid Parentheses**: Stack matching opening/closing brackets with mismatch highlighting.
- [ ] **Min Stack**: Secondary stack tracking prefix minimums in O(1) time.
- [ ] **Daily Temperatures (Monotonic Stack)**: Decreasing stack storing unresolved indices.
- [ ] **Evaluate Reverse Polish Notation**: Binary operand popping and intermediate result pushing.

### Module D: Sorting & Searching
- [ ] **Binary Search & Variants**: Standard, search insertion point, first/last occurrence.
- [ ] **Quick Sort**: Lomuto and Hoare partitioning schemes, pivot selection, recursive split boundary.
- [ ] **Merge Sort**: Divide phase (tree split) and merge phase with temporary buffer playback.
- [ ] **Heap Sort**: Max-heap construction (`heapify`) followed by extraction and sift-down.
- [ ] **Counting Sort / Radix Sort**: Non-comparison frequency bucket distribution.

### Module E: Trees & Binary Search Trees
- [ ] **Tree Traversals**: Preorder, Inorder, Postorder, and Level-Order (BFS).
- [ ] **BST Insert & Delete**: All 3 deletion cases (leaf, single child, two children via in-order successor).
- [ ] **Validate Binary Search Tree**: Range propagation `(min_val < node.val < max_val)`.
- [ ] **Lowest Common Ancestor (LCA)**: Recursive bottom-up return path.
- [ ] **AVL Tree Self-Balancing**: Left-Left, Right-Right, Left-Right, Right-Left rotations with balance factors.
- [ ] **Trie (Prefix Tree)**: Word insertion, prefix autocomplete lookup, end-of-word flags.

### Module F: Graphs & Disjoint Sets
- [ ] **BFS (Shortest Path in Unweighted Graph)**: Wavefront expansion, predecessor map for path reconstruction.
- [ ] **DFS (Connected Components & Cycle Detection)**: Visited set, recursive back edges.
- [ ] **Dijkstra’s Algorithm**: Priority queue extraction, edge relaxation `dist[u] + w < dist[v]`, settled nodes.
- [ ] **Kruskal's Algorithm**: Minimum Spanning Tree with Union-Find (Disjoint Set with rank & path compression).
- [ ] **Topological Sort (Kahn's In-Degree & DFS Post-Order)**: Directed Acyclic Graph dependency resolution.

### Module G: Dynamic Programming & Backtracking
- [ ] **Climbing Stairs / Fibonacci**: Memoization vs Bottom-up 1D tabulation.
- [ ] **0/1 Knapsack Problem**: 2D DP matrix filling, capacity constraint evaluation, optimal item backtracking.
- [ ] **Longest Common Subsequence (LCS)**: 2D table match/skip transitions with traceback path.
- [ ] **N-Queens**: Backtracking board conflict checking (row, diagonal, anti-diagonal bitmasks).
- [ ] **Coin Change**: Fewest coins minimum lookup table.

---

## 4. Algorithmic Correctness Guarantee Framework

To prevent any visual or logical inaccuracy:

1. **Step Generation Via Real Execution**:
   - Do **NOT** hardcode large step sequences by hand.
   - Build algorithm trace generators (`src/engine/generators/`) that execute actual Python/TypeScript code and emit formal `AlgoStep[]` frames with immutable state snapshots.
   ```typescript
   // Example: src/engine/generators/sorting.ts
   export function generateBubbleSortSteps(initialArray: number[]): AlgoStep[] {
     const arr = [...initialArray];
     const steps: AlgoStep[] = [];
     // Execute actual bubble sort, capturing snapshot at every comparison and swap
     return steps;
   }
   ```
2. **Schema Invariant Verification**:
   - Automated tests verifying that every frame adheres to formal invariants (e.g. for BST, `left.val < root.val < right.val` for all nodes at all steps).
3. **Edge Case Tests**:
   - Visualizations must handle empty arrays, single elements, duplicate values, sorted/reverse-sorted inputs, and disconnected graphs gracefully.

---

## 5. UI, Custom Input & Audio/Video Export Features

### A. Dynamic User Input Bar
- Input modal / drawer where the user can:
  - Type custom numbers: e.g. `[15, 3, 9, 8, 2, 7, 1]` for sorting or search.
  - Pick presets: Best case, Worst case, Random, Edge case.
  - Set custom target values.
  - Re-generate steps on the fly using the trace generator engine.

### B. Multi-Language Code Walkthrough Tabs
- Implement tabs for **Python**, **Java**, **C++**, and **TypeScript**.
- Map each step's `codeLines` index accurately across all 4 languages so active lines highlight identically regardless of language chosen.

### C. Enhanced Reels & Video Export Pipeline
- **9:16 Short-Form Mode**: Auto-center the active data structure in the upper 60% of the canvas; place title, caption card, and telemetry indicators in the bottom 40%.
- **Sound Effects (Synthesized Web Audio API)**:
  - Low-latency synthesized click on step advance.
  - Upbeat ding on element match / target found / sorting complete.
  - Dual frequency beep on comparison / swap.
- **Export Formats**: WebM / MP4 via `MediaRecorder` with configurable FPS (30/60) and resolution (1080p, 4K).

---

## 6. Implementation Roadmap & Milestones

### Phase 1: Engine Generators & Interactive Input (Foundation)
1. Implement `src/engine/generators/` starting with Sorting and Searching generators.
2. Build `<CustomInputBar>` component allowing users to input their own data and trigger generator functions.
3. Add multi-language code mapping in `src/types/algo.ts`.

### Phase 2: Tree, Heap & Graph Renderers
1. Create `TreeRenderer.ts` with automated tidy layout calculation.
2. Create `HeapRenderer.ts` connecting array indices with tree nodes via interactive lines.
3. Create `GraphRenderer.ts` supporting directed/undirected edges, weights, and node status colors.
4. Implement BST, AVL, Min/Max Heap, Dijkstra, and Topological Sort configs.

### Phase 3: Matrix & Dynamic Programming Renderers
1. Build `MatrixRenderer.ts` for 2D grids and DP tables.
2. Implement 0/1 Knapsack, Longest Common Subsequence, and Grid Pathfinding (BFS/A*).
3. Add step-by-step table cell calculation formula overlays.

### Phase 4: Full Curriculum Rollout & Audio-Visual Polish
1. Roll out remaining algorithms from Modules A through G.
2. Add Web Audio API synthesized sound cues on step advancement and target match.
3. Optimize 9:16 export layout with burn-in branding and social-ready captions.
4. Final end-to-end test suite verifying algorithmic invariants across all modules.
