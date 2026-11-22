import { useNavigate } from 'react-router-dom';
import { BarChart3, GitBranch } from 'lucide-react';
import { catalog, Subject } from '../catalog';

export default function DashboardPage() {
  const navigate = useNavigate();
  const subjects = catalog.getSubjects();

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Visualization Dashboard</h1>
        <p className="text-slate-400 mb-8">Choose a subject to explore algorithms and concepts</p>

        <button
          onClick={() => navigate('/complexity-lab')}
          className="mb-10 flex w-full items-center justify-between gap-4 rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-500/15 to-cyan-500/10 p-5 text-left transition hover:border-indigo-300/60 hover:from-indigo-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-indigo-400/15 p-3 text-indigo-300"><BarChart3 size={24} /></div>
            <div>
              <h2 className="font-semibold text-white">Algorithm Complexity Lab</h2>
              <p className="mt-1 text-sm text-slate-400">Compare sorting algorithms, operation counts, and Big-O behavior</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-cyan-300">Explore →</span>
        </button>

        <button
          onClick={() => navigate('/recursion-tree')}
          className="mb-10 flex w-full items-center justify-between gap-4 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 p-5 text-left transition hover:border-cyan-300/60"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-cyan-400/15 p-3 text-cyan-300"><GitBranch size={24} /></div>
            <div>
              <h2 className="font-semibold text-white">Recursion Tree Explorer</h2>
              <p className="mt-1 text-sm text-slate-400">Explore recursive calls, base cases, and call-stack depth</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-cyan-300">Explore →</span>
        </button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject: Subject) => (
            <div
              key={subject.id}
              onClick={() => navigate(`/subjects/${subject.id}`)}
              className={`bg-gradient-to-br ${subject.color} cursor-pointer rounded-lg p-6 transition hover:scale-105 hover:shadow-lg`}
            >
              <div className="mb-4 text-5xl">{subject.icon}</div>
              <h2 className="mb-2 text-2xl font-bold text-white">{subject.title}</h2>
              <p className="mb-4 text-sm text-white/80">{subject.description}</p>
              <div className="text-sm font-semibold text-white/60">{subject.topics.length} topics</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
