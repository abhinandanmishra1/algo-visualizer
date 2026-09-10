import { AlgoRenderer, RenderOptions } from '../renderers/types';
import { setupCanvas, drawBurnInCaption } from '../renderers/canvasUtils';

export interface OffscreenRenderContext {
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

/**
 * Creates a detached offscreen canvas at fixed high-resolution dimensions.
 * Portrait (9:16): 1080×1920
 * Landscape (16:9): 1920×1080
 *
 * @param aspectRatio The desired aspect ratio ('16:9' for landscape, '9:16' for portrait)
 * @returns OffscreenRenderContext with canvas and rendering context
 */
export function createOffscreenRenderContext(
  aspectRatio: '16:9' | '9:16' = '16:9'
): OffscreenRenderContext {
  // Determine fixed dimensions based on aspect ratio
  const dimensions = aspectRatio === '16:9' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 };

  // Create detached canvas element (not in DOM)
  const canvas = document.createElement('canvas');

  // Use device pixel ratio for high-res rendering (typically 1 for offscreen)
  const dpr = 1;

  // Setup canvas with proper scaling
  const ctx = setupCanvas(canvas, dimensions.width, dimensions.height, dpr);
  if (!ctx) {
    throw new Error('Failed to create canvas rendering context');
  }

  return {
    width: dimensions.width,
    height: dimensions.height,
    canvas,
    ctx,
  };
}

/**
 * Renders a single frame of an algorithm visualization to the offscreen canvas.
 * This bypasses the on-screen canvas and renders directly at the fixed high resolution.
 *
 * @param renderCtx The offscreen render context
 * @param renderer The algorithm renderer to use
 * @param data The algorithm data to visualize
 * @param state The current algorithm state
 * @param options Additional rendering options (theme, burnInCaption, etc.)
 */
export function renderFrameToOffscreen(
  renderCtx: OffscreenRenderContext,
  renderer: AlgoRenderer,
  data: any,
  state: any,
  options?: Partial<RenderOptions>
): void {
  const { ctx, width, height } = renderCtx;

  // Clear canvas
  ctx.fillStyle = options?.theme === 'light' ? '#ffffff' : '#0f172a';
  ctx.fillRect(0, 0, width, height);

  // Build complete render options
  const renderOptions: RenderOptions = {
    width,
    height,
    dpr: 1,
    aspectRatio: width > height ? '16:9' : '9:16',
    theme: options?.theme || 'dark',
    burnInCaption: options?.burnInCaption,
    ...options,
  };

  // Render the algorithm visualization
  renderer.render(ctx, data, state, renderOptions);

  // Draw burn-in caption if provided (e.g., step number or description)
  if (options?.burnInCaption) {
    drawBurnInCaption(ctx, options.burnInCaption, width, height);
  }
}

/**
 * Utility: Returns canvas stream for recording at the offscreen resolution.
 * Use this instead of on-screen canvas.captureStream() for consistent high-res exports.
 *
 * @param canvas The offscreen canvas to capture
 * @param fps Frames per second for the stream
 * @returns MediaStream for recording
 */
export function getOffscreenCanvasStream(canvas: HTMLCanvasElement, fps: number = 30): MediaStream {
  return canvas.captureStream(fps);
}
