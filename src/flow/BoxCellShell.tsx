import type { ReactNode, CSSProperties } from 'react';
import { NodeShell } from './NodeShell';
import type { PointerBadge } from './types';

interface BoxCellShellProps {
  width: number;
  height: number;
  colorClasses: string;
  pointers?: PointerBadge | PointerBadge[];
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Shared rectangular "box cell" primitive — every grid/row-of-boxes renderer
 * (array, matrix, stack/queue, hash buckets) renders through this so the
 * shape, corner radius, and border weight stay identical everywhere.
 */
export function BoxCellShell({ width, height, colorClasses, pointers, style, children }: BoxCellShellProps) {
  return (
    <NodeShell
      className={`rounded-xl border-2 ${colorClasses} transition-colors duration-300`}
      style={{ width, height, ...style }}
      pointers={pointers}
    >
      {children}
    </NodeShell>
  );
}

export const BOX_VALUE_TEXT_CLASS = 'font-bold text-lg font-mono';
export const BOX_SUBLABEL_TEXT_CLASS = 'absolute top-full mt-1.5 text-[11px] text-slate-400';
export const BOX_GAP = 10;
