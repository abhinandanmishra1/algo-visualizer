import { describe, expect, it } from 'vitest';
import { buildLcsSteps } from '../dp-lcs';

describe('buildLcsSteps', () => {
  it('computes the LCS table and sequence', () => {
    const result = buildLcsSteps('ABCBDAB', 'BDCABA');
    expect(result.table[7][6]).toBe(4);
    expect(result.lcs.length).toBe(4);
    expect(result.steps).toHaveLength(1 + 7 * 6);
  });

  it('handles empty strings', () => {
    const result = buildLcsSteps('', 'ABC');
    expect(result.table).toEqual([[0, 0, 0, 0]]);
    expect(result.lcs).toBe('');
    expect(result.steps).toHaveLength(1);
  });

  it('handles identical strings', () => {
    const result = buildLcsSteps('CAT', 'CAT');
    expect(result.lcs).toBe('CAT');
    expect(result.table[3][3]).toBe(3);
  });
});
