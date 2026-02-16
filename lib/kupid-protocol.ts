// K-KUTs Locket Protocol — Single Source of Truth
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
  {
    id: 'genesis',
    name: 'K-KUTs Genesis Locket',
    price: '$333',
    description: 'Entry-level K-KUTs locket with curated music pairings. Discover the lock-and-key that unlocks your personal creative frequency.',
    features: [
      'Personal K-KUTs Genesis Locket',
      'Curated music frequency pairing',
      'Digital certificate of authenticity',
      'Access to GPM Locket holder community',
    ],
    stripeLink: 'https://buy.stripe.com/28E14mgV08My41C2p84ow04',
    color: 'from-amber-600 to-yellow-500',
    borderColor: 'border-amber-500/40',
    badge: 'GENESIS',
        buttonClass: 'bg-gradient-to-r from-amber-600 to-yellow-500 text-black hover:opacity-90',
  },
  {
    id: 'sovereign',
    name: 'K-KUTs Sovereign Locket',
    price: '$1,100',
    description: 'The Sovereign-tier K-KUTs locket with expanded music library access and personal frequency calibration.',
    features: [
      'Sovereign K-KUTs Locket',
      'Expanded frequency library',
      'Personal calibration session',
      'Priority access to new releases',
      'Sovereign holder events',
    ],
    stripeLink: 'https://buy.stripe.com/eVq14mgV06Eq1Tu9RA4ow05',
    color: 'from-amber-400 to-orange-500',
    borderColor: 'border-orange-400/40',
    badge: 'SOVEREIGN',
    featured: true,
        buttonClass: 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:opacity-90',
  },
  {
    id: 'historic',
    name: 'K-KUTs Historic Locket',
    price: '$3,300',
    description: 'This purchase makes history. 2 patent-pending inventions. 3 trademarks. The ultimate creative artifact with full archive access and legacy value.',
    features: [
      'Historic K-KUTs Locket',
      'Full creative archive access',
      'Lifetime frequency updates',
      'VIP studio sessions',
      'Historic holder inner circle',
      'Locket delivery on/by March 31, 2026',
      '2 patent-pending inventions included',
    ],
    stripeLink: 'https://buy.stripe.com/9B6aEW48ebYK0PqbZI4ow06',
    color: 'from-yellow-300 to-amber-400',
    borderColor: 'border-yellow-400/40',
    badge: 'HISTORIC',
        buttonClass: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-yellow-500/20',
  },
];

// Helper: get tier by id
export function getKupidTier(id: string): KupidTier | undefined {
  return KUPID_TIERS.find((t) => t.id === id);
}

// Helper: Valentine's locket options (summary format for valentines page)
export const LOCKET_OPTIONS = KUPID_TIERS.map((tier) => ({
  title: tier.name.replace('K-KUTs ', ''),
  price: tier.price,
  description: tier.description.slice(0, 80) + (tier.description.length > 80 ? '...' : ''),
  href: '/kupid',
  badge: tier.badge,
  featured: tier.featured,
}));
