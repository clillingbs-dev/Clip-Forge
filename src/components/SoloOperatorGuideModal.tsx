import React from 'react';
import {
  Zap,
  Rocket,
  Clock,
  CheckCircle2,
  Terminal,
  Share2,
  Flame,
  ArrowRight,
  ShieldCheck,
  Cpu,
  X,
  Copy,
  Check
} from 'lucide-react';

interface SoloOperatorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoloOperatorGuideModal: React.FC<SoloOperatorGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCmd, setCopiedCmd] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-400 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Solo Operator Blueprint: 100% Functional & Peak Efficiency
              </h3>
              <p className="text-xs text-slate-400">
                How one person can repurpose 1 podcast into 30 viral shorts every week faster than an agency.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Principles Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>15 Minutes / Episode</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cut total repurposing time from 4 hours of manual Premiere scrubbing to 15 minutes.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>$0 Marginal Cost</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Runs on your GPU/CPU with Faster-Whisper + FFmpeg with zero credit limits or watermarks.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>3x Algorithmic Reach</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Auto-formats simultaneously for TikTok, Instagram Reels, and YouTube Shorts.
            </p>
          </div>
        </div>

        {/* 5-Step Execution Protocol */}
        <div className="space-y-4 my-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            The 5-Step Peak Efficiency Protocol
          </h4>

          {/* Step 1 */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 text-[11px] flex items-center justify-center font-mono">
                  1
                </span>
                Source Ingestion: Quality Over Quantity
              </span>
              <span className="text-[10px] text-purple-400 font-mono">2 Minutes</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              Select videos with crisp vocal audio and dynamic discourse. High information density creates the highest virality scores.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>In the Web Studio: Paste the YouTube URL or drop an MP4.</li>
              <li>Or run locally via Python CLI for raw batch downloading with <code className="text-purple-300">yt-dlp</code>.</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 text-[11px] flex items-center justify-center font-mono">
                  2
                </span>
                AI Virality Hook Filtering (The 3-Second Rule)
              </span>
              <span className="text-[10px] text-purple-400 font-mono">Automatic</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              Never post clips that begin with small talk or filler ("Yeah, so um..."). The Gemini AI engine automatically scores each moment:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div>🎯 <strong>Only publish clips rated 92+ Virality Score.</strong></div>
              <div>⚡ <strong>Check the first sentence:</strong> Must be a shocking claim, contrarian take, or curiosity gap.</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 text-[11px] flex items-center justify-center font-mono">
                  3
                </span>
                Layout & Subtitle Polish (Opus Clip Standard)
              </span>
              <span className="text-[10px] text-purple-400 font-mono">3 Minutes</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              In the 9:16 smartphone player:
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside mb-3">
              <li><strong>Face Focus</strong> for single speaker videos.</li>
              <li><strong>Split Screen</strong> for dual-host podcast interviews.</li>
              <li><strong>Karaoke Subtitles</strong>: Select <em>Opus Classic</em> (Yellow) or <em>MrBeast</em> (Green) for highest retention.</li>
              <li>Toggle <strong>Safe Zone</strong> to ensure buttons and comments don't block the punchline.</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 text-[11px] flex items-center justify-center font-mono">
                  4
                </span>
                Multi-Platform Distribution (TikTok, Reels, Shorts)
              </span>
              <span className="text-[10px] text-purple-400 font-mono">2 Minutes</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              Click <strong>Auto-Post</strong> in the right panel. The system formats individual captions, viral titles, and tags:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <strong>TikTok</strong>: High emoji usage + trending sound.
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <strong>Reels</strong>: Save-worthy educational CTA.
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <strong>Shorts</strong>: Keyword-dense search title.
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 text-[11px] flex items-center justify-center font-mono">
                  5
                </span>
                Peak Local Acceleration (Batch Command)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Speed Run</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              For batch processing 10 full podcast episodes at once on your machine using your uploaded <code className="text-purple-300">clipper.py</code>:
            </p>
            <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400">
              <span className="truncate">python clipper.py "podcast.mp4" -n 8 --whisper medium --layout face</span>
              <button
                onClick={() => copy('python clipper.py "podcast.mp4" -n 8 --whisper medium --layout face', 'cmd-batch')}
                className="ml-2 text-purple-400 hover:text-purple-300 text-[11px] shrink-0 flex items-center gap-1"
              >
                {copiedCmd === 'cmd-batch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'cmd-batch' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Tip: Post 3 shorts per day (morning 8am, lunch 12pm, evening 7pm) for peak compounding reach.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            Got it, Let's Clip
          </button>
        </div>
      </div>
    </div>
  );
};
