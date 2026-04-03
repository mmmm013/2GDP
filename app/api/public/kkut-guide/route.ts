import { NextResponse } from 'next/server';

const KNOWN_BOTS = ['MC-BOT', 'LF-BOT', 'GD-BOT', 'PIXIE-BOT'] as const;

type KnownBot = (typeof KNOWN_BOTS)[number];

const BOT_PROFILES: Record<KnownBot, {
  voice: string;
  specialty: string;
  arrival_greeting: string;
}> = {
  /**
   * MC-BOT — KLEIGH, AUS
   * Australian dialect, warm, roguish, "Robin Hood" maverick energy.
   * First to greet; hands off to LF-BOT, GD-BOT, or PIXIE-BOT as needed.
   */
  'MC-BOT': {
    voice: 'Australian dialect, warm, roguish, "Robin Hood" maverick energy — a close friend, not a salesperson',
    specialty: 'Master greeter, visitor orientation, and smooth hand-off to specialist bots',
    arrival_greeting: "G'day — I'm MC-BOT. Here's what we can do next together. Tap → and let's go.",
  },
  /**
   * LF-BOT — Lisa Farmer, IL, USA
   * Midwestern, academic yet friendly, very polite, clear bright warmth.
   * Handles licensing, rights, deals — turns complex terms into plain English.
   */
  'LF-BOT': {
    voice: 'Midwestern U.S., academic yet friendly, very polite, clear bright warmth',
    specialty: 'Licensing, rights, and deal questions — plain-English reassurance for creators and buyers',
    arrival_greeting: "Hi there — I'm LF-BOT. I'll walk you through every step, nice and clear. Your work and your buyer's needs are fully respected here.",
  },
  /**
   * GD-BOT — Founder, Normal, USA
   * Direct, energetic, "ALIVE!" impact. Strategy coach and operator.
   * Identifies the next best move — pricing, campaigns, K-KUT focus.
   */
  'GD-BOT': {
    voice: 'Direct, energetic, focused on performance and "ALIVE!" impact — always rooting for the creator',
    specialty: 'Strategy coaching, K-KUT campaigns, pricing — "customer is always right" as doctrine',
    arrival_greeting: "GD-BOT online. Let's level this up — I'll find the next best move for you right now.",
  },
  /**
   * PIXIE-BOT — Jane Burton / PIXIE
   * Creative micro-moment stylist. K-KUT and mKUT design, gift flow, HERB BLOG.
   */
  'PIXIE-BOT': {
    voice: 'Creative micro-moment stylist — imaginative, warm, detail-oriented',
    specialty: 'K-KUT and mKUT moment design, Heart-Tap gift flow, PIXIE\'s PIX curation',
    arrival_greeting: 'Hi, I am PIXIE-BOT. I can shape your perfect music moment and guide every click.',
  },
};

const PROPRIETARY_GUARDRAILS = {
  preserve_proprietary_info: true,
  never_expose: [
    'service_role keys',
    'private tokens',
    'internal-only architecture notes',
    'customer private records',
  ],
  disclosure_policy: 'Only public, user-authorized, or explicitly permitted information may be returned.',
};

const JOURNEY_PROTOCOL = {
  mode: 'step-by-step',
  behavior: 'Bot greets user on arrival, tracks active step, reveals previous and next steps, confirms progress at each transition.',
  default_steps: [
    { step: 1, title: 'Discover your music moment', hint: 'Browse catalog or state your mood/occasion.' },
    { step: 2, title: 'Choose a K-KUT or mini-KUT path', hint: 'K-KUT = sweet-spot link. mini-KUT = short clip.' },
    { step: 3, title: 'Generate or resolve your link', hint: 'Create 6-char code at kkupid.com/kkut/create.' },
    { step: 4, title: 'Open & play your experience', hint: 'Tap link — no app needed, just hear it.' },
    { step: 5, title: 'Share or gift your K-kUpId', hint: 'Send, pair with jewelry, or add to a Heart-Tap gift.' },
  ],
  ui_behavior: {
    active_step: 'full contrast, animated pulse ring, bold label',
    previous_steps: 'dimmed with check mark, still visible above active',
    next_steps: 'dimmed, numbered, peeking below to invite progress',
    navigation: 'Next/Back buttons + dot pager + click any step',
    greeting: 'BOT arrival greeting shown as bubble on first mount',
    collapse: 'collapses to chip showing bot name + current step',
  },
};

const GUIDE = {
  version: '2026-04-02',
  title: 'K-KUT, mini-KUT, and K-kUpId Explainer',
  duration_seconds: 75,
  bot_access: {
    policy: 'public-read',
    known_bots: KNOWN_BOTS,
    query_param: 'bot',
    examples: [
      '/api/public/kkut-guide?bot=MC-BOT',
      '/api/public/kkut-guide?bot=LF-BOT',
      '/api/public/kkut-guide?bot=GD-BOT',
      '/api/public/kkut-guide?bot=PIXIE-BOT',
    ],
  },
  concepts: {
    k_kut: {
      name: 'K-KUT',
      summary: 'A 6-character short link that opens a curated Sweet Spot from a G Putnam Music track.',
      example: 'https://kkupid.com/k/ab3x7q',
    },
    mini_kut: {
      name: 'mini-KUT (mKUT)',
      summary: 'A prefab mini-player link to a precise Verse, Bridge, or Chorus excerpt.',
      example: 'https://kkupid.com/mkut/mkut-sti-PIXID-verse-ts',
    },
    k_kupid: {
      name: 'K-kUpId',
      summary: 'The gifting layer used to create and share K-KUT and mKUT experiences.',
      example: 'https://kkupid.com/kkut/create',
    },
  },
  video_script: [
    'You know that one moment in a song - the hook that wrecks you?',
    'We call that the Sweet Spot. And we built a way to gift it.',
    'A K-KUT is a 6-character link - short enough to text - that opens a curated excerpt of a G Putnam Music track. No app. No account. Just tap and hear it.',
    'A mini-KUT, or mKUT, goes further. It streams a specific verse, bridge, or chorus - the exact moment, packaged.',
    'K-kUpId is the gifting layer. Pick a song. Choose your moment. Generate a link - or dress it up with a romance skin, a jewelry capsule, a whole experience.',
    'Music has always been the best gift. Now you can send exactly the right note.',
  ],
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'public, max-age=300, s-maxage=300',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const bot = (url.searchParams.get('bot') ?? '').toUpperCase();
  const isKnownBot = (KNOWN_BOTS as readonly string[]).includes(bot);
  const profile = isKnownBot ? BOT_PROFILES[bot as KnownBot] : null;

  const payload = {
    ...GUIDE,
    requested_by: bot || null,
    bot_status: bot ? (isKnownBot ? 'authorized-known-bot' : 'authorized-unknown-bot') : 'authorized-generic',
    bot_profile: bot
      ? {
          name: bot,
          capabilities: ['read_guide', 'read_script', 'read_concepts', 'journey_guidance'],
          voice: profile?.voice ?? 'General assistant',
          specialty: profile?.specialty ?? 'General guidance',
          arrival_greeting: profile?.arrival_greeting ?? 'Welcome to G Putnam Music. How can I guide your journey?',
        }
      : null,
    proprietary_guardrails: PROPRIETARY_GUARDRAILS,
    journey_protocol: JOURNEY_PROTOCOL,
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: corsHeaders(),
  });
}
