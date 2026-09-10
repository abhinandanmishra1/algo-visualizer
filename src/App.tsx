import { useState, useRef } from 'react';
import {
  getAllAlgorithms,
  getAlgorithm,
  getRenderer,
} from './algorithms/registry';
import { useAlgoEngine } from './engine/useAlgoEngine';
import { ControlBar } from './components/ControlBar';
import { PanelToggleBar } from './components/PanelToggleBar';
import { VisualizerLayout } from './components/VisualizerLayout';
import { ExportModal } from './export/ExportModal';
import { Sparkles, Video, Monitor, Smartphone } from 'lucide-react';
import { AlgoPanelsConfig } from './types/algo';

export default function App() {
  const algorithms = getAllAlgorithms();
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('floyd-cycle');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const currentAlgo = getAlgorithm(selectedAlgoId) || algorithms[0];
  const [panels, setPanels] = useState<AlgoPanelsConfig>(currentAlgo.panels);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    engine,
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    goNext,
    goPrev,
    goToStep,
    play,
    pause,
    reset,
    setSpeed,
    getSpeed,
  } = useAlgoEngine(currentAlgo.steps);

  const handleSelectAlgo = (id: string) => {
    setSelectedAlgoId(id);
    const newAlgo = getAlgorithm(id);
    if (newAlgo) {
      setPanels(newAlgo.panels);
    }
  };

  const handleTogglePanel = (key: keyof AlgoPanelsConfig) => {
    setPanels((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderer = getRenderer(currentAlgo.renderer);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="border-b border-slate-850 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white">
                AlgoVisualizer
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Config-driven canvas visualizer platform
            </p>
          </div>
        </div>

        {/* Center: Algorithm Selector & Aspect Ratio */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Algo Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="algo-select" className="sr-only">
              Select Algorithm
            </label>
            <select
              id="algo-select"
              aria-label="Select Algorithm"
              value={selectedAlgoId}
              onChange={(e) => handleSelectAlgo(e.target.value)}
              className="bg-slate-900 text-slate-100 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
            >
              {algorithms.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.title} ({algo.category})
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio Toggle (16:9 vs 9:16 Reels) */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setAspectRatio('16:9')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                aspectRatio === '16:9'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="16:9 Widescreen"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>16:9</span>
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio('9:16')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                aspectRatio === '9:16'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="9:16 Reel"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16 Reel</span>
            </button>
          </div>

          {/* Export Reel Button */}
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-600/20"
          >
            <Video className="w-4 h-4" />
            <span>Export Video</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-5">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{currentAlgo.title}</span>
            </h2>
            {currentAlgo.subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{currentAlgo.subtitle}</p>
            )}
          </div>

          {/* Panels Toggle Bar */}
          <PanelToggleBar panels={panels} onToggle={handleTogglePanel} />
        </div>

        {/* Visualizer Layout (Canvas, Code, Why, Formula, Distance Map) */}
        {currentStep && (
          <VisualizerLayout
            config={currentAlgo}
            step={currentStep}
            renderer={renderer}
            aspectRatio={aspectRatio}
            activePanels={panels}
            canvasRef={canvasRef}
          />
        )}

        {/* Playback Control Bar */}
        <div className="mt-auto pt-2 sticky bottom-4 z-30">
          <ControlBar
            currentStep={currentStepIndex}
            totalSteps={totalSteps}
            isPlaying={isPlaying}
            speedMs={getSpeed()}
            onPlay={play}
            onPause={pause}
            onNext={goNext}
            onPrev={goPrev}
            onReset={reset}
            onStepSelect={goToStep}
            onSpeedChange={setSpeed}
          />
        </div>
      </main>

      {/* Video Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        canvasRef={canvasRef}
        engine={engine}
        algoTitle={currentAlgo.title}
        aspectRatio={aspectRatio}
      />
    </div>
  );
}
