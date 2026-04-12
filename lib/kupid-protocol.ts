// K-kUpId Digital Protocol — Single Source of Truth
// ALL pages (kupid, valentines, gift) MUST import from here.
// Change prices HERE and they auto-propagate everywhere.

export interface KupidTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  stripeLink: string;
  color: string;
  borderColor: string;
  badge: string;
  buttonClass: string;
  featured?: boolean;
}

export const KUPID_TIERS: KupidTier[] = [
  // --- KLEAN KUTs: Digital Music Link ---
  {
    id: 'klean-kut',
    name: 'KLEAN KUTs - Digital Music Link',
    price: '$49',
    description: 'Sleek & Kool digital K-KUT code – instant shareable music link. Perfect for gifts, promos, and social sharing. BOT-guided experience. Includes 6-character code (kkupid.com/k/xxxxx) linking to your chosen track, story, or playlist.',
    features: [
      'Instant digital K-KUT code',
      '6-character shareable link (kkupid.com/k/xxxxx)',
      'BOT-guided activation experience',
      'Choose your track, story, or playlist',
      'Perfect for gifts & social sharing',
    ],
    stripeLink: 'https://buy.stripe.com/fZueVcdI03se69K1l4ow0a',
    color: 'from-violet-500 to-fuchsia-500',
    borderColor: 'border-violet-400/40',
    badge: 'KLEAN KUT',
    buttonClass: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90',
  },
  // --- Mini-KUT: Standalone Digital Audio Experience ---
  {
    id: 'mini-kut',
    name: 'Mini-KUT Audio Experience',
    price: '$29',
    description: 'Canonical mini-KUT digital container – a personalized audio clip (15-45sec) paired to a custom frequency mood. Includes QR code linking to a playable experience.',
    features: [
      'Custom frequency-matched audio clip',
      '15-45 second curated excerpt',
      'Unique mini-KUT ID & QR code',
      'Shareable across platforms',
      'Embeddable in digital gifts',
    ],
    stripeLink: 'https://buy.stripe.com/dR6aEW8ow00K1Tu9Xs',
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-400/40',
    badge: 'MINI-KUT',
    buttonClass: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90',
  },
  // --- kUpId: Creator Platform Subscription ---
  {
    id: 'kupid-creator',
    name: 'kUpId Creator Suite',
    price: '$99/year',
    description: 'Annual creator subscription for unlimited K-KUT & mini-KUT generation, custom branding, analytics dashboard, and priority access to new frequency features. Perfect for artists, creators, and gifting brands.',
    features: [
      'Unlimited K-KUT code generation',
      'Unlimited mini-KUT creation',
      'Creator dashboard & analytics',
      'Custom branding on links',
      'API access for integrations',
      'Priority support & new features',
    ],
    stripeLink: 'https://buy.stripe.com/3cs00aBmw00K2Xy8Yb',
    color: 'from-amber-500 to-yellow-500',
    borderColor: 'border-amber-400/40',
    badge: 'KUPID',
    buttonClass: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:opacity-90',
  },
];

// Helper: get tier by id
export function getKupidTier(id: string): KupidTier | undefined {
  return KUPID_TIERS.find((t) => t.id === id);
}

// Helper: tier options (summary format for seasonal pages)
export const KUPID_SUMMARY_OPTIONS = KUPID_TIERS.map((tier) => ({
  title: tier.name,
  price: tier.price,
  description: tier.description.slice(0, 80) + (tier.description.length > 80 ? '...' : ''),
  href: '/kupid',
  badge: tier.badge,
  featured: tier.featured,
}));

// Backward-compatible alias kept for older imports.
export const LOCKET_OPTIONS = KUPID_SUMMARY_OPTIONS;
