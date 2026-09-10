import React from 'react';
import { AlgoConfig, AlgoStep, AlgoPanelsConfig } from '../types/algo';
import { AlgoRenderer } from '../renderers/types';
import { CanvasVisualizer } from './CanvasVisualizer';
import { CodeWalkthrough } from './CodeWalkthrough';
import { WhyPanel } from './WhyPanel';
import { FormulaPanel } from './FormulaPanel';
import { DistanceMapPanel } from './DistanceMapPanel';

interface VisualizerLayoutProps {
  config: AlgoConfig;
  step: AlgoStep;
  renderer: AlgoRenderer;
  aspectRatio: '16:9' | '9:16';
  activePanels: AlgoPanelsConfig;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const VisualizerLayout: React.FC<VisualizerLayoutProps> = ({
  config,
  step,
  renderer,
  aspectRatio,
  activePanels,
  canvasRef,
}) => {
  const isReel = aspectRatio === '9:16';

  if (isReel) {
    // 9:16 Vertical Reel Layout
    return (
      <div className="flex flex-col items-center w-full max-w-md mx-auto gap-4">
        {/* Vertical Canvas Container with 9:16 Proportion */}
        <div className="w-full aspect-[9/16] max-h-[640px] shadow-2xl relative rounded-2xl overflow-hidden border-2 border-indigo-500/40">
          <CanvasVisualizer
            ref={canvasRef}
            renderer={renderer}
            data={config.data}
            state={step.state}
            aspectRatio="9:16"
            burnInCaption={step.caption || step.why}
            className="w-full h-full rounded-none border-none"
          />
        </div>

        {/* Compact Bottom Details for Reel View */}
        <div className="w-full space-y-3">
          {activePanels.why && <WhyPanel why={step.why} stepIndex={step.stepIndex} />}
          {activePanels.formula && <FormulaPanel formulas={step.formulaActive} />}
          {activePanels.distanceMap && <DistanceMapPanel items={step.distanceMap} />}
        </div>
      </div>
    );
  }

  // 16:9 Widescreen Standard Layout
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Grid: Canvas Illustration + Code Walkthrough */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Canvas Illustration */}
        <div className={`${activePanels.code ? 'lg:col-span-8' : 'lg:col-span-12'} aspect-video w-full min-h-[360px] shadow-xl`}>
          <CanvasVisualizer
            ref={canvasRef}
            renderer={renderer}
            data={config.data}
            state={step.state}
            aspectRatio="16:9"
            burnInCaption=""
            className="w-full h-full"
          />
        </div>

        {/* Code Walkthrough Panel */}
        {activePanels.code && (
          <div className="lg:col-span-4 min-h-[360px]">
            <CodeWalkthrough
              language={config.code.language}
              lines={config.code.lines}
              activeLines={step.codeLines}
            />
          </div>
        )}
      </div>

      {/* Bottom Row: Intuition / Formula / Distance Map Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activePanels.why && (
          <div className="w-full">
            <WhyPanel why={step.why} stepIndex={step.stepIndex} />
          </div>
        )}
        {activePanels.formula && (
          <div className="w-full">
            <FormulaPanel formulas={step.formulaActive} />
          </div>
        )}
        {activePanels.distanceMap && (
          <div className="w-full">
            <DistanceMapPanel items={step.distanceMap} />
          </div>
        )}
      </div>
    </div>
  );
};
