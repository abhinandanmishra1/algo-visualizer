import { describe, expect, it } from 'vitest';
import { generateBFSSteps } from '../graph';

describe('generateBFSSteps', () => {
  it('keeps the initialization distance snapshot unchanged as nodes are discovered', () => {
    const steps = generateBFSSteps(
      {
        A: ['B', 'C'],
        B: ['D'],
        C: [],
        D: [],
      },
      'A',
    );

    expect(steps[0].state.distances).toEqual({ A: 0 });
    expect(steps.at(-1)?.state.distances).toEqual({
      A: 0,
      B: 1,
      C: 1,
      D: 2,
    });
  });

  it('keeps each dequeue step isolated from discoveries made afterward', () => {
    const steps = generateBFSSteps(
      {
        A: ['B'],
        B: ['C'],
        C: [],
      },
      'A',
    );

    const processStart = steps.find(step => step.title === 'Dequeue & Process: A (Level 0)');
    const processB = steps.find(step => step.title === 'Dequeue & Process: B (Level 1)');

    expect(processStart?.state.distances).toEqual({ A: 0 });
    expect(processB?.state.distances).toEqual({ A: 0, B: 1 });
    expect(steps.at(-1)?.state.distances).toEqual({ A: 0, B: 1, C: 2 });
  });
});
