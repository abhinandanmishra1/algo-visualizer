import type { ReactNode, CSSProperties } from 'react';
import { Handle, Position } from 'reactflow';
import { PointerBadges } from './PointerBadges';
import type { PointerBadge } from './types';

interface NodeShellProps {
  className: string;
  style?: CSSProperties;
  pointers?: PointerBadge | PointerBadge[];
  children: ReactNode;
}

const hiddenHandleStyle: CSSProperties = {
  width: 1,
  height: 1,
  opacity: 0,
  top: '50%',
  left: '50%',
  pointerEvents: 'none',
};

/**
 * Shared shell every custom structure node renders through. Provides:
 * - a single hidden source + target handle (edges compute their own trimmed
 *   paths via ArrowEdge's `data.x1/y1/x2/y2`, so handle placement is
 *   irrelevant — it only needs to exist for React Flow's edge bookkeeping)
 * - the floating pointer badges (Slow/Fast/L/R/etc.)
 */
export function NodeShell({ className, style, pointers, children }: NodeShellProps) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={style}>
      <Handle type="target" position={Position.Top} style={hiddenHandleStyle} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} style={hiddenHandleStyle} isConnectable={false} />
      <PointerBadges pointers={pointers} />
      {children}
    </div>
  );
}
