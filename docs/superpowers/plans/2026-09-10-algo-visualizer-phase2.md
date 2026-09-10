# AlgoVisualizer v2: Bug Fixes, Default Panels, & Algorithm Expansion

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all broken operations (algorithm switching doesn't reset engine, formula panel renders raw LaTeX, speed selector state stale), default panels to code+visualizer only, and add 10+ diverse algorithm configs.

**Architecture:** Fix the `useAlgoEngine` hook to properly react to algorithm changes, replace raw LaTeX strings with readable plain-text formulas (no KaTeX dependency needed), change panel defaults to `{ code: true, why: false, formula: false, distanceMap: false }`, and add algorithm configs for diverse data structure types using existing renderers.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Canvas 2D, Vitest.

## Global Constraints

- No new npm dependencies (no KaTeX). Formula display uses clean plain-text math notation.
- Panel defaults: `code: true`, everything else `false`. User can toggle on.
- Every algorithm config must pass `validateAlgoConfig()`.
- All existing tests must continue to pass after changes.

---

## Identified Bugs

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 1 | **Algorithm switcher doesn't update visualization** | `useAlgoEngine` creates engine via `useMemo(() => ..., [])` — empty deps, never recreates. `engine.setSteps()` is called but `currentStep` returned from hook reads stale engine state since `totalSteps` and `currentStep` are computed outside the subscribe callback. | Rewrite hook to derive `currentStep` and `totalSteps` from reactive `stepIndex` state, and ensure `setSteps` triggers re-render. |
| 2 | **Formula panel renders raw LaTeX** (screenshot: `\lceil \log_2 10 \rceil = 4 \text{comparisons}`) | `FormulaPanel` just renders `{item.math}` as a string. No LaTeX renderer installed. | Replace LaTeX strings in all configs with clean Unicode/plain-text math (e.g. `⌈log₂ 10⌉ = 4`). No dependency needed. |
| 3 | **Speed selector doesn't reflect current speed visually** | `speedMs` prop in `ControlBar` calls `getSpeed()` on every render but the speed state isn't reactive — `getSpeed()` reads from engine instance, not React state. | Add `speed` to the subscribe callback or track it in hook state. |
| 4 | **All panels shown by default** | Config sets `{ why: true, formula: true, distanceMap: true, code: true }`. | Change defaults to `{ code: true, why: false, formula: false, distanceMap: false }`. |

---

### Task 1: Fix `useAlgoEngine` Hook — Algorithm Switching & Speed Reactivity

**Files:**
- Modify: `src/engine/useAlgoEngine.ts`
- Modify: `src/App.tsx`
- Test: `src/engine/__tests__/engine.test.ts` (existing, verify still passes)

**Interfaces:**
- Produces: Fixed `useAlgoEngine(steps)` that properly resets when `steps` array reference changes, and exposes reactive `speed` state.

- [ ] **Step 1: Rewrite `useAlgoEngine` to fix algorithm switching and speed reactivity**

```typescript
// src/engine/useAlgoEngine.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { AlgoStep } from '../types/algo';
import { PlaybackEngine, EngineOptions } from './engine';

export function useAlgoEngine(steps: AlgoStep[], options?: EngineOptions) {
  const engineRef = useRef<PlaybackEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new PlaybackEngine(steps, options);
  }
  const engine = engineRef.current;

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(engine.getSpeed());
  const previousStepsRef = useRef<AlgoStep[]>(steps);

  useEffect(() => {
    if (previousStepsRef.current !== steps) {
      previousStepsRef.current = steps;
      engine.setSteps(steps);
      setStepIndex(0);
      setIsPlaying(false);
    }
  }, [steps, engine]);

  useEffect(() => {
    const unsubscribe = engine.subscribe((index, playing) => {
      setStepIndex(index);
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, [engine]);

  const setSpeed = useCallback((ms: number) => {
    engine.setSpeed(ms);
    setSpeedState(ms);
  }, [engine]);

  return {
    engine,
    currentStepIndex: stepIndex,
    currentStep: steps[stepIndex],
    totalSteps: steps.length,
    isPlaying,
    speed,
    goNext: () => engine.goNext(),
    goPrev: () => engine.goPrev(),
    goToStep: (index: number) => engine.goToStep(index),
    play: () => engine.play(),
    pause: () => engine.pause(),
    togglePlay: () => engine.togglePlay(),
    reset: () => engine.reset(),
    setSpeed,
  };
}
```

Key fixes:
- `currentStep` now derived from `steps[stepIndex]` (reactive, not stale engine read).
- `totalSteps` derived from `steps.length` (reactive).
- `speed` tracked as React state, updated when `setSpeed` is called.
- `setSteps()` call also resets local React state to 0.

- [ ] **Step 2: Update `App.tsx` to use `speed` instead of `getSpeed()`**

In `App.tsx`, change the destructured return and `ControlBar` prop:
- Remove `getSpeed` from destructuring, add `speed`.
- Change `speedMs={getSpeed()}` → `speedMs={speed}`.

- [ ] **Step 3: Run tests to verify**

Run: `cd /Users/abhinandanmishra/personal/Sdeforge/algo-visualizer && ./node_modules/.bin/vitest run`
Expected: All 18 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/engine/useAlgoEngine.ts src/App.tsx
git commit -m "fix: algorithm switching, speed reactivity, and stale step state in useAlgoEngine"
```

---

### Task 2: Fix Panel Defaults & Formula Display

**Files:**
- Modify: `src/algorithms/floyd-cycle.ts` (panels defaults + replace LaTeX strings)
- Modify: `src/algorithms/binary-search.ts` (panels defaults + replace LaTeX strings)
- Modify: `src/App.tsx` (initial panels state)
- Test: `src/algorithms/__tests__/registry.test.ts` (existing, verify passes)

**Interfaces:**
- Consumes: Existing `AlgoConfig` type
- Produces: Updated configs with `panels.why = false`, `panels.formula = false`, `panels.distanceMap = false`, and clean Unicode math strings

- [ ] **Step 1: Update panel defaults in both algorithm configs**

In both `floyd-cycle.ts` and `binary-search.ts`, change:
```typescript
panels: {
  why: false,
  formula: false,
  distanceMap: false,
  code: true,
},
```

- [ ] **Step 2: Replace all raw LaTeX strings with clean Unicode math**

Examples of replacements in `floyd-cycle.ts`:
- `'v_{fast} = 2 \\times v_{slow}'` → `'v_fast = 2 × v_slow'`
- `'d_{fast} = 2 \\times d_{slow}'` → `'d_fast = 2 × d_slow'`
- `'2k - k = nC \\implies k = nC'` → `'2k − k = nC  ⟹  k = nC'`
- `'a = nC - b'` → `'a = nC − b'`
- `'slow == fast \\implies \\text{Start} = \\text{Node 1}'` → `'slow == fast  ⟹  Start = Node 1'`

Examples in `binary-search.ts`:
- `'N = 10'` → stays as-is (already clean)
- `'\\lceil \\log_2 10 \\rceil = 4 \\text{ comparisons}'` → `'⌈log₂ 10⌉ = 4 comparisons'`
- `'mid = \\lfloor \\frac{0 + 9}{2} \\rfloor = 4'` → `'mid = ⌊(0 + 9) / 2⌋ = 4'`
- `'arr[mid] < target \\implies left = mid + 1'` → `'arr[mid] < target  ⟹  left = mid + 1'`

- [ ] **Step 3: Update `App.tsx` initial panels state**

Change initial state in `App.tsx` from `useState<AlgoPanelsConfig>(currentAlgo.panels)` to use the config's panels (which now default to code-only).

- [ ] **Step 4: Run tests**

Run: `cd /Users/abhinandanmishra/personal/Sdeforge/algo-visualizer && ./node_modules/.bin/vitest run`
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/algorithms/ src/App.tsx
git commit -m "fix: default panels to code-only, replace raw LaTeX with Unicode math"
```

---

### Task 3: Add Algorithm Configs — Linked List & Two-Pointer Algorithms

**Files:**
- Create: `src/algorithms/two-pointer.ts`
- Create: `src/algorithms/reverse-linked-list.ts`
- Create: `src/algorithms/merge-two-sorted-lists.ts`
- Modify: `src/algorithms/registry.ts`
- Modify: `src/algorithms/__tests__/registry.test.ts`

**Interfaces:**
- Produces: `twoPointerConfig`, `reverseLinkedListConfig`, `mergeTwoSortedListsConfig`

- [ ] **Step 1: Write failing test for new algorithms**

```typescript
// Add to src/algorithms/__tests__/registry.test.ts
it('loads Two Pointer (Container With Most Water) config', () => {
  const algo = getAlgorithm('two-pointer');
  expect(algo).toBeDefined();
  expect(validateAlgoConfig(algo!).valid).toBe(true);
  expect(algo!.renderer).toBe('array');
});

it('loads Reverse Linked List config', () => {
  const algo = getAlgorithm('reverse-linked-list');
  expect(algo).toBeDefined();
  expect(validateAlgoConfig(algo!).valid).toBe(true);
  expect(algo!.renderer).toBe('linked-list');
});

it('loads Merge Two Sorted Lists config', () => {
  const algo = getAlgorithm('merge-two-sorted-lists');
  expect(algo).toBeDefined();
  expect(validateAlgoConfig(algo!).valid).toBe(true);
  expect(algo!.renderer).toBe('array');
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `cd /Users/abhinandanmishra/personal/Sdeforge/algo-visualizer && ./node_modules/.bin/vitest run src/algorithms/__tests__/registry.test.ts`
Expected: 3 new tests FAIL

- [ ] **Step 3: Implement `two-pointer.ts`**

Two Pointer — Container With Most Water on array `[1, 8, 6, 2, 5, 4, 8, 3, 7]`. Left/right converging pointers. 6+ steps showing area calculation, pointer movement logic.

- [ ] **Step 4: Implement `reverse-linked-list.ts`**

Iterative reversal of `[1 → 2 → 3 → 4 → 5]` with prev/curr/next pointers. 6+ steps showing pointer rewiring.

- [ ] **Step 5: Implement `merge-two-sorted-lists.ts`**

Merge `[1, 3, 5, 7]` and `[2, 4, 6, 8]` into sorted result using two pointer merge. Array renderer. 6+ steps.

- [ ] **Step 6: Register all 3 in `registry.ts`**

- [ ] **Step 7: Run tests**

Run: `cd /Users/abhinandanmishra/personal/Sdeforge/algo-visualizer && ./node_modules/.bin/vitest run`
Expected: All tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/algorithms/
git commit -m "feat: add two-pointer, reverse linked list, and merge sorted lists algorithms"
```

---

### Task 4: Add Algorithm Configs — Sorting Algorithms

**Files:**
- Create: `src/algorithms/bubble-sort.ts`
- Create: `src/algorithms/selection-sort.ts`
- Create: `src/algorithms/insertion-sort.ts`
- Modify: `src/algorithms/registry.ts`
- Modify: `src/algorithms/__tests__/registry.test.ts`

**Interfaces:**
- Produces: `bubbleSortConfig`, `selectionSortConfig`, `insertionSortConfig`

- [ ] **Step 1: Write failing tests for 3 sorting algos**

```typescript
it('loads Bubble Sort config', () => {
  const algo = getAlgorithm('bubble-sort');
  expect(algo).toBeDefined();
  expect(validateAlgoConfig(algo!).valid).toBe(true);
});

it('loads Selection Sort config', () => {
  const algo = getAlgorithm('selection-sort');
  expect(algo).toBeDefined();
  expect(validateAlgoConfig(algo!).valid).toBe(true);
});

it('loads Insertion Sort config', () => {
  const algo = getAlgorithm('insertion-sort');
  expect(algo).toBeDefined();
  expect(validateAlgoConfig(algo!).valid).toBe(true);
});
```

- [ ] **Step 2: Run test to verify failure**

- [ ] **Step 3: Implement `bubble-sort.ts`**

Array `[64, 34, 25, 12, 22, 11, 90]`. Shows adjacent swaps, pass-by-pass bubble-up. Array renderer with active pair highlighting. 8+ steps covering at least 2 full passes + final sorted state.

- [ ] **Step 4: Implement `selection-sort.ts`**

Same array. Shows min-scan + swap per pass. Array renderer. 6+ steps.

- [ ] **Step 5: Implement `insertion-sort.ts`**

Same array. Shows key extraction and shift-right insertion. 6+ steps.

- [ ] **Step 6: Register in `registry.ts`, run tests, commit**

```bash
git commit -m "feat: add bubble sort, selection sort, and insertion sort algorithms"
```

---

### Task 5: Add Algorithm Configs — Search & Graph Algorithms

**Files:**
- Create: `src/algorithms/linear-search.ts`
- Create: `src/algorithms/dfs.ts`
- Create: `src/algorithms/bfs.ts`
- Create: `src/algorithms/sliding-window.ts`
- Modify: `src/algorithms/registry.ts`
- Modify: `src/algorithms/__tests__/registry.test.ts`

**Interfaces:**
- Produces: `linearSearchConfig`, `dfsConfig`, `bfsConfig`, `slidingWindowConfig`

- [ ] **Step 1: Write failing tests for 4 algorithms**

```typescript
for (const id of ['linear-search', 'dfs', 'bfs', 'sliding-window']) {
  it(`loads ${id} config`, () => {
    const algo = getAlgorithm(id);
    expect(algo).toBeDefined();
    expect(validateAlgoConfig(algo!).valid).toBe(true);
  });
}
```

- [ ] **Step 2: Implement `linear-search.ts`**

Array `[4, 2, 7, 1, 9, 3, 8]`, target = 9. Sequential scan with active index highlight. Array renderer. 6+ steps.

- [ ] **Step 3: Implement `sliding-window.ts`**

Maximum Sum Subarray of size k=3 on `[2, 1, 5, 1, 3, 2]`. Window bracket on array. Array renderer. 5+ steps.

- [ ] **Step 4: Implement `dfs.ts`**

DFS traversal on a linked-list representation (path through nodes). Linked-list renderer showing visited stack. 6+ steps.

- [ ] **Step 5: Implement `bfs.ts`**

BFS traversal on a linked-list representation (level-by-level). Linked-list renderer showing visited queue. 6+ steps.

- [ ] **Step 6: Register all, run tests, commit**

```bash
git commit -m "feat: add linear search, sliding window, DFS, and BFS algorithms"
```

---

### Task 6: Update Tests & Final Verification

**Files:**
- Modify: `src/algorithms/__tests__/registry.test.ts`
- Modify: `src/__tests__/App.test.tsx`

- [ ] **Step 1: Update App test to verify new default panel state**

```typescript
it('defaults to showing only Code panel (intuition/formula/telemetry hidden)', () => {
  render(<App />);
  // Code walkthrough panel should be visible
  expect(screen.getByText(/Code Walkthrough/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run full test suite**

Run: `cd /Users/abhinandanmishra/personal/Sdeforge/algo-visualizer && ./node_modules/.bin/vitest run`
Expected: All tests pass.

- [ ] **Step 3: Run production build**

Run: `cd /Users/abhinandanmishra/personal/Sdeforge/algo-visualizer && ./node_modules/.bin/tsc -b && ./node_modules/.bin/vite build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "test: update tests for new defaults and algorithm expansion"
```

---

## Algorithm Catalog (after completion)

| # | Algorithm | Category | Renderer | Data Structure |
|---|-----------|----------|----------|---------------|
| 1 | Floyd's Cycle Detection | Linked List | `linked-list` | Cyclic linked list |
| 2 | Binary Search | Array | `array` | Sorted array |
| 3 | Two Pointer (Container With Most Water) | Array | `array` | Heights array |
| 4 | Reverse Linked List | Linked List | `linked-list` | Singly linked list |
| 5 | Merge Two Sorted Lists | Array | `array` | Two sorted arrays |
| 6 | Bubble Sort | Sorting | `array` | Unsorted array |
| 7 | Selection Sort | Sorting | `array` | Unsorted array |
| 8 | Insertion Sort | Sorting | `array` | Unsorted array |
| 9 | Linear Search | Search | `array` | Unsorted array |
| 10 | Sliding Window (Max Sum) | Array | `array` | Number array |
| 11 | DFS Traversal | Graph | `linked-list` | Node path |
| 12 | BFS Traversal | Graph | `linked-list` | Node levels |

---

## Verification Plan

### Automated Tests
- `./node_modules/.bin/vitest run` — all tests pass
- `./node_modules/.bin/tsc -b && ./node_modules/.bin/vite build` — clean production build

### Manual Verification
- Open `http://localhost:5174`
- Default view: only Canvas + Code Walkthrough visible (no Intuition/Formula/Telemetry)
- Toggle panels on/off via PanelToggleBar — verify they appear/disappear
- Switch between all 12 algorithms — verify canvas resets, steps restart at 0, code walkthrough updates
- Play/Pause/Next/Prev/Reset all work per algorithm
- Speed selector visually reflects current speed and changes playback pace
- Formula panel (when toggled on) shows clean Unicode math, not raw LaTeX
