import { VideoProject, Clip, CaptionPreset, LayoutMode } from '../types/clip';
import { DEFAULT_CAPTION_STYLE } from '../data/sampleVideos';

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const str = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  const match = str.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

export function convertUrlToViralProject(options: {
  url: string;
  customTitle?: string;
  customAuthor?: string;
  customVideoSrc?: string;
  minDuration?: number;
  maxDuration?: number;
  preset?: CaptionPreset;
  layout?: LayoutMode;
  customTopic?: string;
}): VideoProject {
  const {
    url,
    customTitle,
    customAuthor,
    customVideoSrc,
    minDuration = 20,
    maxDuration = 60,
    preset = 'opus-classic',
    layout = 'face',
    customTopic = '',
  } = options;

  const ytId = extractYouTubeId(url);
  const now = Date.now();

  // Determine title and creator
  let title = customTitle || '';
  let author = customAuthor || '';

  if (!title) {
    if (url.includes('QmOF0crdyRU') || url.toLowerCase().includes('huberman')) {
      title = 'Controlling Your Dopamine For Motivation, Focus & Satisfaction';
      author = 'Dr. Andrew Huberman';
    } else if (url.includes('0kL_sY2mF2M') || url.toLowerCase().includes('bartlett') || url.toLowerCase().includes('ceo')) {
      title = 'The 1 Skill That Separates The Top 1% From Everyone Else';
      author = 'Steven Bartlett (The Diary Of A CEO)';
    } else if (url.toLowerCase().includes('lex') || url.toLowerCase().includes('fridman')) {
      title = 'Artificial Intelligence, Future of Humanity and Mindset';
      author = 'Lex Fridman Podcast';
    } else if (url.toLowerCase().includes('rogan')) {
      title = 'The Joe Rogan Experience: Unfiltered Discussion';
      author = 'Joe Rogan';
    } else if (url.toLowerCase().includes('mrbeast')) {
      title = 'Extreme High-Stakes Viral Challenge';
      author = 'MrBeast';
    } else if (url.toLowerCase().includes('mkbhd') || url.toLowerCase().includes('marques')) {
      title = 'The Real Truth About the Future of Tech & Devices';
      author = 'Marques Brownlee';
    } else if (ytId) {
      title = `Viral Podcast Discussion (Episode #${ytId.slice(0, 4)})`;
      author = 'Featured Creator';
    } else {
      title = 'High-Performance Video & Podcast Discussion';
      author = 'Studio Creator';
    }
  }

  if (!author) {
    author = 'Studio Creator';
  }

  const topicRaw = (title + ' ' + customTopic).toLowerCase();
  const isHealth = /dopamine|brain|neuro|sleep|diet|health|fasting|fitness|focus|mental|workout/i.test(topicRaw);
  const isBusiness = /money|billion|million|business|ceo|scale|invest|wealth|career|rich|startup|sales/i.test(topicRaw);
  const isTech = /ai|tech|code|software|model|apple|phone|device|computer|hardware|app|crypto/i.test(topicRaw);

  interface HookItem {
    title: string;
    hook: string;
    reason: string;
    words: string;
    score: number;
  }

  let hookItems: HookItem[] = [];

  if (isHealth) {
    hookItems = [
      {
        title: `Why ${author} Warns Against Chasing Dopamine Spikes`,
        hook: 'The biggest mistake people make with energy and motivation is chasing the initial spike.',
        reason: 'Counter-intuitive biological framing that directly interrupts scrolling by debunking a universal habit.',
        words: 'The biggest mistake people make with energy and motivation is chasing the initial spike. When you hit a goal your dopamine does not plateau. It crashes below your baseline. That is why you feel empty the morning after.',
        score: 98,
      },
      {
        title: 'The 48-Hour Biological Protocol to Reset Deep Focus',
        hook: 'If you want to restore intense focus, you must embrace the friction of the pain itself.',
        reason: 'Actionable somatic tool that reframes discomfort as direct evidence of neuroplasticity.',
        words: 'If you want to restore intense focus you must embrace the friction of the pain itself. Tell yourself this effort hurts and that pain is proof neuroplasticity is turning on right now in your cerebral cortex.',
        score: 96,
      },
      {
        title: 'The Invisible Habit That Destroys 80% of Deep Sleep',
        hook: 'Most people think evening screen light is harmless. It actually suppresses melatonin production by over eighty percent.',
        reason: 'Urgent health wake-up call with quantifiable scientific metrics.',
        words: 'Most people think evening screen light is harmless. It actually suppresses melatonin production by over eighty percent. If you want deep restorative rest you must eliminate overhead fluorescent illumination after sunset.',
        score: 94,
      },
      {
        title: 'How Elite Performers Sustain 10 Hours of Stamina',
        hook: 'Stamina is not willpower. It is attaching pleasure to the friction of effort.',
        reason: 'Redefines grit into an internal neurochemical reward feedback loop.',
        words: 'Stamina is not willpower. It is attaching pleasure to the friction of effort. If you celebrate the grind while it is happening you build an infinite reserve of motivation.',
        score: 92,
      },
    ];
  } else if (isBusiness) {
    hookItems = [
      {
        title: 'The Brutal Truth About Billionaires Working 18 Hours',
        hook: `What separates the top one percent according to ${author} has nothing to do with grinding eighteen hours a day.`,
        reason: 'Pattern interrupt attacking grind culture mythology with elite peer authority.',
        words: `What separates the top one percent according to ${author} has nothing to do with grinding eighteen hours a day. It is ruthless brutal elimination of everything non-essential. If you cannot say no to polite invitations you will never build an empire.`,
        score: 98,
      },
      {
        title: 'How to Build Asymmetric Leverage in 2026',
        hook: 'You do not get rich renting out your time. You only build wealth through ownership and code.',
        reason: 'High-authority financial mental model proven to drive massive bookmarking and shares.',
        words: 'You do not get rich renting out your time. You only build wealth through ownership and code. If you work for an hourly wage your upside is strictly capped by the hours in a day.',
        score: 95,
      },
      {
        title: 'The 3-Second Rule Top CEOs Use to Make Decisions',
        hook: 'If a decision is reversible, make it in less than ten seconds.',
        reason: 'Practical executive mental model reducing cognitive load for founders and operators.',
        words: 'If a decision is reversible make it in less than ten seconds. Most people treat low-stakes decisions like irreversible catastrophes which paralyzes their speed to market.',
        score: 93,
      },
      {
        title: 'Why 99% of Startups Die in the First 18 Months',
        hook: 'Startups do not die from competition. They die from lack of focus and running out of cash.',
        reason: 'Harsh reality check that cuts through startup romanticism.',
        words: 'Startups do not die from competition. They die from lack of focus and running out of cash. Keep your burn rate minimal until you hit undisputed product market fit.',
        score: 91,
      },
    ];
  } else if (isTech) {
    hookItems = [
      {
        title: 'The Shocking Reality About The Next Frontier in Tech',
        hook: 'Most people are completely underestimating how fast intelligence is compounding.',
        reason: 'Technological paradigm shift hook sparking comments, debate, and algorithmic reach.',
        words: 'Most people are completely underestimating how fast intelligence is compounding. What took fifteen months in the previous cycle is now happening in forty-eight hours. The winners are those using agents right now.',
        score: 99,
      },
      {
        title: 'Why a 1-Person Company Can Now Outpace a 30-Person Agency',
        hook: 'A single individual with AI can now outpace an agency of thirty people.',
        reason: 'Solo operator empowerment thesis driving immediate viral resonance among digital natives.',
        words: 'A single individual with AI can now outpace an agency of thirty people. The barrier to entry has collapsed. The bottleneck is no longer execution. It is taste and vision.',
        score: 96,
      },
      {
        title: 'The Hidden Feature Nobody Is Talking About',
        hook: 'Look closely at what happens when you turn on this setting.',
        reason: 'Curiosity-gap pattern interrupt compelling viewers to watch through to the visual payoff.',
        words: 'Look closely at what happens when you turn on this setting. Notice how the response latency drops by more than seventy percent without degrading output precision.',
        score: 93,
      },
      {
        title: '3 Tools That Give You Unfair Advantages in 2026',
        hook: 'If you are still doing manual data extraction, you are wasting forty hours a month.',
        reason: 'High utility checklist that drives instant saves and shares.',
        words: 'If you are still doing manual data extraction you are wasting forty hours a month. Automate the ingest transform and publish pipeline and focus only on strategy.',
        score: 90,
      },
    ];
  } else {
    hookItems = [
      {
        title: `${title.slice(0, 48)} (Viral Highlight)`,
        hook: `If you ask ${author} what actually moved the needle, none of it matches the conventional advice.`,
        reason: 'High-authority contrarian take that disrupts default expectations and stops scrolling in 2 seconds.',
        words: `If you ask ${author} what actually moved the needle none of it matches the conventional advice. It was not doing more things. It was ruthless elimination of distractions.`,
        score: 98,
      },
      {
        title: `The Core Insight From ${author}`,
        hook: 'The minute you realize this simple truth, your entire strategy changes.',
        reason: 'Cognitive reframe promising immediate shift in perspective.',
        words: 'The minute you realize this simple truth your entire strategy changes. You stop competing in crowded categories and start creating your own monopoly.',
        score: 95,
      },
      {
        title: 'Why Most People Fail Right Before The Breakthrough',
        hook: 'The pain you feel right before quitting is the exact inflection point.',
        reason: 'Emotional resilience hook generating high save-to-watch ratio.',
        words: 'The pain you feel right before quitting is the exact inflection point. If you endure just ten percent longer than the average person you capture all the upside.',
        score: 93,
      },
      {
        title: 'The Secret Habit of Top Performers',
        hook: 'Notice what happens when you remove this one common distraction.',
        reason: 'Curiosity gap hook driving high retention through to the payoff.',
        words: 'Notice what happens when you remove this one common distraction. Your mental clarity surges and you accomplish in two hours what used to take an entire day.',
        score: 91,
      },
    ];
  }

  const clips: Clip[] = hookItems.map((item, idx) => {
    const start = 6.0 + idx * 28.0;
    const dur = Math.max(minDuration, Math.min(maxDuration, 26.0));
    const end = start + dur;
    const wordsList = item.words.split(' ');
    let cur = start;

    const wordTimestamps = wordsList.map((w, wIdx) => {
      const wStart = cur;
      const wEnd = cur + 0.32;
      cur = wEnd + 0.04;
      return {
        w,
        start: Number(wStart.toFixed(2)),
        end: Number(wEnd.toFixed(2)),
        emphasis: wIdx % 3 === 1 || w.length > 7,
      };
    });

    return {
      id: `clip-gen-${now}-${idx + 1}`,
      title: item.title,
      hook: item.hook,
      viralityScore: item.score,
      scoreBreakdown: {
        hookScore: item.score + 1,
        engagementScore: item.score - 1,
        trendScore: item.score,
        speechDensity: 3.3,
      },
      reason: item.reason,
      start: Number(start.toFixed(2)),
      end: Number(end.toFixed(2)),
      duration: Number(dur.toFixed(2)),
      hashtags: [
        '#podcast',
        '#viral',
        '#shorts',
        '#reels',
        '#tiktok',
        '#' + author.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 15),
      ],
      suggestedCaptions: {
        tiktok: `${item.title} 🤯 Watch till the end! #${author.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} #shorts #podcast`,
        reels: `${item.title}. Save this for when you need that reminder. 🧠`,
        shorts: `${item.title} | ${author}`,
      },
      segments: [
        {
          id: `seg-gen-${now}-${idx}`,
          start: Number(start.toFixed(2)),
          end: Number(end.toFixed(2)),
          speaker: author,
          text: item.words,
          words: wordTimestamps,
        },
      ],
      layout,
      captionStyle: {
        ...DEFAULT_CAPTION_STYLE,
        preset,
        highlightColor:
          preset === 'mr-beast'
            ? '#4ADE80'
            : preset === 'hormozi'
            ? '#F87171'
            : preset === 'cyber-glow'
            ? '#38BDF8'
            : '#FACC15',
      },
      publishing: {
        tiktok: { platform: 'tiktok', enabled: true, accountHandle: '@creator.official', status: 'idle' },
        reels: { platform: 'reels', enabled: true, accountHandle: '@daily.reels.hub', status: 'idle' },
        shorts: { platform: 'shorts', enabled: true, accountHandle: '@ViralShortsNetwork', status: 'idle' },
      },
    };
  });

  return {
    id: `proj-${now}`,
    title,
    author,
    url,
    duration: 360,
    thumbnail: ytId
      ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    videoSrc: customVideoSrc || '/assets/videos/podcast_huberman.mp4',
    isYouTube: !!ytId,
    youtubeId: ytId || undefined,
    fullTranscript: clips.flatMap((c) => c.segments),
    clips,
    createdAt: new Date().toISOString(),
  };
}
