import { useState, useEffect, useRef, useCallback } from 'react';
import { AlgoStep } from '../types/algo';
import { PlaybackEngine, EngineOptions } from './engine';

export function useAlgoEngine(steps: AlgoStep[], options?: EngineOptions) {
  const engineRef = useRef<PlaybackEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new PlaybackEngine(steps, options);
  }
  const engine = engineRef.current;

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(engine.getSpeed());
  const previousStepsRef = useRef<AlgoStep[]>(steps);

  useEffect(() => {
    if (previousStepsRef.current !== steps) {
      previousStepsRef.current = steps;
      engine.setSteps(steps);
      setStepIndex(0);
      setIsPlaying(false);
    }
  }, [steps, engine]);

  useEffect(() => {
    const unsubscribe = engine.subscribe((index, playing) => {
      setStepIndex(index);
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, [engine]);

  const setSpeed = useCallback((ms: number) => {
    engine.setSpeed(ms);
    setSpeedState(ms);
  }, [engine]);

  return {
    engine,
    currentStepIndex: stepIndex,
    currentStep: steps[stepIndex],
    totalSteps: steps.length,
    isPlaying,
    speed,
    goNext: () => engine.goNext(),
    goPrev: () => engine.goPrev(),
    goToStep: (index: number) => engine.goToStep(index),
    play: () => engine.play(),
    pause: () => engine.pause(),
    togglePlay: () => engine.togglePlay(),
    reset: () => engine.reset(),
    setSpeed,
  };
}
