import React from 'react';
import { AlgoPanelsConfig } from '../types/algo';
import { SlidersHorizontal } from 'lucide-react';

interface PanelToggleBarProps {
  panels: AlgoPanelsConfig;
  onToggle: (key: keyof AlgoPanelsConfig) => void;
}

export const PanelToggleBar: React.FC<PanelToggleBarProps> = ({ panels, onToggle }) => {
  const options: { key: keyof AlgoPanelsConfig; label: string }[] = [
    { key: 'code', label: 'Code Walkthrough' },
    { key: 'why', label: 'Intuition' },
    { key: 'formula', label: 'Formulas' },
    { key: 'distanceMap', label: 'Telemetry' },
  ];

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="flex items-center gap-1 text-slate-500 font-medium">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Panels:
      </span>
      {options.map((opt) => {
        const isEnabled = panels[opt.key];
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onToggle(opt.key)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              isEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-transparent border-slate-850 text-slate-500 hover:text-slate-400'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
