/**
 * GPM Free-Gift Catalog
 *
 * Rules (hard-coded, never overridden):
 *  1. Every eligible item MUST cost < $50.00 at the time of issuance.
 *  2. HISTORIC cost-items (retired / legacy-priced) are NEVER given away.
 *  3. Priority order: K-KUTs > mini-KUTs > K-kUpIds > other digital items.
 *  4. Track titles are the single source of truth (ASCAP). No DISCO IDs.
 *
 * Regional scheduling for the hourly free-gift cron (24 UTC hours):
 *   US  hours  (UTC): 14, 18, 22  → 9 AM / 1 PM / 5 PM ET
 *   CA  hours  (UTC): 15, 19, 23  → staggered from US by 1 h
 *   UK  hours  (UTC): 8, 12, 17   → 8 AM / 12 PM / 5 PM GMT
 *   AUS hours  (UTC): 0, 4, 21    → AUS/East 10 AM / 2 PM / 7 AM
 *   CN  hours  (UTC): 1, 5, 9     → Beijing 9 AM / 1 PM / 5 PM CST
 *   Random (all other hours): 2, 3, 6, 7, 10, 11, 13, 16, 20
 */

export type GiftItemType = 'K-KUT' | 'mini-KUT' | 'K-kUpId' | 'digital';

export type GiftRegion = 'US' | 'CA' | 'UK' | 'AUS' | 'CN' | 'GLOBAL';

export interface FreeGiftItem {
  /** ASCAP title — single source of truth */
  title: string;
  type: GiftItemType;
  /** Current retail cost in USD cents — must be < 5000 */
  costCents: number;
  /** False = active catalog item. True = historic/retired (never give away). */
  isHistoric: boolean;
  /** Internal GPMC delivery URL */
  deliveryUrl: string;
  /** Short description shown to recipient */
  description: string;
}

// ---------------------------------------------------------------------------
// CATALOG — only items that pass ALL eligibility rules
// ---------------------------------------------------------------------------

export const FREE_GIFT_CATALOG: FreeGiftItem[] = [
  // ── K-KUTs (highest priority) ────────────────────────────────────────────
  {
    title: 'Loved Renews',
    type: 'K-KUT',
    costCents: 999,
    isHistoric: false,
    deliveryUrl: 'https://gputnammusic.com/k/val-loved-renews',
    description: 'Valentine\'s K-KUT — Loved Renews. Vocalist: KLEIGH.',
  },
  {
    title: 'Awesome Anniversary',
    type: 'K-KUT',
    costCents: 999,
    isHistoric: false,
    deliveryUrl: 'https://gputnammusic.com/k/awesome-anniversary',
    description: 'Anniversary K-KUT — Awesome Anniversary. Vocalist: KLEIGH.',
  },
  {
    title: 'HK-Xmas',
    type: 'K-KUT',
    costCents: 999,
    isHistoric: false,
    deliveryUrl: 'https://gputnammusic.com/k/hk-xmas',
    description: 'Holiday K-KUT. Seasonal sovereign bestowal.',
  },
  {
    title: 'SSS Tuesday',
    type: 'K-KUT',
    costCents: 999,
    isHistoric: false,
    deliveryUrl: 'https://gputnammusic.com/k/sss-tuesday',
    description: 'Sonic Showcase Sunday/Tuesday K-KUT.',
  },
  {
    title: 'Natu Sonic',
    type: 'K-KUT',
    costCents: 999,
    isHistoric: false,
    deliveryUrl: 'https://gputnammusic.com/k/natu-sonic',
    description: 'NATU flagship K-KUT.',
  },

  // ── mini-KUTs (second priority) ──────────────────────────────────────────
  {
    title: 'Best Birthday Short',
    type: 'mini-KUT',
    costCents: 499,
    isHistoric: false,
    deliveryUrl: 'https://gputnammusic.com/k/best-birthday-short',
    description: 'Birthday mini-KUT. High-frequency identity celebration.',
  },
  {
    title: 'HK-Bday',
    type: 'mini-KUT',
    costCents: 499,
    isHistoric: false,
    deliveryUrl: 'https://gputnammusic.com/k/hk-bday',
    description: 'Birthday mini-KUT — HK-Bday edition.',
  },
  {
    title: 'HK-Mploy',
    type: 'mini-KUT',
    costCents: 499,
    isHistoric: false,
    deliveryUrl: 'https://gputnammusic.com/k/hk-mploy',
    description: 'Employee recognition mini-KUT.',
  },
  {
    title: 'H-HLWN',
    type: 'mini-KUT',
    costCents: 499,
    isHistoric: false,
    deliveryUrl: 'https://gputnammusic.com/k/h-hlwn',
    description: 'Halloween resonance mini-KUT.',
  },

  // ── K-kUpIds (third priority) ─────────────────────────────────────────────
  {
    title: 'K-kUpId Starter Link',
    type: 'K-kUpId',
    costCents: 0,
    isHistoric: false,
    deliveryUrl: 'https://gputnammusic.com/kupid',
    description: 'Digital K-kUpId activation link. Tap to engage the 4PE.',
  },
];

// ---------------------------------------------------------------------------
// REGIONAL HOUR MAP  (UTC 0–23)
// ---------------------------------------------------------------------------

export const REGIONAL_HOURS: Record<GiftRegion, number[]> = {
  US:     [14, 18, 22],
  CA:     [15, 19, 23],
  UK:     [8,  12, 17],
  AUS:    [0,   4, 21],
  CN:     [1,   5,  9],
  GLOBAL: [2, 3, 6, 7, 10, 11, 13, 16, 20], // randomize among all catalog items
};

/** Returns the region that "owns" the given UTC hour, or GLOBAL for random hours. */
export function getRegionForHour(utcHour: number): GiftRegion {
  for (const [region, hours] of Object.entries(REGIONAL_HOURS) as [GiftRegion, number[]][]) {
    if (region !== 'GLOBAL' && hours.includes(utcHour)) return region;
  }
  return 'GLOBAL';
}

// ---------------------------------------------------------------------------
// ELIGIBILITY FILTER
// Returns only items that are active (not historic) and cost < $50.
// Priority: K-KUT → mini-KUT → K-kUpId → digital
// ---------------------------------------------------------------------------

const PRIORITY: Record<GiftItemType, number> = {
  'K-KUT': 0,
  'mini-KUT': 1,
  'K-kUpId': 2,
  'digital': 3,
};

export function getEligibleGifts(): FreeGiftItem[] {
  return FREE_GIFT_CATALOG
    .filter((item) => !item.isHistoric && item.costCents < 5000)
    .sort((a, b) => PRIORITY[a.type] - PRIORITY[b.type]);
}

/** Pick one gift at random from the eligible pool, weighted toward K-KUTs. */
export function pickFreeGift(region: GiftRegion): FreeGiftItem {
  const pool = getEligibleGifts();
  if (pool.length === 0) throw new Error('Free-gift catalog is empty');

  // For regional hours, prefer the highest-priority type available
  if (region !== 'GLOBAL') {
    const topPriority = pool[0].type;
    const priorityPool = pool.filter((i) => i.type === topPriority);
    return priorityPool[Math.floor(Math.random() * priorityPool.length)];
  }

  // For random (GLOBAL) hours, pick from the whole eligible pool
  return pool[Math.floor(Math.random() * pool.length)];
}
