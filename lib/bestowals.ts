/**
 * 4PE Bestowal Script Catalog
 *
 * Defines every event-driven K-KUT / mini-KUT (mK) bestowal package processed
 * by the 4-Pillar Engine (4PE).
 *
 * Nomenclature lock:
 *   K-KUT  = KK  (full-length bestowals)
 *   mini-KUT = mK (short / rapid bestowals)
 *   KUBs, SHIP, KIDz = Sponsor tiers (Level 1 Net Profit)
 *   Vocalist lock: KLEIGH for Valentine's / Anniversary
 *   Scherer: strictly "Artist, Composer, Pianist"
 *
 * 4-Pillar mapping:
 *   Process  = Six Sigma methodology, zero-defect delivery
 *   People   = Roles (Lloyd, NATU, Sponsors, Recipients)
 *   Performance = Future / sonic art
 *   Profit   = Level 1 Net Profit (KUB/SHIP/KIDz sponsors)
 */

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type AssetTier = 'K-KUT' | 'mini-KUT'
export type PillarFocus = 'Process' | 'People' | 'Performance' | 'Profit' | string

export interface BestowalScript {
  /** Unique trigger key used in the 4PE SMS / API request */
  trigger: string
  /** Human-readable event label */
  event: string
  /** K-KUT or mini-KUT */
  asset_tier: AssetTier
  /** Title-based slug — matches ASCAP as single source of truth (never a DISCO numeric ID) */
  asset_id: string
  /** Internal GPMC track URL used as SMS delivery link */
  asset_url: string
  /** Primary vocalist credited on this bestowal */
  vocalist: string
  /** Composer credit — always Scherer */
  composer: string
  /** Four-Pillar focus areas for this script */
  pillars: PillarFocus[]
  /** Full bestowal SMS / delivery body — 4PE-formatted */
  sms_body: string
  /** Long-form script for the 4PE STI/BTI engine (rendered in platform UI) */
  script: string
  /** Methodology classification */
  methodology: '4P_Six_Sigma'
  /** Physical delivery mechanism */
  mechanism: 'K-kUpId_Jewelry'
  /** Sponsor tiers that fund this bestowal's Level 1 Profit */
  sponsors: string[]
}

// ---------------------------------------------------------------------------
// CATALOG — Event Scripts (The Process)
// ---------------------------------------------------------------------------

export const BESTOWAL_CATALOG: Record<string, BestowalScript> = {

  // ─── Valentine's ──────────────────────────────────────────────────────────
  VALENTINES_KK: {
    trigger: 'VALENTINES_KK',
    event: "Valentine's Day — Lyrical Sentiment Bestowal",
    asset_tier: 'K-KUT',
    asset_id: 'LOVED_RENEWS_KK',
    asset_url: 'https://gputnammusic.com/k/val-loved-renews',
    vocalist: 'KLEIGH',
    composer: 'Scherer',
    pillars: ['Process', 'Performance'],
    sms_body:
      'Sovereign Bestowal: Your "Loved Renews" K-KUT is ready. Tap your K-kUpId to receive it. Happy Valentine\'s from the GPM Sovereign Fleet. 💌',
    script: `This is a sovereign bestowal of "Loved Renews" — a proprietary K-KUT (KK) manufactured specifically for this Valentine's resonance. By engaging your K-kUpId Jewelry, you are initiating the 4PE handshake. This is not just music; it is a Six Sigma-validated emotional delivery.

Vocalist: KLEIGH
Pianist / Composer: Scherer

Through this physical hardware, the sentiment is locked. Happy Valentine's from the GPM Sovereign Fleet.`,
    methodology: '4P_Six_Sigma',
    mechanism: 'K-kUpId_Jewelry',
    sponsors: ['KUB', 'SHIP'],
  },

  // ─── Anniversary ─────────────────────────────────────────────────────────
  ANNIVERSARY_KK: {
    trigger: 'ANNIVERSARY_KK',
    event: 'Anniversary — Eternal Resonance Tracking',
    asset_tier: 'K-KUT',
    asset_id: 'AWESOME-ANNIVERSARY-KK',
    asset_url: 'https://gputnammusic.com/k/awesome-anniversary',
    vocalist: 'KLEIGH',
    composer: 'Scherer',
    pillars: ['Performance', 'Profit'],
    sms_body:
      'Sovereign Bestowal: Initiating Awesome Anniversary. Your resonance is locked. Tap your K-kUpId to receive: https://gputnammusic.com/k/awesome-anniversary',
    script: `Initiating the Awesome Anniversary bestowal. This proprietary K-KUT is manufactured to the Six Sigma standard.

Vocalist: KLEIGH
Composer / Pianist: Scherer

Through your K-kUpId mechanism, this resonance marks a Level 1 Final Outcome of shared performance. Lock the resonance now.`,
    methodology: '4P_Six_Sigma',
    mechanism: 'K-kUpId_Jewelry',
    sponsors: ['KUB', 'SHIP'],
  },

  // ─── Birthday ─────────────────────────────────────────────────────────────
  BIRTHDAY_MK: {
    trigger: 'BIRTHDAY_MK',
    event: 'Birthday — Identity Celebration Logic',
    asset_tier: 'mini-KUT',
    asset_id: 'BEST-BIRTHDAY-SHORT-MK',
    asset_url: 'https://gputnammusic.com/k/best-birthday-short',
    vocalist: '[Sovereign Selection]',
    composer: 'Scherer',
    pillars: ['People', 'Process'],
    sms_body:
      'Sovereign Bestowal: Happy Birthday! Your Best Birthday-Short (mK) is ready for your role in the fleet. Tap to receive: https://gputnammusic.com/k/best-birthday-short',
    script: `This is your Best Birthday-Short resonance. A condensed mini-KUT designed for high-frequency People (Roles) recognition.

Process: Delivered via the 4PE SMS Gateway.
Performance: Honoring your role in the future of our companies.

Tap your hardware to receive the bestowal. Happy Birthday from the Flagship.`,
    methodology: '4P_Six_Sigma',
    mechanism: 'K-kUpId_Jewelry',
    sponsors: ['KUB', 'KIDz'],
  },

  // ─── Christmas ────────────────────────────────────────────────────────────
  CHRISTMAS_KK: {
    trigger: 'CHRISTMAS_KK',
    event: 'Christmas — Seasonal Sovereign Bestowal',
    asset_tier: 'K-KUT',
    asset_id: 'HK-XMAS',
    asset_url: 'https://gputnammusic.com/k/hk-xmas',
    vocalist: '[Sovereign Selection]',
    composer: 'Scherer',
    pillars: ['People', 'Profit'],
    sms_body:
      'A gift of sovereign sound. Your HK-XMAS Holiday-KUT is ready. Tap your K-kUpId to receive the bestowal. Happy Holidays from the GPM Sovereign Fleet. 🎄',
    script: `A gift of sovereign sound. This is your HK-XMAS Holiday-KUT, bestowed by our Sponsors (KUB, SHIP, KIDz). Under the 4PE, this seasonal asset is delivered with the precision of our Six Sigma process.

Asset: GPM Holiday Collection
Vocalist: [Sovereign Selection]
Composer: Scherer

May your holiday resonance be locked. This bestowal represents the Level 1 Final Outcome of a year of performance. Tap to experience the gift.`,
    methodology: '4P_Six_Sigma',
    mechanism: 'K-kUpId_Jewelry',
    sponsors: ['KUB', 'SHIP', 'KIDz'],
  },

  // ---------------------------------------------------------------------------
  // Professional & Technical Scripts (The People Pillar)
  // ---------------------------------------------------------------------------

  // ─── Lloyd / Spirit Song Studios (SSS) Tuesday Promo ─────────────────────
  LLOYD_SSS_TUESDAY: {
    trigger: 'LLOYD_SSS_TUESDAY',
    event: 'SSS Tuesday — Near-Genius Studio Recognition (Lloyd)',
    asset_tier: 'K-KUT',
    asset_id: 'SSS-TUESDAY-KK',
    asset_url: 'https://gputnammusic.com/k/sss-tuesday',
    vocalist: 'Lloyd',
    composer: 'Scherer',
    pillars: ['People', 'Process'],
    sms_body:
      "Today is SSS Tuesday. Spirit Song Studios is live. Lloyd and the team are executing high-fidelity engineering for the GPM platform. Tap to hear the near-genius sonic architecture in action.",
    script: `Today is SSS Tuesday. We are highlighting the industrial Process at Spirit Song Studios, where Lloyd and the team execute the high-fidelity engineering required for the GPM platform.

Role (People): Lloyd — Leading the near-genius sonic architecture.
Methodology: Every track, from K-KUTs to mini-KUTs (mK), is run through our Six Sigma filter to ensure zero-defect resonance.

This is how we build the future for all companies in the fleet. Precision in the studio leads to perfection in the bestowal.`,
    methodology: '4P_Six_Sigma',
    mechanism: 'K-kUpId_Jewelry',
    sponsors: ['KUB'],
  },

  // ─── NATU — Sonic Landscapes & Performance ────────────────────────────────
  NATU_SONIC_LANDSCAPES: {
    trigger: 'NATU_SONIC_LANDSCAPES',
    event: 'NATU — Interdisciplinary Resonance / Sonic Landscapes',
    asset_tier: 'K-KUT',
    asset_id: 'NATU-SONIC-KK',
    asset_url: 'https://gputnammusic.com/k/natu-sonic',
    vocalist: 'NATU',
    composer: 'Scherer',
    pillars: ['Performance', 'Process'],
    sms_body:
      "Welcome to the future of interdisciplinary resonance. The NATU Sonic Landscape is ready. Tap your K-kUpId to unlock the performance.",
    script: `Welcome to the future of interdisciplinary resonance. This is the NATU Sonic Landscape, a proprietary asset manufactured via the 4P Methodology. Using our Six Sigma process, we have mapped a sonic journey designed for your K-kUpId delivery mechanism.

Role: NATU Performance Assets
Outcome: The future of all companies within the GPM Sovereign Fleet.

Tap your jewelry to unlock the performance. This is the 4PE at work.`,
    methodology: '4P_Six_Sigma',
    mechanism: 'K-kUpId_Jewelry',
    sponsors: ['KUB', 'SHIP'],
  },

  // ---------------------------------------------------------------------------
  // HK Suite (Holiday-KUT extensions)
  // ---------------------------------------------------------------------------

  HK_BDAY: {
    trigger: 'HK_BDAY',
    event: 'HK-BDay — Best Birthday Bestowal',
    asset_tier: 'mini-KUT',
    asset_id: 'HK-BDAY',
    asset_url: 'https://gputnammusic.com/k/hk-bday',
    vocalist: '[Sovereign Selection]',
    composer: 'Scherer',
    pillars: ['People', 'Process'],
    sms_body:
      'Best Birthday Bestowal: Your HK-BDay mini-KUT is live. Tap your K-kUpId to receive your personal resonance from the GPM Sovereign Fleet. 🎂',
    script: `This is your HK-BDay bestowal — the Best Birthday Resonance, delivered with Six Sigma precision. Tap your K-kUpId hardware to receive the gift.`,
    methodology: '4P_Six_Sigma',
    mechanism: 'K-kUpId_Jewelry',
    sponsors: ['KUB', 'KIDz'],
  },

  H_HLWN: {
    trigger: 'H_HLWN',
    event: 'H-HLWN — Halloween Resonance',
    asset_tier: 'K-KUT',
    asset_id: 'H-HLWN',
    asset_url: 'https://gputnammusic.com/k/h-hlwn',
    vocalist: '[Sovereign Selection]',
    composer: 'Scherer',
    pillars: ['Performance', 'People'],
    sms_body:
      'Halloween Resonance from the GPM Sovereign Fleet. Your H-HLWN K-KUT is locked. Tap your K-kUpId to experience it. 🎃',
    script: `This is your H-HLWN bestowal — the Halloween Resonance of the GPM fleet. Delivered via the 4PE and your K-kUpId mechanism.`,
    methodology: '4P_Six_Sigma',
    mechanism: 'K-kUpId_Jewelry',
    sponsors: ['KUB'],
  },

  HK_MPLOY: {
    trigger: 'HK_MPLOY',
    event: 'HK-Mploy — Employee / Internal Performance KUT',
    asset_tier: 'mini-KUT',
    asset_id: 'HK-MPLOY',
    asset_url: 'https://gputnammusic.com/k/hk-mploy',
    vocalist: '[Sovereign Selection]',
    composer: 'Scherer',
    pillars: ['People', 'Profit'],
    sms_body:
      'Internal Performance Bestowal: Your HK-Mploy mini-KUT recognizes your role in the fleet. Tap your K-kUpId to receive the acknowledgment. 🏆',
    script: `This is your HK-Mploy bestowal — the Employee Recognition KUT. Delivered to honor your contribution to the GPM Sovereign Fleet. Tap your K-kUpId hardware to receive.`,
    methodology: '4P_Six_Sigma',
    mechanism: 'K-kUpId_Jewelry',
    sponsors: ['KUB', 'SHIP'],
  },
}

// ---------------------------------------------------------------------------
// HELPER — look up a script by trigger key (case-insensitive)
// ---------------------------------------------------------------------------

export function getBestowalScript(trigger: string): BestowalScript | null {
  return BESTOWAL_CATALOG[trigger.toUpperCase()] ?? null
}

// ---------------------------------------------------------------------------
// HELPER — list all available triggers
// ---------------------------------------------------------------------------

export function listBestowalTriggers(): string[] {
  return Object.keys(BESTOWAL_CATALOG)
}
