import { AlgoStep } from '../../types/algo';

/**
 * Generate steps for Merge Two Sorted Lists
 * Renders as a 3-row matrix: row 0 = list1, row 1 = list2, row 2 = growing result
 */
export function generateMergeTwoSortedListsSteps(list1: number[], list2: number[]): AlgoStep[] {
  const steps: AlgoStep[] = [];
  let stepIndex = 0;
  let i = 0;
  let j = 0;
  const result: number[] = [];

  const resultCellValues = () => {
    const cellValues: Record<string, number> = {};
    result.forEach((value, idx) => {
      cellValues[`2,${idx}`] = value;
    });
    return cellValues;
  };

  while (i < list1.length && j < list2.length) {
    const a = list1[i];
    const b = list2[j];
    const pickFirst = a <= b;
    const picked = pickFirst ? a : b;
    result.push(picked);

    steps.push({
      stepIndex: stepIndex++,
      title: `Compare list1[${i}] and list2[${j}]`,
      state: {
        activeCells: new Set([`0,${i}`, `1,${j}`]),
        highlightedCells: new Set([`2,${result.length - 1}`]),
        cellValues: resultCellValues(),
      },
      codeLines: pickFirst ? [4, 5] : [4, 6, 7],
      why: `Compare list1[${i}] (${a}) and list2[${j}] (${b}). ${pickFirst ? `${a} <= ${b}` : `${b} < ${a}`}, so pick ${picked} from ${pickFirst ? 'list1' : 'list2'} and advance pointer ${pickFirst ? 'i' : 'j'}.`,
      caption: `${pickFirst ? `${a} <= ${b}` : `${b} < ${a}`}: Append ${picked} to result, advance pointer ${pickFirst ? 'i' : 'j'}`,
      formulaActive: [
        {
          label: 'Comparison',
          math: `${pickFirst ? `${a} ≤ ${b}` : `${b} < ${a}`}  ⟹  pick ${pickFirst ? 'list1' : 'list2'}[${pickFirst ? i : j}]`,
          active: true,
        },
        { label: 'Result So Far', math: `result = [${result.join(', ')}]`, active: true },
      ],
      distanceMap: [
        { label: 'Next Picked', value: picked, highlight: true },
        { label: 'Result Size', value: result.length },
      ],
    });

    if (pickFirst) {
      i++;
    } else {
      j++;
    }
  }

  const drainRemaining = (source: number[], startIdx: number, sourceRow: number, sourceName: string) => {
    for (let k = startIdx; k < source.length; k++) {
      result.push(source[k]);
      steps.push({
        stepIndex: stepIndex++,
        title: `Drain remaining ${sourceName}[${k}]`,
        state: {
          activeCells: new Set([`${sourceRow},${k}`]),
          highlightedCells: new Set([`2,${result.length - 1}`]),
          cellValues: resultCellValues(),
        },
        codeLines: [8],
        why: `The other list is exhausted. Append remaining ${sourceName}[${k}] (${source[k]}) directly to result.`,
        caption: `${sourceName} exhausted on other side: append ${source[k]} to result`,
        formulaActive: [
          { label: 'Flush Remaining', math: `${sourceName}[${k}] = ${source[k]}`, active: true },
          { label: 'Result So Far', math: `result = [${result.join(', ')}]`, active: true },
        ],
        distanceMap: [
          { label: 'Next Picked', value: source[k], highlight: true },
          { label: 'Result Size', value: result.length },
        ],
      });
    }
  };

  if (i < list1.length) {
    drainRemaining(list1, i, 0, 'list1');
  } else if (j < list2.length) {
    drainRemaining(list2, j, 1, 'list2');
  }

  steps.push({
    stepIndex: stepIndex++,
    title: 'Merge Complete',
    state: {
      activeCells: new Set<string>(),
      highlightedCells: new Set(Array.from({ length: result.length }, (_, idx) => `2,${idx}`)),
      cellValues: resultCellValues(),
    },
    codeLines: [8, 9],
    why: `All elements are merged in sorted order: [${result.join(', ')}].`,
    caption: `Merged result: [${result.join(', ')}] complete in O(M + N)`,
    formulaActive: [
      { label: 'Sorted Output', math: `[${result.join(', ')}]`, active: true },
      { label: 'Time Complexity', math: 'O(M + N) linear time', active: true },
      { label: 'Space Complexity', math: 'O(M + N) output buffer', active: true },
    ],
    distanceMap: [
      { label: 'Total Merged', value: result.length, highlight: true },
      { label: 'Status', value: 'Complete', highlight: true },
      { label: 'Complexity', value: 'O(M + N)' },
    ],
  });

  return steps;
}
