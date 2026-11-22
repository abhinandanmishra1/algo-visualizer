import { describe, expect, it } from 'vitest';
import { generateMergeSortSteps } from '../sorting';

describe('generateMergeSortSteps', () => {
  it('sorts values and does not mutate the caller input', () => {
    const input = [38, 27, 43, 3, 9, 82, 10];
    const steps = generateMergeSortSteps(input);

    expect(input).toEqual([38, 27, 43, 3, 9, 82, 10]);
    expect(steps.at(-1)?.state.array).toEqual([3, 9, 10, 27, 38, 43, 82]);
    expect(steps.at(-1)?.state.sorted).toBe(true);
  });

  it('handles empty arrays, one value, duplicates, and negative numbers', () => {
    expect(generateMergeSortSteps([]).at(-1)?.state.array).toEqual([]);
    expect(generateMergeSortSteps([7]).at(-1)?.state.array).toEqual([7]);
    expect(generateMergeSortSteps([4, -1, 4, 0, -5]).at(-1)?.state.array)
      .toEqual([-5, -1, 0, 4, 4]);
  });

  it('emits sequential step indexes', () => {
    const steps = generateMergeSortSteps([3, 1, 2]);
    expect(steps.map(step => step.stepIndex)).toEqual(
      steps.map((_, index) => index),
    );
  });
});
