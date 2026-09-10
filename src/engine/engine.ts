import { AlgoStep } from '../types/algo';

export type EngineListener = (stepIndex: number, isPlaying: boolean) => void;

export interface EngineOptions {
  defaultSpeedMs?: number;
  loop?: boolean;
}

export class PlaybackEngine {
  private steps: AlgoStep[];
  private currentIndex: number = 0;
  private playing: boolean = false;
  private speedMs: number = 1200;
  private loop: boolean = false;
  private timer: any = null;
  private listeners: Set<EngineListener> = new Set();

  constructor(steps: AlgoStep[], options?: EngineOptions) {
    this.steps = steps;
    if (options?.defaultSpeedMs) this.speedMs = options.defaultSpeedMs;
    if (options?.loop) this.loop = options.loop;
  }

  public setSteps(steps: AlgoStep[]): void {
    this.pause();
    this.steps = steps;
    this.currentIndex = 0;
    this.notify();
  }

  public getCurrentStepIndex(): number {
    return this.currentIndex;
  }

  public getCurrentStep(): AlgoStep | undefined {
    return this.steps[this.currentIndex];
  }

  public getTotalSteps(): number {
    return this.steps.length;
  }

  public isPlaying(): boolean {
    return this.playing;
  }

  public getSpeed(): number {
    return this.speedMs;
  }

  public setSpeed(ms: number): void {
    this.speedMs = ms;
    if (this.playing) {
      this.pause();
      this.play();
    }
  }

  public goNext(): boolean {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      this.notify();
      return true;
    } else if (this.loop) {
      this.currentIndex = 0;
      this.notify();
      return true;
    } else {
      this.pause();
      return false;
    }
  }

  public goPrev(): boolean {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.notify();
      return true;
    }
    return false;
  }

  public goToStep(index: number): void {
    const target = Math.max(0, Math.min(index, this.steps.length - 1));
    if (target !== this.currentIndex) {
      this.currentIndex = target;
      this.notify();
    }
  }

  public play(): void {
    if (this.playing) return;
    if (this.currentIndex >= this.steps.length - 1) {
      this.currentIndex = 0;
    }
    this.playing = true;
    this.notify();
    this.scheduleNext();
  }

  public pause(): void {
    if (!this.playing && !this.timer) return;
    this.playing = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public togglePlay(): void {
    if (this.playing) this.pause();
    else this.play();
  }

  public reset(): void {
    this.pause();
    this.currentIndex = 0;
    this.notify();
  }

  public subscribe(listener: EngineListener): () => void {
    this.listeners.add(listener);
    listener(this.currentIndex, this.playing);
    return () => this.listeners.delete(listener);
  }

  private scheduleNext(): void {
    if (!this.playing) return;
    this.timer = setTimeout(() => {
      const advanced = this.goNext();
      if (advanced && this.playing) {
        this.scheduleNext();
      }
    }, this.speedMs);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.currentIndex, this.playing);
    }
  }
}
