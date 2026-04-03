/**
 * GPMC Security Middleware
 *
 * Layers:
 *  1. Bad-bot / scraper UA blocking — hard deny (403)
 *  2. Good-bot tagging — allow but stamp X-Bot-Class header for downstream logging
 *  3. Security headers — HSTS, CSP, X-Frame-Options, etc.
 *  4. Intrusion signal logging — emits structured log line consumed by Vercel Log Drains
 *     or any SIEM / security-rating system (e.g. Datadog, Splunk, Elastic)
 *
 * Industry standards applied:
 *  - OWASP Top-10 header mitigations
 *  - NIST SP 800-53 AU-2 / SI-3 bot controls
 *  - CIS Benchmark: deny aggressive crawlers, allow legitimate search-engine bots
 */

import { NextRequest, NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// 1. BOT CLASSIFICATION LISTS
// ---------------------------------------------------------------------------

/**
 * Malicious / aggressive bots — BLOCK (403).
 * These are scrapers, credential-stuffers, and exploit scanners.
 * Source: OWASP Bad Bot list + observed patterns.
 */
const BLOCKED_BOT_PATTERNS: RegExp[] = [
  /ahrefsbot/i,
  /semrushbot/i,
  /dotbot/i,
  /blexbot/i,
  /mj12bot/i,
  /petalbot/i,
  /serpstatbot/i,
  /zgrab/i,
  /masscan/i,
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /nessus/i,
  /openvas/i,
  /python-requests\/[0-9]/i,  // raw script kiddies; well-written agents self-identify
  /go-http-client\/[0-9]/i,
  /curl\/[0-9]/i,             // raw curl scanners (not dev tools — those set custom UAs)
  /wget\//i,
  /libwww-perl/i,
  /scrapy/i,
  /phantomjs/i,
  /headlesschrome/i,
  /headless/i,
  /dataforseo/i,
  /bytespider/i,
  /ccbot/i,
  /gptbot/i,                  // OpenAI training crawler — not authorized on this platform
  /google-extended/i,         // Google Bard/Gemini training crawler
  /claudebot/i,               // Anthropic training crawler
  /cohere-training/i,
  /meta-externalagent/i,
  /facebookexternalhit/i,     // FB link-preview is fine; block only aggressive variants below
]

/**
 * Legitimate search / indexing bots — ALLOW but TAG.
 * Downstream analytics can filter on X-Bot-Class: indexed-search.
 */
const INDEXED_SEARCH_BOT_PATTERNS: RegExp[] = [
  /googlebot/i,
  /bingbot/i,
  /applebot/i,
  /duckduckbot/i,
  /yandexbot/i,
  /slurp/i,          // Yahoo
  /baiduspider/i,
]

/**
 * Platform-internal GPM bots — ALLOW, TAG as 'gpmc-internal'.
 * These are the MC-BOT, LF-BOT, GD-BOT, PIXIE-BOT etc. defined in the
 * kkut-guide public API and the 4PE engine.
 */
const INTERNAL_BOT_PATTERNS: RegExp[] = [
  /mc-bot/i,
  /lf-bot/i,
  /gd-bot/i,
  /pixie-bot/i,
  /gpmc-bot/i,
  /4pe-engine/i,
]

// ---------------------------------------------------------------------------
// 2. SECURITY HEADERS (OWASP / CIS hardened set)
// ---------------------------------------------------------------------------

function securityHeaders(): Record<string, string> {
  return {
    // Prevent clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    // Force HTTPS for 1 year, include subdomains
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    // Prevent MIME-type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Referrer policy — don't leak URL to 3rd parties
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Permissions policy — deny unused browser APIs
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(self)',
    // Cross-origin isolation
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Resource-Policy': 'same-site',
    // Content-Security-Policy — allow media from Supabase storage + Stripe + Twilio
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
      "media-src 'self' blob: https://*.supabase.co https://*.supabase.in",
      "connect-src 'self' https://*.supabase.co https://*.supabase.in https://api.stripe.com https://api.twilio.com",
      "frame-src https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  }
}

// ---------------------------------------------------------------------------
// 3. INTRUSION SIGNAL LOGGING
// ---------------------------------------------------------------------------

type BotClass = 'blocked' | 'indexed-search' | 'gpmc-internal' | 'unknown'

interface IntrusionLog {
  ts: string
  event: 'bot_blocked' | 'bot_tagged' | 'request_ok'
  bot_class: BotClass
  ua: string
  ip: string
  method: string
  path: string
  country: string
}

function emitSecurityLog(entry: IntrusionLog): void {
  // Structured JSON — compatible with Vercel Log Drains → Datadog / Splunk / Elastic
  // Security-rating systems (e.g. SecurityScorecard, BitSight) consume these via SIEM integrations.
  console.log(JSON.stringify({ source: 'gpmc-security', ...entry }))
}

// ---------------------------------------------------------------------------
// 4. BOT CLASSIFICATION HELPER
// ---------------------------------------------------------------------------

function classifyBot(ua: string): { blocked: boolean; botClass: BotClass } {
  if (!ua) return { blocked: false, botClass: 'unknown' }

  for (const pattern of BLOCKED_BOT_PATTERNS) {
    if (pattern.test(ua)) return { blocked: true, botClass: 'blocked' }
  }
  for (const pattern of INTERNAL_BOT_PATTERNS) {
    if (pattern.test(ua)) return { blocked: false, botClass: 'gpmc-internal' }
  }
  for (const pattern of INDEXED_SEARCH_BOT_PATTERNS) {
    if (pattern.test(ua)) return { blocked: false, botClass: 'indexed-search' }
  }

  return { blocked: false, botClass: 'unknown' }
}

// ---------------------------------------------------------------------------
// 5. MIDDLEWARE ENTRY POINT
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? ''
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const country = request.headers.get('x-vercel-ip-country') ?? 'unknown'
  const path = request.nextUrl.pathname
  const method = request.method

  const { blocked, botClass } = classifyBot(ua)

  const baseLog: Omit<IntrusionLog, 'event'> = {
    ts: new Date().toISOString(),
    bot_class: botClass,
    ua: ua.slice(0, 200),   // truncate to avoid log bloat
    ip,
    method,
    path,
    country,
  }

  // --- BLOCK ---
  if (blocked) {
    emitSecurityLog({ ...baseLog, event: 'bot_blocked' })
    return new NextResponse(
      JSON.stringify({ error: 'Access denied' }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders(),
          'X-Bot-Class': 'blocked',
        },
      }
    )
  }

  // --- ALLOW (with tagging and security headers) ---
  const response = NextResponse.next()

  // Stamp security headers on every passing response
  for (const [key, value] of Object.entries(securityHeaders())) {
    response.headers.set(key, value)
  }

  // Tag bot class for downstream observability
  if (botClass !== 'unknown') {
    response.headers.set('X-Bot-Class', botClass)
    emitSecurityLog({ ...baseLog, event: 'bot_tagged' })
  }

  return response
}

// Run on all paths except Next.js internals and static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot)).*)',
  ],
}
