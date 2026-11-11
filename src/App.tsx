import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Calendar,
  Layers,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  Play,
  Type,
  Plus,
  Link as LinkIcon,
  ArrowRight,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Header } from './components/Header';
import { IngestionView } from './components/IngestionView';
import { ProcessingModal } from './components/ProcessingModal';
import { ClipsList } from './components/ClipsList';
import { VideoPlayer916 } from './components/VideoPlayer916';
import { PublisherPanel } from './components/PublisherPanel';
import { ViralityAnalysisPanel } from './components/ViralityAnalysisPanel';
import { TranscriptEditor } from './components/TranscriptEditor';
import { ExportModal } from './components/ExportModal';
import { PythonCliModal } from './components/PythonCliModal';
import { SoloOperatorGuideModal } from './components/SoloOperatorGuideModal';
import { SAMPLE_PROJECTS, DEFAULT_CAPTION_STYLE } from './data/sampleVideos';
import { convertUrlToViralProject } from './utils/viralityConverter';
import {
  VideoProject,
  Clip,
  CaptionPreset,
  LayoutMode,
  CaptionStyleConfig,
  WordTimestamp,
  SocialPublishStatus,
} from './types/clip';

export default function App() {
  // Main Project State (default to Huberman Lab sample)
  const [project, setProject] = useState<VideoProject | null>(SAMPLE_PROJECTS[0]);
  const [selectedClipId, setSelectedClipId] = useState<string>(SAMPLE_PROJECTS[0].clips[0].id);

  // App Navigation
  const [activeTab, setActiveTab] = useState<'studio' | 'scheduler' | 'presets'>('studio');
  const [rightPanelTab, setRightPanelTab] = useState<'publisher' | 'virality' | 'transcript'>('publisher');
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'duration'>('score');

  // Quick link input inside Studio header
  const [studioQuickUrl, setStudioQuickUrl] = useState('');

  // Modals
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingVideoTitle, setPendingVideoTitle] = useState('');
  const [showCliModal, setShowCliModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(120);

  const activeClip = project?.clips.find((c) => c.id === selectedClipId) || project?.clips[0];

  // Handler for analyzing new video (YouTube URL or Sample or Upload)
  const handleAnalyze = async (options: {
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
  }) => {
    const displayTitle = options.customTitle || options.url;
    setPendingVideoTitle(displayTitle);
    setIsProcessing(true);

    // 1. If user chose a pre-loaded sample
    if (options.sampleId) {
      const sample = SAMPLE_PROJECTS.find((s) => s.id === options.sampleId);
      if (sample) {
        setProject(sample);
        setSelectedClipId(sample.clips[0].id);
        setPendingVideoTitle(sample.title);
        setCreditsRemaining((prev) => Math.max(0, prev - 15));
        return;
      }
    }

    // 2. If user uploaded a local video file
    if (options.customVideoSrc) {
      const localProject = convertUrlToViralProject({
        url: options.url,
        customTitle: options.customTitle,
        customAuthor: options.customAuthor || 'Uploaded Creator',
        customVideoSrc: options.customVideoSrc,
        minDuration: options.minDuration,
        maxDuration: options.maxDuration,
        preset: options.captionPreset,
        layout: options.layout,
        customTopic: options.customTopic,
      });
      setProject(localProject);
      setSelectedClipId(localProject.clips[0].id);
      setPendingVideoTitle(localProject.title);
      setCreditsRemaining((prev) => Math.max(0, prev - 15));
      return;
    }

    // 3. Ingest YouTube URL: try server analysis first
    try {
      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          url: options.url,
          targetClipCount: 4,
          minDuration: options.minDuration,
          maxDuration: options.maxDuration,
          preset: options.captionPreset,
          customTopic: options.customTopic,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.project && data.project.clips?.length > 0) {
          setProject(data.project);
          setSelectedClipId(data.project.clips[0].id);
          setPendingVideoTitle(data.project.title);
          setCreditsRemaining((prev) => Math.max(0, prev - 15));
          return;
        }
      }
    } catch {
      // Server latency or offline; fall back seamlessly to client virality converter
    }

    // 4. Guaranteed instant, tailored conversion
    const fallbackProject = convertUrlToViralProject({
      url: options.url,
      customTitle: options.customTitle,
      customAuthor: options.customAuthor,
      customVideoSrc: options.customVideoSrc,
      minDuration: options.minDuration,
      maxDuration: options.maxDuration,
      preset: options.captionPreset,
      layout: options.layout,
      customTopic: options.customTopic,
    });
    setProject(fallbackProject);
    setSelectedClipId(fallbackProject.clips[0].id);
    setPendingVideoTitle(fallbackProject.title);
    setCreditsRemaining((prev) => Math.max(0, prev - 15));
  };

  const handleStudioQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioQuickUrl.trim()) return;
    handleAnalyze({
      url: studioQuickUrl.trim(),
      minDuration: 20,
      maxDuration: 60,
      layout: 'face',
      captionPreset: 'opus-classic',
      customTopic: '',
    });
    setStudioQuickUrl('');
  };

  // Trimming / Time updates
  const handleUpdateClipTime = (clipId: string, newStart: number, newEnd: number) => {
    if (!project) return;
    setProject({
      ...project,
      clips: project.clips.map((c) =>
        c.id === clipId
          ? {
              ...c,
              start: Number(newStart.toFixed(2)),
              end: Number(newEnd.toFixed(2)),
              duration: Number((newEnd - newStart).toFixed(2)),
            }
          : c
      ),
    });
  };

  // Caption style updates
  const handleUpdateCaptionStyle = (clipId: string, style: Partial<CaptionStyleConfig>) => {
    if (!project) return;
    setProject({
      ...project,
      clips: project.clips.map((c) =>
        c.id === clipId
          ? {
              ...c,
              captionStyle: { ...c.captionStyle, ...style },
            }
          : c
      ),
    });
  };

  // Layout mode updates
  const handleUpdateLayout = (clipId: string, layout: LayoutMode) => {
    if (!project) return;
    setProject({
      ...project,
      clips: project.clips.map((c) => (c.id === clipId ? { ...c, layout } : c)),
    });
  };

  // Transcript word updates
  const handleUpdateWords = (newWords: WordTimestamp[]) => {
    if (!project || !activeClip) return;
    const updatedSegments = activeClip.segments.map((seg) => ({
      ...seg,
      words: newWords.filter((w) => w.start >= seg.start - 0.2 && w.end <= seg.end + 0.5),
    }));

    setProject({
      ...project,
      clips: project.clips.map((c) =>
        c.id === activeClip.id ? { ...c, segments: updatedSegments } : c
      ),
    });
  };

  // Social publishing updates
  const handleUpdateSocialStatus = (
    clipId: string,
    platform: 'tiktok' | 'reels' | 'shorts',
    status: Partial<SocialPublishStatus>
  ) => {
    if (!project) return;
    setProject({
      ...project,
      clips: project.clips.map((c) =>
        c.id === clipId
          ? {
              ...c,
              publishing: {
                ...c.publishing,
                [platform]: {
                  ...c.publishing[platform],
                  ...status,
                },
              },
            }
          : c
      ),
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Studio Header */}
      <Header
        onNewVideo={() => setIsIngestionOpen(true)}
        onOpenCliModal={() => setShowCliModal(true)}
        onOpenGuideModal={() => setShowGuideModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        creditsRemaining={creditsRemaining}
      />

      {/* Main Container Viewport */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* VIEW 1: Video Ingestion / New Project Hero */}
        {isIngestionOpen || !project ? (
          <div className="flex-1 overflow-y-auto">
            {project && (
              <div className="max-w-5xl mx-auto px-4 pt-4">
                <button
                  onClick={() => setIsIngestionOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to current project</span>
                </button>
              </div>
            )}
            <IngestionView onAnalyze={handleAnalyze} isLoading={isProcessing} />
          </div>
        ) : activeTab === 'scheduler' ? (
          /* VIEW 2: Auto-Scheduler Queue View */
          <div className="max-w-5xl mx-auto w-full p-6 lg:p-8 flex-1 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-white">
                  Multi-Platform Auto-Scheduler
                </h2>
                <p className="text-xs text-slate-400">
                  Automated distribution queue for TikTok, Instagram Reels, and YouTube Shorts.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('studio')}
                className="px-3.5 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                Back to Studio Editor
              </button>
            </div>

            {/* Scheduled Posts Timeline */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Upcoming Publishing Queue (Next 48 Hours)</span>
              </h3>

              <div className="space-y-3">
                {project.clips.map((clip, index) => (
                  <div
                    key={clip.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-950/50 border border-purple-500/30 flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white">{clip.title}</span>
                          <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            {clip.viralityScore}/100 Virality
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                          "{clip.hook}"
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                          <span className="text-purple-400 font-semibold">
                            TikTok · IG Reels · YT Shorts
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {index === 0
                              ? 'Today at 6:30 PM (Peak Retention)'
                              : `Tomorrow at ${index * 3 + 1}:00 PM`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Queued
                      </span>
                      <button
                        onClick={() => {
                          setSelectedClipId(clip.id);
                          setActiveTab('studio');
                        }}
                        className="px-3 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'presets' ? (
          /* VIEW 3: Caption Presets & Styling Gallery */
          <div className="max-w-5xl mx-auto w-full p-6 lg:p-8 flex-1 overflow-y-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Karaoke Subtitle Styles & Presets
              </h2>
              <p className="text-xs text-slate-400">
                Industry-tested viral caption animations inspired by Opus Clip, MrBeast, and Alex Hormozi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  preset: 'opus-classic',
                  name: 'Opus Classic',
                  desc: 'Signature vibrant yellow highlight on active word with deep drop shadows.',
                  color: '#FACC15',
                },
                {
                  preset: 'mr-beast',
                  name: 'MrBeast Impact',
                  desc: 'High-contrast glowing lime green active word with bold heavy font.',
                  color: '#4ADE80',
                },
                {
                  preset: 'hormozi',
                  name: 'Hormozi Punch',
                  desc: 'Aggressive red highlight with all-caps emphasis on power words.',
                  color: '#F87171',
                },
                {
                  preset: 'cyber-glow',
                  name: 'Cyber Neon',
                  desc: 'Electric cyan glow popular on tech, finance, and futuristic podcasts.',
                  color: '#38BDF8',
                },
                {
                  preset: 'minimal-white',
                  name: 'Clean Editorial',
                  desc: 'Elegant pure white with subtle opacity dimming on non-active words.',
                  color: '#FFFFFF',
                },
              ].map((item) => (
                <div
                  key={item.preset}
                  onClick={() => {
                    if (activeClip) {
                      handleUpdateCaptionStyle(activeClip.id, {
                        preset: item.preset as CaptionPreset,
                        highlightColor: item.color,
                      });
                      setActiveTab('studio');
                    }
                  }}
                  className="bg-slate-900 rounded-xl border border-slate-800 hover:border-purple-500/60 p-5 cursor-pointer transition-all group"
                >
                  <div className="h-28 bg-black rounded-lg flex items-center justify-center p-3 mb-3 border border-slate-800">
                    <span
                      className="font-caption font-extrabold text-xl text-center"
                      style={{ color: item.color }}
                    >
                      VIRAL <span className="text-white">SHORT</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-purple-300">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {item.desc}
                  </p>
                  <button className="text-xs font-semibold text-purple-400 group-hover:underline">
                    Apply to Active Clip →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW 4: Core Opus Clip 3-Column Studio */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Studio Top Control Strip: Current Project info + Quick URL Converter */}
            <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                  <img
                    src={project.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-100 truncate">
                      {project.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold shrink-0">
                      {project.clips.length} Viral Shorts Converted
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    Channel: <span className="text-slate-300">{project.author}</span> · {project.url}
                  </div>
                </div>
              </div>

              {/* Quick YouTube input right in Studio header */}
              <form
                onSubmit={handleStudioQuickSubmit}
                className="flex items-center gap-1.5 sm:max-w-md w-full shrink-0"
              >
                <div className="relative flex-1">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studioQuickUrl}
                    onChange={(e) => setStudioQuickUrl(e.target.value)}
                    placeholder="Paste another YouTube URL..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!studioQuickUrl.trim() || isProcessing}
                  className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Convert</span>
                </button>
              </form>
            </div>

            {/* 3-Column Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
              {/* COLUMN 1: Ranked Clips List (3 cols on desktop) */}
              <div className="lg:col-span-3 h-full overflow-hidden border-b lg:border-b-0 border-slate-800">
                <ClipsList
                  clips={project.clips}
                  selectedClipId={selectedClipId}
                  onSelectClip={(id) => setSelectedClipId(id)}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </div>

              {/* COLUMN 2: Center Interactive 9:16 Video Player & Trimmer (5 cols) */}
              <div className="lg:col-span-5 h-full overflow-hidden border-b lg:border-b-0 border-slate-800 flex flex-col">
                {activeClip ? (
                  <VideoPlayer916
                    clip={activeClip}
                    videoSrc={project.videoSrc}
                    projectThumbnail={project.thumbnail}
                    author={project.author}
                    youtubeId={project.youtubeId}
                    isYouTube={project.isYouTube}
                    onUpdateClipTime={handleUpdateClipTime}
                    onUpdateCaptionStyle={handleUpdateCaptionStyle}
                    onUpdateLayout={handleUpdateLayout}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                    Select a clip to preview
                  </div>
                )}
              </div>

              {/* COLUMN 3: Right Panel - Auto-Publisher, Virality Insights & Transcript (4 cols) */}
              <div className="lg:col-span-4 h-full flex flex-col bg-slate-900/40 border-l border-slate-800/80">
                {/* Tab Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 p-2 shrink-0 bg-slate-950/60">
                  <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg">
                    <button
                      onClick={() => setRightPanelTab('publisher')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        rightPanelTab === 'publisher'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Auto-Post
                    </button>
                    <button
                      onClick={() => setRightPanelTab('virality')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        rightPanelTab === 'virality'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Virality AI
                    </button>
                    <button
                      onClick={() => setRightPanelTab('transcript')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        rightPanelTab === 'transcript'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Transcript
                    </button>
                  </div>

                  <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700/80 transition-colors"
                    title="Download MP4, ASS, or SRT"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-400" />
                    <span>Export</span>
                  </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-hidden">
                  {activeClip && rightPanelTab === 'publisher' && (
                    <PublisherPanel
                      clip={activeClip}
                      onUpdateSocialStatus={handleUpdateSocialStatus}
                    />
                  )}
                  {activeClip && rightPanelTab === 'virality' && (
                    <ViralityAnalysisPanel clip={activeClip} />
                  )}
                  {activeClip && rightPanelTab === 'transcript' && (
                    <TranscriptEditor
                      clip={activeClip}
                      onUpdateWords={handleUpdateWords}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <ProcessingModal
        isOpen={isProcessing}
        onComplete={() => {
          setIsProcessing(false);
          setIsIngestionOpen(false);
          setActiveTab('studio');
        }}
        videoTitle={pendingVideoTitle}
      />

      {activeClip && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          clip={activeClip}
        />
      )}

      <PythonCliModal
        isOpen={showCliModal}
        onClose={() => setShowCliModal(false)}
      />

      <SoloOperatorGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
}
