import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center px-6 max-w-2xl">
        <h1 className="text-6xl font-bold mb-6 text-white">
          Algorithm Visualizer
        </h1>
        <p className="text-xl text-slate-300 mb-4">
          Master data structures, algorithms, system design, and more with interactive visualizations.
        </p>
        <p className="text-slate-400 mb-8">
          Watch algorithms come to life. Export short-form videos for social media.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
        >
          Explore Visualizations →
        </button>

        <div className="mt-16 grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-white font-semibold">DSA</h3>
            <p className="text-sm text-slate-400">Algorithms & Data Structures</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🏗️</div>
            <h3 className="text-white font-semibold">System Design</h3>
            <p className="text-sm text-slate-400">LLD, HLD, Scalability</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🌐</div>
            <h3 className="text-white font-semibold">CS Concepts</h3>
            <p className="text-sm text-slate-400">Networking, OS, Fundamentals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
