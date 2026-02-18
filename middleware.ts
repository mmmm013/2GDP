import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 4-BRAND SPLIT ENGINE: Domain-to-Brand Mapping
// Maps incoming hostnames to their brand_domain
const DOMAIN_TO_BRAND: Record<string, string> = {
  'gputnammusic.com': 'GPM',
  'www.gputnammusic.com': 'GPM',
  '2kleigh.com': 'KLEIGH',
  'www.2kleigh.com': 'KLEIGH',
  'itskleigh.com': 'KLEIGH',
  'www.itskleigh.com': 'KLEIGH',
  'kidsfunsongs.com': 'KFS',
  'www.kidsfunsongs.com': 'KFS',
};

// SOCIAL MEDIA SUBDOMAIN REDIRECTS
// Maps subdomains to external social media profiles
// VERIFIED profiles marked with ✓, NEED INFO marked with ?
const SOCIAL_REDIRECTS: Record<string, string> = {
  // ✓ VERIFIED - Instagram @gregputnammusic
  'ig': 'https://instagram.com/gregputnammusic',

  // ✓ VERIFIED - Facebook page
  'fb': 'https://www.facebook.com/p/G-Putnam-Music-LLC-100083396467797/',

  // ? NEED INFO - X/Twitter profile URL needed
  // 'x': 'https://x.com/NEED_PROFILE',
  // 'twitter': 'https://x.com/NEED_PROFILE',

  // ✓ VERIFIED - YouTube channel
  'yt': 'https://www.youtube.com/@Musicmakers-Normal',
  'youtube': 'https://www.youtube.com/@Musicmakers-Normal',

  // ? NEED INFO - TikTok profile URL needed
  // 'tiktok': 'https://tiktok.com/@NEED_PROFILE',
  // 'tt': 'https://tiktok.com/@NEED_PROFILE',

  // ✓ VERIFIED - LinkedIn company page
  'linkedin': 'https://www.linkedin.com/company/g-putnam-music-llc',
  'li': 'https://www.linkedin.com/company/g-putnam-music-llc',

  // ✓ VERIFIED - Spotify artist
  'spotify': 'https://open.spotify.com/artist/7KSeVeJFgVn116BUHlvlX4',

  // ✓ VERIFIED - Apple Music artist
  'apple': 'https://music.apple.com/us/artist/g-putnam-music/1577755253',

  // ? NEED INFO - SoundCloud profile URL needed
  // 'soundcloud': 'https://soundcloud.com/NEED_PROFILE',
  // 'sc': 'https://soundcloud.com/NEED_PROFILE',
};

// OFAC COMPLIANCE: SANCTIONED COUNTRIES (ISO 3166-1 Alpha-2 Codes)
// As of January 2026, these regions are subject to US trade restrictions
const BLOCKED_COUNTRIES = [
  'RU', // Russia
  'IR', // Iran
  'KP', // North Korea
  'CU', // Cuba
  'SY', // Syria
];

export function middleware(req: NextRequest) {
  // Get hostname for subdomain detection
  const hostname = req.headers.get('host') || '';

  // Check for social subdomain redirects
  const subdomain = hostname.split('.')[0];
  if (SOCIAL_REDIRECTS[subdomain]) {
    return NextResponse.redirect(SOCIAL_REDIRECTS[subdomain], 308);
  }

  // Extract country from Vercel's geo headers
  const country = req.geo?.country || req.headers.get('x-vercel-ip-country') || 'US';

  // Check against sanctions list
  if (BLOCKED_COUNTRIES.includes(country)) {
    // Redirect to compliance notice page
    const url = req.nextUrl.clone();
    url.pathname = '/blocked';
    return NextResponse.rewrite(url);
  }

  // 4-BRAND SPLIT ENGINE: Resolve brand from hostname
  const brand = DOMAIN_TO_BRAND[hostname] || 'GPM';
  const response = NextResponse.next();
  response.headers.set('x-brand-domain', brand);

  // Allow all other traffic with brand header
  return response;
}

// Apply middleware to all routes except static assets and API internals
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
