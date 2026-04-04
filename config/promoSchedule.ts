/**
 * config/promoSchedule.ts
 *
 * GPM Orderly Promo Release Schedule — Founder's standing directive.
 *
 * Rules:
 *  1. Scheduled promos take priority over random catalog rotation.
 *  2. If no scheduled promo is active, rotate-promotions falls back to random.
 *  3. PROMO_OVERRIDE env var lets the Founder pin any promo for 24 h without a deploy.
 *     Format: "promo-id" — e.g.  PROMO_OVERRIDE=kez-plz-april
 *  4. Seasonal campaigns respect the free-gift catalog rules (< $50, not historic).
 *  5. Promo IDs must be unique strings — used as campaign slugs.
 */

export interface ScheduledPromo {
  id: string
  /** Human-readable campaign name */
  name: string
  /** Month (1-12) this promo is active. null = runs year-round on matching weeks */
  month: number | null
  /** Day-of-month window [startDay, endDay] inclusive; null = full month */
  dayRange: [number, number] | null
  /** ISO-day-of-week array [1=Mon … 7=Sun] for weekly recurring promos; null = not weekly */
  weekdays: number[] | null
  /** Free-gift catalog title to feature (ASCAP title) */
  featuredGiftTitle: string | null
  /** Stripe product link to feature on the promo bar */
  featuredProductUrl: string | null
  /** Short tagline for the promo bar */
  tagline: string
  /** Sponsor tier badge: 'KUB' | 'KEZ' | null */
  sponsorTier: 'KUB' | 'KEZ' | null
}

export const PROMO_SCHEDULE: ScheduledPromo[] = [
  // ── January — New Year / Fresh Start ────────────────────────────────────
  {
    id: 'new-year-loved-renews',
    name: 'New Year, New Love',
    month: 1,
    dayRange: [1, 15],
    weekdays: null,
    featuredGiftTitle: 'Loved Renews',
    featuredProductUrl: 'https://gputnammusic.com/kupid',
    tagline: 'Start the year with the music that moves you. 🎵',
    sponsorTier: null,
  },

  // ── February — Valentine's Day ───────────────────────────────────────────
  {
    id: 'valentines-kkut',
    name: "Valentine's K-KUT Locket",
    month: 2,
    dayRange: [1, 16],
    weekdays: null,
    featuredGiftTitle: 'Loved Renews',
    featuredProductUrl: 'https://gputnammusic.com/valentines',
    tagline: "Give the music that says what words can't. ❤️ K-KUTs Lockets",
    sponsorTier: null,
  },

  // ── March — Spring / Renewal ─────────────────────────────────────────────
  {
    id: 'spring-awesome-anniversary',
    name: 'Spring Anniversary K-KUT',
    month: 3,
    dayRange: [1, 31],
    weekdays: null,
    featuredGiftTitle: 'Awesome Anniversary',
    featuredProductUrl: 'https://gputnammusic.com/kupid',
    tagline: 'Celebrate every milestone. The Sweet Spot is yours. 🌸',
    sponsorTier: null,
  },

  // ── April — KEZ PLZ Campaign (Michael Scherer) ───────────────────────────
  {
    id: 'kez-plz-april',
    name: 'KEZ PLZ — Love & Recovery',
    month: 4,
    dayRange: null, // whole month
    weekdays: null,
    featuredGiftTitle: null,
    featuredProductUrl: 'https://gputnammusic.com/scherer',
    tagline: '🎹 KEZ PLZ — Help Michael Scherer & his family. Every key pressed counts.',
    sponsorTier: 'KEZ',
  },

  // ── May — Mother's Day ───────────────────────────────────────────────────
  {
    id: 'mothers-day-kkut',
    name: "Mother's Day K-KUT",
    month: 5,
    dayRange: [1, 15],
    weekdays: null,
    featuredGiftTitle: 'Awesome Anniversary',
    featuredProductUrl: 'https://gputnammusic.com/kupid',
    tagline: "She deserves the Sweet Spot. Gift a K-KUT Locket this Mother's Day. 🌷",
    sponsorTier: null,
  },

  // ── June — KUB Koala Promo (KLEIGH) ─────────────────────────────────────
  {
    id: 'kub-koala-june',
    name: 'KUB Koala — KLEIGH Promo',
    month: 6,
    dayRange: null,
    weekdays: null,
    featuredGiftTitle: 'Natu Sonic',
    featuredProductUrl: 'https://gputnammusic.com/kleigh',
    tagline: '🐨 KUB Season is here — join the KLEIGH Koala family.',
    sponsorTier: 'KUB',
  },

  // ── July — Independence / Summer ────────────────────────────────────────
  {
    id: 'summer-natu-sonic',
    name: 'Summer Sonic Freedom',
    month: 7,
    dayRange: [1, 15],
    weekdays: null,
    featuredGiftTitle: 'Natu Sonic',
    featuredProductUrl: 'https://gputnammusic.com/kupid',
    tagline: 'Freedom sounds like this. 🎆 NATU Sonic K-KUT — limited summer run.',
    sponsorTier: null,
  },

  // ── September — Back to School ───────────────────────────────────────────
  {
    id: 'back-to-school-kidkut',
    name: 'Back to School KidKUT',
    month: 9,
    dayRange: [1, 20],
    weekdays: null,
    featuredGiftTitle: 'SSS Tuesday',
    featuredProductUrl: 'https://gputnammusic.com/kupid',
    tagline: '🎒 KidKUTs are back — collectible charms for every frequency mood.',
    sponsorTier: null,
  },

  // ── October — Halloween ──────────────────────────────────────────────────
  {
    id: 'halloween-h-hlwn',
    name: 'Halloween mini-KUT',
    month: 10,
    dayRange: [15, 31],
    weekdays: null,
    featuredGiftTitle: 'H-HLWN',
    featuredProductUrl: 'https://gputnammusic.com/kupid',
    tagline: '🎃 H-HLWN mini-KUT — the resonance of the season.',
    sponsorTier: null,
  },

  // ── December — Holiday / Christmas ──────────────────────────────────────
  {
    id: 'holiday-hk-xmas',
    name: 'Holiday K-KUT Gift',
    month: 12,
    dayRange: [1, 25],
    weekdays: null,
    featuredGiftTitle: 'HK-Xmas',
    featuredProductUrl: 'https://gputnammusic.com/kupid',
    tagline: '🎄 The most musical gift of the year — HK-Xmas K-KUT Locket.',
    sponsorTier: null,
  },

  // ── Weekly recurring — Sonic Showcase Sunday/Tuesday ────────────────────
  {
    id: 'sss-tuesday-weekly',
    name: 'Sonic Showcase Sunday/Tuesday',
    month: null,
    dayRange: null,
    weekdays: [2, 7], // Tuesday=2, Sunday=7 (ISO week days)
    featuredGiftTitle: 'SSS Tuesday',
    featuredProductUrl: 'https://gputnammusic.com/kupid',
    tagline: '🎵 Sonic Showcase — claim your weekly K-KUT.',
    sponsorTier: null,
  },
]

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Returns the scheduled promo that is active right now, or null. */
export function getActiveScheduledPromo(now = new Date()): ScheduledPromo | null {
  // PROMO_OVERRIDE takes absolute priority
  const override = process.env.PROMO_OVERRIDE?.trim()
  if (override) {
    const found = PROMO_SCHEDULE.find((p) => p.id === override)
    if (found) return found
  }

  const month = now.getMonth() + 1 // 1-12
  const day   = now.getDate()      // 1-31
  // ISO day-of-week: 1=Mon … 7=Sun
  const weekday = ((now.getDay() + 6) % 7) + 1

  for (const promo of PROMO_SCHEDULE) {
    // Weekly recurring check
    if (promo.weekdays && promo.weekdays.includes(weekday)) return promo

    // Monthly/seasonal check
    if (promo.month === null) continue
    if (promo.month !== month) continue
    if (!promo.dayRange) return promo // whole month
    const [start, end] = promo.dayRange
    if (day >= start && day <= end) return promo
  }

  return null
}
