import React from 'react';
import { Lightbulb } from 'lucide-react';

interface WhyPanelProps {
  why: string;
  stepIndex: number;
}

export const WhyPanel: React.FC<WhyPanelProps> = ({ why, stepIndex }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2 text-amber-400 font-semibold text-sm">
        <Lightbulb className="w-4 h-4" />
        <span>Step {stepIndex + 1} Intuition & Logic</span>
      </div>
      <p className="text-slate-200 text-sm leading-relaxed font-sans">
        {why || 'No step explanation available.'}
      </p>
    </div>
  );
};
