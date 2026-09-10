import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlaybackEngine } from '../engine';

describe('PlaybackEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const dummySteps = [
    { stepIndex: 0, title: 'Step 0', state: {}, codeLines: [1], why: 'Why 0' },
    { stepIndex: 1, title: 'Step 1', state: {}, codeLines: [2], why: 'Why 1' },
    { stepIndex: 2, title: 'Step 2', state: {}, codeLines: [3], why: 'Why 2' },
  ];

  it('initializes at step 0 and navigates forward and backward', () => {
    const engine = new PlaybackEngine(dummySteps);
    expect(engine.getCurrentStepIndex()).toBe(0);

    engine.goNext();
    expect(engine.getCurrentStepIndex()).toBe(1);

    engine.goNext();
    expect(engine.getCurrentStepIndex()).toBe(2);

    // Clamps at end
    engine.goNext();
    expect(engine.getCurrentStepIndex()).toBe(2);

    engine.goPrev();
    expect(engine.getCurrentStepIndex()).toBe(1);

    engine.reset();
    expect(engine.getCurrentStepIndex()).toBe(0);
  });

  it('supports goToStep with bounds clamping', () => {
    const engine = new PlaybackEngine(dummySteps);
    engine.goToStep(2);
    expect(engine.getCurrentStepIndex()).toBe(2);

    engine.goToStep(100);
    expect(engine.getCurrentStepIndex()).toBe(2);

    engine.goToStep(-10);
    expect(engine.getCurrentStepIndex()).toBe(0);
  });

  it('supports autoplay with configurable step duration', () => {
    const engine = new PlaybackEngine(dummySteps, { defaultSpeedMs: 1000 });
    const listener = vi.fn();
    engine.subscribe(listener);

    engine.play();
    expect(engine.isPlaying()).toBe(true);

    vi.advanceTimersByTime(1000);
    expect(engine.getCurrentStepIndex()).toBe(1);

    vi.advanceTimersByTime(1000);
    expect(engine.getCurrentStepIndex()).toBe(2);

    // Reaches end -> automatically pauses
    vi.advanceTimersByTime(1000);
    expect(engine.isPlaying()).toBe(false);
  });
});
