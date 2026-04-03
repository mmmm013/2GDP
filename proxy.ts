import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export function proxy(req: NextRequest) {
  // Get hostname for subdomain detection
  const hostname = req.headers.get('host') || '';
  const isKleighDomain = hostname.includes('2kleigh.com');
  
  // Check for social subdomain redirects
  const subdomain = hostname.split('.')[0];
  if (SOCIAL_REDIRECTS[subdomain]) {
    return NextResponse.redirect(SOCIAL_REDIRECTS[subdomain], 308);
  }

  // Domain branding guardrail:
  // 2kleigh.com should land on the KLEIGH product experience.
  if (isKleighDomain && req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/kleigh';
    return NextResponse.rewrite(url);
  }
  
  // Extract country from Vercel's geo headers (production) or fallback to headers
  const geo = (req as any).geo;
  const country = geo?.country || req.headers.get('x-vercel-ip-country') || 'US';

  // Check against sanctions list
  if (BLOCKED_COUNTRIES.includes(country)) {
    // Redirect to compliance notice page
    const url = req.nextUrl.clone();
    url.pathname = '/blocked';
    return NextResponse.rewrite(url);
  }

  // Allow all other traffic
  return NextResponse.next();
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
