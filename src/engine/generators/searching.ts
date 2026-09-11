import { AlgoStep } from '../../types/algo';

/**
 * Generate steps for Linear Search algorithm
 * Iterates through array sequentially, comparing each element with target
 */
export function generateLinearSearchSteps(input: number[], target: number): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const array = [...input];
  let stepIndex = 0;

  // Iterate through each element
  for (let i = 0; i < array.length; i++) {
    const isMatch = array[i] === target;

    steps.push({
      stepIndex: stepIndex++,
      title: isMatch ? `Index ${i}: Target Found!` : `Check Index ${i}`,
      state: {
        array,
        searchIndex: i,
        target,
        targetFound: isMatch,
        activeIndices: [i],
        eliminatedIndices: i > 0 ? Array.from({ length: i }, (_, j) => j) : [],
        pointers: {
          [i]: {
            label: isMatch ? `TARGET (${array[i]})` : `i=${i} (${array[i]})`,
            color: isMatch ? '#10b981' : '#06b6d4',
            icon: isMatch ? '🎯' : '🔍',
            position: 'top',
          },
        },
      },
      codeLines: [1, 2],
      why: isMatch
        ? `arr[${i}] == ${target} == target! Match found at index ${i}. Return immediately.`
        : `Compare arr[${i}] (${array[i]}) with target (${target}). ${array[i]} ≠ ${target}, continue to next index.`,
      caption: isMatch
        ? `MATCH FOUND! arr[${i}] == ${target} at index ${i}`
        : `arr[${i}] = ${array[i]} ≠ ${target} ⟹ advance`,
      formulaActive: isMatch
        ? [
            { label: 'Success', math: `arr[${i}] == ${target}  ⟹  return ${i}`, active: true },
            { label: 'Time Complexity', math: 'O(N) worst, O(1) best', active: true },
            { label: 'Space Complexity', math: 'O(1) auxiliary', active: true },
          ]
        : [{ label: 'Comparison', math: `arr[${i}] = ${array[i]} ≠ ${target}`, active: true }],
      distanceMap: [
        { label: 'Current Value', value: array[i] },
        { label: 'Target', value: target },
        { label: 'Checked', value: `${i + 1} / ${array.length}` },
        ...(isMatch ? [{ label: 'Status', value: 'FOUND', highlight: true }] : []),
      ],
    });

    if (isMatch) break;
  }

  // If target not found, add final step
  if (steps[steps.length - 1]?.state.targetFound !== true) {
    steps.push({
      stepIndex: stepIndex++,
      title: 'Target Not Found',
      state: {
        array,
        target,
        targetFound: false,
        activeIndices: [],
        eliminatedIndices: Array.from({ length: array.length }, (_, i) => i),
      },
      codeLines: [5],
      why: `Searched entire array. Target ${target} not found. Return -1 (not found).`,
      caption: `Target ${target} not found in array. Return -1`,
      formulaActive: [
        { label: 'Result', math: 'return -1 (not found)', active: true },
        { label: 'Time Complexity', math: 'O(N)', active: true },
      ],
      distanceMap: [
        { label: 'Status', value: 'NOT FOUND', highlight: true },
        { label: 'Elements Checked', value: `${array.length} / ${array.length}` },
      ],
    });
  }

  return steps;
}

/**
 * Generate steps for Binary Search algorithm
 * Sorted array required; uses left/right pointers with midpoint calculation
 */
export function generateBinarySearchSteps(input: number[], target: number): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const array = [...input].sort((a, b) => a - b); // Ensure sorted
  let stepIndex = 0;
  let left = 0;
  let right = array.length - 1;
  let found = false;
  let foundIndex = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = array[mid];
    const comparison = midValue === target ? 'match' : midValue < target ? 'too-small' : 'too-large';

    steps.push({
      stepIndex: stepIndex++,
      title:
        comparison === 'match'
          ? `Binary Search: Target Found at Index ${mid}!`
          : `Binary Search: Compare Midpoint [L=${left}, M=${mid}, R=${right}]`,
      state: {
        array,
        left,
        right,
        mid,
        target,
        targetFound: comparison === 'match',
        activeIndices: [mid],
        searchRange: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        pointers: {
          [left]: {
            label: `L (${array[left]})`,
            color: '#06b6d4',
            icon: '👈',
            position: 'bottom',
          },
          [mid]: {
            label: comparison === 'match' ? `TARGET (${midValue})` : `M (${midValue})`,
            color: comparison === 'match' ? '#10b981' : '#f59e0b',
            icon: comparison === 'match' ? '🎯' : '📍',
            position: 'top',
          },
          [right]: {
            label: `R (${array[right]})`,
            color: '#f43f5e',
            icon: '👉',
            position: 'bottom',
          },
        },
      },
      codeLines: [2, 3],
      why:
        comparison === 'match'
          ? `array[${mid}] (${midValue}) == target (${target}). Found at index ${mid}!`
          : comparison === 'too-small'
            ? `array[${mid}] (${midValue}) < target (${target}). Search right half. Move left pointer.`
            : `array[${mid}] (${midValue}) > target (${target}). Search left half. Move right pointer.`,
      caption:
        comparison === 'match'
          ? `MATCH FOUND! array[${mid}] == ${target}`
          : comparison === 'too-small'
            ? `array[${mid}] = ${midValue} < ${target} ⟹ search right`
            : `array[${mid}] = ${midValue} > ${target} ⟹ search left`,
      formulaActive: [
        {
          label: 'Midpoint Calculation',
          math: `mid = ⌊(${left} + ${right}) / 2⌋ = ${mid}`,
          active: true,
        },
        {
          label: 'Comparison',
          math: `array[${mid}] = ${midValue} ${comparison === 'match' ? '==' : comparison === 'too-small' ? '<' : '>'} ${target}`,
          active: true,
        },
      ],
      distanceMap: [
        { label: 'Left', value: left },
        { label: 'Mid', value: mid },
        { label: 'Right', value: right },
        { label: 'Search Space', value: right - left + 1 },
      ],
    });

    if (comparison === 'match') {
      found = true;
      foundIndex = mid;
      break;
    } else if (comparison === 'too-small') {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // Add final result step
  steps.push({
    stepIndex: stepIndex++,
    title: found ? `Binary Search Complete: Found at Index ${foundIndex}` : 'Binary Search Complete: Not Found',
    state: {
      array,
      target,
      targetFound: found,
      activeIndices: found ? [foundIndex] : [],
      pointers: found
        ? {
            [foundIndex]: {
              label: `FOUND (${array[foundIndex]})`,
              color: '#10b981',
              icon: '🏆',
              position: 'top',
            },
          }
        : {},
    },
    codeLines: [4],
    why: found
      ? `Target ${target} found at index ${foundIndex}. Binary search complete in O(log N) time.`
      : `Target ${target} not in sorted array. Search space exhausted.`,
    caption: found
      ? `Success! Found ${target} at index ${foundIndex} in O(log N)`
      : `Target ${target} not found. Return -1`,
    formulaActive: [
      { label: 'Time Complexity', math: 'O(log N)', active: true },
      { label: 'Space Complexity', math: 'O(1) iterative', active: true },
      { label: 'Requires', math: 'Sorted input array', active: true },
    ],
    distanceMap: [
      { label: 'Result', value: found ? `Index ${foundIndex}` : 'Not Found', highlight: true },
      { label: 'Time Complexity', value: 'O(log N)' },
      { label: 'Comparisons', value: stepIndex },
    ],
  });

  return steps;
}

/**
 * Generate steps for Two Pointer algorithm (Container With Most Water)
 * Left and right pointers converge, calculating area at each step
 */
export function generateTwoPointerSteps(input: number[]): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const heights = [...input];
  let stepIndex = 0;
  let left = 0;
  let right = heights.length - 1;
  let maxArea = 0;
  let maxAreaIndices = { left: 0, right: heights.length - 1 };

  while (left < right) {
    const width = right - left;
    const h = Math.min(heights[left], heights[right]);
    const area = width * h;

    if (area > maxArea) {
      maxArea = area;
      maxAreaIndices = { left, right };
    }

    steps.push({
      stepIndex: stepIndex++,
      title: `Calculate Area with L=${left}, R=${right}`,
      state: {
        array: heights,
        left,
        right,
        currentMax: maxArea,
        currentArea: area,
        activeIndices: [left, right],
        pointers: {
          [left]: {
            label: `L (h=${heights[left]})`,
            color: '#06b6d4',
            icon: '👈',
            position: 'bottom',
          },
          [right]: {
            label: `R (h=${heights[right]})`,
            color: '#f43f5e',
            icon: '👉',
            position: 'bottom',
          },
        },
      },
      codeLines: [3, 4, 5, 6],
      why: `Width = ${right} - ${left} = ${width}. Height = min(${heights[left]}, ${heights[right]}) = ${h}. Area = ${width} × ${h} = ${area}. ${area > maxArea ? 'NEW MAX!' : `Max still ${maxArea}`}`,
      caption: area > maxArea ? `Area ${area} > max ${maxArea}! NEW MAX!` : `Area ${area} ≤ max ${maxArea}`,
      formulaActive: [
        {
          label: 'Area Calculation',
          math: `min(${heights[left]}, ${heights[right]}) × (${right} − ${left}) = ${area}`,
          active: true,
        },
        { label: 'Max Water', math: `max_water = ${maxArea}`, active: true },
      ],
      distanceMap: [
        { label: 'Left Height', value: heights[left] },
        { label: 'Right Height', value: heights[right] },
        { label: 'Width', value: width },
        { label: 'Current Area', value: area },
        { label: 'Max Water', value: maxArea, highlight: area > maxArea },
      ],
    });

    // Move the pointer with smaller height
    if (heights[left] < heights[right]) {
      left++;
    } else {
      right--;
    }
  }

  // Add final result step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Two Pointer Complete: Maximum Water Found',
    state: {
      array: heights,
      left: maxAreaIndices.left,
      right: maxAreaIndices.right,
      currentMax: maxArea,
      found: true,
      activeIndices: [maxAreaIndices.left, maxAreaIndices.right],
      pointers: {
        [maxAreaIndices.left]: {
          label: `Optimal L (h=${heights[maxAreaIndices.left]})`,
          color: '#10b981',
          icon: '🏆',
          position: 'bottom',
        },
        [maxAreaIndices.right]: {
          label: `Optimal R (h=${heights[maxAreaIndices.right]})`,
          color: '#10b981',
          icon: '🏆',
          position: 'bottom',
        },
      },
    },
    codeLines: [7],
    why: `Maximum water area = ${maxArea} between indices ${maxAreaIndices.left} and ${maxAreaIndices.right}. O(N) single pass complete!`,
    caption: `Optimal max water = ${maxArea} (indices [${maxAreaIndices.left}] and [${maxAreaIndices.right}])`,
    formulaActive: [
      { label: 'Max Water Result', math: `max_water = ${maxArea}`, active: true },
      { label: 'Time Complexity', math: 'O(N) single scan', active: true },
      { label: 'Space Complexity', math: 'O(1) extra space', active: true },
    ],
    distanceMap: [
      { label: 'Max Capacity', value: maxArea, highlight: true },
      { label: 'Optimal Pair', value: `[${maxAreaIndices.left}] & [${maxAreaIndices.right}]`, highlight: true },
      { label: 'Complexity', value: 'O(N) / O(1)' },
    ],
  });

  return steps;
}

/**
 * Generate steps for Sliding Window algorithm (Max Sum of Subarray)
 * Window slides across array, tracking max sum for each position
 */
export function generateSlidingWindowSteps(input: number[], k: number): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const array = [...input];

  if (k > array.length || k < 1) {
    return [
      {
        stepIndex: 0,
        title: 'Invalid Window Size',
        state: { array, k, error: true },
        codeLines: [],
        why: `Window size k=${k} is invalid for array of length ${array.length}`,
        caption: `Error: k=${k} must be between 1 and ${array.length}`,
        distanceMap: [{ label: 'Status', value: 'Invalid Input' }],
      },
    ];
  }

  let stepIndex = 0;
  let maxSum = 0;
  let maxWindowStart = 0;

  // Calculate initial window sum
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += array[i];
  }
  maxSum = windowSum;

  steps.push({
    stepIndex: stepIndex++,
    title: `Initial Window: [0..${k - 1}]`,
    state: {
      array,
      windowStart: 0,
      windowEnd: k - 1,
      windowSum,
      currentMax: maxSum,
      activeIndices: Array.from({ length: k }, (_, i) => i),
      pointers: {
        0: { label: 'Start', color: '#06b6d4', icon: '🪟', position: 'bottom' },
        [k - 1]: { label: 'End', color: '#06b6d4', icon: '🪟', position: 'bottom' },
      },
    },
    codeLines: [1, 2, 3],
    why: `Compute initial sum of first k=${k} elements: ${Array.from({ length: k }, (_, i) => array[i]).join(' + ')} = ${windowSum}. Set max_sum = ${windowSum}.`,
    caption: `Initial window [${Array.from({ length: k }, (_, i) => array[i]).join(', ')}] ⟹ sum = ${windowSum}, max_sum = ${maxSum}`,
    formulaActive: [
      {
        label: 'Initial Sum',
        math: `${Array.from({ length: k }, (_, i) => array[i]).join(' + ')} = ${windowSum}`,
        active: true,
      },
      { label: 'Max Sum', math: `max_sum = ${maxSum}`, active: true },
    ],
    distanceMap: [
      { label: 'Window Sum', value: windowSum },
      { label: 'Max Sum', value: maxSum, highlight: true },
      { label: 'Window Size (k)', value: k },
    ],
  });

  // Slide the window
  for (let i = k; i < array.length; i++) {
    windowSum = windowSum + array[i] - array[i - k];

    const isNewMax = windowSum > maxSum;
    if (isNewMax) {
      maxSum = windowSum;
      maxWindowStart = i - k + 1;
    }

    steps.push({
      stepIndex: stepIndex++,
      title: `Slide Window to [${i - k + 1}..${i}]${isNewMax ? ' - NEW MAX!' : ''}`,
      state: {
        array,
        windowStart: i - k + 1,
        windowEnd: i,
        windowSum,
        currentMax: maxSum,
        activeIndices: Array.from({ length: k }, (_, j) => i - k + 1 + j),
        eliminatedIndices: Array.from({ length: i - k + 1 }, (_, j) => j),
        pointers: {
          [i - k + 1]: { label: 'Start', color: '#06b6d4', icon: '🪟', position: 'bottom' },
          [i]: { label: 'End', color: '#06b6d4', icon: '🪟', position: 'bottom' },
        },
      },
      codeLines: [4, 5, 6],
      why: `Slide right: subtract outgoing element array[${i - k}] (${array[i - k]}) and add incoming array[${i}] (${array[i]}). New sum = ${windowSum - array[i] + array[i - k]} - ${array[i - k]} + ${array[i]} = ${windowSum}.${isNewMax ? ` NEW MAX = ${maxSum}!` : ''}`,
      caption: `Slide right: ${windowSum - array[i] + array[i - k]} − ${array[i - k]} + ${array[i]} = ${windowSum}${isNewMax ? ` ⟹ NEW MAX = ${maxSum}!` : ` (max remains ${maxSum})`}`,
      formulaActive: [
        {
          label: 'Slide Update',
          math: `${windowSum - array[i] + array[i - k]} − ${array[i - k]} + ${array[i]} = ${windowSum}`,
          active: true,
        },
        { label: 'Max Check', math: `max(${maxSum - (isNewMax ? windowSum : 0)}, ${windowSum}) = ${maxSum}`, active: true },
      ],
      distanceMap: [
        { label: 'Window Sum', value: windowSum },
        { label: 'Max Sum', value: maxSum },
        ...(isNewMax ? [{ label: 'Status', value: 'NEW MAX', highlight: true }] : []),
      ],
    });
  }

  // Add final result step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Sliding Window Complete: Max Sum Found',
    state: {
      array,
      windowStart: maxWindowStart,
      windowEnd: maxWindowStart + k - 1,
      currentMax: maxSum,
      found: true,
      activeIndices: Array.from({ length: k }, (_, i) => maxWindowStart + i),
      pointers: {
        [maxWindowStart]: {
          label: `MAX [${array[maxWindowStart]}`,
          color: '#10b981',
          icon: '🏆',
          position: 'bottom',
        },
        [maxWindowStart + k - 1]: {
          label: `${array[maxWindowStart + k - 1]}]`,
          color: '#10b981',
          icon: '🏆',
          position: 'bottom',
        },
      },
    },
    codeLines: [7],
    why: `Maximum sum subarray of size k=${k} is [${Array.from({ length: k }, (_, i) => array[maxWindowStart + i]).join(', ')}] with sum = ${maxSum}. O(N) single pass!`,
    caption: `Optimal max sum = ${maxSum} from subarray [${Array.from({ length: k }, (_, i) => array[maxWindowStart + i]).join(', ')}]`,
    formulaActive: [
      {
        label: 'Optimal Window',
        math: `array[${maxWindowStart}..${maxWindowStart + k - 1}] = [${Array.from({ length: k }, (_, i) => array[maxWindowStart + i]).join(', ')}], sum = ${maxSum}`,
        active: true,
      },
      { label: 'Time Complexity', math: 'O(N) single pass vs O(N × k) brute force', active: true },
      { label: 'Space Complexity', math: 'O(1) constant auxiliary space', active: true },
    ],
    distanceMap: [
      { label: 'Max Sum', value: maxSum, highlight: true },
      {
        label: 'Best Window',
        value: `[${Array.from({ length: k }, (_, i) => array[maxWindowStart + i]).join(', ')}]`,
        highlight: true,
      },
      { label: 'Complexity', value: 'O(N) / O(1)' },
    ],
  });

  return steps;
}
