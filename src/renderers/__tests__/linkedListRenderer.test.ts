import { describe, it, expect } from 'vitest';
import { calculateNodePositions } from '../linkedListRenderer';

describe('calculateNodePositions', () => {
  it('computes linear head nodes and circular cycle nodes coordinates', () => {
    const nodes = [
      { id: '1', val: 3 },
      { id: '2', val: 2 },
      { id: '3', val: 0 },
      { id: '4', val: -4 },
    ];
    // cycle starts at index 1 (val: 2), so node 0 is linear, nodes 1,2,3 form a loop
    const positions = calculateNodePositions(nodes, 1, 800, 450);
    expect(positions).toHaveLength(4);
    expect(positions[0].x).toBeLessThan(positions[1].x);
    expect(positions[1]).toBeDefined();
    expect(positions[2]).toBeDefined();
    expect(positions[3]).toBeDefined();
    expect(positions[0].radius).toBeGreaterThan(15);
  });

  it('handles linear list without cycle', () => {
    const nodes = [
      { id: '1', val: 1 },
      { id: '2', val: 2 },
      { id: '3', val: 3 },
    ];
    const positions = calculateNodePositions(nodes, -1, 800, 450);
    expect(positions).toHaveLength(3);
    expect(positions[0].x).toBeLessThan(positions[1].x);
    expect(positions[1].x).toBeLessThan(positions[2].x);
  });
});
