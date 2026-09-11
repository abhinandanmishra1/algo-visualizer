import { BaseEdge, EdgeLabelRenderer, getBezierPath, getStraightPath, type EdgeProps } from 'reactflow';

export interface ArrowEdgeData {
  label?: string | number;
  highlighted?: boolean;
  dashed?: boolean;
  curved?: boolean;
  color?: string;
  /**
   * Explicit trimmed endpoints (already offset by node radius), computed by
   * the owning adapter. When present these are used instead of the raw
   * handle-derived coordinates, so edges terminate exactly at a node's
   * visual boundary regardless of handle placement.
   */
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

/**
 * Generic directed edge used by graph/tree/heap/hash-table/linked-list/diagram
 * flow adapters. Supports an optional weight/label chip and a curved variant
 * (used for linked-list cycle back-edges).
 */
export function ArrowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps<ArrowEdgeData>) {
  const sx = data?.x1 ?? sourceX;
  const sy = data?.y1 ?? sourceY;
  const tx = data?.x2 ?? targetX;
  const ty = data?.y2 ?? targetY;

  const [path, labelX, labelY] = data?.curved
    ? getBezierPath({ sourceX: sx, sourceY: sy, sourcePosition, targetX: tx, targetY: ty, targetPosition, curvature: 0.6 })
    : getStraightPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty });

  const color = data?.color ?? (data?.highlighted ? '#38bdf8' : '#64748b');

  return (
    <>
      <BaseEdge
        path={path}
        markerEnd={markerEnd}
        style={{
          stroke: color,
          strokeWidth: data?.highlighted ? 2.5 : 1.75,
          strokeDasharray: data?.dashed ? '6 4' : undefined,
        }}
      />
      {data?.label !== undefined && data?.label !== '' && (
        <EdgeLabelRenderer>
          <div
            className="absolute rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'none',
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const arrowEdgeTypes = { arrow: ArrowEdge };
