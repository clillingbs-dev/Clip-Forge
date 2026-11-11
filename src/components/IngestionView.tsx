import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Sparkles,
  SlidersHorizontal,
  Youtube,
  Play,
  Flame,
  Clock,
  Layout,
  Type,
  Check,
  ArrowRight,
  FileVideo,
  Radio,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CaptionPreset, LayoutMode } from '../types/clip';
import { SAMPLE_PROJECTS } from '../data/sampleVideos';

interface IngestionViewProps {
  onAnalyze: (options: {
    url: string;
    sampleId?: string;
    customTitle?: string;
    customAuthor?: string;
    customVideoSrc?: string;
    minDuration: number;
    maxDuration: number;
    layout: LayoutMode;
    captionPreset: CaptionPreset;
    customTopic: string;
  }) => void;
  isLoading: boolean;
}

export const IngestionView: React.FC<IngestionViewProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Advanced options
  const [durationRange, setDurationRange] = useState<'15-30' | '30-60' | '60-90'>('30-60');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('face');
  const [captionPreset, setCaptionPreset] = useState<CaptionPreset>('opus-classic');
  const [customTopic, setCustomTopic] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      // Ignore clipboard read permission errors
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const [min, max] = durationRange.split('-').map(Number);
    onAnalyze({
      url: url.trim(),
      minDuration: min,
      maxDuration: max,
      layout: layoutMode,
      captionPreset,
      customTopic,
    });
  };

  const handleFileUpload = (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    const cleanedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const [min, max] = durationRange.split('-').map(Number);
    onAnalyze({
      url: file.name,
      customTitle: cleanedTitle,
      customAuthor: 'Uploaded Local Video',
      customVideoSrc: blobUrl,
      minDuration: min,
      maxDuration: max,
      layout: layoutMode,
      captionPreset,
      customTopic,
    });
  };

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_PROJECTS.find(s => s.id === sampleId);
    if (!sample) return;
    const [min, max] = durationRange.split('-').map(Number);
    onAnalyze({
      url: sample.url,
      sampleId: sample.id,
      minDuration: min,
      maxDuration: max,
      layout: layoutMode,
      captionPreset,
      customTopic,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Opus Clip 3.0 Virality Engine · AI Face-Track 9:16</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight leading-tight mb-4">
          Turn 1 Long Video Into <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            10 Viral Shorts in 1 Click
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Drop any YouTube podcast, interview, or video URL. Our AI isolates viral hooks, auto-reframes speakers into 9:16 vertical video, and burns dynamic karaoke captions for TikTok, Reels & Shorts.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-4 sm:p-6 mb-8 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 mb-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInputMode('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                inputMode === 'url'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube Video URL</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode('upload')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                inputMode === 'upload'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileVideo className="w-3.5 h-3.5 text-blue-400" />
              <span>Upload MP4 / MOV</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Clip Settings</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {inputMode === 'url' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)"
                  className="w-full pl-10 pr-20 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-medium bg-slate-800 text-slate-300 hover:text-white rounded-md transition-colors"
                >
                  Paste
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isLoading ? 'Processing Video...' : 'Get Clips in 1 Click'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Quick Test:</span>
                {[
                  {
                    label: '🧠 Huberman Dopamine',
                    url: 'https://www.youtube.com/watch?v=QmOF0crdyRU',
                  },
                  {
                    label: '💼 Diary of a CEO (Bartlett)',
                    url: 'https://www.youtube.com/watch?v=0kL_sY2mF2M',
                  },
                  {
                    label: '🤖 Lex Fridman AI',
                    url: 'https://www.youtube.com/watch?v=V-_O7nl0Ii0',
                  },
                  {
                    label: '🔥 Joe Rogan Experience',
                    url: 'https://www.youtube.com/watch?v=4T_yG1eG550',
                  },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setUrl(chip.url)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 hover:border-purple-500/40 transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </form>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors bg-slate-950/40 cursor-pointer ${
                isDragging ? 'border-purple-500 bg-purple-950/20' : 'border-slate-800 hover:border-purple-500/50'
              }`}
            >
              <FileVideo className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Drag and drop your long video here</h3>
              <p className="text-xs text-slate-500 mb-4">Supports MP4, MOV, WEBM (1080p recommended, face-tracking enabled)</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg cursor-pointer transition-colors shadow">
                Browse Video Files
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          )}

        {/* Collapsible Advanced Settings */}
        {showAdvanced && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
            {/* Duration setting */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Preferred Clip Length
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                {(['15-30', '30-60', '60-90'] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setDurationRange(range)}
                    className={`py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                      durationRange === range
                        ? 'bg-purple-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {range}s
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Setting */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Layout className="w-3.5 h-3.5 text-indigo-400" />
                Auto-Reframe Layout
              </label>
              <select
                value={layoutMode}
                onChange={(e) => setLayoutMode(e.target.value as LayoutMode)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="face">AI Face-Tracking 9:16 (Auto Crop)</option>
                <option value="split">Split-Screen (Top & Bottom Speakers)</option>
                <option value="fit">Fit on Blurred Background</option>
              </select>
            </div>

            {/* Caption Preset Setting */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                Karaoke Subtitle Preset
              </label>
              <select
                value={captionPreset}
                onChange={(e) => setCaptionPreset(e.target.value as CaptionPreset)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="opus-classic">Opus Classic (Yellow Active Word)</option>
                <option value="mr-beast">MrBeast Impact (Green Glow)</option>
                <option value="hormozi">Hormozi Punch (Red Emphasis)</option>
                <option value="cyber-glow">Cyber Neon (Electric Cyan)</option>
                <option value="minimal-white">Minimalist Clean White</option>
              </select>
            </div>

            {/* Custom Hook Topic */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                Virality Keyword Filter
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. dopamine, habits, money"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 placeholder-slate-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick Try Sample Podcasts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Or test immediately with trending podcast samples</span>
          </div>
          <span className="text-xs text-slate-500">100% playable & pre-transcribed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAMPLE_PROJECTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleSelectSample(sample.id)}
              className="group relative bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800/90 hover:border-purple-500/50 p-4 transition-all duration-200 cursor-pointer shadow-md flex items-start gap-3.5"
            >
              <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                <img
                  src={sample.thumbnail}
                  alt={sample.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 rounded text-[9px] font-mono-num text-slate-300">
                  03:00
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-purple-400 mb-0.5 truncate">
                  {sample.author}
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-2 leading-snug mb-1.5">
                  {sample.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                    <Flame className="w-3 h-3" /> {sample.clips.length} Viral Clips Ready
                  </span>
                  <span>·</span>
                  <span className="text-slate-400">98 Virality Score</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Value Props Banner */}
      <div className="mt-12 pt-8 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">AI Virality Scoring</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates hook velocity, curiosity gaps, and retention drop-offs so you only post guaranteed winners.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2.5">
            <Layout className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">Smart Face Re-Centering</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Smooth face tracking keeps speakers perfectly in frame for 9:16 mobile feeds with zero awkward cutoffs.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2.5">
            <Type className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">Karaoke Word Highlight</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bouncy synchronized word-by-word captions in Opus Clip and Hormozi styles proven to increase watch time by 150%.
          </p>
        </div>
      </div>
    </div>
  );
};
