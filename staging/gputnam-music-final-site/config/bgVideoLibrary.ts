/**
 * config/bgVideoLibrary.ts — GPM Background Video Library
 *
 * Maps (scene key, season) → video asset path / URL.
 * Used by the Active/Jogger Experience player (§3 of the GPM plan).
 *
 * ─────────────────────────────────────────────────────────────
 * ASSET STATUS
 * ─────────────────────────────────────────────────────────────
 * Paths prefixed with /video/ resolve from /public/video/.
 * Until real assets are uploaded, each entry falls back to an
 * empty string ("") — the player renders a solid colour gradient
 * instead.  Drop MP4/WebM files into public/video/ and update
 * the `src` values below.
 * ─────────────────────────────────────────────────────────────
 */

export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type SceneKey =
  | 'beach'
  | 'waterfall'
  | 'central-park'
  | 'wrigley-field'
  | 'golden-gate'
  | 'victoria-canyon'
  | 'china-ocean'
  | 'london-run'
  | 'paris-run'
  | 'vancouver-run'
  | 'co-ski'
  | 'co-snowboard';

export interface BgVideo {
  src: string;          // path or URL — empty = gradient fallback
  poster?: string;      // preview frame
  credit?: string;      // attribution if needed
}

export type BgVideoEntry = Record<Season, BgVideo>;

export const BG_VIDEO_LIBRARY: Record<SceneKey, BgVideoEntry> = {
  beach: {
    spring:  { src: '/video/beach-spring.mp4',  poster: '/video/posters/beach-spring.jpg'  },
    summer:  { src: '/video/beach-summer.mp4',  poster: '/video/posters/beach-summer.jpg'  },
    fall:    { src: '/video/beach-fall.mp4',    poster: '/video/posters/beach-fall.jpg'    },
    winter:  { src: '/video/beach-winter.mp4',  poster: '/video/posters/beach-winter.jpg'  },
  },
  waterfall: {
    spring:  { src: '/video/waterfall-spring.mp4' },
    summer:  { src: '/video/waterfall-summer.mp4' },
    fall:    { src: '/video/waterfall-fall.mp4'   },
    winter:  { src: '/video/waterfall-winter.mp4' },
  },
  'central-park': {
    spring:  { src: '/video/centralpark-spring.mp4' },
    summer:  { src: '/video/centralpark-summer.mp4' },
    fall:    { src: '/video/centralpark-fall.mp4'   },
    winter:  { src: '/video/centralpark-winter.mp4' },
  },
  'wrigley-field': {
    spring:  { src: '/video/wrigley-spring.mp4' },
    summer:  { src: '/video/wrigley-summer.mp4' },
    fall:    { src: '/video/wrigley-fall.mp4'   },
    winter:  { src: '/video/wrigley-winter.mp4' },
  },
  'golden-gate': {
    spring:  { src: '/video/goldengate-spring.mp4' },
    summer:  { src: '/video/goldengate-summer.mp4' },
    fall:    { src: '/video/goldengate-fall.mp4'   },
    winter:  { src: '/video/goldengate-winter.mp4' },
  },
  'victoria-canyon': {
    spring:  { src: '/video/victoriacanyon-spring.mp4' },
    summer:  { src: '/video/victoriacanyon-summer.mp4' },
    fall:    { src: '/video/victoriacanyon-fall.mp4'   },
    winter:  { src: '/video/victoriacanyon-winter.mp4' },
  },
  'china-ocean': {
    spring:  { src: '/video/chinaocean-spring.mp4' },
    summer:  { src: '/video/chinaocean-summer.mp4' },
    fall:    { src: '/video/chinaocean-fall.mp4'   },
    winter:  { src: '/video/chinaocean-winter.mp4' },
  },
  'london-run': {
    spring:  { src: '/video/londonrun-spring.mp4' },
    summer:  { src: '/video/londonrun-summer.mp4' },
    fall:    { src: '/video/londonrun-fall.mp4'   },
    winter:  { src: '/video/londonrun-winter.mp4' },
  },
  'paris-run': {
    spring:  { src: '/video/parisrun-spring.mp4' },
    summer:  { src: '/video/parisrun-summer.mp4' },
    fall:    { src: '/video/parisrun-fall.mp4'   },
    winter:  { src: '/video/parisrun-winter.mp4' },
  },
  'vancouver-run': {
    spring:  { src: '/video/vancouverrun-spring.mp4' },
    summer:  { src: '/video/vancouverrun-summer.mp4' },
    fall:    { src: '/video/vancouverrun-fall.mp4'   },
    winter:  { src: '/video/vancouverrun-winter.mp4' },
  },
  'co-ski': {
    spring:  { src: '/video/coski-spring.mp4' },
    summer:  { src: '/video/coski-summer.mp4' },
    fall:    { src: '/video/coski-fall.mp4'   },
    winter:  { src: '/video/coski-winter.mp4' },
  },
  'co-snowboard': {
    spring:  { src: '/video/cosnowboard-spring.mp4' },
    summer:  { src: '/video/cosnowboard-summer.mp4' },
    fall:    { src: '/video/cosnowboard-fall.mp4'   },
    winter:  { src: '/video/cosnowboard-winter.mp4' },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOOD → SCENE affinity map
// ─────────────────────────────────────────────────────────────────────────────
export const MOOD_SCENE_MAP: Record<string, SceneKey> = {
  'high energy':  'central-park',
  energy:         'central-park',
  'road trip':    'golden-gate',
  driving:        'golden-gate',
  uplifting:      'waterfall',
  happy:          'beach',
  summer:         'beach',
  focus:          'central-park',
  adventurous:    'victoria-canyon',
  romantic:       'paris-run',
  calm:           'waterfall',
  relaxing:       'beach',
  melancholy:     'london-run',
  dreamy:         'china-ocean',
  background:     'vancouver-run',
  party:          'wrigley-field',
  dinner:         'paris-run',
};

// ─────────────────────────────────────────────────────────────────────────────
// SEASON HELPER (northern hemisphere default; southern hemisphere flag flips it)
// ─────────────────────────────────────────────────────────────────────────────
export function getCurrentSeason(southernHemisphere = false): Season {
  const month = new Date().getMonth(); // 0-11
  let season: Season;
  if (month >= 2 && month <= 4)       season = 'spring';
  else if (month >= 5 && month <= 7)  season = 'summer';
  else if (month >= 8 && month <= 10) season = 'fall';
  else                                 season = 'winter';

  if (!southernHemisphere) return season;

  const flip: Record<Season, Season> = {
    spring: 'fall',
    summer: 'winter',
    fall:   'spring',
    winter: 'summer',
  };
  return flip[season];
}

/**
 * Resolve the best background video for a given mood + optional override.
 * Returns BgVideo (may have empty `src` if asset not yet uploaded).
 */
export function resolveBgVideo(
  mood: string,
  options: {
    sceneOverride?: SceneKey;
    seasonOverride?: Season;
    southernHemisphere?: boolean;
  } = {}
): BgVideo & { scene: SceneKey; season: Season } {
  const scene: SceneKey =
    options.sceneOverride ??
    MOOD_SCENE_MAP[mood.toLowerCase()] ??
    'central-park';

  const season: Season =
    options.seasonOverride ?? getCurrentSeason(options.southernHemisphere);

  const entry = BG_VIDEO_LIBRARY[scene];
  return { ...entry[season], scene, season };
}
