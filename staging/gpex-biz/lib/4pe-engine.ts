/**
 * 4PE-BIZ ENGINE — GPEx Business Excel-A-rator
 * Core platform module. Industry-agnostic. Central IL focus.
 *
 * 4PE = Four-Point Excellence
 *   P1: Process  — standardize + systematize
 *   P2: People   — workforce + culture alignment
 *   P3: Platform — technology + data infrastructure
 *   P4: Profit   — revenue model + cost optimization
 *
 * KUTs + KKr are bundled into ALL 4PE platforms.
 */

export type Industry =
  | 'healthcare'
  | 'construction'
  | 'retail'
  | 'food-service'
  | 'logistics'
  | 'manufacturing'
  | 'professional-services'
  | 'real-estate'
  | 'education'
  | 'it-systems';

export type CostType = 'retail' | 'wholesale';

export interface BizTier {
  id: string;
  label: string;
  tagline: string;
  costType: CostType;
  priceMonthly: number;
  features: string[];
}

export interface FourPE {
  process: string[];
  people: string[];
  platform: string[];
  profit: string[];
}

// ── Top 10 Central IL Industries ─────────────────────────────────────────────
export const CENTRAL_IL_INDUSTRIES: Record<Industry, string> = {
  healthcare:             'Healthcare & Medical Services',
  construction:          'Construction & Trades',
  retail:                'Retail & Consumer Goods',
  'food-service':        'Food Service & Hospitality',
  logistics:             'Logistics & Distribution',
  manufacturing:         'Manufacturing & Fabrication',
  'professional-services':'Professional Services (Legal/Accounting/HR)',
  'real-estate':         'Real Estate & Property Management',
  education:             'Education & Training',
  'it-systems':          'IT Systems & Managed Services',
};

// ── BIZ Tiers (Retail vs Wholesale) ──────────────────────────────────────────
export const BIZ_TIERS: BizTier[] = [
  {
    id: 'starter',
    label: 'STARTER',
    tagline: 'Launch the system',
    costType: 'retail',
    priceMonthly: 97,
    features: [
      '4PE Audit (Process + People)',
      'KUT Library Access (read-only)',
      'Monthly ops report',
      'Email support',
    ],
  },
  {
    id: 'accelerator',
    label: 'ACCELERATOR',
    tagline: 'Activate the engine',
    costType: 'retail',
    priceMonthly: 297,
    features: [
      'Full 4PE Audit suite',
      'KUT + KKr Library (full access)',
      'Weekly ops cadence',
      'OPS-BOT integration',
      'Dedicated account lead',
    ],
  },
  {
    id: 'wholesale',
    label: 'WHOLESALE PARTNER',
    tagline: 'White-label the platform',
    costType: 'wholesale',
    priceMonthly: 0, // contract-based
    features: [
      'Platform white-label rights',
      'All 4PE modules',
      'KUT + KKr full bundle',
      'Revenue share model',
      'Priority build queue',
    ],
  },
];

// ── 4PE Framework per Industry ────────────────────────────────────────────────
export function get4PEFramework(industry: Industry): FourPE {
  const base: FourPE = {
    process:  ['Document core workflows', 'Identify bottlenecks', 'Apply DMAIC cycle'],
    people:   ['Role clarity matrix', 'Accountability system', 'Culture KPIs'],
    platform: ['Audit current tech stack', 'Data integration plan', 'Automation roadmap'],
    profit:   ['Cost segregation (retail vs wholesale)', 'Revenue leakage audit', 'Pricing optimization'],
  };

  const overlays: Partial<Record<Industry, Partial<FourPE>>> = {
    healthcare: {
      process:  ['HIPAA compliance workflow', 'Patient intake optimization', 'Billing cycle audit'],
      platform: ['EHR integration layer', 'Telehealth infrastructure', 'Claims automation'],
    },
    construction: {
      process:  ['Job-site SOPs', 'Subcontractor coordination', 'Punch-list system'],
      platform: ['Project management stack', 'Estimating automation', 'Field-to-office data sync'],
    },
    'it-systems': {
      process:  ['Ticket triage SOP', 'Change management protocol', 'SLA enforcement'],
      platform: ['RMM + PSA integration', 'Security posture baseline', 'Client onboarding automation'],
    },
  };

  const overlay = overlays[industry];
  if (!overlay) return base;

  return {
    process:  overlay.process  ?? base.process,
    people:   overlay.people   ?? base.people,
    platform: overlay.platform ?? base.platform,
    profit:   overlay.profit   ?? base.profit,
  };
}
