import { describe, it, expect } from 'vitest';
import { getAlgorithm, getAllAlgorithms } from '../registry';
import { validateAlgoConfig } from '../../types/algo';

describe('Algorithm Registry', () => {
  it('loads Floyd Cycle Detection config and passes schema validation', () => {
    const floyd = getAlgorithm('floyd-cycle');
    expect(floyd).toBeDefined();
    const validation = validateAlgoConfig(floyd!);
    expect(validation.valid).toBe(true);
    expect(floyd?.steps.length).toBeGreaterThanOrEqual(10);
    expect(floyd?.renderer).toBe('linked-list');
  });

  it('loads Binary Search config and passes schema validation', () => {
    const bs = getAlgorithm('binary-search');
    expect(bs).toBeDefined();
    const validation = validateAlgoConfig(bs!);
    expect(validation.valid).toBe(true);
    expect(bs?.steps.length).toBeGreaterThanOrEqual(5);
    expect(bs?.renderer).toBe('array');
  });

  it('lists all registered algorithms', () => {
    const all = getAllAlgorithms();
    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all.map((a) => a.id)).toContain('floyd-cycle');
    expect(all.map((a) => a.id)).toContain('binary-search');
  });
});
