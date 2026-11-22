import { useMemo, useState } from 'react';
import { ArrowLeft, Grid3X3, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildLcsSteps } from '../engine/dp-lcs';

const DEFAULT_FIRST = 'ABCBDAB';
const DEFAULT_SECOND = 'BDCABA';

export default function DPTablePage() {
  const [first, setFirst] = useState(DEFAULT_FIRST);
  const [second, setSecond] = useState(DEFAULT_SECOND);
  const [stepIndex, setStepIndex] = useState(0);
  const result = useMemo(() => buildLcsSteps(first, second), [first, second]);
  const step = result.steps[stepIndex];
  const progress = Math.round((stepIndex / Math.max(result.steps.length - 1, 1)) * 100);

  const updateFirst = (value: string) => { setFirst(value.toUpperCase().slice(0, 8).replace(/[^A-Z]/g, '')); setStepIndex(0); };
  const updateSecond = (value: string) => { setSecond(value.toUpperCase().slice(0, 8).replace(/[^A-Z]/g, '')); setStepIndex(0); };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">
            <Grid3X3 size={14} /> Dynamic programming visualizer
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">DP Table Visualizer</h1>
          <p className="mt-2 max-w-2xl text-slate-400">Watch the Longest Common Subsequence (LCS) table fill one cell at a time. Change either string and step through the recurrence.</p>
        </div>

        <section className="mb-6 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2">
          <div>
            <label htmlFor="lcs-first" className="mb-2 block text-sm font-semibold text-slate-200">String A</label>
            <input id="lcs-first" value={first} onChange={event => updateFirst(event.target.value)} maxLength={8} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 font-mono tracking-widest text-white outline-none focus:border-violet-400" />
          </div>
          <div>
            <label htmlFor="lcs-second" className="mb-2 block text-sm font-semibold text-slate-200">String B</label>
            <input id="lcs-second" value={second} onChange={event => updateSecond(event.target.value)} maxLength={8} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 font-mono tracking-widest text-white outline-none focus:border-violet-400" />
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Use up to 8 letters per string. Only A–Z characters are accepted.</p>
            <button onClick={() => { setFirst(DEFAULT_FIRST); setSecond(DEFAULT_SECOND); setStepIndex(0); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white">
              <RotateCcw size={14} /> Reset example
            </button>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">DP table <span className="ml-2 text-xs font-normal text-slate-500">dp[i][j] = LCS length of the first i and j characters</span></h2>
            <span className="font-mono text-xs text-violet-300">Step {stepIndex + 1} / {result.steps.length}</span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-violet-400 transition-all" style={{ width: `${progress}%` }} /></div>
          <div className="overflow-x-auto pb-2">
            <table className="mx-auto border-separate border-spacing-1 text-center font-mono text-sm">
              <thead>
                <tr>
                  <th className="h-9 min-w-9 text-slate-500"> </th>
                  <th className="h-9 min-w-9 rounded-md bg-slate-800 text-slate-400">∅</th>
                  {second.split('').map((char, index) => <th key={index} className="h-9 min-w-9 rounded-md bg-slate-800 text-violet-200">{char}</th>)}
                </tr>
              </thead>
              <tbody>
                {step.table.map((row, i) => (
                  <tr key={i}>
                    <th className="h-9 min-w-9 rounded-md bg-slate-800 text-violet-200">{i === 0 ? '∅' : first[i - 1]}</th>
                    {row.map((value, j) => {
                      const active = i === step.i && j === step.j && stepIndex > 0;
                      const dependency = stepIndex > 0 && ((i === step.i - 1 && j === step.j) || (i === step.i && j === step.j - 1) || (i === step.i - 1 && j === step.j - 1));
                      return <td key={j} className={`h-9 min-w-9 rounded-md border text-center transition-colors ${active ? 'border-violet-300 bg-violet-500 text-white ring-2 ring-violet-400/30' : dependency ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200' : 'border-slate-800 bg-slate-950 text-slate-300'}`}>{value}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button onClick={() => setStepIndex(0)} disabled={stepIndex === 0} className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-40">⏮ First</button>
            <button onClick={() => setStepIndex(index => Math.max(0, index - 1))} disabled={stepIndex === 0} className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-40">← Previous</button>
            <button onClick={() => setStepIndex(index => Math.min(result.steps.length - 1, index + 1))} disabled={stepIndex === result.steps.length - 1} className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40">Next cell →</button>
            <button onClick={() => setStepIndex(result.steps.length - 1)} disabled={stepIndex === result.steps.length - 1} className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-40">Last ⏭</button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current transition</p>
            <p className="mt-2 text-lg font-semibold text-violet-300">{stepIndex === 0 ? 'Initialize the table' : `dp[${step.i}][${step.j}] = ${step.value}`}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{step.explanation}</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Final answer</p>
            <p className="mt-2 font-mono text-2xl text-emerald-300">{stepIndex === result.steps.length - 1 ? result.lcs || '(empty)' : '—'}</p>
            <p className="mt-2 text-sm text-slate-400">LCS length: {step.table[first.length]?.[second.length] ?? 0} · Time: O(m × n) · Space: O(m × n)</p>
          </article>
        </section>
        <p className="mt-5 text-xs leading-5 text-slate-500">Rule: if characters match, take the diagonal value + 1. Otherwise, take max(top, left). The table is built from shorter prefixes toward the full strings.</p>
      </div>
    </div>
  );
}
