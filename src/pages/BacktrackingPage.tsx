import { useMemo, useState } from 'react';
import { ArrowLeft, RotateCcw, StepBack, StepForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildQueensTrace } from '../engine/n-queens';

const ACTION_LABELS = {
  try: 'Candidate check',
  place: 'Place queen',
  backtrack: 'Backtrack',
  solution: 'Solution found',
};

export default function BacktrackingPage() {
  const [size, setSize] = useState(4);
  const [stepIndex, setStepIndex] = useState(0);
  const result = useMemo(() => buildQueensTrace(size), [size]);
  const step = result.steps[Math.min(stepIndex, result.steps.length - 1)];
  const progress = Math.round((stepIndex / Math.max(result.steps.length - 1, 1)) * 100);
  const placed = step?.board.filter(col => col !== -1).length ?? 0;

  const changeSize = (value: number) => {
    setSize(value);
    setStepIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <span>♛</span> Backtracking visualizer
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">N-Queens Explorer</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Watch backtracking place queens row by row, reject unsafe positions, and undo choices when a path cannot lead to a solution.</p>
          </div>
          <button onClick={() => setStepIndex(0)} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white">
            <RotateCcw size={15} /> Restart
          </button>
        </div>

        <section className="mb-6 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-[1fr_2fr]">
          <div>
            <label htmlFor="queens-size" className="mb-2 block text-sm font-semibold text-slate-200">Board size</label>
            <select id="queens-size" value={size} onChange={event => changeSize(Number(event.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-white">
              {[4, 5, 6].map(value => <option key={value} value={value}>{value} × {value}</option>)}
            </select>
            <p className="mt-2 text-xs text-slate-500">Larger boards create longer search traces.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Solutions" value={result.solutionCount} />
            <Metric label="Queens placed" value={placed} />
            <Metric label="Search steps" value={result.steps.length} />
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Search board</h2>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-amber-400" /> Queen</span>
              <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-rose-500" /> Rejected candidate</span>
            </div>
          </div>
          <div className="mx-auto grid w-fit overflow-hidden rounded-lg border border-slate-700" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 3.5rem))` }}>
            {Array.from({ length: size * size }, (_, index) => {
              const row = Math.floor(index / size);
              const col = index % size;
              const queen = step?.board[row] === col;
              const rejected = step?.action === 'try' && step.row === row && step.col === col && !step.safe;
              return (
                <div key={index} className={`flex h-14 w-14 items-center justify-center text-2xl sm:h-14 sm:w-14 ${(row + col) % 2 === 0 ? 'bg-slate-700' : 'bg-slate-800'} ${rejected ? 'ring-2 ring-inset ring-rose-500 bg-rose-500/20' : ''}`}>
                  {queen ? <span className="text-amber-300 drop-shadow">♛</span> : rejected ? <span className="text-sm font-bold text-rose-300">×</span> : null}
                </div>
              );
            })}
          </div>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-slate-500"><span>Trace progress</span><span>{stepIndex + 1} / {result.steps.length}</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button onClick={() => setStepIndex(0)} disabled={stepIndex === 0} className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-40">First</button>
            <button onClick={() => setStepIndex(index => Math.max(0, index - 1))} disabled={stepIndex === 0} className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-40"><StepBack size={14} /> Previous</button>
            <button onClick={() => setStepIndex(index => Math.min(result.steps.length - 1, index + 1))} disabled={stepIndex === result.steps.length - 1} className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-40">Next <StepForward size={14} /></button>
            <button onClick={() => setStepIndex(result.steps.length - 1)} disabled={stepIndex === result.steps.length - 1} className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-40">Last</button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current operation</p>
            <p className="mt-2 text-lg font-semibold text-amber-300">{step ? ACTION_LABELS[step.action] : 'Ready'}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{step?.explanation ?? 'The search trace is ready.'}</p>
            {step && <p className="mt-3 text-xs text-slate-500">Row {step.row + 1} · Column {step.col + 1} · {step.safe ? 'Safe position' : 'Conflict detected'}</p>}
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">How backtracking works</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Place one queen in each row. A position is safe when no earlier queen shares its column or either diagonal. If a row has no valid position, undo the previous placement and try another column.</p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-300"><code>{'solve(row):\n  if row == n: record solution\n  for col in columns:\n    if safe(row, col):\n      place queen\n      solve(row + 1)\n      remove queen'}</code></pre>
          </article>
        </section>
        <p className="mt-5 text-xs leading-5 text-slate-500">The visualizer records candidate checks, placements, backtracks, and every completed solution. N-Queens has no solutions for board sizes 2 and 3.</p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>;
}
