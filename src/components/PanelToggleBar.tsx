import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlgoPanelsConfig } from '../types/algo';
import { cn } from '@/lib/utils';

interface PanelToggleBarProps {
  panels: AlgoPanelsConfig;
  onToggle: (key: keyof AlgoPanelsConfig) => void;
}

const options: { key: keyof AlgoPanelsConfig; label: string }[] = [
  { key: 'code', label: 'Code Walkthrough' },
  { key: 'why', label: 'Intuition' },
  { key: 'formula', label: 'Formulas' },
  { key: 'distanceMap', label: 'Telemetry' },
];

export function PanelToggleBar({ panels, onToggle }: PanelToggleBarProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="flex items-center gap-1 text-slate-500 font-medium">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Panels:
      </span>
      {options.map((opt) => {
        const isEnabled = panels[opt.key];
        return (
          <Button
            key={opt.key}
            variant="outline"
            size="sm"
            onClick={() => onToggle(opt.key)}
            className={cn(
              'h-6 px-2.5 text-xs',
              isEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
            )}
          >
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
}
