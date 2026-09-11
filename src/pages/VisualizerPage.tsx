import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { catalog } from '../catalog';
import { AlgoConfig } from '../types/algo';
import { VisualizerLayout } from '../components/VisualizerLayout';
import { useAlgoEngine } from '../engine/useAlgoEngine';
import { getRenderer } from '../algorithms/registry';
import { AlgoRenderer } from '../renderers/types';

export default function VisualizerPage() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [config, setConfig] = useState<AlgoConfig | null>(null);
  const [renderer, setRenderer] = useState<AlgoRenderer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load config on mount or when params change
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!subjectId || !topicId) {
          setError('Subject or topic not found');
          return;
        }

        const topic = catalog.getTopic(subjectId, topicId);
        if (!topic) {
          setError('Topic not found');
          return;
        }

        if (topic.status === 'coming-soon') {
          setError('This topic is coming soon');
          return;
        }

        const loadedConfig = await Promise.resolve(topic.loadConfig());
        setConfig(loadedConfig);
        setRenderer(getRenderer(loadedConfig.renderer));
      } catch (err) {
        setError((err as Error).message || 'Failed to load topic');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [subjectId, topicId]);

  // Use the playback engine to manage steps
  const engine = useAlgoEngine(config?.steps ?? [], {
    defaultSpeedMs: 1200,
    loop: false,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading visualization...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(`/subjects/${subjectId}`)}
            className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2"
          >
            ← Back to {subjectId}
          </button>
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 text-red-300">
            <p className="font-semibold mb-2">Unable to load visualization</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!config || !renderer) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p>Configuration not available</p>
      </div>
    );
  }

  const aspectRatio = config.aspectRatio ?? '16:9';

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/subjects/${subjectId}`)}
            className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
          >
            ← Back to {subjectId}
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{config.title}</h1>
            {config.subtitle && <p className="text-slate-300 text-lg">{config.subtitle}</p>}
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {config.category}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-slate-200">
                Step {engine.currentStepIndex + 1} / {engine.totalSteps}
              </span>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <VisualizerLayout
            config={config}
            step={engine.currentStep}
            renderer={renderer}
            aspectRatio={aspectRatio}
            activePanels={config.panels}
            canvasRef={canvasRef}
          />
        </div>

        {/* Playback Controls */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-4 justify-center mb-6">
            <button
              onClick={() => engine.reset()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              title="Reset to beginning"
            >
              ⏮ Reset
            </button>
            <button
              onClick={() => engine.goPrev()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition disabled:opacity-50"
              disabled={engine.currentStepIndex === 0}
            >
              ◀ Prev
            </button>
            <button
              onClick={() => engine.togglePlay()}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                engine.isPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {engine.isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              onClick={() => engine.goNext()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition disabled:opacity-50"
              disabled={engine.currentStepIndex === engine.totalSteps - 1}
            >
              Next ▶
            </button>
            <div className="flex items-center gap-2">
              <label className="text-slate-300 text-sm">Speed:</label>
              <select
                value={engine.speed}
                onChange={(e) => engine.setSpeed(Number(e.target.value))}
                className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 text-sm"
              >
                <option value={500}>0.5x</option>
                <option value={1000}>1x</option>
                <option value={1200}>1.2x</option>
                <option value={1600}>1.6x</option>
                <option value={2000}>2x</option>
              </select>
            </div>
          </div>

          {/* Step Slider */}
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm w-12">{engine.currentStepIndex + 1}</span>
            <input
              type="range"
              min="0"
              max={engine.totalSteps - 1}
              value={engine.currentStepIndex}
              onChange={(e) => engine.goToStep(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-slate-400 text-sm w-12 text-right">{engine.totalSteps}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
