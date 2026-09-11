import type { CSSProperties } from 'react';
import type { PointerBadge } from './types';

interface PointerBadgesProps {
  pointers?: PointerBadge | PointerBadge[];
}

/**
 * Renders one or more floating pointer badges (e.g. "L", "R", "Slow") above
 * or below a structure node. Absolutely positioned so it doesn't affect
 * React Flow's node bounding box / layout.
 */
export function PointerBadges({ pointers }: PointerBadgesProps) {
  if (!pointers) return null;
  const list = Array.isArray(pointers) ? pointers : [pointers];
  if (list.length === 0) return null;

  const top = list.filter((p) => (p.position ?? 'top') === 'top');
  const bottom = list.filter((p) => p.position === 'bottom');

  return (
    <>
      {top.map((p, i) => (
        <Badge key={`top-${i}`} p={p} style={{ bottom: '100%', marginBottom: 6 + i * 26 }} />
      ))}
      {bottom.map((p, i) => (
        <Badge key={`bottom-${i}`} p={p} style={{ top: '100%', marginTop: 6 + i * 26 }} />
      ))}
    </>
  );
}

function Badge({ p, style }: { p: PointerBadge; style: CSSProperties }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-lg pointer-events-none"
      style={{ backgroundColor: p.color || '#6366f1', color: '#fff', ...style }}
    >
      {p.icon && <span>{p.icon}</span>}
      <span>{p.label}</span>
    </div>
  );
}
