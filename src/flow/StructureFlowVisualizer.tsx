import { useEffect, useMemo, useRef, useState } from 'react';
import type { RendererType } from '../types/algo';
import { getFlowModule } from './registry';
import { FlowVisualizer } from './FlowVisualizer';

interface StructureFlowVisualizerProps {
  rendererType: RendererType;
  data: any;
  state: any;
  burnInCaption?: string;
  className?: string;
}

/**
 * Interactive, on-screen visualization for every structure type. This is the
 * primary user-facing view; the canvas renderers under src/renderers/ keep
 * running in parallel (hidden) purely so the existing video export pipeline
 * (canvas.captureStream) keeps working unchanged.
 */
export function StructureFlowVisualizer({
  rendererType,
  data,
  state,
  burnInCaption,
  className,
}: StructureFlowVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 450 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { adapter, nodeTypes } = getFlowModule(rendererType);

  const { nodes, edges } = useMemo(
    () => adapter.toFlow(data, state, size.width, size.height),
    [adapter, data, state, size.width, size.height]
  );

  return (
    <div ref={containerRef} className={`w-full h-full min-h-[300px] ${className ?? ''}`}>
      <FlowVisualizer nodes={nodes} edges={edges} nodeTypes={nodeTypes} burnInCaption={burnInCaption} />
    </div>
  );
}
