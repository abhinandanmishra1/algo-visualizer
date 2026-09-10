import { PlaybackEngine } from '../engine/engine';
import {
  createOffscreenRenderContext,
  renderFrameToOffscreen,
  getOffscreenCanvasStream,
} from './offscreenRenderer';
import { AlgoRenderer, RenderOptions } from '../renderers/types';

export function getSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') {
    return 'video/webm';
  }

  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264',
    'video/webm',
    'video/mp4',
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return 'video/webm';
}

export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

export interface RecordOptions {
  fps?: number;
  stepDurationMs?: number;
  filename?: string;
  onProgress?: (currentStep: number, totalSteps: number, percent: number) => void;
}

export async function recordCanvasAnimation(
  canvas: HTMLCanvasElement,
  engine: PlaybackEngine,
  options?: RecordOptions
): Promise<Blob> {
  const fps = options?.fps || 30;
  const stepDurationMs = options?.stepDurationMs || 1400;
  const mimeType = getSupportedMimeType();
  const totalSteps = engine.getTotalSteps();

  return new Promise((resolve, reject) => {
    try {
      const stream = canvas.captureStream(fps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 6000000,
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const fullBlob = new Blob(chunks, { type: mimeType });
        if (options?.filename) {
          downloadBlob(fullBlob, options.filename);
        }
        resolve(fullBlob);
      };

      // Reset to beginning
      engine.reset();
      mediaRecorder.start();

      let currentStep = 0;
      options?.onProgress?.(0, totalSteps, 0);

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < totalSteps) {
          engine.goToStep(currentStep);
          options?.onProgress?.(
            currentStep,
            totalSteps,
            Math.round((currentStep / totalSteps) * 100)
          );
        } else {
          clearInterval(interval);
          // Wait extra frame at the end for last step visibility
          setTimeout(() => {
            mediaRecorder.stop();
          }, 800);
        }
      }, stepDurationMs);
    } catch (err) {
      reject(err);
    }
  });
}

export interface OffscreenRecordOptions extends RecordOptions {
  aspectRatio?: '16:9' | '9:16';
  theme?: 'light' | 'dark';
}

/**
 * Records algorithm animation to high-resolution offscreen canvas.
 * Renders each frame via the provided renderer directly to offscreen context.
 *
 * @param engine PlaybackEngine with algorithm state
 * @param renderer AlgoRenderer instance for rendering visualization
 * @param data Algorithm data to visualize
 * @param steps Total number of animation steps
 * @param options Recording options (fps, stepDurationMs, aspectRatio, theme, etc.)
 * @returns Promise resolving to the recorded Blob
 */
export async function recordCanvasAnimationOffscreen(
  engine: PlaybackEngine,
  renderer: AlgoRenderer,
  data: any,
  steps: number,
  options?: OffscreenRecordOptions
): Promise<Blob> {
  const fps = options?.fps || 30;
  const stepDurationMs = options?.stepDurationMs || 1400;
  const aspectRatio = options?.aspectRatio || '16:9';
  const theme = options?.theme || 'dark';
  const mimeType = getSupportedMimeType();

  return new Promise((resolve, reject) => {
    try {
      // Create offscreen render context
      const offscreenCtx = createOffscreenRenderContext(aspectRatio);

      // Get video stream from offscreen canvas
      const stream = getOffscreenCanvasStream(offscreenCtx.canvas, fps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 6000000,
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const fullBlob = new Blob(chunks, { type: mimeType });
        if (options?.filename) {
          downloadBlob(fullBlob, options.filename);
        }
        resolve(fullBlob);
      };

      // Reset to beginning
      engine.reset();
      mediaRecorder.start();

      let currentStep = 0;
      options?.onProgress?.(0, steps, 0);

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps) {
          // Move engine to step
          engine.goToStep(currentStep);

          // Get current state from engine (assuming engine exposes state and data)
          const state = (engine as any).getState?.() || {};
          const currentData = (engine as any).getData?.() || data;

          // Render to offscreen canvas
          const renderOptions: Partial<RenderOptions> = {
            theme,
            burnInCaption: `Step ${currentStep}`,
          };
          renderFrameToOffscreen(offscreenCtx, renderer, currentData, state, renderOptions);

          options?.onProgress?.(
            currentStep,
            steps,
            Math.round((currentStep / steps) * 100)
          );
        } else {
          clearInterval(interval);
          // Wait extra frame at the end for last step visibility
          setTimeout(() => {
            mediaRecorder.stop();
          }, 800);
        }
      }, stepDurationMs);
    } catch (err) {
      reject(err);
    }
  });
}
