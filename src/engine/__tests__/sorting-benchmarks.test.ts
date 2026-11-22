import { describe, expect, it } from 'vitest';
import { runSortingBenchmarks } from '../sorting-benchmarks';

describe('runSortingBenchmarks', () => {
  it('sorts all algorithms consistently for each input pattern', () => {
    for (const pattern of ['random', 'sorted', 'reversed'] as const) {
      const results = runSortingBenchmarks(25, pattern);
      expect(results).toHaveLength(4);
      for (const result of results) {
        expect(result.sorted).toEqual([...result.sorted].sort((a, b) => a - b));
        expect(result.comparisons).toBeGreaterThanOrEqual(0);
        expect(result.writes).toBeGreaterThanOrEqual(0);
        expect(result.swaps).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('keeps generated input deterministic for the same settings', () => {
    expect(runSortingBenchmarks(20, 'random')).toEqual(runSortingBenchmarks(20, 'random'));
  });

  it('clamps input sizes to the supported range', () => {
    expect(runSortingBenchmarks(1, 'random')[0].sorted).toHaveLength(2);
    expect(runSortingBenchmarks(500, 'random')[0].sorted).toHaveLength(100);
  });

  it('shows quadratic worst-case growth for last-pivot quick sort on sorted input', () => {
    const result = runSortingBenchmarks(20, 'sorted').find(item => item.id === 'quick');
    expect(result?.comparisons).toBe(190);
  });
});
