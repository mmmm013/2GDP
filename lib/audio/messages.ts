<<<<<<< HEAD
export const AUDIO_UI_MESSAGES = {
  playbackBlocked: 'Tap play again to start audio.',
  playbackUnavailable: 'Playback unavailable right now. Please try again.',
  trackUnavailable: 'Track unavailable right now. Try another selection.',
  noSource: 'No playable source found for this track.',
} as const;
=======
/**
 * Audio UI message strings used across the GPM audio pipeline.
 */

export const AUDIO_UI_MESSAGES = {
  /** Shown when browser blocks autoplay and the audio cannot start */
  playbackBlocked: 'Tap to enable audio',
  /** Shown when the audio file is missing or fails to load */
  fileNotFound: 'Audio unavailable',
  /** Generic playback error fallback */
  playbackError: 'Audio error — using voice fallback',
} as const;

export type AudioUiMessageKey = keyof typeof AUDIO_UI_MESSAGES;
>>>>>>> origin/copilot/fix-audio-playback-issues
