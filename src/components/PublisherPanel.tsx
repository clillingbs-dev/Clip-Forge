import React, { useState } from 'react';
import {
  Send,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Copy,
  Clock,
  Check,
  AlertCircle,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Clip, SocialPublishStatus } from '../types/clip';

interface PublisherPanelProps {
  clip: Clip;
  onUpdateSocialStatus: (
    clipId: string,
    platform: 'tiktok' | 'reels' | 'shorts',
    status: Partial<SocialPublishStatus>
  ) => void;
}

export const PublisherPanel: React.FC<PublisherPanelProps> = ({
  clip,
  onUpdateSocialStatus,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'tiktok' | 'reels' | 'shorts'>('tiktok');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'scheduled'>('now');
  const [scheduledSlot, setScheduledSlot] = useState('Today at 6:30 PM (Peak Retention)');
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    permalinks: { platform: string; url: string }[];
  } | null>(null);

  const activeSocial = clip.publishing[selectedPlatform];
  const activeCaption = clip.suggestedCaptions[selectedPlatform];

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(`${activeCaption}\n\n${clip.hashtags.join(' ')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePlatform = (p: 'tiktok' | 'reels' | 'shorts') => {
    onUpdateSocialStatus(clip.id, p, {
      enabled: !clip.publishing[p].enabled,
    });
  };

  const handleAutoPublish = async () => {
    setIsPublishing(true);
    setPublishResult(null);

    const enabledPlatforms = (['tiktok', 'reels', 'shorts'] as const).filter(
      (p) => clip.publishing[p].enabled
    );

    const results: { platform: string; url: string }[] = [];

    try {
      for (const p of enabledPlatforms) {
        onUpdateSocialStatus(clip.id, p, { status: 'publishing' });

        const res = await fetch('/api/publish-clip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clipId: clip.id,
            platform: p,
            caption: clip.suggestedCaptions[p],
            title: clip.title,
            scheduleType: scheduleMode,
            scheduledTime: scheduledSlot,
          }),
        });

        const data = await res.json();
        if (data.success) {
          onUpdateSocialStatus(clip.id, p, {
            status: scheduleMode === 'now' ? 'published' : 'scheduled',
            permalink: data.permalink,
            scheduledTime: data.scheduledTime,
          });
          results.push({ platform: p, url: data.permalink });
        }
      }

      setPublishResult({ success: true, permalinks: results });

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#A855F7', '#EC4899', '#FBBF24', '#38BDF8'],
      });
    } catch (err) {
      console.error('Publishing error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 p-4 space-y-4 overflow-y-auto">
      {/* Platform Switcher & Auth status */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Target Social Accounts</span>
          </h4>
          <span className="text-[11px] text-emerald-400 font-medium">3 Connected</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'tiktok', name: 'TikTok', iconColor: 'text-pink-400' },
              { id: 'reels', name: 'IG Reels', iconColor: 'text-purple-400' },
              { id: 'shorts', name: 'YT Shorts', iconColor: 'text-red-500' },
            ] as const
          ).map((p) => {
            const isEnabled = clip.publishing[p.id].enabled;
            const isTabActive = selectedPlatform === p.id;
            const isPublished = clip.publishing[p.id].status === 'published';

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isTabActive
                    ? 'bg-purple-950/40 border-purple-500 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${p.iconColor}`}>{p.name}</span>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleTogglePlatform(p.id);
                    }}
                    className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {clip.publishing[p.id].accountHandle}
                </div>
                {isPublished && (
                  <div className="mt-1 text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Posted
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption & Post Optimizer */}
      <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-200">
            {selectedPlatform.toUpperCase()} Viral Caption & Hashtags
          </span>
          <button
            onClick={handleCopyCaption}
            className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>

        <textarea
          rows={4}
          value={activeCaption}
          onChange={(e) => {
            clip.suggestedCaptions[selectedPlatform] = e.target.value;
          }}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
        />

        <div className="flex flex-wrap gap-1.5 mt-2">
          {clip.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-slate-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Schedule Mode Selector */}
      <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2.5">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>Publishing Timing</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setScheduleMode('now')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
              scheduleMode === 'now'
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Publish Now
          </button>

          <button
            onClick={() => setScheduleMode('scheduled')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
              scheduleMode === 'scheduled'
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Smart Schedule
          </button>
        </div>

        {scheduleMode === 'scheduled' && (
          <div className="pt-2">
            <label className="text-[11px] text-slate-400 mb-1 block">Optimal Slot for Podcasting</label>
            <select
              value={scheduledSlot}
              onChange={(e) => setScheduledSlot(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Today at 6:30 PM (Peak Retention)">Today at 6:30 PM (Peak Retention)</option>
              <option value="Tonight at 8:45 PM (High Shareability)">Tonight at 8:45 PM (High Shareability)</option>
              <option value="Tomorrow at 12:15 PM (Lunch Rush)">Tomorrow at 12:15 PM (Lunch Rush)</option>
              <option value="Tomorrow at 7:00 PM (US Prime Time)">Tomorrow at 7:00 PM (US Prime Time)</option>
            </select>
          </div>
        )}
      </div>

      {/* Auto Publish Trigger Button */}
      <button
        onClick={handleAutoPublish}
        disabled={isPublishing}
        className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        <Send className="w-4 h-4" />
        <span>
          {isPublishing
            ? 'Publishing in progress...'
            : scheduleMode === 'now'
            ? 'Auto-Post to Selected Platforms'
            : 'Schedule for Peak Window'}
        </span>
      </button>

      {/* Success Notification & Live Permalinks */}
      {publishResult && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Successfully Auto-Published!</span>
          </div>
          <div className="space-y-1.5">
            {publishResult.permalinks.map((item) => (
              <a
                key={item.platform}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-[11px] text-slate-300 hover:text-white bg-slate-900/80 px-2 py-1.5 rounded border border-slate-800"
              >
                <span className="capitalize font-semibold text-purple-300">{item.platform}</span>
                <span className="flex items-center gap-1 text-slate-400 hover:underline">
                  View Live Post <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
