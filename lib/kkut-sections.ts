/**
 * K-KUT Section Architecture — GPM Canonical Song-Structure Taxonomy
 *
 * ASCAP Rule: K-KUTs are EXACT EXCERPTS of whole song sections only.
 * - Sections are never time-sliced; they are pre-rendered section audio files
 *   stored in Supabase storage and catalogued in k_kut_assets.
 * - A K-KUT may contain ONE or MORE CONTIGUOUS sections in ORIGINAL SONG ORDER.
 * - Only 1 K-KUT per purchase — no rearrangement allowed.
 * - This order is the canonical reference; no deviation is permitted.
 */

// ---------------------------------------------------------------------------
// Canonical section order — fixed, non-negotiable (matches ASCAP filing)
// ---------------------------------------------------------------------------
export const SECTION_ORDER = [
  'Intro',
  'V1',
  'Pre1',
  'Ch1',
  'V2',
  'Pre2',
  'Ch2',
  'BR',
  'Ch3',
  'Outro',
] as const;

export type SectionTag = (typeof SECTION_ORDER)[number];

// Human-readable labels for display
export const SECTION_LABELS: Record<SectionTag, string> = {
  Intro: 'Intro',
  V1:    'Verse 1',
  Pre1:  'Pre-Chorus 1',
  Ch1:   'Chorus 1',
  V2:    'Verse 2',
  Pre2:  'Pre-Chorus 2',
  Ch2:   'Chorus 2',
  BR:    'Bridge',
  Ch3:   'Final Chorus',
  Outro: 'Outro',
};

// Short badge labels (used in the creator + player UI)
export const SECTION_BADGES: Record<SectionTag, string> = {
  Intro: 'INTRO',
  V1:    'V1',
  Pre1:  'PRE1',
  Ch1:   'CH1',
  V2:    'V2',
  Pre2:  'PRE2',
  Ch2:   'CH2',
  BR:    'BR',
  Ch3:   'CH3',
  Outro: 'OUTRO',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the canonical index of a section tag (0-based). */
export function sectionIndex(tag: SectionTag): number {
  return SECTION_ORDER.indexOf(tag);
}

/**
 * Validates that the provided tags are:
 *  1. All valid section tags
 *  2. In original song order (ascending index, no skips)
 *  3. Contiguous (indices form a gapless sequence)
 *  4. At least one section selected
 *
 * Returns null on success, or an error string on failure.
 */
export function validateSections(tags: string[]): string | null {
  if (!tags.length) return 'Select at least one section.';

  const valid = new Set<string>(SECTION_ORDER);
  for (const t of tags) {
    if (!valid.has(t)) return `"${t}" is not a valid section.`;
  }

  const indices = (tags as SectionTag[]).map(sectionIndex);
  // Must be sorted in original order
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] <= indices[i - 1]) {
      return 'Sections must be in original song order — no rearranging (ASCAP rule).';
    }
    // Must be contiguous (no gaps)
    if (indices[i] !== indices[i - 1] + 1) {
      return 'Sections must be contiguous — no skipping sections in between.';
    }
  }

  return null;
}

/**
 * Given a start and end section tag (inclusive), returns all sections
 * in between in canonical order. Used by the range-picker UI.
 */
export function sectionRange(from: SectionTag, to: SectionTag): SectionTag[] {
  const a = sectionIndex(from);
  const b = sectionIndex(to);
  if (a > b) return sectionRange(to, from); // normalize
  return SECTION_ORDER.slice(a, b + 1) as SectionTag[];
}
