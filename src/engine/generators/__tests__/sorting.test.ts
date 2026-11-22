import { describe, expect, it } from 'vitest';
import { generateQuickSortSteps } from '../sorting';

describe('generateQuickSortSteps', () => {
  it('sorts values and preserves the caller input', () => {
    const input = [10, 7, 8, 9, 1, 5];
    const steps = generateQuickSortSteps(input);

    expect(input).toEqual([10, 7, 8, 9, 1, 5]);
    expect(steps.at(-1)?.state.array).toEqual([1, 5, 7, 8, 9, 10]);
    expect(steps.at(-1)?.state.sorted).toBe(true);
  });

  it('handles duplicates, negative values, and an already sorted array', () => {
    const steps = generateQuickSortSteps([-2, 4, 4, 0, -5, 9]);
    expect(steps.at(-1)?.state.array).toEqual([-5, -2, 0, 4, 4, 9]);

    const sortedSteps = generateQuickSortSteps([1, 2, 3]);
    expect(sortedSteps.at(-1)?.state.array).toEqual([1, 2, 3]);
  });

  it('emits sequential step indexes', () => {
    const steps = generateQuickSortSteps([3, 1, 2]);
    expect(steps.map(step => step.stepIndex)).toEqual(
      steps.map((_, index) => index),
    );
  });
});
