import { useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InputPattern, runSortingBenchmarks } from '../engine/sorting-benchmarks';

const patterns: { value: InputPattern; label: string; hint: string }[] = [
  { value: 'random', label: 'Random', hint: 'A mixed input with no intentional order' },
  { value: 'sorted', label: 'Already sorted', hint: 'Best-case input for adaptive algorithms' },
  { value: 'reversed', label: 'Reverse sorted', hint: 'A challenging input for simple sorts' },
];

export default function ComplexityLabPage() {
  const [size, setSize] = useState(30);
  const [pattern, setPattern] = useState<InputPattern>('random');
  const results = useMemo(() => runSortingBenchmarks(size, pattern), [size, pattern]);
  const maxComparisons = Math.max(...results.map(result => result.comparisons), 1);
  const allSorted = results.every(result =>
    result.sorted.every((value, index, array) => index === 0 || array[index - 1] <= value)
  );

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <BarChart3 size={14} /> Interactive learning tool
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Algorithm Complexity Lab</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Run the same input through four sorting algorithms. Compare actual operation counts and connect them to Big-O.
            </p>
          </div>
          <button
            onClick={() => { setSize(30); setPattern('random'); }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white"
          >
            <RefreshCw size={15} /> Reset
          </button>
        </div>

        <section className="mb-7 grid gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-[1fr_1fr]">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="array-size" className="text-sm font-semibold text-slate-200">Input size</label>
              <span className="rounded-md bg-slate-800 px-2 py-1 font-mono text-sm text-cyan-300">{size} values</span>
            </div>
            <input
              id="array-size"
              type="range"
              min="5"
              max="100"
              step="5"
              value={size}
              onChange={event => setSize(Number(event.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500"><span>5</span><span>100</span></div>
          </div>
          <div>
            <label htmlFor="input-pattern" className="mb-2 block text-sm font-semibold text-slate-200">Input distribution</label>
            <select
              id="input-pattern"
              value={pattern}
              onChange={event => setPattern(event.target.value as InputPattern)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
            >
              {patterns.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <p className="mt-2 text-xs text-slate-500">{patterns.find(option => option.value === pattern)?.hint}</p>
          </div>
        </section>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Algorithms compared</p>
            <p className="mt-1 text-2xl font-bold">4</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Input size</p>
            <p className="mt-1 text-2xl font-bold">{size}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Correctness check</p>
            <p className={`mt-1 text-2xl font-bold ${allSorted ? 'text-emerald-400' : 'text-rose-400'}`}>
              {allSorted ? 'All sorted ✓' : 'Check failed'}
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="font-semibold">Operation comparison</h2>
            <p className="mt-1 text-xs text-slate-500">Counts are measured by executing each algorithm on the same generated input. Runtime is intentionally omitted because browser timing is noisy.</p>
          </div>
          <div className="divide-y divide-slate-800">
            {results.map(result => (
              <div key={result.id} className="grid gap-4 p-5 md:grid-cols-[180px_1fr_170px] md:items-center">
                <div>
                  <h3 className="font-semibold">{result.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{result.timeComplexity}</p>
                  <p className="mt-1 text-xs text-slate-500">Space: {result.spaceComplexity}</p>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-slate-400">
                    <span>Comparisons</span><span className="font-mono text-slate-200">{result.comparisons.toLocaleString()}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${(result.comparisons / maxComparisons) * 100}%` }} />
                  </div>
                </div>
                <div className="flex gap-5 text-sm">
                  <div><p className="text-xs text-slate-500">Writes</p><p className="mt-1 font-mono">{result.writes.toLocaleString()}</p></div>
                  <div><p className="text-xs text-slate-500">Swaps</p><p className="mt-1 font-mono">{result.swaps.toLocaleString()}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="font-semibold text-white">How to read this</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Comparisons measure how often values are evaluated against each other. Writes count assignments into the working array. Swaps count pair exchanges. These are operation counts, not wall-clock performance.
            </p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="font-semibold text-white">Interview takeaway</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Big-O describes how work grows as input grows. Merge Sort stays O(n log n) across input orders, while this Quick Sort implementation uses the last element as pivot and can degrade to O(n²) on sorted or reverse-sorted data.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
