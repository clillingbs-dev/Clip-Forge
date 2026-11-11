import React from 'react';
import { Flame, Sparkles, TrendingUp, Zap, HelpCircle, CheckCircle, BarChart3 } from 'lucide-react';
import { Clip } from '../types/clip';

interface ViralityAnalysisPanelProps {
  clip: Clip;
}

export const ViralityAnalysisPanel: React.FC<ViralityAnalysisPanelProps> = ({ clip }) => {
  const { scoreBreakdown } = clip;

  return (
    <div className="flex flex-col h-full bg-slate-900/60 p-4 space-y-4 overflow-y-auto">
      {/* Top Virality Score Card */}
      <div className="bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-950 p-4 rounded-xl border border-purple-500/30 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Virality Score</span>
            </div>
            <div className="text-3xl font-extrabold font-mono-num text-white flex items-baseline gap-1">
              <span>{clip.viralityScore}</span>
              <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {clip.viralityScore >= 95 ? 'Extremely High' : 'High Potential'}
            </span>
            <div className="text-[10px] text-slate-400 mt-1">Algorithmic Rank #1</div>
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 h-full rounded-full"
            style={{ width: `${clip.viralityScore}%` }}
          />
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Algorithmic Retention Metrics</span>
        </h4>

        <div className="space-y-2">
          {/* Hook Strength */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Hook Strength (First 3s)</span>
              <span className="font-mono-num font-bold text-purple-400">{scoreBreakdown.hookScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: `${scoreBreakdown.hookScore}%` }}
              />
            </div>
          </div>

          {/* Engagement & Pacing */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Engagement & Pacing</span>
              <span className="font-mono-num font-bold text-indigo-400">{scoreBreakdown.engagementScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1">
              <div
                className="bg-indigo-500 h-full rounded-full"
                style={{ width: `${scoreBreakdown.engagementScore}%` }}
              />
            </div>
          </div>

          {/* Trend Suitability */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Trend & Shareability</span>
              <span className="font-mono-num font-bold text-amber-400">{scoreBreakdown.trendScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${scoreBreakdown.trendScore}%` }}
              />
            </div>
          </div>

          {/* Speech Density */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Speech Density</span>
            <span className="font-mono-num font-bold text-emerald-400">
              {scoreBreakdown.speechDensity} words/sec (High Pacing)
            </span>
          </div>
        </div>
      </div>

      {/* AI Virality Rationale */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Gemini AI Virality Breakdown</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {clip.reason}
        </p>
      </div>

      {/* Hook Analysis */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Opening Hook Analysis</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs italic text-purple-200">
          "{clip.hook}"
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Stops scroll velocity by challenging conventional thinking and creating an immediate psychological curiosity gap.
        </p>
      </div>
    </div>
  );
};
