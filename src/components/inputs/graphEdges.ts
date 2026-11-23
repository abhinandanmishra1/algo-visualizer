import type { Edge } from 'reactflow';

/**
 * Add missing reverse edges and remove direction markers for undirected mode.
 * Reverse edges created here are tagged so they can be removed later.
 */
export function makeUndirectedEdges(edges: Edge[]): Edge[] {
  const undirectedEdges = edges.map((edge) => ({
    ...edge,
    markerEnd: undefined,
  }));
  const existingIds = new Set(undirectedEdges.map((edge) => edge.id));

  for (const edge of edges) {
    if (edge.source === edge.target) continue;

    const reverseId = `${edge.target}->${edge.source}`;
    if (existingIds.has(reverseId)) continue;

    undirectedEdges.push({
      id: reverseId,
      source: edge.target,
      target: edge.source,
      animated: true,
      data: { generatedReverse: true },
    });
    existingIds.add(reverseId);
  }

  return undirectedEdges;
}

/**
 * Remove only reverse edges generated for undirected mode and restore arrows.
 * Edges independently created by the user in both directions are preserved.
 */
export function makeDirectedEdges(edges: Edge[]): Edge[] {
  return edges
    .filter((edge) => edge.data?.generatedReverse !== true)
    .map((edge) => ({
      ...edge,
      markerEnd: 'arrowclosed',
    }));
}
