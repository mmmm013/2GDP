/**
 * Audio UI message strings used across the GPM audio pipeline.
 */
export const AUDIO_UI_MESSAGES = {
  playbackBlocked: 'Tap to enable audio',
  playbackUnavailable: 'Playback unavailable right now. Please try again.',
  trackUnavailable: 'Track unavailable right now. Try another selection.',
  noSource: 'No playable source found for this track.',
  fileNotFound: 'Audio unavailable',
  playbackError: 'Audio error - using voice fallback',
} as const;

export type AudioUiMessageKey = keyof typeof AUDIO_UI_MESSAGES;
