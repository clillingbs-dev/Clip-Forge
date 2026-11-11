import React from 'react';
import { Scissors, Sparkles, Terminal, RefreshCw, Zap, UploadCloud, Share2 } from 'lucide-react';

interface HeaderProps {
  onNewVideo: () => void;
  onOpenCliModal: () => void;
  onOpenGuideModal: () => void;
  activeTab: 'studio' | 'scheduler' | 'presets';
  setActiveTab: (tab: 'studio' | 'scheduler' | 'presets') => void;
  creditsRemaining: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewVideo,
  onOpenCliModal,
  onOpenGuideModal,
  activeTab,
  setActiveTab,
  creditsRemaining,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-[1px] flex items-center justify-center shadow-lg shadow-purple-950/40">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Scissors className="w-4 h-4 text-purple-400 transform -rotate-45" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-1.5">
              OpusClip <span className="text-purple-400">AI</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Sparkles className="w-3 h-3 text-purple-400" /> Viral Pro
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800/70">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'studio'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clips Studio
          </button>
          <button
            onClick={() => setActiveTab('scheduler')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'scheduler'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Auto-Scheduler
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'presets'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Caption Presets
          </button>
        </nav>

        {/* Action Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono-num font-semibold text-slate-100">{creditsRemaining}</span>
            <span className="text-slate-400">mins left</span>
          </div>

          <button
            onClick={onOpenGuideModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 rounded-lg transition-colors"
            title="Solo Operator Master Blueprint"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Solo Blueprint</span>
          </button>

          <button
            onClick={onOpenCliModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800/90 border border-slate-800 rounded-lg transition-colors"
            title="Local Python CLI instructions"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Python CLI</span>
          </button>

          <button
            onClick={onNewVideo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>New Video</span>
          </button>
        </div>
      </div>
    </header>
  );
};
