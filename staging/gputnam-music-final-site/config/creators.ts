/**
 * config/creators.ts — GPM Creator Registry (staging copy)
 * Single source of truth for creator identities, roles, and portal scopes.
 *
 * ⚠️  ROLE ACCURACY LOCK
 *   • Zach Garrett (ZG): songwriter & GPN vocalist ONLY — NOT a PIX collaborator.
 *     Pairs with MSJ as creative team "The Awesome Squad."
 *   • PIXIE (Jane Burton): HERB BLOG author ("PIXIE's PIX") + GPM FP playlist curator.
 */

export type CreatorBrand = 'KLEIGH' | 'MSJ' | 'ZG' | 'LGM' | 'PIXIE';

export type CreatorScope =
  | 'AUDIO'
  | 'IMAGE'
  | 'LYRICS'
  | 'PDF'
  | 'KEZ_CAMPAIGN'
  | 'VOCAL_DEMO'
  | 'VISUAL_ART'
  | 'STUDIO_PHOTO'
  | 'HERB_BLOG'
  | 'GPM_FP_PLAYLIST';

export interface Creator {
  id: string;
  brand: CreatorBrand;
  displayName: string;
  legalName: string;
  role: string;
  scope: CreatorScope[];
  pairedWith?: CreatorBrand;
  tagline: string;
  portalSlug: string;
}

export const CREATORS: Creator[] = [
  {
    id: 'kleigh',
    brand: 'KLEIGH',
    displayName: 'KLEIGH',
    legalName: 'Michael Clay / Clayton Michael Gunn',
    role: 'Vocalist · Songwriter · Pianist · Visual Artist',
    scope: ['AUDIO', 'IMAGE', 'LYRICS'],
    tagline: 'The Legacy Collection',
    portalSlug: 'kleigh',
  },
  {
    id: 'msj',
    brand: 'MSJ',
    displayName: 'Michael Scherer',
    legalName: 'Michael Scherer',
    role: 'Pianist · Performer · Songwriter — The Awesome Squad',
    scope: ['AUDIO', 'PDF', 'KEZ_CAMPAIGN'],
    pairedWith: 'ZG',
    tagline: 'KEZ PLZ — Keys for a Keyboard',
    portalSlug: 'msj',
  },
  {
    id: 'zg',
    brand: 'ZG',
    displayName: 'Zach Garrett',
    legalName: 'Zach Garrett',
    role: 'Songwriter · GPN Vocalist — The Awesome Squad',
    scope: ['LYRICS', 'VOCAL_DEMO'],
    pairedWith: 'MSJ',
    tagline: 'The Awesome Squad',
    portalSlug: 'zg',
  },
  {
    id: 'lgm',
    brand: 'LGM',
    displayName: 'Lloyd G Miller',
    legalName: 'Lloyd G Miller',
    role: 'Visual Artist · Studio Owner',
    scope: ['VISUAL_ART', 'STUDIO_PHOTO'],
    tagline: 'Studio & Canvas',
    portalSlug: 'lgm',
  },
  {
    id: 'pixie',
    brand: 'PIXIE',
    displayName: 'PIXIE',
    legalName: 'Jane Burton',
    role: 'HERB BLOG Author · GPM FP Playlist Curator',
    scope: ['HERB_BLOG', 'GPM_FP_PLAYLIST'],
    tagline: "PIXIE's PIX — Herbal Gardening & Nature",
    portalSlug: 'pixie',
  },
];

export function getCreatorBySlug(slug: string): Creator | undefined {
  return CREATORS.find((c) => c.portalSlug === slug.toLowerCase());
}

/** Accepted MIME types per scope. */
export const SCOPE_ACCEPT: Record<CreatorScope, string[]> = {
  AUDIO:           ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac'],
  IMAGE:           ['image/jpeg', 'image/png', 'image/webp'],
  LYRICS:          ['text/plain', 'application/pdf'],
  PDF:             ['application/pdf'],
  KEZ_CAMPAIGN:    ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'],
  VOCAL_DEMO:      ['audio/mpeg', 'audio/wav', 'audio/flac'],
  VISUAL_ART:      ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'],
  STUDIO_PHOTO:    ['image/jpeg', 'image/png', 'image/webp'],
  // Blog posts arrive as JSON {title, content} from the rich-text editor
  HERB_BLOG:       ['application/json', 'text/plain'],
  // Playlist as JSON track-list OR audio file
  GPM_FP_PLAYLIST: ['application/json', 'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac'],
};
