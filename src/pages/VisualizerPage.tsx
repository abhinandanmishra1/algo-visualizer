import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Pencil, Film } from 'lucide-react';
import { catalog } from '../catalog';
import { AlgoConfig, RendererType } from '../types/algo';
import { VisualizerLayout } from '../components/VisualizerLayout';
import { ControlBar } from '../components/ControlBar';
import { PanelToggleBar } from '../components/PanelToggleBar';
import { useAlgoEngine } from '../engine/useAlgoEngine';
import { getRenderer } from '../algorithms/registry';
import { AlgoRenderer } from '../renderers/types';
import { InputModal } from '../components/InputModal';
import type { GraphData } from '../renderers/graphRenderer';
import { ExportModal } from '../export/ExportModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function adjacencyListToGraphData(adj: Record<string | number, (string | number)[]>): GraphData {
  const ids = Object.keys(adj);
  const nodes = ids.map((id) => ({ id, label: id }));
  const edges = ids.flatMap((from) => (adj[from] || []).map((to) => ({ from, to })));
  return { nodes, edges };
}

function mapCustomInputToData(renderer: RendererType, currentData: Record<string, any>, customInput: any) {
  switch (renderer) {
    case 'array':
      return { ...currentData, elements: customInput.array };
    case 'tree':
      return customInput;
    case 'graph':
      return adjacencyListToGraphData(customInput);
    default:
      return { ...currentData, ...customInput };
  }
}

export default function VisualizerPage() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [config, setConfig] = useState<AlgoConfig | null>(null);
  const [renderer, setRenderer] = useState<AlgoRenderer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const topicRef = useRef<any>(null);

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

        topicRef.current = topic;
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

  const handleCustomInput = async (customInput: any) => {
    if (!config || !topicRef.current) return;

    try {
      if (
        topicRef.current &&
        typeof (topicRef.current as any).buildConfig === 'function'
      ) {
        const newConfig = await Promise.resolve(
          (topicRef.current as any).buildConfig(customInput)
        );
        setConfig(newConfig);
      } else {
        console.warn(
          'buildConfig not available for this topic. Implement buildConfig(customInput) in topic meta to enable custom input editing.'
        );
        setConfig({
          ...config,
          data: mapCustomInputToData(config.renderer, config.data, customInput),
        });
      }
      setShowInputModal(false);
    } catch (err) {
      console.error('Failed to update with custom input:', err);
    }
  };

  const engine = useAlgoEngine(config?.steps ?? [], {
    defaultSpeedMs: 1200,
    loop: false,
  });

  const [activePanels, setActivePanels] = useState(config?.panels);
  useEffect(() => {
    if (config?.panels) setActivePanels(config.panels);
  }, [config?.panels]);

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
          <Button variant="ghost" onClick={() => navigate(`/subjects/${subjectId}`)} className="mb-6 gap-2 text-blue-400 hover:text-blue-300">
            <ArrowLeft className="w-4 h-4" /> Back to {subjectId}
          </Button>
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 text-red-300">
            <p className="font-semibold mb-2">Unable to load visualization</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!config || !renderer || !activePanels) {
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
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(`/subjects/${subjectId}`)} className="mb-4 gap-2 text-blue-400 hover:text-blue-300">
            <ArrowLeft className="w-4 h-4" /> Back to {subjectId}
          </Button>
          <div>
            <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <h1 className="text-4xl font-bold text-white">{config.title}</h1>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setShowInputModal(true)} className="gap-2">
                  <Pencil className="w-4 h-4" /> Edit Input
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowExportModal(true)}
                  className="gap-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30"
                >
                  <Film className="w-4 h-4" /> Export Video
                </Button>
              </div>
            </div>
            {config.subtitle && <p className="text-slate-300 text-lg">{config.subtitle}</p>}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {config.category}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-slate-200">
                Step {engine.currentStepIndex + 1} / {engine.totalSteps}
              </span>
              <PanelToggleBar
                panels={activePanels}
                onToggle={(key) => setActivePanels((p) => (p ? { ...p, [key]: !p[key] } : p))}
              />
            </div>
          </div>
        </div>

        <Card className="bg-slate-800/50 border border-slate-700 p-6 mb-8">
          <VisualizerLayout
            config={config}
            step={engine.currentStep}
            renderer={renderer}
            aspectRatio={aspectRatio}
            activePanels={activePanels}
            canvasRef={canvasRef}
          />
        </Card>

        <ControlBar
          currentStep={engine.currentStepIndex}
          totalSteps={engine.totalSteps}
          isPlaying={engine.isPlaying}
          speedMs={engine.speed}
          onPlay={engine.play}
          onPause={engine.pause}
          onNext={engine.goNext}
          onPrev={engine.goPrev}
          onReset={engine.reset}
          onStepSelect={engine.goToStep}
          onSpeedChange={engine.setSpeed}
        />
      </div>

      <InputModal
        isOpen={showInputModal}
        renderer={config.renderer}
        initialValue={config.data}
        onSubmit={handleCustomInput}
        onClose={() => setShowInputModal(false)}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        canvasRef={canvasRef}
        engine={engine.engine}
        algoTitle={config.title}
        aspectRatio={aspectRatio}
      />
    </div>
  );
}
