import { NextResponse } from 'next/server';

const KNOWN_BOTS = ['MC-BOT', 'LF-BOT', 'GD-BOT', 'PIXIE-BOT'] as const;

type KnownBot = (typeof KNOWN_BOTS)[number];

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

  const payload = {
    ...GUIDE,
    requested_by: bot || null,
    bot_status: bot ? (isKnownBot ? 'authorized-known-bot' : 'authorized-unknown-bot') : 'authorized-generic',
    bot_profile: bot
      ? {
          name: bot,
          capabilities: ['read_guide', 'read_script', 'read_concepts'],
        }
      : null,
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: corsHeaders(),
  });
}
