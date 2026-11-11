import { VideoProject, Clip, CaptionStyleConfig } from '../types/clip';

export const DEFAULT_CAPTION_STYLE: CaptionStyleConfig = {
  preset: 'opus-classic',
  highlightColor: '#FACC15', // Vibrant yellow (Opus Clip signature)
  textColor: '#FFFFFF',
  strokeColor: '#000000',
  fontSize: 26,
  positionY: 72,
  uppercase: true,
  maxWordsPerGroup: 4,
  showEmojis: true,
};

export const SAMPLE_PROJECTS: VideoProject[] = [
  {
    id: 'sample-huberman-dopamine',
    title: 'Dr. Andrew Huberman: The Secret to Infinite Drive & Dopamine Reset',
    author: 'Huberman Lab Podcast',
    url: 'https://www.youtube.com/watch?v=QmOF0crdyRU',
    youtubeId: 'QmOF0crdyRU',
    duration: 180,
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    videoSrc: '/assets/videos/podcast_huberman.mp4',
    isYouTube: false,
    createdAt: new Date().toISOString(),
    fullTranscript: [
      {
        id: 'seg-1',
        start: 4.2,
        end: 9.8,
        speaker: 'Dr. Andrew Huberman',
        text: 'The biggest mistake people make with motivation is chasing the dopamine spike.',
        words: [
          { w: 'The', start: 4.2, end: 4.4 },
          { w: 'biggest', start: 4.4, end: 4.8 },
          { w: 'mistake', start: 4.8, end: 5.3 },
          { w: 'people', start: 5.3, end: 5.7 },
          { w: 'make', start: 5.7, end: 6.0 },
          { w: 'with', start: 6.0, end: 6.2 },
          { w: 'motivation', start: 6.2, end: 6.9, emphasis: true },
          { w: 'is', start: 6.9, end: 7.1 },
          { w: 'chasing', start: 7.1, end: 7.6 },
          { w: 'the', start: 7.6, end: 7.8 },
          { w: 'dopamine', start: 7.8, end: 8.5, emphasis: true },
          { w: 'spike.', start: 8.5, end: 9.4 },
        ]
      },
      {
        id: 'seg-2',
        start: 10.1,
        end: 16.5,
        speaker: 'Dr. Andrew Huberman',
        text: 'When you achieve a goal, dopamine does not stay high. It crashes BELOW your baseline.',
        words: [
          { w: 'When', start: 10.1, end: 10.4 },
          { w: 'you', start: 10.4, end: 10.6 },
          { w: 'achieve', start: 10.6, end: 11.1 },
          { w: 'a', start: 11.1, end: 11.2 },
          { w: 'goal,', start: 11.2, end: 11.7 },
          { w: 'dopamine', start: 11.7, end: 12.3 },
          { w: 'does', start: 12.3, end: 12.6 },
          { w: 'not', start: 12.6, end: 12.9 },
          { w: 'stay', start: 12.9, end: 13.3 },
          { w: 'high.', start: 13.3, end: 13.8 },
          { w: 'It', start: 13.8, end: 14.1 },
          { w: 'crashes', start: 14.1, end: 14.8, emphasis: true },
          { w: 'BELOW', start: 14.8, end: 15.4, emphasis: true },
          { w: 'your', start: 15.4, end: 15.7 },
          { w: 'baseline.', start: 15.7, end: 16.5 },
        ]
      },
      {
        id: 'seg-3',
        start: 16.8,
        end: 24.2,
        speaker: 'Dr. Andrew Huberman',
        text: 'That sudden post-accomplishment crash is why you feel empty the day after winning.',
        words: [
          { w: 'That', start: 16.8, end: 17.1 },
          { w: 'sudden', start: 17.1, end: 17.5 },
          { w: 'post-accomplishment', start: 17.5, end: 18.6 },
          { w: 'crash', start: 18.6, end: 19.1, emphasis: true },
          { w: 'is', start: 19.1, end: 19.3 },
          { w: 'why', start: 19.3, end: 19.6 },
          { w: 'you', start: 19.6, end: 19.8 },
          { w: 'feel', start: 19.8, end: 20.2 },
          { w: 'empty', start: 20.2, end: 20.8, emphasis: true },
          { w: 'the', start: 20.8, end: 21.0 },
          { w: 'day', start: 21.0, end: 21.3 },
          { w: 'after', start: 21.3, end: 21.7 },
          { w: 'winning.', start: 21.7, end: 22.5 },
        ]
      },
      {
        id: 'seg-4',
        start: 24.6,
        end: 32.5,
        speaker: 'Dr. Andrew Huberman',
        text: 'If you attach dopamine to the friction of the effort itself, you unlock unlimited stamina.',
        words: [
          { w: 'If', start: 24.6, end: 24.8 },
          { w: 'you', start: 24.8, end: 25.0 },
          { w: 'attach', start: 25.0, end: 25.5 },
          { w: 'dopamine', start: 25.5, end: 26.2 },
          { w: 'to', start: 26.2, end: 26.4 },
          { w: 'the', start: 26.4, end: 26.6 },
          { w: 'friction', start: 26.6, end: 27.2, emphasis: true },
          { w: 'of', start: 27.2, end: 27.4 },
          { w: 'the', start: 27.4, end: 27.6 },
          { w: 'effort', start: 27.6, end: 28.1 },
          { w: 'itself,', start: 28.1, end: 28.6 },
          { w: 'you', start: 28.6, end: 28.8 },
          { w: 'unlock', start: 28.8, end: 29.4 },
          { w: 'unlimited', start: 29.4, end: 30.1, emphasis: true },
          { w: 'stamina.', start: 30.1, end: 31.0 },
        ]
      },
      {
        id: 'seg-5',
        start: 33.0,
        end: 42.0,
        speaker: 'Dr. Andrew Huberman',
        text: 'Tell yourself: "This effort hurts, and that pain is proof my neuroplasticity is turning on right now."',
        words: [
          { w: 'Tell', start: 33.0, end: 33.3 },
          { w: 'yourself:', start: 33.3, end: 33.8 },
          { w: '"This', start: 33.8, end: 34.2 },
          { w: 'effort', start: 34.2, end: 34.6 },
          { w: 'hurts,', start: 34.6, end: 35.1 },
          { w: 'and', start: 35.1, end: 35.3 },
          { w: 'that', start: 35.3, end: 35.5 },
          { w: 'pain', start: 35.5, end: 36.0, emphasis: true },
          { w: 'is', start: 36.0, end: 36.2 },
          { w: 'proof', start: 36.2, end: 36.6 },
          { w: 'my', start: 36.6, end: 36.8 },
          { w: 'neuroplasticity', start: 36.8, end: 37.8, emphasis: true },
          { w: 'is', start: 37.8, end: 38.0 },
          { w: 'turning', start: 38.0, end: 38.4 },
          { w: 'on', start: 38.4, end: 38.6 },
          { w: 'right', start: 38.6, end: 38.9 },
          { w: 'now."', start: 38.9, end: 39.5 },
        ]
      }
    ],
    clips: [
      {
        id: 'clip-huberman-1',
        title: 'Why You Feel Empty After Winning (The Post-Goal Crash)',
        hook: 'The biggest mistake people make with motivation is chasing the dopamine spike.',
        viralityScore: 98,
        scoreBreakdown: {
          hookScore: 99,
          engagementScore: 97,
          trendScore: 98,
          speechDensity: 3.2,
        },
        reason: 'Contrarian scientific perspective attacking a widespread myth. Immediate pattern interrupt in first 3 seconds, concludes with an actionable dopamine reframing tool.',
        start: 4.2,
        end: 32.5,
        duration: 28.3,
        hashtags: ['#hubermanlab', '#dopamine', '#psychology', '#neuroscience', '#motivation', '#productivity'],
        suggestedCaptions: {
          tiktok: 'Stop chasing dopamine spikes! 🛑 Dr. Huberman reveals why you feel depressed after reaching a huge goal and how to fix your brain chemistry. #huberman #dopamine #shorts',
          reels: 'The post-achievement crash is real neuroscience. Here is how top performers rewire effort into pure fuel. Save this for your morning routine. 🧠',
          shorts: 'Why You Feel Empty The Day After Winning | Dr. Andrew Huberman neuroscience hack for unlimited motivation.',
        },
        layout: 'face',
        captionStyle: DEFAULT_CAPTION_STYLE,
        segments: [],
        publishing: {
          tiktok: { platform: 'tiktok', enabled: true, accountHandle: '@daily.neuro.hacks', status: 'idle' },
          reels: { platform: 'reels', enabled: true, accountHandle: '@huberman.clips', status: 'idle' },
          shorts: { platform: 'shorts', enabled: true, accountHandle: '@ScienceShortsDaily', status: 'idle' },
        }
      },
      {
        id: 'clip-huberman-2',
        title: 'How to Hack Neuroplasticity While It Hurts',
        hook: 'Tell yourself: "This effort hurts, and that pain is proof my neuroplasticity is turning on."',
        viralityScore: 94,
        scoreBreakdown: {
          hookScore: 92,
          engagementScore: 95,
          trendScore: 94,
          speechDensity: 2.9,
        },
        reason: 'Action-oriented mantra with high shareability for gym, study, and entrepreneurial audiences looking for grit reinforcement.',
        start: 24.6,
        end: 42.0,
        duration: 17.4,
        hashtags: ['#neuroplasticity', '#discipline', '#growthmindset', '#huberman', '#focus'],
        suggestedCaptions: {
          tiktok: 'This one mindset switch changes how you perceive pain and friction forever. Tag a friend who needs this reminder today! ⚡',
          reels: 'When it hurts to keep going, your brain is literally rewiring itself. Lean into the friction.',
          shorts: 'The Exact Phrase To Say When You Want To Quit | Dr. Andrew Huberman',
        },
        layout: 'face',
        captionStyle: { ...DEFAULT_CAPTION_STYLE, highlightColor: '#38BDF8', preset: 'cyber-glow' },
        segments: [],
        publishing: {
          tiktok: { platform: 'tiktok', enabled: true, accountHandle: '@daily.neuro.hacks', status: 'idle' },
          reels: { platform: 'reels', enabled: false, accountHandle: '@huberman.clips', status: 'idle' },
          shorts: { platform: 'shorts', enabled: true, accountHandle: '@ScienceShortsDaily', status: 'idle' },
        }
      }
    ]
  },
  {
    id: 'sample-bartlett-ceo',
    title: 'Steven Bartlett: The 1 Skill That Separates The Top 1% From Everyone Else',
    author: 'The Diary Of A CEO',
    url: 'https://www.youtube.com/watch?v=0kL_sY2mF2M',
    youtubeId: '0kL_sY2mF2M',
    duration: 210,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    videoSrc: '/assets/videos/podcast_bartlett.mp4',
    isYouTube: false,
    createdAt: new Date().toISOString(),
    fullTranscript: [
      {
        id: 'seg-b1',
        start: 3.5,
        end: 11.2,
        speaker: 'Steven Bartlett',
        text: 'I interviewed over 250 billionaires, athletes, and world leaders. They all had one weird habit in common.',
        words: [
          { w: 'I', start: 3.5, end: 3.7 },
          { w: 'interviewed', start: 3.7, end: 4.4 },
          { w: 'over', start: 4.4, end: 4.7 },
          { w: '250', start: 4.7, end: 5.3, emphasis: true },
          { w: 'billionaires,', start: 5.3, end: 6.2, emphasis: true },
          { w: 'athletes,', start: 6.2, end: 7.0 },
          { w: 'and', start: 7.0, end: 7.2 },
          { w: 'world', start: 7.2, end: 7.5 },
          { w: 'leaders.', start: 7.5, end: 8.2 },
          { w: 'They', start: 8.2, end: 8.5 },
          { w: 'all', start: 8.5, end: 8.8 },
          { w: 'had', start: 8.8, end: 9.1 },
          { w: 'one', start: 9.1, end: 9.4 },
          { w: 'weird', start: 9.4, end: 9.8, emphasis: true },
          { w: 'habit', start: 9.8, end: 10.3 },
          { w: 'in', start: 10.3, end: 10.5 },
          { w: 'common.', start: 10.5, end: 11.2 },
        ]
      },
      {
        id: 'seg-b2',
        start: 11.8,
        end: 19.5,
        speaker: 'Steven Bartlett',
        text: 'None of them work 18 hours a day. What they possess is aggressive, ruthless elimination of the non-essential.',
        words: [
          { w: 'None', start: 11.8, end: 12.1 },
          { w: 'of', start: 12.1, end: 12.3 },
          { w: 'them', start: 12.3, end: 12.5 },
          { w: 'work', start: 12.5, end: 12.9 },
          { w: '18', start: 12.9, end: 13.4 },
          { w: 'hours', start: 13.4, end: 13.8 },
          { w: 'a', start: 13.8, end: 14.0 },
          { w: 'day.', start: 14.0, end: 14.4 },
          { w: 'What', start: 14.4, end: 14.7 },
          { w: 'they', start: 14.7, end: 14.9 },
          { w: 'possess', start: 14.9, end: 15.4 },
          { w: 'is', start: 15.4, end: 15.6 },
          { w: 'aggressive,', start: 15.6, end: 16.3, emphasis: true },
          { w: 'ruthless', start: 16.3, end: 16.9, emphasis: true },
          { w: 'elimination', start: 16.9, end: 17.8, emphasis: true },
          { w: 'of', start: 17.8, end: 18.0 },
          { w: 'the', start: 18.0, end: 18.2 },
          { w: 'non-essential.', start: 18.2, end: 19.2 },
        ]
      },
      {
        id: 'seg-b3',
        start: 20.0,
        end: 28.5,
        speaker: 'Steven Bartlett',
        text: 'If you cannot say NO to a polite invitation that drains your energy, you will never build an empire.',
        words: [
          { w: 'If', start: 20.0, end: 20.2 },
          { w: 'you', start: 20.2, end: 20.4 },
          { w: 'cannot', start: 20.4, end: 20.9 },
          { w: 'say', start: 20.9, end: 21.2 },
          { w: 'NO', start: 21.2, end: 21.6, emphasis: true },
          { w: 'to', start: 21.6, end: 21.8 },
          { w: 'a', start: 21.8, end: 21.9 },
          { w: 'polite', start: 21.9, end: 22.4 },
          { w: 'invitation', start: 22.4, end: 23.2 },
          { w: 'that', start: 23.2, end: 23.5 },
          { w: 'drains', start: 23.5, end: 24.1, emphasis: true },
          { w: 'your', start: 24.1, end: 24.3 },
          { w: 'energy,', start: 24.3, end: 24.8 },
          { w: 'you', start: 24.8, end: 25.1 },
          { w: 'will', start: 25.1, end: 25.4 },
          { w: 'never', start: 25.4, end: 25.9, emphasis: true },
          { w: 'build', start: 25.9, end: 26.3 },
          { w: 'an', start: 26.3, end: 26.5 },
          { w: 'empire.', start: 26.5, end: 27.5, emphasis: true },
        ]
      }
    ],
    clips: [
      {
        id: 'clip-bartlett-1',
        title: 'The Brutal Truth About Billionaires Working 18 Hours',
        hook: 'I interviewed over 250 billionaires, athletes, and world leaders. They all had one weird habit in common.',
        viralityScore: 97,
        scoreBreakdown: {
          hookScore: 98,
          engagementScore: 96,
          trendScore: 97,
          speechDensity: 3.4,
        },
        reason: 'Extremely strong high-authority hook with social proof ("250 billionaires"), debunking hustle culture tropes, and ending on an emotional gut punch.',
        start: 3.5,
        end: 28.5,
        duration: 25.0,
        hashtags: ['#diaryofaceo', '#stevenbartlett', '#success', '#billionairemindset', '#focus', '#shorts'],
        suggestedCaptions: {
          tiktok: 'The secret habit of 250+ billionaires Steven Bartlett interviewed. It has nothing to do with waking up at 4 AM! 🤯 #ceo #podcast #mindset',
          reels: 'Ruthless elimination of the non-essential. Are you saying YES to things that secretly drain your ambition?',
          shorts: 'What 250 Billionaires Do Differently | Steven Bartlett Diary Of A CEO',
        },
        layout: 'split',
        captionStyle: { ...DEFAULT_CAPTION_STYLE, preset: 'mr-beast', highlightColor: '#4ADE80' },
        segments: [],
        publishing: {
          tiktok: { platform: 'tiktok', enabled: true, accountHandle: '@ceo.clips.official', status: 'idle' },
          reels: { platform: 'reels', enabled: true, accountHandle: '@theceodiary.shorts', status: 'idle' },
          shorts: { platform: 'shorts', enabled: true, accountHandle: '@PodcastHighlightsHQ', status: 'idle' },
        }
      }
    ]
  }
];

// Populate clip segments from project full transcript
SAMPLE_PROJECTS.forEach(project => {
  project.clips.forEach(clip => {
    clip.segments = project.fullTranscript.filter(
      seg => seg.end >= clip.start && seg.start <= clip.end
    );
  });
});
