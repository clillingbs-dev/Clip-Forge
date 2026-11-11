import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Type,
  Smartphone,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  Radio,
  Mic,
  Headphones,
  Sparkles
} from 'lucide-react';
import { Clip, LayoutMode, CaptionStyleConfig, WordTimestamp } from '../types/clip';

interface VideoPlayer916Props {
  clip: Clip;
  videoSrc: string;
  projectThumbnail?: string;
  author?: string;
  youtubeId?: string;
  isYouTube?: boolean;
  onUpdateClipTime: (clipId: string, newStart: number, newEnd: number) => void;
  onUpdateCaptionStyle: (clipId: string, style: Partial<CaptionStyleConfig>) => void;
  onUpdateLayout: (clipId: string, layout: LayoutMode) => void;
}

export const VideoPlayer916: React.FC<VideoPlayer916Props> = ({
  clip,
  videoSrc,
  projectThumbnail = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
  author = 'Studio Host',
  youtubeId,
  isYouTube,
  onUpdateClipTime,
  onUpdateCaptionStyle,
  onUpdateLayout,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(clip.start);
  const [isMuted, setIsMuted] = useState(false);
  const [showSocialOverlay, setShowSocialOverlay] = useState(true);
  const [showStyleToolbar, setShowStyleToolbar] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [playerMode, setPlayerMode] = useState<'shorts' | 'youtube'>('shorts');

  // Sync video time when selected clip changes
  useEffect(() => {
    setCurrentTime(clip.start);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = clip.start;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // In some browsers autoplay without user interaction is delayed; play state remains controlled
          setIsPlaying(false);
        });
    }
  }, [clip.id, clip.start]);

  // Video timeupdate loop listener
  const handleTimeUpdate = () => {
    if (!videoRef.current || videoError) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    // Loop clip boundaries
    if (t >= clip.end || t < clip.start - 0.2) {
      videoRef.current.currentTime = clip.start;
    }
  };

  // Resilient software clock fallback: if video is paused/errored, keep the animation ticker moving smoothly
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // If video element is actively playing and not errored, let handleTimeUpdate drive time
      if (videoRef.current && !videoError && !videoRef.current.paused) {
        return;
      }

      setCurrentTime((prev) => {
        const next = prev + 0.1;
        if (next >= clip.end) {
          if (videoRef.current && !videoError) {
            try {
              videoRef.current.currentTime = clip.start;
            } catch {
              // ignore seek error
            }
          }
          return clip.start;
        }
        return Number(next.toFixed(2));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, clip.start, clip.end, videoError]);

  const togglePlay = () => {
    if (isPlaying) {
      if (videoRef.current && !videoError) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (videoRef.current && !videoError) {
        if (videoRef.current.currentTime >= clip.end || videoRef.current.currentTime < clip.start) {
          videoRef.current.currentTime = clip.start;
        }
        videoRef.current.play().catch(() => {
          setVideoError(true);
        });
      }
      setIsPlaying(true);
    }
  };

  const restartClip = () => {
    setCurrentTime(clip.start);
    if (videoRef.current && !videoError) {
      try {
        videoRef.current.currentTime = clip.start;
        videoRef.current.play().catch(() => {});
      } catch {
        // ignore
      }
    }
    setIsPlaying(true);
  };

  // Keyboard shortcut: Space for play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, clip.start, clip.end]);

  // Find all words in the current clip
  const allWords: WordTimestamp[] = [];
  clip.segments.forEach((seg) => {
    seg.words.forEach((w) => allWords.push(w));
  });

  // Calculate active word and active 3-4 word phrase
  const activeWordIndex = allWords.findIndex(
    (w) => currentTime >= w.start - 0.05 && currentTime <= w.end + 0.1
  );

  // Group into readable chunks of ~4 words
  const groupSize = clip.captionStyle.maxWordsPerGroup || 4;
  const currentChunkIndex = activeWordIndex >= 0 ? Math.floor(activeWordIndex / groupSize) : 0;
  const currentWordChunk = allWords.slice(
    currentChunkIndex * groupSize,
    (currentChunkIndex + 1) * groupSize
  );

  const formatTime = (seconds: number) => {
    const relativeSec = Math.max(0, seconds - clip.start);
    const m = Math.floor(relativeSec / 60);
    const s = Math.floor(relativeSec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 lg:p-6 items-center justify-between overflow-y-auto">
      {/* Top Studio Bar */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 mb-3 px-1 shrink-0">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => onUpdateLayout(clip.id, 'face')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              clip.layout === 'face'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Face-tracking dynamic crop (9:16)"
          >
            Face Focus
          </button>
          <button
            onClick={() => onUpdateLayout(clip.id, 'split')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              clip.layout === 'split'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Dual-speaker interview split"
          >
            Split Screen
          </button>
          <button
            onClick={() => onUpdateLayout(clip.id, 'fit')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              clip.layout === 'fit'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Fit video on blurred ambient backdrop"
          >
            Fit & Blur
          </button>
        </div>

        <div className="flex items-center gap-2">
          {youtubeId && (
            <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
              <button
                onClick={() => setPlayerMode('shorts')}
                className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
                  playerMode === 'shorts'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="9:16 Vertical Short Preview with Karaoke Subtitles"
              >
                9:16 Short
              </button>
              <button
                onClick={() => setPlayerMode('youtube')}
                className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
                  playerMode === 'youtube'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Original YouTube Video Player"
              >
                YouTube
              </button>
            </div>
          )}

          <button
            onClick={() => setShowSocialOverlay(!showSocialOverlay)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showSocialOverlay
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle TikTok / Reels Safe Zones"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Safe Zone</span>
          </button>

          <button
            onClick={() => setShowStyleToolbar(!showStyleToolbar)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showStyleToolbar
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Customize Subtitles"
          >
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Captions</span>
          </button>
        </div>
      </div>

      {/* Caption Quick Toolbar */}
      {showStyleToolbar && (
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-3 text-xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Color:</span>
            {[
              { label: 'Yellow', color: '#FACC15' },
              { label: 'Green', color: '#4ADE80' },
              { label: 'Cyan', color: '#38BDF8' },
              { label: 'Red', color: '#F87171' },
              { label: 'White', color: '#FFFFFF' },
            ].map((c) => (
              <button
                key={c.color}
                onClick={() => onUpdateCaptionStyle(clip.id, { highlightColor: c.color })}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  clip.captionStyle.highlightColor === c.color ? 'scale-115 border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.color }}
                title={c.label}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Position:</span>
            <input
              type="range"
              min="30"
              max="85"
              value={clip.captionStyle.positionY}
              onChange={(e) => onUpdateCaptionStyle(clip.id, { positionY: Number(e.target.value) })}
              className="w-16 accent-purple-500 cursor-pointer"
            />
          </div>

          <button
            onClick={() => onUpdateCaptionStyle(clip.id, { uppercase: !clip.captionStyle.uppercase })}
            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
              clip.captionStyle.uppercase
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            CAPS
          </button>
        </div>
      )}

      {/* 9:16 Vertical Smartphone Canvas Frame */}
      <div className="relative w-full max-w-[310px] sm:max-w-[340px] aspect-[9/16] bg-slate-950 rounded-[36px] overflow-hidden shadow-2xl border-[6px] border-slate-800 shrink-0 select-none group">
        {/* Smartphone Speaker / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 pointer-events-none flex items-center justify-center">
          <div className="w-8 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Video Canvas Container */}
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-slate-950">
          {/* Ambient blurred backdrop for Fit mode */}
          {clip.layout === 'fit' && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={projectThumbnail}
                alt=""
                className="w-full h-full object-cover blur-2xl scale-125 opacity-60"
              />
            </div>
          )}

          {/* YouTube Embedded Source Player */}
          {playerMode === 'youtube' && youtubeId ? (
            <div className="w-full h-full bg-black flex items-center justify-center relative z-10">
              <iframe
                key={`${youtubeId}-${clip.id}-${clip.start}`}
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&start=${Math.floor(clip.start)}&end=${Math.ceil(clip.end)}&rel=0&modestbranding=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={clip.title}
              />
            </div>
          ) : clip.layout === 'split' ? (
            <div className="w-full h-full flex flex-col z-10">
              <div className="flex-1 overflow-hidden relative border-b border-slate-800 bg-slate-900">
                <img
                  src={projectThumbnail}
                  alt={author}
                  className="w-full h-full object-cover object-top scale-105"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-semibold text-purple-300 backdrop-blur-sm">
                  {author} (Host)
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                  alt="Guest Speaker"
                  className="w-full h-full object-cover object-center scale-105"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-semibold text-emerald-300 backdrop-blur-sm">
                  Guest Speaker
                </div>
              </div>
            </div>
          ) : !videoError ? (
            /* Face Crop / Fit Video Element with onError guard */
            <video
              ref={videoRef}
              src={videoSrc}
              onTimeUpdate={handleTimeUpdate}
              onError={() => setVideoError(true)}
              muted={isMuted}
              playsInline
              preload="auto"
              onClick={togglePlay}
              className={`w-full ${
                clip.layout === 'face'
                  ? 'h-full object-cover object-center scale-135 transition-transform duration-700'
                  : 'h-auto max-h-full object-contain relative z-10'
              } cursor-pointer`}
            />
          ) : (
            /* Resilient High-Fidelity Studio Visualizer Backdrop */
            <div
              onClick={togglePlay}
              className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer z-10 overflow-hidden"
            >
              <img
                src={projectThumbnail}
                alt={author}
                className="absolute inset-0 w-full h-full object-cover scale-110 opacity-40 blur-[1px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/60" />

              <div className="relative z-10 flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500/50 p-1 shadow-lg shadow-purple-950/50">
                  <img
                    src={projectThumbnail}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                <div>
                  <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-purple-400" />
                    <span>{author}</span>
                  </div>
                  <div className="text-[10px] text-purple-300/80 font-mono">
                    High-Definition Studio Audio
                  </div>
                </div>

                {/* Animated Speech Equalizer Bars */}
                <div className="flex items-center gap-1 h-8 px-4 py-1 rounded-full bg-slate-900/80 border border-slate-800">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-purple-500 to-amber-400 rounded-full transition-all duration-100"
                      style={{
                        height: isPlaying
                          ? `${20 + ((Math.sin(currentTime * 8 + i * 0.7) + 1) * 35)}%`
                          : '20%',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dark gradient scrims for contrast */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

          {/* DYNAMIC ANIMATED KARAOKE SUBTITLES */}
          <div
            className="absolute inset-x-4 z-20 pointer-events-none text-center flex flex-col items-center justify-center transition-all duration-150"
            style={{ top: `${clip.captionStyle.positionY}%` }}
          >
            {currentWordChunk.length > 0 ? (
              <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-[2px]">
                {currentWordChunk.map((w, idx) => {
                  const globalIdx = currentChunkIndex * groupSize + idx;
                  const isActive = globalIdx === activeWordIndex;
                  const wordText = clip.captionStyle.uppercase ? w.w.toUpperCase() : w.w;

                  return (
                    <span
                      key={idx}
                      className={`font-caption font-extrabold tracking-wide transition-all duration-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] ${
                        isActive
                          ? 'scale-115 text-2xl sm:text-3xl'
                          : 'scale-100 text-xl sm:text-2xl text-white opacity-95'
                      }`}
                      style={{
                        color: isActive ? clip.captionStyle.highlightColor : '#FFFFFF',
                        textShadow: isActive
                          ? `0 0 16px ${clip.captionStyle.highlightColor}88, 0 2px 4px #000000`
                          : '0 2px 6px #000000, 0 1px 2px #000000',
                      }}
                    >
                      {wordText}
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="text-white/60 font-caption font-semibold text-sm">
                [Audio Active]
              </div>
            )}
          </div>

          {/* TIKTOK / INSTAGRAM REELS UI SAFE ZONE OVERLAY */}
          {showSocialOverlay && (
            <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 pb-6">
              {/* Top social tab */}
              <div className="flex items-center justify-center gap-4 text-xs font-bold text-white/80 pt-4">
                <span className="opacity-60">Following</span>
                <span className="border-b-2 border-white pb-0.5">For You</span>
              </div>

              {/* Bottom social controls + side buttons */}
              <div className="flex items-end justify-between gap-3">
                {/* Creator info & caption */}
                <div className="flex-1 text-left space-y-1 max-w-[200px]">
                  <div className="font-bold text-xs text-white flex items-center gap-1.5 drop-shadow">
                    <span>{clip.publishing.tiktok.accountHandle || '@creator'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  </div>
                  <p className="text-[11px] text-white/90 line-clamp-2 leading-tight drop-shadow font-medium">
                    {clip.title} {clip.hashtags.slice(0, 3).join(' ')}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-white/80 font-mono">
                    <Music2 className="w-2.5 h-2.5 animate-spin" />
                    <span className="truncate">Original Podcast Audio - Opus AI</span>
                  </div>
                </div>

                {/* Right Action Icons (TikTok / Reels layout) */}
                <div className="flex flex-col items-center gap-3 text-white drop-shadow-md">
                  <div className="w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-[10px] font-bold -mt-2">142K</span>

                  <div className="w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold -mt-2">1,820</span>

                  <div className="w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold -mt-2">24.5K</span>

                  <div className="w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Click to play overlay button if paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/30 z-30 flex items-center justify-center cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrubbing & Trimming Timeline Controls */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mt-3 shadow-lg shrink-0">
        {/* Scrubber track */}
        <div className="relative w-full h-8 bg-slate-950 rounded-lg border border-slate-800 p-1 flex items-center mb-2 overflow-hidden">
          {/* Waveform graphic bars */}
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-25 pointer-events-none">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-purple-400 rounded-full"
                style={{ height: `${20 + ((i * 17) % 65)}%` }}
              />
            ))}
          </div>

          {/* Playhead progress */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-purple-500/20 border-r-2 border-purple-400 pointer-events-none"
            style={{
              width: `${Math.min(
                100,
                Math.max(0, ((currentTime - clip.start) / Math.max(0.1, clip.duration)) * 100)
              )}%`,
            }}
          />

          <input
            type="range"
            min={clip.start}
            max={clip.end}
            step="0.1"
            value={currentTime}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentTime(val);
              if (videoRef.current && !videoError) {
                try {
                  videoRef.current.currentTime = val;
                } catch {
                  // ignore
                }
              }
            }}
            className="w-full relative z-10 opacity-0 cursor-ew-resize h-full"
          />
        </div>

        {/* Playback action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={restartClip}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Replay from clip start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Timecode */}
          <div className="flex items-center gap-1 font-mono-num text-xs text-slate-300">
            <span className="text-purple-300 font-semibold">{formatTime(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span>{formatTime(clip.end)}</span>
          </div>

          {/* Fine trimming triggers */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <button
              onClick={() => onUpdateClipTime(clip.id, Math.max(0, clip.start - 1), clip.end)}
              className="px-1.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
              title="Add 1s to start"
            >
              -1s
            </button>
            <button
              onClick={() => onUpdateClipTime(clip.id, clip.start, clip.end + 1)}
              className="px-1.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
              title="Add 1s to end"
            >
              +1s
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
