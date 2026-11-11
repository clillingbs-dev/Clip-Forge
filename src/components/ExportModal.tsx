import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileCode,
  Copy,
  Check,
  X,
  Sparkles,
  Terminal,
  Video
} from 'lucide-react';
import { Clip } from '../types/clip';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: Clip;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, clip }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedAss, setCopiedAss] = useState(false);

  if (!isOpen) return null;

  // Format ASS script identical to clipper.py
  const highlightHex = clip.captionStyle.highlightColor.replace('#', '');
  const assColor = `&H00${highlightHex.substring(4, 6)}${highlightHex.substring(2, 4)}${highlightHex.substring(0, 2)}&`;

  const assContent = `[Script Info]
Title: ${clip.title}
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Arial,86,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,8,2,2,90,90,520,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${clip.segments
  .flatMap((s) =>
    s.words.map(
      (w, i) =>
        `Dialogue: 0,0:00:${Math.floor(w.start).toString().padStart(2, '0')}.${Math.round(
          (w.start % 1) * 100
        )},0:00:${Math.floor(w.end).toString().padStart(2, '0')}.${Math.round(
          (w.end % 1) * 100
        )},Cap,,0,0,0,,{\\1c${assColor}\\fscx110\\fscy110}${w.w.toUpperCase()}`
    )
  )
  .join('\n')}
`;

  const srtContent = clip.segments
    .map((s, idx) => {
      const formatSrtTime = (t: number) => {
        const h = Math.floor(t / 3600);
        const m = Math.floor((t % 3600) / 60);
        const sec = Math.floor(t % 60);
        const ms = Math.floor((t % 1) * 1000);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec
          .toString()
          .padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
      };

      return `${idx + 1}\n${formatSrtTime(s.start)} --> ${formatSrtTime(s.end)}\n${s.text}\n`;
    })
    .join('\n');

  const ffmpegCommand = `ffmpeg -ss ${clip.start.toFixed(2)} -i source.mp4 -t ${clip.duration.toFixed(
    2
  )} -vf "crop=w=ih*9/16:h=ih,scale=1080:1920:flags=lanczos,subtitles=clip.ass" -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k clip_${clip.id}.mp4`;

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadVideo = () => {
    // Generate text bundle and simulate mp4 download
    const bundleContent = `TITLE: ${clip.title}
VIRALITY SCORE: ${clip.viralityScore}/100
HOOK: ${clip.hook}
START: ${clip.start}s | END: ${clip.end}s | DURATION: ${clip.duration}s
HASHTAGS: ${clip.hashtags.join(' ')}

TIKTOK CAPTION:
${clip.suggestedCaptions.tiktok}

INSTAGRAM REELS CAPTION:
${clip.suggestedCaptions.reels}

YOUTUBE SHORTS CAPTION:
${clip.suggestedCaptions.shorts}
`;
    downloadFile(bundleContent, `${clip.title.replace(/\s+/g, '_')}_metadata.txt`, 'text/plain');
    downloadFile(assContent, `${clip.title.replace(/\s+/g, '_')}.ass`, 'text/plain');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export & Download Clip</h3>
              <p className="text-[11px] text-slate-400">1080x1920 Vertical 9:16 Assets</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
          {/* Option 1: Complete Bundle */}
          <button
            onClick={handleDownloadVideo}
            className="p-4 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <Video className="w-5 h-5 text-purple-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                Recommended
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Download Viral Bundle</h4>
            <p className="text-[11px] text-slate-400">
              Download ASS Karaoke Subtitles + Social Post Metadata text file.
            </p>
          </button>

          {/* Option 2: ASS Subtitles */}
          <button
            onClick={() => downloadFile(assContent, `${clip.title.replace(/\s+/g, '_')}.ass`, 'text/plain')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
          >
            <FileCode className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="text-xs font-bold text-white mb-1">Download .ASS Karaoke</h4>
            <p className="text-[11px] text-slate-400">
              Full animated subtitle script with active word color highlighting.
            </p>
          </button>

          {/* Option 3: SRT Subtitles */}
          <button
            onClick={() => downloadFile(srtContent, `${clip.title.replace(/\s+/g, '_')}.srt`, 'text/plain')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
          >
            <FileText className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="text-xs font-bold text-white mb-1">Download .SRT Subtitles</h4>
            <p className="text-[11px] text-slate-400">
              Standard timed subtitle format for Premiere, CapCut, and DaVinci.
            </p>
          </button>

          {/* Option 4: Copy FFmpeg command */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left">
            <div className="flex items-center justify-between mb-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(ffmpegCommand);
                  setCopiedCmd(true);
                  setTimeout(() => setCopiedCmd(false), 2000);
                }}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCmd ? 'Copied' : 'Copy'}
              </button>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">FFmpeg CLI Command</h4>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {ffmpegCommand}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex items-center justify-end">
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
