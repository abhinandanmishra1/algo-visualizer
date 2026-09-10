import React, { useState } from 'react';
import { Download, Film, CheckCircle2, Loader2, X } from 'lucide-react';
import { PlaybackEngine } from '../engine/engine';
import { createAudioSfxManager } from './audioSfx';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  engine: PlaybackEngine;
  algoTitle: string;
  aspectRatio: '16:9' | '9:16';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  canvasRef,
  engine,
  algoTitle,
  aspectRatio,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepCount, setStepCount] = useState({ current: 0, total: 0 });
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    if (!canvasRef.current) return;
    setIsRecording(true);
    setProgress(0);
    setIsFinished(false);

    const safeTitle = algoTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeTitle}-${aspectRatio === '9:16' ? 'reel' : 'widescreen'}.webm`;

    try {
      // Create audio SFX manager for synchronized sound effects
      const audioMgr = createAudioSfxManager();

      // Get supported mime type and prepare recording
      const canvas = canvasRef.current;
      const videoStream = canvas.captureStream(30);
      const audioStream = audioMgr.getAudioStream();

      // Composite video and audio tracks into single MediaStream
      const combinedStream = new MediaStream([
        ...videoStream.getTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      // Record combined stream (video + audio)
      const mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error(`Unsupported mime type: ${mimeType}`);
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
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
        const url = URL.createObjectURL(fullBlob);
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
      };

      // Reset engine and start recording
      engine.reset();
      mediaRecorder.start();

      let currentStep = 0;
      const totalSteps = engine.getTotalSteps();
      setStepCount({ current: 0, total: totalSteps });
      setProgress(0);

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < totalSteps) {
          engine.goToStep(currentStep);

          // Trigger audio effects based on step (approximate triggering logic)
          // This can be refined later based on engine state hints
          audioMgr.playCompare();

          setStepCount({ current: currentStep, total: totalSteps });
          setProgress(Math.round((currentStep / totalSteps) * 100));
        } else {
          clearInterval(interval);
          // Wait extra frame at the end for last step visibility
          setTimeout(() => {
            audioMgr.playComplete();
            setTimeout(() => {
              mediaRecorder.stop();
            }, 100);
          }, 800);
        }
      }, 1400);
    } catch (err) {
      console.error('Recording failed:', err);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          disabled={isRecording}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 disabled:opacity-30"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg">Export Animation</h3>
            <p className="text-xs text-slate-400">
              Format: {aspectRatio === '9:16' ? '9:16 Vertical Reel' : '16:9 Widescreen'}
            </p>
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-850 mb-6 space-y-2 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Algorithm:</span>
            <span className="font-semibold text-slate-200">{algoTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Capture Method:</span>
            <span className="font-mono text-cyan-400">canvas.captureStream() + Web Audio SFX</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Output Container:</span>
            <span className="font-mono text-emerald-400">WebM (VP9 + Opus Audio)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Pacing:</span>
            <span>1.4s per step (clean reels pace)</span>
          </div>
        </div>

        {isRecording && (
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Recording frames...</span>
              <span>
                {stepCount.current + 1} / {stepCount.total} ({progress}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {isFinished && (
          <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl mb-6 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Video successfully generated and downloaded!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isRecording}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartExport}
            disabled={isRecording}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {isRecording ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Recording Video...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Start Export</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
