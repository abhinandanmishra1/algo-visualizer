import { Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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

const speeds = [
  { label: '0.5x', ms: 2000 },
  { label: '1x', ms: 1200 },
  { label: '1.5x', ms: 800 },
  { label: '2x', ms: 400 },
];

export function ControlBar({
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
}: ControlBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-900 border border-slate-800 rounded-xl shadow-md">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" onClick={onReset} aria-label="Reset">
                <RotateCcw />
              </Button>
            }
          />
          <TooltipContent>Reset</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrev}
                disabled={currentStep === 0}
                aria-label="Previous step"
              >
                <SkipBack />
              </Button>
            }
          />
          <TooltipContent>Previous step</TooltipContent>
        </Tooltip>

        <Button
          onClick={isPlaying ? onPause : onPlay}
          size="lg"
          className={cn(
            'gap-2 font-semibold shadow-md',
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          )}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause /> : <Play />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                disabled={currentStep >= totalSteps - 1}
                aria-label="Next step"
              >
                <SkipForward />
              </Button>
            }
          />
          <TooltipContent>Next step</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex-1 min-w-[200px] flex items-center gap-3">
        <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
          {currentStep + 1} / {totalSteps}
        </span>
        <Slider
          min={0}
          max={Math.max(0, totalSteps - 1)}
          step={1}
          value={[currentStep]}
          onValueChange={(v) => onStepSelect(Array.isArray(v) ? v[0] : v)}
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
        <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
        {speeds.map((s) => (
          <Button
            key={s.label}
            variant="ghost"
            size="sm"
            onClick={() => onSpeedChange(s.ms)}
            className={cn(
              'h-6 px-2 text-xs',
              speedMs === s.ms ? 'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold' : 'text-slate-400'
            )}
          >
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
