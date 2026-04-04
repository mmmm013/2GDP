/**
 * config/founderDefaults.ts — Founder (Greg Putnam) default preferences
 *
 * These are used as fallbacks when a user has no saved preferences in
 * localStorage.  Surfaced via "Reset to Founder Defaults" button in the
 * settings panel.
 */

import type { SceneKey, Season } from './bgVideoLibrary';
import type { AvatarMode } from '../lib/userPrefs';

export interface FounderDefaults {
  favLocations: SceneKey[];
  favAvatarMode: AvatarMode;
  lyricsDefault: boolean;
  seasonOverride: Season | null;
  southernHemisphere: boolean;
}

export const FOUNDER_DEFAULTS: FounderDefaults = {
  // Greg's preferred running backdrops
  favLocations: ['central-park', 'golden-gate', 'london-run'],
  // Founder default avatar: runner
  favAvatarMode: 'runner',
  // Show lyrics by default
  lyricsDefault: true,
  // Let the app auto-detect season
  seasonOverride: null,
  southernHemisphere: false,
};
