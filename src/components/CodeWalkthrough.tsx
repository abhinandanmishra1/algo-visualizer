import React from 'react';
import { Code2 } from 'lucide-react';

interface CodeWalkthroughProps {
  language: string;
  lines: string[];
  activeLines: number[];
}

export const CodeWalkthrough: React.FC<CodeWalkthroughProps> = ({
  language,
  lines,
  activeLines,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 flex flex-col h-full overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span>Code Walkthrough</span>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
          {language}
        </span>
      </div>
      <div className="p-3 font-mono text-xs overflow-x-auto overflow-y-auto max-h-[380px] leading-6 select-text">
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = activeLines.includes(lineNumber);

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                isActive
                  ? 'bg-indigo-950/80 text-indigo-100 border-l-2 border-indigo-400 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className={`w-5 text-right select-none text-[11px] ${
                  isActive ? 'text-indigo-400 font-bold' : 'text-slate-600'
                }`}
              >
                {lineNumber}
              </span>
              <pre className="font-mono text-xs whitespace-pre">{line}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
