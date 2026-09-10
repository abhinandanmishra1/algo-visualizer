import { useState, useEffect, useMemo, useRef } from 'react';
import { AlgoStep } from '../types/algo';
import { PlaybackEngine, EngineOptions } from './engine';

export function useAlgoEngine(steps: AlgoStep[], options?: EngineOptions) {
  const engine = useMemo(() => new PlaybackEngine(steps, options), []);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const previousStepsRef = useRef<AlgoStep[]>(steps);

  useEffect(() => {
    if (previousStepsRef.current !== steps) {
      previousStepsRef.current = steps;
      engine.setSteps(steps);
    }
  }, [steps, engine]);

  useEffect(() => {
    const unsubscribe = engine.subscribe((index, playing) => {
      setStepIndex(index);
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, [engine]);

  return {
    engine,
    currentStepIndex: stepIndex,
    currentStep: engine.getCurrentStep(),
    totalSteps: engine.getTotalSteps(),
    isPlaying,
    goNext: () => engine.goNext(),
    goPrev: () => engine.goPrev(),
    goToStep: (index: number) => engine.goToStep(index),
    play: () => engine.play(),
    pause: () => engine.pause(),
    togglePlay: () => engine.togglePlay(),
    reset: () => engine.reset(),
    setSpeed: (ms: number) => engine.setSpeed(ms),
    getSpeed: () => engine.getSpeed(),
  };
}
