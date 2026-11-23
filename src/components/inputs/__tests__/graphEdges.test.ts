import { describe, expect, it } from 'vitest';
import type { Edge } from 'reactflow';
import { makeDirectedEdges, makeUndirectedEdges } from '../graphEdges';

const edge = (source: string, target: string, data?: Edge['data']): Edge => ({
  id: `${source}->${target}`,
  source,
  target,
  markerEnd: 'arrowclosed',
  data,
});

describe('graph direction helpers', () => {
  it('adds a missing reverse edge and removes arrow markers in undirected mode', () => {
    const result = makeUndirectedEdges([edge('A', 'B')]);

    expect(result).toHaveLength(2);
    expect(result[0].markerEnd).toBeUndefined();
    expect(result[1]).toMatchObject({
      id: 'B->A',
      source: 'B',
      target: 'A',
      data: { generatedReverse: true },
    });
    expect(result[1].markerEnd).toBeUndefined();
  });

  it('does not duplicate an edge when the reverse already exists', () => {
    const originalEdges = [edge('A', 'B'), edge('B', 'A')];

    expect(makeUndirectedEdges(originalEdges)).toHaveLength(2);
    expect(makeDirectedEdges(originalEdges)).toHaveLength(2);
  });

  it('is idempotent when converting to undirected mode more than once', () => {
    const once = makeUndirectedEdges([edge('A', 'B')]);

    expect(makeUndirectedEdges(once)).toEqual(once);
  });

  it('removes generated reverse edges and restores arrows when returning to directed mode', () => {
    const undirected = makeUndirectedEdges([edge('A', 'B')]);
    const result = makeDirectedEdges(undirected);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'A->B',
      markerEnd: 'arrowclosed',
    });
  });

  it('does not create a reverse edge for a self-loop', () => {
    expect(makeUndirectedEdges([edge('A', 'A')])).toHaveLength(1);
  });
});
