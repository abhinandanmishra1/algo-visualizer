import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
} from 'lucide-react';

interface ControlBarProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speedMs: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onStepSelect: (index: number) => void;
  onSpeedChange: (speedMs: number) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speedMs,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onStepSelect,
  onSpeedChange,
}) => {
  const speeds = [
    { label: '0.5x', ms: 2000 },
    { label: '1x', ms: 1200 },
    { label: '1.5x', ms: 800 },
    { label: '2x', ms: 400 },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-900 border border-slate-800 rounded-xl shadow-md">
      {/* Playback Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Reset"
          aria-label="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep === 0}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Previous Step"
          aria-label="Previous Step"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={isPlaying ? onPause : onPlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Play</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Next Step"
          aria-label="Next Step"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Step Scrubber */}
      <div className="flex-1 min-w-[200px] flex items-center gap-3">
        <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
          {currentStep + 1} / {totalSteps}
        </span>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(e) => onStepSelect(Number(e.target.value))}
          className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
        />
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
        <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
        {speeds.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onSpeedChange(s.ms)}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
              speedMs === s.ms
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
