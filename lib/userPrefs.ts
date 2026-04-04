/**
 * lib/userPrefs.ts — GPM User Preference Store
 *
 * Persists user preferences in localStorage under the key 'gpm_user_prefs'.
 * Falls back to FOUNDER_DEFAULTS when no prefs are saved.
 *
 * Used by: HomeFP player (bg video scene, avatar, lyrics toggle, season).
 */

import type { SceneKey, Season } from '../config/bgVideoLibrary';
import { FOUNDER_DEFAULTS } from '../config/founderDefaults';

export type AvatarMode =
  | 'runner'
  | 'biker'
  | 'parachutist'
  | 'figure-skater'
  | 'surfer'
  | 'skier'
  | 'none';

export interface UserPrefs {
  favLocations: SceneKey[];
  favAvatarMode: AvatarMode;
  lyricsDefault: boolean;
  seasonOverride: Season | null;
  southernHemisphere: boolean;
}

const STORAGE_KEY = 'gpm_user_prefs';

function isServer(): boolean {
  return typeof window === 'undefined';
}

export function loadPrefs(): UserPrefs {
  if (isServer()) return { ...FOUNDER_DEFAULTS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...FOUNDER_DEFAULTS };
    return { ...FOUNDER_DEFAULTS, ...JSON.parse(raw) } as UserPrefs;
  } catch {
    return { ...FOUNDER_DEFAULTS };
  }
}

export function savePrefs(prefs: Partial<UserPrefs>): void {
  if (isServer()) return;
  try {
    const current = loadPrefs();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...prefs }));
  } catch {
    // localStorage unavailable (private browsing etc.) — silent fail
  }
}

export function resetPrefs(): void {
  if (isServer()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silent
  }
}

/** Derive avatar mode from BPM / mood when user has no explicit preference */
export function defaultAvatarForMood(mood: string, bpm?: number): AvatarMode {
  const bpmVal = bpm ?? 120;
  const moodLo = mood.toLowerCase();

  if (moodLo.includes('classical') || moodLo.includes('dreamy')) return 'figure-skater';
  if (moodLo.includes('ski') || moodLo.includes('snow') || moodLo.includes('co-ski')) return 'skier';
  if (moodLo.includes('surf') || moodLo.includes('beach') || moodLo.includes('summer')) return 'surfer';
  if (moodLo.includes('parachut') || moodLo.includes('float')) return 'parachutist';
  if (bpmVal >= 140) return 'runner';
  if (bpmVal >= 110) return 'biker';
  return 'runner';
}

/** Cycle through avatar modes (used when user taps avatar) */
const AVATAR_MODES: AvatarMode[] = [
  'runner', 'biker', 'parachutist', 'figure-skater', 'surfer', 'skier', 'none',
];

export function nextAvatarMode(current: AvatarMode): AvatarMode {
  const idx = AVATAR_MODES.indexOf(current);
  return AVATAR_MODES[(idx + 1) % AVATAR_MODES.length];
}
