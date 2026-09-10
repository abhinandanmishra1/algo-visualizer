import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { AlgoRenderer, RenderOptions } from '../renderers/types';
import { setupCanvas } from '../renderers/canvasUtils';

interface CanvasVisualizerProps {
  renderer: AlgoRenderer;
  data: any;
  state: any;
  aspectRatio?: '16:9' | '9:16';
  burnInCaption?: string;
  className?: string;
}

export const CanvasVisualizer = forwardRef<HTMLCanvasElement, CanvasVisualizerProps>(
  (
    {
      renderer,
      data,
      state,
      aspectRatio = '16:9',
      burnInCaption,
      className = '',
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => canvasRef.current!);

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const renderCanvas = () => {
        const rect = container.getBoundingClientRect();
        const width = Math.max(300, rect.width);
        const height = Math.max(200, rect.height);
        const dpr = window.devicePixelRatio || 1;

        const ctx = setupCanvas(canvas, width, height, dpr);

        const options: RenderOptions = {
          width,
          height,
          dpr,
          aspectRatio,
          burnInCaption,
        };

        renderer.render(ctx, data, state, options);
      };

      renderCanvas();

      const observer = new ResizeObserver(() => {
        renderCanvas();
      });

      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }, [renderer, data, state, aspectRatio, burnInCaption]);

    return (
      <div
        ref={containerRef}
        className={`w-full h-full min-h-[300px] relative overflow-hidden bg-slate-950 rounded-xl border border-slate-800 ${className}`}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    );
  }
);

CanvasVisualizer.displayName = 'CanvasVisualizer';
