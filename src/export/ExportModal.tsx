import { useState } from 'react';
import { Download, Film, CheckCircle2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

export function ExportModal({ isOpen, onClose, canvasRef, engine, algoTitle, aspectRatio }: ExportModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepCount, setStepCount] = useState({ current: 0, total: 0 });
  const [isFinished, setIsFinished] = useState(false);

  const handleStartExport = async () => {
    if (!canvasRef.current) return;
    setIsRecording(true);
    setProgress(0);
    setIsFinished(false);

    const safeTitle = algoTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeTitle}-${aspectRatio === '9:16' ? 'reel' : 'widescreen'}.webm`;

    try {
      const audioMgr = createAudioSfxManager();

      const canvas = canvasRef.current;
      const videoStream = canvas.captureStream(30);
      const audioStream = audioMgr.getAudioStream();

      const combinedStream = new MediaStream([
        ...videoStream.getTracks(),
        ...audioStream.getAudioTracks(),
      ]);

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
        setIsFinished(true);
      };

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
          audioMgr.playCompare();

          setStepCount({ current: currentStep, total: totalSteps });
          setProgress(Math.round((currentStep / totalSteps) * 100));
        } else {
          clearInterval(interval);
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isRecording && onClose()}>
      <DialogContent className="max-w-md bg-slate-900 border border-slate-800 text-slate-100" showCloseButton={!isRecording}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-slate-100">Export Animation</DialogTitle>
              <DialogDescription className="text-slate-400">
                Format: {aspectRatio === '9:16' ? '9:16 Vertical Reel' : '16:9 Widescreen'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2 text-xs text-slate-300">
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
          <div className="space-y-2">
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
          <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Video successfully generated and downloaded!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isRecording}>
            Cancel
          </Button>
          <Button
            onClick={handleStartExport}
            disabled={isRecording}
            className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
          >
            {isRecording ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Recording Video...</span>
              </>
            ) : (
              <>
                <Download />
                <span>Start Export</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
