import type { NodeVisualState } from './types';

export interface NodeStateStyle {
  fill: string;
  border: string;
  ring: string;
  text: string;
}

/**
 * Single source of truth for state -> color mapping across every custom
 * React Flow node. Values mirror the hex colors used by the canvas
 * renderers so the on-screen view and exported video read as one system.
 */
const STATE_STYLES: Record<NodeVisualState, NodeStateStyle> = {
  default: {
    fill: 'bg-slate-800',
    border: 'border-slate-500',
    ring: '',
    text: 'text-slate-50',
  },
  active: {
    fill: 'bg-sky-700',
    border: 'border-sky-400',
    ring: 'shadow-[0_0_14px_rgba(14,165,233,0.7)]',
    text: 'text-sky-50',
  },
  visiting: {
    fill: 'bg-amber-700',
    border: 'border-amber-400',
    ring: 'shadow-[0_0_14px_rgba(245,158,11,0.7)]',
    text: 'text-amber-50',
  },
  visited: {
    fill: 'bg-emerald-800',
    border: 'border-emerald-400',
    ring: 'shadow-[0_0_10px_rgba(16,185,129,0.6)]',
    text: 'text-emerald-50',
  },
  highlight: {
    fill: 'bg-purple-800',
    border: 'border-purple-400',
    ring: 'shadow-[0_0_14px_rgba(168,85,247,0.7)]',
    text: 'text-purple-50',
  },
  found: {
    fill: 'bg-emerald-600',
    border: 'border-emerald-300',
    ring: 'shadow-[0_0_16px_rgba(16,185,129,0.8)]',
    text: 'text-white',
  },
  eliminated: {
    fill: 'bg-slate-900',
    border: 'border-slate-700',
    ring: '',
    text: 'text-slate-600',
  },
};

export function getNodeStateStyle(state: NodeVisualState): NodeStateStyle {
  return STATE_STYLES[state] ?? STATE_STYLES.default;
}
