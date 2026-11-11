import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, X, Play, Cpu, ShieldCheck } from 'lucide-react';

interface PythonCliModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCliModal: React.FC<PythonCliModalProps> = ({ isOpen, onClose }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleDownloadScript = () => {
    window.open('/public/assets/aistudio/clipper_bb0d75b4.py', '_blank');
  };

  const handleDownloadRequirements = () => {
    window.open('/public/assets/aistudio/requirements_090071e9.txt', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ClipForge Python Engine</h3>
              <p className="text-xs text-slate-400">
                Run unlimited 4K clipping locally on your machine with Faster-Whisper & FFmpeg
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
            <Cpu className="w-4 h-4 text-purple-400 mb-1" />
            <div className="font-semibold text-slate-200">Local Whisper GPU/CPU</div>
            <div className="text-[11px] text-slate-400">Zero cloud audio costs</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
            <div className="font-semibold text-slate-200">No Watermarks</div>
            <div className="text-[11px] text-slate-400">100% Free and unmetered</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
            <Play className="w-4 h-4 text-amber-400 mb-1" />
            <div className="font-semibold text-slate-200">Face-Following Crop</div>
            <div className="text-[11px] text-slate-400">OpenCV Haar tracking</div>
          </div>
        </div>

        {/* Quick Steps */}
        <div className="space-y-4 my-4">
          {/* Step 1 */}
          <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-200">
                1. Install Python packages (faster-whisper, yt-dlp, opencv)
              </span>
              <button
                onClick={() => copyToClipboard('pip install -r requirements.txt', 1)}
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                {copiedStep === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedStep === 1 ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <code className="block bg-slate-900 p-2 rounded text-xs font-mono text-emerald-400">
              pip install faster-whisper yt-dlp opencv-python-headless
            </code>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-200">
                2. Run ClipForge with your YouTube URL or MP4
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    'python clipper.py "https://www.youtube.com/watch?v=..." -n 5 --min 25 --max 60',
                    2
                  )
                }
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                {copiedStep === 2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedStep === 2 ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <code className="block bg-slate-900 p-2 rounded text-xs font-mono text-emerald-400">
              python clipper.py "https://www.youtube.com/watch?v=..." -n 5 --min 25 --max 60
            </code>
          </div>
        </div>

        {/* Download Buttons for Uploaded Files */}
        <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href="/assets/aistudio/clipper_bb0d75b4.py"
              download="clipper.py"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download clipper.py</span>
            </a>

            <a
              href="/assets/aistudio/requirements_090071e9.txt"
              download="requirements.txt"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download requirements.txt</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
