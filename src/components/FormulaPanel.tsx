import React from 'react';
import { Sigma } from 'lucide-react';
import { FormulaItem } from '../types/algo';

interface FormulaPanelProps {
  formulas?: FormulaItem[];
}

export const FormulaPanel: React.FC<FormulaPanelProps> = ({ formulas }) => {
  if (!formulas || formulas.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3 text-cyan-400 font-semibold text-sm">
        <Sigma className="w-4 h-4" />
        <span>Mathematical Invariants</span>
      </div>
      <div className="space-y-2.5">
        {formulas.map((item, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-lg border transition-all ${
              item.active
                ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'border-slate-800/80 bg-slate-950/40 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-cyan-300/90 mb-1">
              <span>{item.label}</span>
              {item.active && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </div>
            <div className="font-mono text-sm tracking-wide text-slate-100 py-0.5">
              {item.math}
            </div>
            {item.explanation && (
              <div className="text-xs text-slate-400 mt-1 italic">
                {item.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
