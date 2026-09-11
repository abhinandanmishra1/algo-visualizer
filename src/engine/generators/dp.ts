import { AlgoStep } from '../../types/algo';

/**
 * Generates steps for Fibonacci with memoization
 * Shows DP table being filled, explains recurrence relation
 */
export function generateFibonacciMemoSteps(n: number): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const memo: number[] = new Array(n + 1).fill(-1);

  // Helper to compute fibonacci and record steps
  function fib(num: number, depth: number = 0): number {
    if (num <= 1) {
      memo[num] = num;
      steps.push({
        stepIndex: steps.length,
        title: `Base Case: fib(${num})`,
        state: {
          dpTable: [...memo.slice(0, n + 1)],
          currentCell: num,
          explanation: `Base case: fib(${num}) = ${num}`,
          formula: num === 0 ? 'fib(0) = 0' : 'fib(1) = 1',
          depth,
        },
        codeLines: [1, 2],
        why: `Base case reached: fib(${num}) = ${num}. This is the foundation of recursion.`,
      });
      return num;
    }

    if (memo[num] !== -1) {
      steps.push({
        stepIndex: steps.length,
        title: `Memoized: fib(${num})`,
        state: {
          dpTable: [...memo.slice(0, n + 1)],
          currentCell: num,
          explanation: `Already computed: fib(${num}) = ${memo[num]}`,
          formula: `memo[${num}] = ${memo[num]} (cached)`,
          depth,
        },
        codeLines: [3, 4],
        why: `Value fib(${num}) already computed and cached. Return memoized value ${memo[num]} to avoid redundant computation.`,
      });
      return memo[num];
    }

    const fib1 = fib(num - 1, depth + 1);
    const fib2 = fib(num - 2, depth + 1);
    memo[num] = fib1 + fib2;

    steps.push({
      stepIndex: steps.length,
      title: `Compute: fib(${num})`,
      state: {
        dpTable: [...memo.slice(0, n + 1)],
        currentCell: num,
        explanation: `fib(${num}) = fib(${num - 1}) + fib(${num - 2})`,
        formula: `fib(${num}) = ${fib1} + ${fib2} = ${memo[num]}`,
        depth,
      },
      codeLines: [5, 6],
      why: `Recurrence relation: fib(${num}) = fib(${num - 1}) + fib(${num - 2}) = ${fib1} + ${fib2} = ${memo[num]}. Store in memo to avoid recomputation.`,
      formulaActive: [
        { label: 'Recurrence', math: `fib(n) = fib(n-1) + fib(n-2)`, active: true },
        { label: 'Current', math: `fib(${num}) = ${memo[num]}`, active: true },
      ],
      distanceMap: [
        { label: 'Current Index', value: num },
        { label: 'fib(n-1)', value: fib1 },
        { label: 'fib(n-2)', value: fib2 },
        { label: 'Result', value: memo[num], highlight: true },
      ],
    });

    return memo[num];
  }

  fib(n);
  return steps;
}

/**
 * Generates steps for Longest Common Subsequence (LCS)
 * Shows DP table being filled cell by cell
 */
export function generateLCSSteps(s1: string, s2: string): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const m = s1.length;
  const n = s2.length;

  // Initialize DP table
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Add initialization step
  steps.push({
    stepIndex: steps.length,
    title: 'Initialize DP Table',
    state: {
      dpTable: dp.map(row => [...row]),
      s1,
      s2,
      currentRow: 0,
      currentCol: 0,
      explanation: 'Base case: empty strings have LCS = 0',
      matchFound: false,
    },
    codeLines: [1, 2],
    why: 'Initialize all DP table values to 0. First row and column represent comparison with empty string.',
  });

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          stepIndex: steps.length,
          title: `Match Found: s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}'`,
          state: {
            dpTable: dp.map(row => [...row]),
            s1,
            s2,
            currentRow: i,
            currentCol: j,
            matchFound: true,
            explanation: `Characters match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
          },
          codeLines: [4, 5],
          why: `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}'. Add 1 to diagonal value: dp[${i}][${j}] = ${dp[i - 1][j - 1]} + 1 = ${dp[i][j]}`,
          formulaActive: [
            { label: 'Match', math: `s1[${i - 1}] == s2[${j - 1}]`, active: true },
            { label: 'Recurrence', math: `dp[i][j] = dp[i-1][j-1] + 1`, active: true },
          ],
          distanceMap: [
            { label: 'Row', value: i },
            { label: 'Col', value: j },
            { label: 'LCS Length', value: dp[i][j], highlight: true },
          ],
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          stepIndex: steps.length,
          title: `No Match: s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}'`,
          state: {
            dpTable: dp.map(row => [...row]),
            s1,
            s2,
            currentRow: i,
            currentCol: j,
            matchFound: false,
            explanation: `No match. dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}`,
          },
          codeLines: [6, 7],
          why: `Characters don't match. Take maximum from top or left: dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
          formulaActive: [
            { label: 'No Match', math: `s1[${i - 1}] != s2[${j - 1}]`, active: true },
            { label: 'Recurrence', math: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`, active: true },
          ],
          distanceMap: [
            { label: 'Row', value: i },
            { label: 'Col', value: j },
            { label: 'Top Value', value: dp[i - 1][j] },
            { label: 'Left Value', value: dp[i][j - 1] },
            { label: 'Max', value: dp[i][j], highlight: true },
          ],
        });
      }
    }
  }

  // Add final result step
  steps.push({
    stepIndex: steps.length,
    title: `LCS Computation Complete`,
    state: {
      dpTable: dp.map(row => [...row]),
      s1,
      s2,
      currentRow: m,
      currentCol: n,
      result: dp[m][n],
    },
    codeLines: [8, 9],
    why: `LCS length between "${s1}" and "${s2}" is ${dp[m][n]}.`,
    formulaActive: [
      { label: 'LCS Length', math: `${dp[m][n]}`, active: true },
      { label: 'Time Complexity', math: `O(m × n)`, active: true },
      { label: 'Space Complexity', math: `O(m × n)`, active: true },
    ],
  });

  return steps;
}

/**
 * Generates steps for 0/1 Knapsack problem
 * Shows DP table being filled with profit calculations
 */
export function generateKnapsack01Steps(
  weights: number[],
  values: number[],
  capacity: number,
): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const n = weights.length;

  // Initialize DP table (items + 1 rows, capacity + 1 cols)
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  // Add initialization step
  steps.push({
    stepIndex: steps.length,
    title: 'Initialize Knapsack DP Table',
    state: {
      dpTable: dp.map(row => [...row]),
      weights,
      values,
      capacity,
      currentItem: 0,
      currentCapacity: 0,
      explanation: 'Base case: 0 items or 0 capacity = 0 profit',
    },
    codeLines: [1, 2],
    why: 'Initialize DP table. First row/column represent 0 items or 0 capacity, yielding 0 profit.',
  });

  // Fill DP table
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      const itemWeight = weights[i - 1];
      const itemValue = values[i - 1];

      if (itemWeight <= w) {
        // Item can fit: choose max of include or exclude
        const includeValue = dp[i - 1][w - itemWeight] + itemValue;
        const excludeValue = dp[i - 1][w];
        dp[i][w] = Math.max(includeValue, excludeValue);

        const include = includeValue > excludeValue;
        steps.push({
          stepIndex: steps.length,
          title: `Item ${i}: Weight=${itemWeight}, Value=${itemValue}, Capacity=${w}`,
          state: {
            dpTable: dp.map(row => [...row]),
            weights,
            values,
            capacity,
            currentItem: i,
            currentCapacity: w,
            canInclude: true,
            included: include,
            explanation: include
              ? `Item ${i} INCLUDED: ${itemValue} + ${excludeValue} = ${dp[i][w]}`
              : `Item ${i} EXCLUDED: ${excludeValue} is better than ${includeValue}`,
          },
          codeLines: [4, 5, 6],
          why: include
            ? `Include item ${i} (weight=${itemWeight}, value=${itemValue}): profit = ${includeValue} is better than excluding (${excludeValue}).`
            : `Exclude item ${i}: profit = ${excludeValue} is better than including (${includeValue}).`,
          formulaActive: [
            {
              label: 'Include',
              math: `dp[${i-1}][${w - itemWeight}] + ${itemValue} = ${includeValue}`,
              active: include,
            },
            {
              label: 'Exclude',
              math: `dp[${i - 1}][${w}] = ${excludeValue}`,
              active: !include,
            },
            { label: 'Choose', math: `max(${includeValue}, ${excludeValue}) = ${dp[i][w]}`, active: true },
          ],
          distanceMap: [
            { label: 'Item', value: i },
            { label: 'Weight', value: itemWeight },
            { label: 'Value', value: itemValue },
            { label: 'Capacity', value: w },
            { label: 'Max Profit', value: dp[i][w], highlight: true },
          ],
        });
      } else {
        // Item doesn't fit: exclude it
        dp[i][w] = dp[i - 1][w];
        steps.push({
          stepIndex: steps.length,
          title: `Item ${i}: Too Heavy (Weight=${itemWeight} > Capacity=${w})`,
          state: {
            dpTable: dp.map(row => [...row]),
            weights,
            values,
            capacity,
            currentItem: i,
            currentCapacity: w,
            canInclude: false,
            explanation: `Item ${i} cannot fit. dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i][w]}`,
          },
          codeLines: [7, 8],
          why: `Item ${i} weighs ${itemWeight} but capacity is only ${w}. Cannot include. Copy value from above: dp[${i}][${w}] = ${dp[i - 1][w]}.`,
          formulaActive: [
            { label: 'Cannot Fit', math: `weight[${i - 1}] = ${itemWeight} > ${w}`, active: true },
            { label: 'Copy Above', math: `dp[${i - 1}][${w}] = ${dp[i][w]}`, active: true },
          ],
          distanceMap: [
            { label: 'Item', value: i },
            { label: 'Weight', value: itemWeight },
            { label: 'Capacity', value: w },
            { label: 'Max Profit', value: dp[i][w] },
          ],
        });
      }
    }
  }

  // Add final result step
  steps.push({
    stepIndex: steps.length,
    title: 'Knapsack Complete',
    state: {
      dpTable: dp.map(row => [...row]),
      weights,
      values,
      capacity,
      result: dp[n][capacity],
    },
    codeLines: [9],
    why: `Maximum profit with capacity ${capacity} using items with weights ${JSON.stringify(weights)} and values ${JSON.stringify(values)} is ${dp[n][capacity]}.`,
    formulaActive: [
      { label: 'Max Profit', math: `${dp[n][capacity]}`, active: true },
      { label: 'Time Complexity', math: `O(n × W)`, active: true },
      { label: 'Space Complexity', math: `O(n × W)`, active: true },
    ],
  });

  return steps;
}

/**
 * Generates steps for Edit Distance (Levenshtein Distance)
 * Shows DP table filled with minimum edit operations
 */
export function generateEditDistanceSteps(s1: string, s2: string): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const m = s1.length;
  const n = s2.length;

  // Initialize DP table
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Base cases: converting from/to empty string
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Add initialization step
  steps.push({
    stepIndex: steps.length,
    title: 'Initialize Edit Distance DP Table',
    state: {
      dpTable: dp.map(row => [...row]),
      s1,
      s2,
      currentRow: 0,
      currentCol: 0,
      explanation: 'Base case: empty strings require deletions or insertions',
    },
    codeLines: [1, 2],
    why: `Base cases: Convert "" to s2 requires ${n} insertions, convert s1 to "" requires ${m} deletions.`,
  });

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        // Characters match: no operation needed
        dp[i][j] = dp[i - 1][j - 1];
        steps.push({
          stepIndex: steps.length,
          title: `Match: s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}'`,
          state: {
            dpTable: dp.map(row => [...row]),
            s1,
            s2,
            currentRow: i,
            currentCol: j,
            matchFound: true,
            explanation: `Characters match! No operation needed. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}`,
          },
          codeLines: [4, 5],
          why: `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}'. No operation needed. Copy diagonal: dp[${i}][${j}] = ${dp[i][j]}.`,
          formulaActive: [
            { label: 'Match', math: `s1[${i - 1}] == s2[${j - 1}]`, active: true },
            { label: 'No Operation', math: `dp[i][j] = dp[i-1][j-1]`, active: true },
          ],
          distanceMap: [
            { label: 'Row', value: i },
            { label: 'Col', value: j },
            { label: 'Edit Distance', value: dp[i][j], highlight: true },
          ],
        });
      } else {
        // Characters don't match: min of insert, delete, replace
        const deleteOp = dp[i - 1][j];
        const insertOp = dp[i][j - 1];
        const replaceOp = dp[i - 1][j - 1];
        dp[i][j] = 1 + Math.min(deleteOp, insertOp, replaceOp);

        const minOp = Math.min(deleteOp, insertOp, replaceOp);
        let operation = '';
        if (minOp === replaceOp) operation = 'Replace';
        else if (minOp === deleteOp) operation = 'Delete from s1';
        else operation = 'Insert into s1';

        steps.push({
          stepIndex: steps.length,
          title: `Mismatch: s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}'`,
          state: {
            dpTable: dp.map(row => [...row]),
            s1,
            s2,
            currentRow: i,
            currentCol: j,
            matchFound: false,
            explanation: `No match. ${operation}: 1 + min(${deleteOp}, ${insertOp}, ${replaceOp}) = ${dp[i][j]}`,
          },
          codeLines: [6, 7],
          why: `s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}'. Three options: Delete (${deleteOp}), Insert (${insertOp}), Replace (${replaceOp}). Minimum is ${minOp}, so dp[${i}][${j}] = 1 + ${minOp} = ${dp[i][j]} (${operation}).`,
          formulaActive: [
            { label: 'Delete', math: `dp[i-1][j] + 1 = ${deleteOp + 1}`, active: minOp === deleteOp },
            { label: 'Insert', math: `dp[i][j-1] + 1 = ${insertOp + 1}`, active: minOp === insertOp },
            { label: 'Replace', math: `dp[i-1][j-1] + 1 = ${replaceOp + 1}`, active: minOp === replaceOp },
            { label: 'Min', math: `${dp[i][j]}`, active: true },
          ],
          distanceMap: [
            { label: 'Row', value: i },
            { label: 'Col', value: j },
            { label: 'Delete Cost', value: deleteOp + 1 },
            { label: 'Insert Cost', value: insertOp + 1 },
            { label: 'Replace Cost', value: replaceOp + 1 },
            { label: 'Min Edit Dist', value: dp[i][j], highlight: true },
          ],
        });
      }
    }
  }

  // Add final result step
  steps.push({
    stepIndex: steps.length,
    title: 'Edit Distance Complete',
    state: {
      dpTable: dp.map(row => [...row]),
      s1,
      s2,
      currentRow: m,
      currentCol: n,
      result: dp[m][n],
    },
    codeLines: [8],
    why: `Edit distance (Levenshtein distance) from "${s1}" to "${s2}" is ${dp[m][n]} operations.`,
    formulaActive: [
      { label: 'Edit Distance', math: `${dp[m][n]}`, active: true },
      { label: 'Time Complexity', math: `O(m × n)`, active: true },
      { label: 'Space Complexity', math: `O(m × n)`, active: true },
    ],
  });

  return steps;
}
