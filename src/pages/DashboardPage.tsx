import { useNavigate } from 'react-router-dom';
import { catalog, Subject } from '../catalog';

export default function DashboardPage() {
  const navigate = useNavigate();
  const subjects = catalog.getSubjects();

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Visualization Dashboard</h1>
        <p className="text-slate-400 mb-12">Choose a subject to explore algorithms and concepts</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject: Subject) => (
            <div
              key={subject.id}
              onClick={() => navigate(`/subjects/${subject.id}`)}
              className={`bg-gradient-to-br ${subject.color} p-6 rounded-lg cursor-pointer hover:shadow-lg hover:scale-105 transition transform`}
            >
              <div className="text-5xl mb-4">{subject.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{subject.title}</h2>
              <p className="text-sm text-white/80 mb-4">{subject.description}</p>
              <div className="text-sm font-semibold text-white/60">
                {subject.topics.length} topics
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
