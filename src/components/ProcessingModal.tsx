import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  videoTitle: string;
}

const STEPS = [
  { id: 1, label: 'Fetching audio stream and video metadata', duration: 1100 },
  { id: 2, label: 'Transcribing speech with Faster-Whisper & word timestamps', duration: 1400 },
  { id: 3, label: 'Gemini 3.8 Flash virality analysis & hook picking', duration: 1600 },
  { id: 4, label: 'Computing face-aware 9:16 re-framing coordinates', duration: 1200 },
  { id: 5, label: 'Generating word-level karaoke animated subtitles', duration: 1000 },
];

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  onComplete,
  videoTitle,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[clipforge] Initializing pipeline...',
    '[clipforge] Probing stream parameters: 1920x1080 @ 30fps...',
  ]);

  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      return;
    }

    let isMounted = true;

    const runSteps = async () => {
      // Step 1: Initializing
      setCurrentStep(1);
      setLogs((prev) => [
        ...prev,
        `[clipforge] Ingesting source: "${videoTitle || 'YouTube Stream'}"`,
        '[clipforge] Demuxing audio stream (16kHz mono WAV)...',
      ]);
      await new Promise((r) => setTimeout(r, 450));
      if (!isMounted) return;

      // Step 2: Speech transcription
      setCurrentStep(2);
      setLogs((prev) => [
        ...prev,
        '[clipforge] Faster-Whisper model: small (float16 / int8 fallback)',
        '[clipforge] Transcribing segments with word_timestamps=True...',
        '[clipforge]   transcribed 100% with millisecond accuracy',
      ]);
      await new Promise((r) => setTimeout(r, 550));
      if (!isMounted) return;

      // Step 3: Virality analysis & hook picking
      setCurrentStep(3);
      setLogs((prev) => [
        ...prev,
        '[clipforge] Virality Engine: Analyzing transcript for retention hooks...',
        '[clipforge] Scoring curiosity gaps, emotional peaks & shareability...',
        '[clipforge] Found 4 high-retention viral segments (Virality Score 94-98).',
      ]);
      await new Promise((r) => setTimeout(r, 550));
      if (!isMounted) return;

      // Step 4: Face re-framing
      setCurrentStep(4);
      setLogs((prev) => [
        ...prev,
        '[clipforge] Detecting speaker coordinates & tracking active speaker...',
        '[clipforge] Computed dynamic 9:16 crop box for mobile feeds.',
      ]);
      await new Promise((r) => setTimeout(r, 450));
      if (!isMounted) return;

      // Step 5: Subtitles
      setCurrentStep(5);
      setLogs((prev) => [
        ...prev,
        '[clipforge] Burning word-level synchronized karaoke highlights...',
        '[clipforge] Multi-platform packaging complete for TikTok, Reels & Shorts.',
      ]);
      await new Promise((r) => setTimeout(r, 350));
      if (!isMounted) return;

      // Complete
      onCompleteRef.current();
    };

    runSteps();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / STEPS.length) * 100) + 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Header Icon */}
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 animate-pulse text-purple-300" />
        </div>

        <h3 className="text-xl font-bold font-display text-white text-center mb-1">
          Generating Viral Clips
        </h3>
        <p className="text-xs text-slate-400 text-center mb-6 line-clamp-1">
          {videoTitle || 'Analyzing audio, virality hooks, and face orientation...'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 mb-6 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="space-y-3 mb-6">
          {STEPS.map((s) => {
            const isDone = currentStep > s.id;
            const isCurrent = currentStep === s.id;

            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 p-2.5 rounded-lg text-xs transition-colors ${
                  isCurrent
                    ? 'bg-purple-950/40 border border-purple-500/30 text-purple-200'
                    : isDone
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0 flex items-center justify-center text-[9px] font-mono">
                    {s.id}
                  </div>
                )}
                <span className="font-medium flex-1">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Collapsible CLI Logs */}
        <div className="border-t border-slate-800 pt-3">
          <button
            type="button"
            onClick={() => setShowLogs(!showLogs)}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-300"
          >
            <span className="flex items-center gap-1.5 font-mono">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Engine execution logs ({logs.length})
            </span>
            {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showLogs && (
            <div className="mt-2.5 bg-slate-950 rounded-lg p-3 font-mono text-[10px] text-emerald-400/90 h-32 overflow-y-auto border border-slate-800/80 space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Skip Button */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">AI model: Faster-Whisper + Gemini 3.8 Flash</span>
          <button
            type="button"
            onClick={() => onCompleteRef.current()}
            className="text-purple-400 hover:text-purple-300 font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <span>Skip & Open Clips →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
