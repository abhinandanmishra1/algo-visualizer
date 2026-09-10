import React from 'react';
import { Activity } from 'lucide-react';
import { DistanceItem } from '../types/algo';

interface DistanceMapPanelProps {
  items?: DistanceItem[];
}

export const DistanceMapPanel: React.FC<DistanceMapPanelProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold text-sm">
        <Activity className="w-4 h-4" />
        <span>Telemetry & Distance Map</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg border flex flex-col justify-between ${
              item.highlight
                ? 'border-emerald-500/60 bg-emerald-950/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : 'border-slate-800/80 bg-slate-950/50'
            }`}
          >
            <span className="text-xs text-slate-400 truncate">{item.label}</span>
            <span
              className={`font-mono text-base font-bold mt-1 ${
                item.highlight ? 'text-emerald-300' : 'text-slate-200'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
