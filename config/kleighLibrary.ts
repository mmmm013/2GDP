/* config/kleighLibrary.ts */

export type Mood = 'Melancholy' | 'Uplifting' | 'Focus' | 'High Energy' | 'Dreamy';

export interface LicenseInfo {
  holder: string;
  type: string;       // e.g. "exclusive", "non-exclusive"
  territories?: string[]; // optional list of territories
  expires?: string;   // ISO date if applicable
}

export interface Track {
  id: string;
  title: string;   // ASCAP title — single source of truth for track identity
  vocalist: string;
  url: string; // Internal GPMC audio URL (Supabase Storage or signed proxy)
  coverImage: string;
  moods: Mood[];
  isPremium: boolean;

  /* Suggested enhancements */
  durationSeconds?: number;
  releaseDate?: string; // ISO date
  bpm?: number;
  key?: string;
  explicit?: boolean;
  format?: string; // e.g. "mp3", "flac"
  previewUrl?: string;
  waveformUrl?: string;
  licenseInfo?: LicenseInfo;
  metadata?: Record<string, unknown>; // any additional provider-specific fields
}

// ---------------------------------------------------------
// THE MASTER MANIFEST
// Tracks are identified by ASCAP title — never by a third-party
// numeric ID. Audio resolves via internal GPMC/Supabase Storage.
// ---------------------------------------------------------
export const KLEIGH_LIBRARY: Track[] = [
  {
    id: 'k1',
    title: 'Kleigh Song 01',
    vocalist: 'Kleigh',
    url: '/api/resolve-audio?title=Kleigh+Song+01',
    coverImage: '/images/kleigh-cover.jpg',
    moods: ['Melancholy', 'Focus'],
    isPremium: true,

    durationSeconds: 198,
    releaseDate: '2024-09-01',
    bpm: 78,
    key: 'Em',
    explicit: false,
    format: 'mp3',
    previewUrl: '/api/resolve-audio?title=Kleigh+Song+01&preview=true',
    waveformUrl: '/waveforms/k1.json',
    licenseInfo: {
      holder: 'Kleigh / MusicMaykers',
      type: 'non-exclusive',
      territories: ['US', 'CA'],
    },
    metadata: { ascapTitle: 'Kleigh Song 01' }
  },
  {
    id: 'k2',
    title: 'Kleigh Song 02',
    vocalist: 'Kleigh',
    url: '/api/resolve-audio?title=Kleigh+Song+02',
    coverImage: '/images/kleigh-cover.jpg',
    moods: ['High Energy', 'Uplifting'],
    isPremium: true,

    durationSeconds: 222,
    releaseDate: '2024-09-01',
    bpm: 120,
    key: 'C',
    explicit: false,
    format: 'mp3',
    previewUrl: '/api/resolve-audio?title=Kleigh+Song+02&preview=true',
    waveformUrl: '/waveforms/k2.json',
    licenseInfo: {
      holder: 'Kleigh / MusicMaykers',
      type: 'non-exclusive',
      territories: ['Global']
    },
    metadata: { ascapTitle: 'Kleigh Song 02' }
  }
  // add more tracks following the shape above
];
