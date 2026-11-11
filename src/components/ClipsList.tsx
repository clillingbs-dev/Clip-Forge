import React from 'react';
import { Flame, Clock, Sparkles, Check, Send, ChevronRight } from 'lucide-react';
import { Clip } from '../types/clip';

interface ClipsListProps {
  clips: Clip[];
  selectedClipId: string;
  onSelectClip: (clipId: string) => void;
  sortBy: 'score' | 'duration';
  setSortBy: (sort: 'score' | 'duration') => void;
}

export const ClipsList: React.FC<ClipsListProps> = ({
  clips,
  selectedClipId,
  onSelectClip,
  sortBy,
  setSortBy,
}) => {
  const sortedClips = [...clips].sort((a, b) => {
    if (sortBy === 'score') return b.viralityScore - a.viralityScore;
    return b.duration - a.duration;
  });

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/70 border-r border-slate-800/80">
      {/* Top Header of the List */}
      <div className="p-4 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Viral Clips ({clips.length})
            </h3>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Sort:</span>
            <button
              onClick={() => setSortBy(sortBy === 'score' ? 'duration' : 'score')}
              className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-2 transition-colors"
            >
              {sortBy === 'score' ? 'Virality' : 'Duration'}
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          Ranked by algorithmic retention, hook strength & shareability.
        </p>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {sortedClips.map((clip, index) => {
          const isSelected = clip.id === selectedClipId;
          const isSuperViral = clip.viralityScore >= 95;

          const anyPublished = Object.values(clip.publishing).some((p) => p.status === 'published');
          const anyScheduled = Object.values(clip.publishing).some((p) => p.status === 'scheduled');

          return (
            <div
              key={clip.id}
              onClick={() => onSelectClip(clip.id)}
              className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500/80 shadow-lg shadow-purple-950/50'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top metadata row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[11px] font-bold text-slate-500">
                    #{index + 1}
                  </span>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono-num ${
                      isSuperViral
                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                        : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                    }`}
                  >
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{clip.viralityScore}/100</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono-num text-slate-400">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{formatSeconds(clip.duration)}</span>
                </div>
              </div>

              {/* Title & Hook */}
              <h4 className="text-xs font-semibold text-slate-100 group-hover:text-purple-200 line-clamp-2 leading-snug mb-1">
                {clip.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5 italic">
                "{clip.hook}"
              </p>

              {/* Bottom platform badges & status */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      clip.publishing.tiktok.enabled ? 'bg-slate-800 text-slate-200' : 'text-slate-600'
                    }`}
                  >
                    TikTok
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      clip.publishing.reels.enabled ? 'bg-slate-800 text-slate-200' : 'text-slate-600'
                    }`}
                  >
                    Reels
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      clip.publishing.shorts.enabled ? 'bg-slate-800 text-slate-200' : 'text-slate-600'
                    }`}
                  >
                    Shorts
                  </span>
                </div>

                <div>
                  {anyPublished ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Auto-Posted
                    </span>
                  ) : anyScheduled ? (
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <Send className="w-2.5 h-2.5" /> Scheduled
                    </span>
                  ) : (
                    <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                      Edit & Post <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
