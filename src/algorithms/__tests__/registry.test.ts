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

  it('loads Two Pointer (Container With Most Water) config', () => {
    const algo = getAlgorithm('two-pointer');
    expect(algo).toBeDefined();
    expect(validateAlgoConfig(algo!).valid).toBe(true);
    expect(algo!.renderer).toBe('array');
  });

  it('loads Reverse Linked List config', () => {
    const algo = getAlgorithm('reverse-linked-list');
    expect(algo).toBeDefined();
    expect(validateAlgoConfig(algo!).valid).toBe(true);
    expect(algo!.renderer).toBe('linked-list');
  });

  it('loads Merge Two Sorted Lists config', () => {
    const algo = getAlgorithm('merge-two-sorted-lists');
    expect(algo).toBeDefined();
    expect(validateAlgoConfig(algo!).valid).toBe(true);
    expect(algo!.renderer).toBe('array');
  });

  it('lists all registered algorithms', () => {
    const all = getAllAlgorithms();
    expect(all.length).toBeGreaterThanOrEqual(5);
    expect(all.map((a) => a.id)).toContain('floyd-cycle');
    expect(all.map((a) => a.id)).toContain('binary-search');
    expect(all.map((a) => a.id)).toContain('two-pointer');
    expect(all.map((a) => a.id)).toContain('reverse-linked-list');
    expect(all.map((a) => a.id)).toContain('merge-two-sorted-lists');
  });
});
