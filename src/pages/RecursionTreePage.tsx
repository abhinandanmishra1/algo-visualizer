import { useMemo, useState } from 'react';
import { ArrowLeft, GitBranch, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

type CallNode = {
  id: string;
  label: string;
  expression: string;
  depth: number;
  children: CallNode[];
  baseCase: boolean;
};

function buildFibTree(n: number, id = 'root', depth = 0): CallNode {
  const baseCase = n <= 1;
  return {
    id,
    label: `fib(${n})`,
    expression: baseCase ? `return ${n}` : `fib(${n - 1}) + fib(${n - 2})`,
    depth,
    baseCase,
    children: baseCase ? [] : [
      buildFibTree(n - 1, `${id}-L`, depth + 1),
      buildFibTree(n - 2, `${id}-R`, depth + 1),
    ],
  };
}

function flatten(node: CallNode): CallNode[] {
  return [node, ...node.children.flatMap(flatten)];
}

function TreeNode({ node, selectedId, onSelect }: {
  node: CallNode;
  selectedId: string;
  onSelect: (node: CallNode) => void;
}) {
  const selected = node.id === selectedId;
  return (
    <div className="flex min-w-max flex-col items-center">
      <button
        onClick={() => onSelect(node)}
        className={`min-w-24 rounded-xl border px-3 py-2 text-center transition ${selected
          ? 'border-cyan-300 bg-cyan-400/20 text-cyan-100 ring-2 ring-cyan-400/30'
          : node.baseCase
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:border-emerald-300'
            : 'border-indigo-500/40 bg-indigo-500/10 text-indigo-100 hover:border-indigo-300'}`}
      >
        <span className="block font-mono text-sm font-bold">{node.label}</span>
        <span className="mt-1 block text-[10px] uppercase tracking-wide opacity-70">
          {node.baseCase ? 'Base case' : 'Recursive call'}
        </span>
      </button>
      {node.children.length > 0 && (
        <>
          <div className="h-5 w-px bg-slate-600" />
          <div className="flex items-start justify-center gap-3 border-t border-slate-600 px-2 pt-3">
            {node.children.map(child => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="absolute -top-3 h-3 w-px bg-slate-600" />
                <TreeNode node={child} selectedId={selectedId} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function RecursionTreePage() {
  const [n, setN] = useState(5);
  const [selected, setSelected] = useState<CallNode | null>(null);
  const tree = useMemo(() => buildFibTree(n), [n]);
  const nodes = useMemo(() => flatten(tree), [tree]);
  const baseCalls = nodes.filter(node => node.baseCase).length;
  const maxDepth = Math.max(...nodes.map(node => node.depth));
  const activeNode = selected && nodes.find(node => node.id === selected.id) ? selected : tree;

  const changeInput = (value: number) => {
    setN(value);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <GitBranch size={14} /> Recursion visualizer
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Recursion Tree Explorer</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Follow the recursive calls made by Fibonacci. Select any node to inspect its call, return condition, and depth.
            </p>
          </div>
          <button onClick={() => { changeInput(5); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white">
            <RotateCcw size={15} /> Reset
          </button>
        </div>

        <section className="mb-6 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-[1fr_2fr]">
          <div>
            <label htmlFor="fib-input" className="mb-2 block text-sm font-semibold text-slate-200">Calculate Fibonacci</label>
            <select id="fib-input" value={n} onChange={event => changeInput(Number(event.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-white">
              {[3, 4, 5, 6].map(value => <option key={value} value={value}>fib({value})</option>)}
            </select>
            <p className="mt-2 text-xs text-slate-500">Small inputs keep every recursive call visible.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Total calls" value={nodes.length} />
            <Metric label="Base cases" value={baseCalls} />
            <Metric label="Max depth" value={maxDepth} />
          </div>
        </section>

        <section className="mb-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Call tree: fib({n})</h2>
            <div className="flex gap-3 text-xs text-slate-400">
              <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-indigo-400" /> Recursive call</span>
              <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" /> Base case</span>
            </div>
          </div>
          <div className="flex min-w-max justify-center pb-4 pt-2">
            <TreeNode node={tree} selectedId={activeNode.id} onSelect={setSelected} />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="font-semibold">Selected call</h2>
            <p className="mt-3 font-mono text-xl text-cyan-300">{activeNode.label}</p>
            <p className="mt-2 text-sm text-slate-400">{activeNode.expression}</p>
            <p className="mt-3 text-xs text-slate-500">Depth: {activeNode.depth} · {activeNode.baseCase ? 'Stops recursion and returns immediately.' : `Creates ${activeNode.children.length} child calls.`}</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="font-semibold">Complexity insight</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Naive recursive Fibonacci makes two smaller calls for most inputs. The same subproblems are solved repeatedly, so the call count grows exponentially: O(2ⁿ) time and O(n) maximum call-stack space.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-300"><code>{'fib(n):\n  if n <= 1: return n\n  return fib(n - 1) + fib(n - 2)'}</code></pre>
          </article>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>;
}
