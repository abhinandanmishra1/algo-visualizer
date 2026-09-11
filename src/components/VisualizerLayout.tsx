import React from 'react';
import { AlgoConfig, AlgoStep, AlgoPanelsConfig } from '../types/algo';
import { AlgoRenderer } from '../renderers/types';
import { CanvasVisualizer } from './CanvasVisualizer';
import { StructureFlowVisualizer } from '../flow/StructureFlowVisualizer';
import { WaterContainerVisualizer } from './WaterContainerVisualizer';
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

/**
 * Renders the canvas visualizer off-screen at a fixed size purely so
 * canvas.captureStream() (used by ExportModal) keeps producing real frames —
 * the React Flow view below is what the user actually sees and interacts with.
 */
function HiddenExportCanvas({
  renderer,
  data,
  state,
  aspectRatio,
  burnInCaption,
  canvasRef,
}: {
  renderer: AlgoRenderer;
  data: any;
  state: any;
  aspectRatio: '16:9' | '9:16';
  burnInCaption?: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const width = aspectRatio === '9:16' ? 540 : 960;
  const height = aspectRatio === '9:16' ? 960 : 540;

  return (
    <div
      aria-hidden
      className="fixed pointer-events-none"
      style={{ left: -99999, top: 0, width, height }}
    >
      <CanvasVisualizer
        ref={canvasRef}
        renderer={renderer}
        data={data}
        state={state}
        aspectRatio={aspectRatio}
        burnInCaption={burnInCaption}
        className="w-full h-full"
      />
    </div>
  );
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

  // Bespoke topics (e.g. Container With Most Water) opt out of the generic
  // React Flow illustration in favor of a purpose-built visualization.
  const renderPrimaryVisual = (extraClassName: string) => {
    if (config.visualComponent === 'water-container') {
      return (
        <WaterContainerVisualizer
          elements={config.data.elements ?? []}
          state={step.state}
          className={extraClassName}
        />
      );
    }
    return (
      <StructureFlowVisualizer
        rendererType={config.renderer}
        data={config.data}
        state={step.state}
        burnInCaption={isReel ? step.caption || step.why : undefined}
        className={extraClassName}
      />
    );
  };

  const hiddenCanvas = (
    <HiddenExportCanvas
      renderer={renderer}
      data={config.data}
      state={step.state}
      aspectRatio={aspectRatio}
      burnInCaption={step.caption || step.why}
      canvasRef={canvasRef}
    />
  );

  if (isReel) {
    // 9:16 Vertical Reel Layout
    return (
      <div className="flex flex-col items-center w-full max-w-md mx-auto gap-4">
        {hiddenCanvas}
        {/* Vertical Flow Container with 9:16 Proportion */}
        <div className="w-full aspect-[9/16] max-h-[640px] shadow-2xl relative rounded-2xl overflow-hidden border-2 border-indigo-500/40">
          {renderPrimaryVisual('rounded-none border-none')}
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
      {hiddenCanvas}
      {/* Top Grid: Flow Illustration + Code Walkthrough */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Flow Illustration */}
        <div className={`${activePanels.code ? 'lg:col-span-8' : 'lg:col-span-12'} aspect-video w-full min-h-[360px] shadow-xl`}>
          {renderPrimaryVisual('')}
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
