import { PlaybackEngine } from '../engine/engine';

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
