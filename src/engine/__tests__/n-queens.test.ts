import { describe, expect, it } from 'vitest';
import { buildQueensTrace } from '../n-queens';

describe('buildQueensTrace', () => {
  it('finds the two solutions for a 4x4 board', () => {
    const result = buildQueensTrace(4);
    expect(result.solutionCount).toBe(2);
    expect(result.steps.some(step => step.action === 'backtrack')).toBe(true);
    expect(result.steps.filter(step => step.action === 'solution')).toHaveLength(2);
  });

  it('finds one solution for a 1x1 board', () => {
    const result = buildQueensTrace(1);
    expect(result.solutionCount).toBe(1);
    expect(result.steps.at(-1)?.action).toBe('solution');
  });

  it('finds no solution for a 2x2 or 3x3 board', () => {
    expect(buildQueensTrace(2).solutionCount).toBe(0);
    expect(buildQueensTrace(3).solutionCount).toBe(0);
  });

  it('rejects unsupported board sizes', () => {
    expect(() => buildQueensTrace(0)).toThrow(RangeError);
    expect(() => buildQueensTrace(9)).toThrow(RangeError);
  });
});
