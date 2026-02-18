// ============================================================
// 4-BRAND SPLIT ENGINE: Brand Configuration
// Central config for all brand silos in the GPM Mothership
// ============================================================

export type BrandDomain = 'GPM' | 'KLEIGH' | 'SCHERER' | 'KFS';

export interface NavLink {
  name: string;
  href: string;
  description?: string;
}

export interface BrandConfig {
  brand: BrandDomain;
  name: string;
  tagline: string;
  subtitle: string;
  domain: string;
  logoText: string;
  navLinks: NavLink[];
  ctaButton: { text: string; href: string };
  mcBotPrompt: string;
  theme: {
    primary: string;
    accent: string;
    bgClass: string;
  };
  features: {
    streaming: boolean;
    stiMenu: boolean;
    educatorSignIn: boolean;
    heroesPage: boolean;
    giftTiers: boolean;
    kupid: boolean;
    fanCam: boolean;
    contentApprovalRequired: boolean;
  };
}

// ---- GPM: G Putnam Music (Flagship) ----
const GPM_CONFIG: BrandConfig = {
  brand: 'GPM',
  name: 'G Putnam Music',
  tagline: 'The One Stop Song Shop',
  subtitle: 'Activity-Based, Context-Aware Music Intelligence',
  domain: 'gputnammusic.com',
  logoText: 'Dream the Stream',
  navLinks: [
    { name: 'GPM E1', href: '/who', description: 'Brand: Who is GPM?' },
    { name: 'R-Lists', href: '/artists', description: 'Creative: Our Artists' },
    { name: 'Heroes', href: '/heroes', description: 'Strategy: Grandpa\'s Legacy' },
    { name: 'KUBs', href: '/ships', description: 'Business: Sponsorships' },
    { name: 'Accolades', href: '/accolades' },
  ],
  ctaButton: { text: 'DREAM THE STREAM', href: '/ships' },
  mcBotPrompt: 'Pick an Activity — Click any T20 box or GPM PIX to stream',
  theme: {
    primary: '#8B4513',
    accent: '#DAA520',
    bgClass: 'bg-[#8B4513]',
  },
  features: {
    streaming: true,
    stiMenu: true,
    educatorSignIn: false,
    heroesPage: true,
    giftTiers: true,
    kupid: true,
    fanCam: true,
    contentApprovalRequired: false,
  },
};

// ---- KFS: Kids Fun Songs ----
const KFS_CONFIG: BrandConfig = {
  brand: 'KFS',
  name: 'Kids Fun Songs',
  tagline: 'Pediatric & Classroom Approved',
  subtitle: 'Songs that Heal & Teach',
  domain: 'kidsfunsongs.com',
  logoText: 'Kids Fun Songs',
  navLinks: [
    { name: 'Singalongs', href: '/singalongs', description: 'KFS music library' },
    { name: 'STI Menu', href: '/sti', description: 'Standard Template Items' },
    { name: 'Educators', href: '/educators', description: 'Educator sign-in & freebies' },
    { name: 'Heroes', href: '/heroes', description: 'Hero Pillars' },
  ],
  ctaButton: { text: 'START STREAMING', href: '/singalongs' },
  mcBotPrompt: 'Pick a Singalong — Click any KFS PIX to stream',
  theme: {
    primary: '#FF6B35',
    accent: '#00BCD4',
    bgClass: 'bg-[#FF6B35]',
  },
  features: {
    streaming: true,
    stiMenu: true,
    educatorSignIn: true,
    heroesPage: true,
    giftTiers: false,
    kupid: false,
    fanCam: false,
    contentApprovalRequired: true, // Silent approval gate
  },
};

// ---- KLEIGH ----
const KLEIGH_CONFIG: BrandConfig = {
  brand: 'KLEIGH',
  name: 'Kleigh',
  tagline: 'Artist Brand',
  subtitle: 'Original Music by Kleigh',
  domain: '2kleigh.com',
  logoText: 'Kleigh',
  navLinks: [
    { name: 'Music', href: '/kleigh', description: 'Kleigh artist page' },
    { name: 'Heroes', href: '/heroes' },
  ],
  ctaButton: { text: 'LISTEN NOW', href: '/kleigh' },
  mcBotPrompt: 'Pick a Kleigh track to stream',
  theme: {
    primary: '#E91E63',
    accent: '#9C27B0',
    bgClass: 'bg-[#E91E63]',
  },
  features: {
    streaming: true,
    stiMenu: false,
    educatorSignIn: false,
    heroesPage: true,
    giftTiers: false,
    kupid: false,
    fanCam: false,
    contentApprovalRequired: false,
  },
};

// ---- SCHERER ----
const SCHERER_CONFIG: BrandConfig = {
  brand: 'SCHERER',
  name: 'Michael Scherer',
  tagline: 'Artist Brand',
  subtitle: 'Original Music by Michael Scherer',
  domain: 'gputnammusic.com',
  logoText: 'Michael Scherer',
  navLinks: [
    { name: 'Music', href: '/scherer', description: 'Scherer artist page' },
    { name: 'Heroes', href: '/heroes' },
  ],
  ctaButton: { text: 'LISTEN NOW', href: '/scherer' },
  mcBotPrompt: 'Pick a Scherer track to stream',
  theme: {
    primary: '#1565C0',
    accent: '#42A5F5',
    bgClass: 'bg-[#1565C0]',
  },
  features: {
    streaming: true,
    stiMenu: false,
    educatorSignIn: false,
    heroesPage: true,
    giftTiers: false,
    kupid: false,
    fanCam: false,
    contentApprovalRequired: false,
  },
};

// ---- BRAND REGISTRY ----
const BRAND_REGISTRY: Record<BrandDomain, BrandConfig> = {
  GPM: GPM_CONFIG,
  KFS: KFS_CONFIG,
  KLEIGH: KLEIGH_CONFIG,
  SCHERER: SCHERER_CONFIG,
};

export function getBrandConfig(brand: BrandDomain): BrandConfig {
  return BRAND_REGISTRY[brand] || GPM_CONFIG;
}

export function getBrandFromHostname(hostname: string): BrandDomain {
  const HOSTNAME_MAP: Record<string, BrandDomain> = {
    'gputnammusic.com': 'GPM',
    'www.gputnammusic.com': 'GPM',
    '2kleigh.com': 'KLEIGH',
    'www.2kleigh.com': 'KLEIGH',
    'itskleigh.com': 'KLEIGH',
    'www.itskleigh.com': 'KLEIGH',
    'kidsfunsongs.com': 'KFS',
    'www.kidsfunsongs.com': 'KFS',
  };
  return HOSTNAME_MAP[hostname] || 'GPM';
}

export { GPM_CONFIG, KFS_CONFIG, KLEIGH_CONFIG, SCHERER_CONFIG, BRAND_REGISTRY };
