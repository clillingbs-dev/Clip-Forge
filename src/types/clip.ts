export interface WordTimestamp {
  w: string;
  start: number;
  end: number;
  emphasis?: boolean;
}

export interface TranscriptSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  words: WordTimestamp[];
}

export interface ViralityScoreBreakdown {
  hookScore: number;       // 0-100 (Opening 3-second retention)
  engagementScore: number; // 0-100 (Emotional peak & pacing)
  trendScore: number;      // 0-100 (Platform algorithm suitability)
  speechDensity: number;   // words per second
}

export type CaptionPreset = 'opus-classic' | 'mr-beast' | 'hormozi' | 'cyber-glow' | 'minimal-white';

export interface CaptionStyleConfig {
  preset: CaptionPreset;
  highlightColor: string;
  textColor: string;
  strokeColor: string;
  fontSize: number;       // In px relative to 9:16 frame
  positionY: number;      // percentage from top (e.g. 72)
  uppercase: boolean;
  maxWordsPerGroup: number;
  showEmojis: boolean;
}

export type LayoutMode = 'face' | 'fit' | 'split';

export interface SocialPublishStatus {
  platform: 'tiktok' | 'reels' | 'shorts';
  enabled: boolean;
  accountHandle: string;
  status: 'idle' | 'scheduled' | 'publishing' | 'published';
  scheduledTime?: string;
  permalink?: string;
}

export interface Clip {
  id: string;
  title: string;
  hook: string;
  viralityScore: number; // 0-100
  scoreBreakdown: ViralityScoreBreakdown;
  reason: string;
  start: number;         // in seconds
  end: number;           // in seconds
  duration: number;      // in seconds
  hashtags: string[];
  suggestedCaptions: {
    tiktok: string;
    reels: string;
    shorts: string;
  };
  segments: TranscriptSegment[];
  layout: LayoutMode;
  captionStyle: CaptionStyleConfig;
  publishing: Record<'tiktok' | 'reels' | 'shorts', SocialPublishStatus>;
}

export interface VideoProject {
  id: string;
  title: string;
  author: string;
  url: string;
  duration: number;      // in seconds
  thumbnail: string;
  videoSrc: string;      // Playable video stream or sample video
  isYouTube: boolean;
  youtubeId?: string;
  fullTranscript: TranscriptSegment[];
  clips: Clip[];
  createdAt: string;
}
