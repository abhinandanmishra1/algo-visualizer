import { AlgoStep } from '../../types/algo';

/**
 * Generates step-by-step execution of Bubble Sort algorithm
 */
export function generateBubbleSortSteps(input: number[]): AlgoStep[] {
  const arr = [...input];
  const steps: AlgoStep[] = [];
  let stepIndex = 0;

  const emit = (
    why: string,
    codeLines: number[],
    state: Partial<AlgoStep> = {}
  ) => {
    steps.push({
      stepIndex: stepIndex++,
      title: 'Bubble Sort',
      why,
      codeLines,
      state: { elements: [...arr], ...state.state },
      caption: state.caption,
      formulaActive: state.formulaActive,
    });
  };

  // Initial state
  emit(
    `Start Bubble Sort with array: [${arr.join(', ')}]`,
    [0],
    { state: {} }
  );

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      emit(
        `Compare arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}`,
        [2, 3],
        { state: { activeIndices: [j, j + 1] } }
      );

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        emit(
          `Swap positions ${j} and ${j + 1}: ${arr[j + 1]} and ${arr[j]}`,
          [4, 5],
          { state: { swappedIndices: [j, j + 1] } }
        );
      }
    }
    emit(
      `Pass ${i + 1} complete. Element ${arr[arr.length - 1 - i]} is in final position.`,
      [1],
      { state: { sortedUntil: arr.length - 1 - i } }
    );
  }

  emit(
    `Sorted array: [${arr.join(', ')}]`,
    [6],
    { state: { sorted: true } }
  );

  return steps;
}

/**
 * Generates step-by-step execution of Selection Sort algorithm
 */
export function generateSelectionSortSteps(input: number[]): AlgoStep[] {
  const arr = [...input];
  const steps: AlgoStep[] = [];
  let stepIndex = 0;

  const emit = (
    why: string,
    codeLines: number[],
    state: Partial<AlgoStep> = {}
  ) => {
    steps.push({
      stepIndex: stepIndex++,
      title: 'Selection Sort',
      why,
      codeLines,
      state: { elements: [...arr], ...state.state },
      caption: state.caption,
      formulaActive: state.formulaActive,
    });
  };

  emit(
    `Start Selection Sort with array: [${arr.join(', ')}]`,
    [0],
    { state: {} }
  );

  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    emit(
      `Pass ${i + 1}: Initialize minIdx = ${i}`,
      [2, 3],
      { state: { currentIndex: i, minIndex: minIdx } }
    );

    for (let j = i + 1; j < arr.length; j++) {
      emit(
        `Compare arr[${j}]=${arr[j]} with arr[${minIdx}]=${arr[minIdx]}`,
        [4, 5],
        { state: { currentIndex: i, minIndex: minIdx, activeIndices: [j, minIdx] } }
      );

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        emit(
          `Found smaller element at index ${minIdx} with value ${arr[minIdx]}`,
          [6],
          { state: { currentIndex: i, minIndex: minIdx } }
        );
      }
    }

    if (minIdx !== i) {
      emit(
        `Before swap: arr[${i}]=${arr[i]}, arr[${minIdx}]=${arr[minIdx]}`,
        [7],
        { state: { currentIndex: i, minIndex: minIdx, swappedIndices: [i, minIdx] } }
      );
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      emit(
        `Swap arr[${i}] and arr[${minIdx}]. Element ${arr[i]} is now in sorted position.`,
        [7],
        { state: { currentIndex: i, sortedUntil: i } }
      );
    }
  }

  emit(
    `Sorted array: [${arr.join(', ')}]`,
    [8],
    { state: { sorted: true } }
  );

  return steps;
}

/**
 * Generates step-by-step execution of Insertion Sort algorithm
 */
export function generateInsertionSortSteps(input: number[]): AlgoStep[] {
  const arr = [...input];
  const steps: AlgoStep[] = [];
  let stepIndex = 0;

  const emit = (
    why: string,
    codeLines: number[],
    state: Partial<AlgoStep> = {}
  ) => {
    steps.push({
      stepIndex: stepIndex++,
      title: 'Insertion Sort',
      why,
      codeLines,
      state: { elements: [...arr], ...state.state },
      caption: state.caption,
      formulaActive: state.formulaActive,
    });
  };

  emit(
    `Start Insertion Sort with array: [${arr.join(', ')}]`,
    [0],
    { state: {} }
  );

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    emit(
      `Pass ${i}: Extract key = arr[${i}] = ${key}`,
      [1, 2],
      { state: { currentIndex: i, key } }
    );

    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      emit(
        `Compare arr[${j}]=${arr[j]} > key=${key}`,
        [3],
        { state: { currentIndex: i, key, activeIndices: [j] } }
      );

      arr[j + 1] = arr[j];
      emit(
        `Shift arr[${j}]=${arr[j]} to arr[${j + 1}]`,
        [4],
        { state: { currentIndex: i, key, shiftIndex: j } }
      );
      j--;
    }

    arr[j + 1] = key;
    emit(
      `Insert key=${key} at arr[${j + 1}]. Sorted prefix: [${arr
        .slice(0, i + 1)
        .join(', ')}]`,
      [5],
      { state: { currentIndex: i, sortedUntil: i } }
    );
  }

  emit(
    `Sorted array: [${arr.join(', ')}]`,
    [6],
    { state: { sorted: true } }
  );

  return steps;
}

/**
 * Generates step-by-step execution of Merge Sort algorithm
 */
export function generateMergeSortSteps(input: number[]): AlgoStep[] {
  const arr = [...input];
  const steps: AlgoStep[] = [];
  let stepIndex = 0;

  const emit = (
    why: string,
    codeLines: number[],
    state: Partial<AlgoStep> = {}
  ) => {
    steps.push({
      stepIndex: stepIndex++,
      title: 'Merge Sort',
      why,
      codeLines,
      state: { elements: [...arr], ...state.state },
      caption: state.caption,
      formulaActive: state.formulaActive,
    });
  };

  emit(
    `Start Merge Sort with array: [${arr.join(', ')}]`,
    [0],
    { state: {} }
  );

  function mergeSort(
    left: number,
    right: number,
    depth: number = 0
  ): void {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    emit(
      `Divide: Split range [${left}, ${right}] at mid=${mid}. Left=[${arr
        .slice(left, mid + 1)
        .join(', ')}], Right=[${arr.slice(mid + 1, right + 1).join(', ')}]`,
      [1, 2],
      { state: { divideRange: [left, right], midPoint: mid, depth } }
    );

    mergeSort(left, mid, depth + 1);
    mergeSort(mid + 1, right, depth + 1);

    // Merge step
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    emit(
      `Merge: Combining [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
      [3, 4],
      { state: { mergeRange: [left, right], depth } }
    );

    let i = 0,
      j = 0,
      k = left;
    while (i < leftArr.length && j < rightArr.length) {
      emit(
        `Compare leftArr[${i}]=${leftArr[i]} and rightArr[${j}]=${rightArr[j]}`,
        [5, 6],
        {
          state: {
            mergeRange: [left, right],
            compareValues: [leftArr[i], rightArr[j]],
            activeIndices: [left + i, mid + 1 + j],
            depth,
          },
        }
      );

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        emit(
          `Place ${leftArr[i]} at position ${k}`,
          [7],
          { state: { mergeRange: [left, right], placeIndex: k, swappedIndices: [k], depth } }
        );
        i++;
      } else {
        arr[k] = rightArr[j];
        emit(
          `Place ${rightArr[j]} at position ${k}`,
          [7],
          { state: { mergeRange: [left, right], placeIndex: k, swappedIndices: [k], depth } }
        );
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;
    }

    emit(
      `Merge complete for range [${left}, ${right}]. Subarray: [${arr
        .slice(left, right + 1)
        .join(', ')}]`,
      [8],
      { state: { mergeRange: [left, right], sortedRanges: [left, right], depth } }
    );
  }

  mergeSort(0, arr.length - 1);

  emit(
    `Sorted array: [${arr.join(', ')}]`,
    [9],
    { state: { sorted: true } }
  );

  return steps;
}

/**
 * Generates step-by-step execution of Quick Sort algorithm
 */
export function generateQuickSortSteps(input: number[]): AlgoStep[] {
  const arr = [...input];
  const steps: AlgoStep[] = [];
  let stepIndex = 0;

  const emit = (
    why: string,
    codeLines: number[],
    state: Partial<AlgoStep> = {}
  ) => {
    steps.push({
      stepIndex: stepIndex++,
      title: 'Quick Sort',
      why,
      codeLines,
      state: { elements: [...arr], ...state.state },
      caption: state.caption,
      formulaActive: state.formulaActive,
    });
  };

  emit(
    `Start Quick Sort with array: [${arr.join(', ')}]`,
    [0],
    { state: {} }
  );

  function partition(low: number, high: number, depth: number = 0): number {
    const pivot = arr[high];
    emit(
      `Partition range [${low}, ${high}]. Pivot = arr[${high}] = ${pivot}`,
      [1, 2],
      { state: { partitionRange: [low, high], pivot, pivotIndex: high, depth } }
    );

    let i = low - 1;

    for (let j = low; j < high; j++) {
      emit(
        `Compare arr[${j}]=${arr[j]} with pivot=${pivot}`,
        [3],
        { state: { partitionRange: [low, high], pivot, activeIndices: [j], depth } }
      );

      if (arr[j] < pivot) {
        i++;
        emit(
          `Swap arr[${i}]=${arr[i]} and arr[${j}]=${arr[j]}`,
          [4, 5],
          {
            state: {
              partitionRange: [low, high],
              pivot,
              swappedIndices: [i, j],
              depth,
            },
          }
        );
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    emit(
      `Swap arr[${i + 1}]=${arr[i + 1]} and arr[${high}]=${arr[high]} (pivot)`,
      [6],
      {
        state: {
          partitionRange: [low, high],
          pivot,
          swappedIndices: [i + 1, high],
          depth,
        },
      }
    );
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    emit(
      `Partition complete. Pivot ${pivot} at index ${i + 1}. Left: [${arr
        .slice(low, i + 1)
        .join(', ')}], Right: [${arr.slice(i + 2, high + 1).join(', ')}]`,
      [7],
      {
        state: {
          partitionRange: [low, high],
          pivot,
          pivotIndex: i + 1,
          sortedPosition: i + 1,
          depth,
        },
      }
    );

    return i + 1;
  }

  function quickSort(low: number, high: number, depth: number = 0): void {
    if (low < high) {
      const pi = partition(low, high, depth);
      quickSort(low, pi - 1, depth + 1);
      quickSort(pi + 1, high, depth + 1);
    }
  }

  quickSort(0, arr.length - 1);

  emit(
    `Sorted array: [${arr.join(', ')}]`,
    [8],
    { state: { sorted: true } }
  );

  return steps;
}
