import { useParams, useNavigate } from 'react-router-dom';
import { catalog, TopicMeta } from '../catalog';

export default function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  if (!subjectId) return <div>Subject not found</div>;

  const subject = catalog.getSubject(subjectId);
  if (!subject) return <div>Subject not found</div>;

  const topics = subject.topics;
  const topicsByDifficulty = {
    beginner: topics.filter(t => t.difficulty === 'beginner'),
    intermediate: topics.filter(t => t.difficulty === 'intermediate'),
    advanced: topics.filter(t => t.difficulty === 'advanced'),
  };

  const renderTopicCard = (topic: TopicMeta) => (
    <div
      key={topic.id}
      onClick={() => {
        if (topic.status === 'ready') {
          navigate(`/subjects/${subjectId}/${topic.id}`);
        }
      }}
      className={`p-4 rounded-lg cursor-pointer border transition ${
        topic.status === 'coming-soon'
          ? 'bg-slate-700 border-slate-600 opacity-60 cursor-not-allowed'
          : 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-700'
      }`}
    >
      <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
      {topic.subtitle && <p className="text-sm text-slate-400">{topic.subtitle}</p>}
      <div className="mt-3 flex gap-2 flex-wrap">
        {topic.tags.map((tag: string) => (
          <span key={tag} className="text-xs px-2 py-1 bg-slate-600 text-slate-200 rounded">
            {tag}
          </span>
        ))}
      </div>
      {topic.status === 'coming-soon' && (
        <div className="mt-2 text-xs font-semibold text-yellow-400">Coming Soon</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-400 hover:text-blue-300 mb-6"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-white mb-2">{subject.title}</h1>
        <p className="text-slate-400 mb-12">{subject.description}</p>

        {Object.entries(topicsByDifficulty).map(([difficulty, diffTopics]) => (
          diffTopics.length > 0 && (
            <div key={difficulty} className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4 capitalize">{difficulty}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diffTopics.map(renderTopicCard)}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
