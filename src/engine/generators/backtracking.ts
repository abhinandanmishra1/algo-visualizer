import { AlgoStep } from '../../types/algo';

/**
 * Generates step-by-step visualization for the N-Queens problem using backtracking.
 * Emits steps at each decision point: try place, found solution, backtrack.
 *
 * @param n The size of the board (n×n)
 * @returns Array of AlgoStep objects showing the backtracking process
 */
export function generateNQueensSteps(n: number): AlgoStep[] {
  const steps: AlgoStep[] = [];
  let stepIndex = 0;

  // Initialize empty board
  const board: number[][] = Array(n)
    .fill(null)
    .map(() => Array(n).fill(0));
  const solutions: number[][][] = [];

  // Helper function to check if placing a queen at (row, col) is safe
  const isSafe = (tempBoard: number[][], row: number, col: number): boolean => {
    // Check column
    for (let i = 0; i < row; i++) {
      if (tempBoard[i][col] === 1) return false;
    }
    // Check upper left diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (tempBoard[i][j] === 1) return false;
    }
    // Check upper right diagonal
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (tempBoard[i][j] === 1) return false;
    }
    return true;
  };

  // Main backtracking function
  const solve = (tempBoard: number[][], row: number, depth: number): void => {
    // Base case: all queens placed
    if (row === n) {
      // Found a solution
      solutions.push(tempBoard.map((r) => [...r]));
      steps.push({
        stepIndex: stepIndex++,
        title: `Solution Found #${solutions.length}`,
        state: {
          board: tempBoard.map((r) => [...r]),
          row,
          solutions: solutions.map((s) => s.map((r) => [...r])),
          depth,
        },
        codeLines: [1, 2, 3],
        why: `All ${n} queens placed successfully. Solution #${solutions.length} found.`,
        caption: `Valid placement: all queens safe. Total solutions found: ${solutions.length}`,
      });
      return;
    }

    // Try placing a queen in each column of the current row
    for (let col = 0; col < n; col++) {
      const isSafeToPlace = isSafe(tempBoard, row, col);

      if (isSafeToPlace) {
        // Emit step: try to place queen
        tempBoard[row][col] = 1;
        steps.push({
          stepIndex: stepIndex++,
          title: `Try Place Queen at [${row}, ${col}]`,
          state: {
            board: tempBoard.map((r) => [...r]),
            row,
            col,
            solutions: solutions.map((s) => s.map((r) => [...r])),
            depth,
          },
          codeLines: [4, 5],
          why: `Position [${row}, ${col}] is safe. Placing queen and exploring further.`,
          caption: `Place Queen at Row ${row}, Col ${col}`,
        });

        // Recurse to next row
        solve(tempBoard, row + 1, depth + 1);

        // Backtrack: remove queen
        tempBoard[row][col] = 0;
        steps.push({
          stepIndex: stepIndex++,
          title: `Backtrack from [${row}, ${col}]`,
          state: {
            board: tempBoard.map((r) => [...r]),
            row,
            col,
            solutions: solutions.map((s) => s.map((r) => [...r])),
            depth,
            backtracking: true,
          },
          codeLines: [6, 7],
          why: `No valid solution found in this branch. Remove queen from [${row}, ${col}] and try next column.`,
          caption: `Backtrack: Remove Queen from [${row}, ${col}]`,
        });
      }
    }
  };

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Initialize N-Queens Problem',
    state: {
      board: board.map((r) => [...r]),
      row: 0,
      solutions: [],
      depth: 0,
    },
    codeLines: [0],
    why: `Starting to solve ${n}-Queens problem. Place queens one row at a time using backtracking.`,
    caption: `N-Queens (${n}×${n} board) - Start solving`,
  });

  // Solve the problem
  solve(board, 0, 0);

  // Final summary step
  steps.push({
    stepIndex: stepIndex++,
    title: `Complete: ${solutions.length} Solutions Found`,
    state: {
      board: board.map((r) => [...r]),
      row: n,
      solutions: solutions.map((s) => s.map((r) => [...r])),
      depth: 0,
      complete: true,
    },
    codeLines: [0],
    why: `Backtracking complete. Found ${solutions.length} valid placement(s) for ${n} queens.`,
    caption: `Total solutions: ${solutions.length}`,
  });

  return steps;
}

/**
 * Generates step-by-step visualization for generating all subsets using backtracking.
 * Emits steps at each decision point: include element, skip element, found subset.
 *
 * @param input Array of numbers to generate subsets from
 * @returns Array of AlgoStep objects showing the backtracking process
 */
export function generateSubsetsSteps(input: number[]): AlgoStep[] {
  const steps: AlgoStep[] = [];
  let stepIndex = 0;

  const allSubsets: number[][] = [];
  const remaining = [...input];

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Initialize Subset Generation',
    state: {
      current: [],
      remaining: [...remaining],
      allSubsets: [],
      depth: 0,
    },
    codeLines: [0],
    why: `Starting to generate all subsets of [${input.join(', ')}]. Use backtracking to explore all combinations.`,
    caption: `Generate Subsets of [${input.join(', ')}]`,
  });

  const generateSubsets = (index: number, currentSubset: number[], depth: number): void => {
    // Base case: processed all elements, add current subset
    if (index === input.length) {
      allSubsets.push([...currentSubset]);
      steps.push({
        stepIndex: stepIndex++,
        title: `Found Subset #${allSubsets.length}`,
        state: {
          current: [...currentSubset],
          remaining: input.slice(index),
          allSubsets: allSubsets.map((s) => [...s]),
          depth,
          index,
        },
        codeLines: [1, 2],
        why: `Processed all elements. Current subset [${currentSubset.join(', ')}] is complete.`,
        caption: `Subset #${allSubsets.length}: [${currentSubset.join(', ')}]`,
      });
      return;
    }

    // Option 1: Include current element
    currentSubset.push(input[index]);
    steps.push({
      stepIndex: stepIndex++,
      title: `Include Element ${input[index]}`,
      state: {
        current: [...currentSubset],
        remaining: input.slice(index + 1),
        allSubsets: allSubsets.map((s) => [...s]),
        depth,
        index,
        action: 'include',
      },
      codeLines: [3, 4],
      why: `Include element ${input[index]} in current subset. Recurse to include/exclude remaining elements.`,
      caption: `Include ${input[index]}: current = [${currentSubset.join(', ')}]`,
    });
    generateSubsets(index + 1, currentSubset, depth + 1);

    // Backtrack: Remove the element we just added
    currentSubset.pop();
    steps.push({
      stepIndex: stepIndex++,
      title: `Backtrack from ${input[index]} (exclude)`,
      state: {
        current: [...currentSubset],
        remaining: input.slice(index + 1),
        allSubsets: allSubsets.map((s) => [...s]),
        depth,
        index,
        backtracking: true,
      },
      codeLines: [5],
      why: `Backtrack and try excluding element ${input[index]}.`,
      caption: `Backtrack: Remove ${input[index]}, current = [${currentSubset.join(', ')}]`,
    });

    // Option 2: Exclude current element (implicitly done by skipping it)
    steps.push({
      stepIndex: stepIndex++,
      title: `Exclude Element ${input[index]}`,
      state: {
        current: [...currentSubset],
        remaining: input.slice(index + 1),
        allSubsets: allSubsets.map((s) => [...s]),
        depth,
        index,
        action: 'exclude',
      },
      codeLines: [6, 7],
      why: `Exclude element ${input[index]} and proceed to next element.`,
      caption: `Exclude ${input[index]}: current = [${currentSubset.join(', ')}]`,
    });
    generateSubsets(index + 1, currentSubset, depth + 1);
  };

  // Generate all subsets
  generateSubsets(0, [], 0);

  // Final summary step
  steps.push({
    stepIndex: stepIndex++,
    title: `Complete: ${allSubsets.length} Subsets Generated`,
    state: {
      current: [],
      remaining: [],
      allSubsets: allSubsets.map((s) => [...s]),
      depth: 0,
      complete: true,
    },
    codeLines: [0],
    why: `Backtracking complete. Generated all ${allSubsets.length} subsets of [${input.join(', ')}].`,
    caption: `Total subsets: ${allSubsets.length}`,
  });

  return steps;
}

/**
 * Generates step-by-step visualization for generating all permutations using backtracking.
 * Emits steps at each decision point: pick element, recurse, backtrack.
 *
 * @param input Array of numbers to generate permutations from
 * @returns Array of AlgoStep objects showing the backtracking process
 */
export function generatePermutationsSteps(input: number[]): AlgoStep[] {
  const steps: AlgoStep[] = [];
  let stepIndex = 0;

  const allPerms: number[][] = [];
  const used: boolean[] = Array(input.length).fill(false);

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Initialize Permutation Generation',
    state: {
      current: [],
      remaining: [...input],
      allPerms: [],
      depth: 0,
    },
    codeLines: [0],
    why: `Starting to generate all permutations of [${input.join(', ')}]. Use backtracking to explore all orderings.`,
    caption: `Generate Permutations of [${input.join(', ')}]`,
  });

  const generatePerms = (current: number[], depth: number): void => {
    // Base case: all elements used, found a permutation
    if (current.length === input.length) {
      allPerms.push([...current]);
      steps.push({
        stepIndex: stepIndex++,
        title: `Found Permutation #${allPerms.length}`,
        state: {
          current: [...current],
          remaining: input.filter((_, i) => !used[i]),
          allPerms: allPerms.map((p) => [...p]),
          depth,
        },
        codeLines: [1, 2],
        why: `All elements used. Permutation [${current.join(', ')}] is complete.`,
        caption: `Permutation #${allPerms.length}: [${current.join(', ')}]`,
      });
      return;
    }

    // Try each unused element
    for (let i = 0; i < input.length; i++) {
      if (!used[i]) {
        // Use this element
        used[i] = true;
        current.push(input[i]);

        steps.push({
          stepIndex: stepIndex++,
          title: `Pick Element ${input[i]}`,
          state: {
            current: [...current],
            remaining: input.filter((_, idx) => !used[idx]),
            allPerms: allPerms.map((p) => [...p]),
            depth,
            pickedIndex: i,
          },
          codeLines: [3, 4],
          why: `Pick element ${input[i]} and add to current permutation. Recurse with remaining elements.`,
          caption: `Pick ${input[i]}: current = [${current.join(', ')}]`,
        });

        generatePerms(current, depth + 1);

        // Backtrack: undo the choice
        current.pop();
        used[i] = false;

        steps.push({
          stepIndex: stepIndex++,
          title: `Backtrack from ${input[i]}`,
          state: {
            current: [...current],
            remaining: input.filter((_, idx) => !used[idx]),
            allPerms: allPerms.map((p) => [...p]),
            depth,
            backtracking: true,
          },
          codeLines: [5],
          why: `Backtrack and try other permutations starting with different elements.`,
          caption: `Backtrack: Remove ${input[i]}, current = [${current.join(', ')}]`,
        });
      }
    }
  };

  // Generate all permutations
  generatePerms([], 0);

  // Final summary step
  steps.push({
    stepIndex: stepIndex++,
    title: `Complete: ${allPerms.length} Permutations Generated`,
    state: {
      current: [],
      remaining: [],
      allPerms: allPerms.map((p) => [...p]),
      depth: 0,
      complete: true,
    },
    codeLines: [0],
    why: `Backtracking complete. Generated all ${allPerms.length} permutations of [${input.join(', ')}].`,
    caption: `Total permutations: ${allPerms.length}`,
  });

  return steps;
}
