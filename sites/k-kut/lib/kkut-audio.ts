/**
 * K-KUT Web Audio section preview engine
 * Synthesises a musical chord preview for each canonical song section.
 * Uses the Web Audio API — no external assets required.
 */

interface SectionProfile {
  /** Fundamental frequencies (Hz) for each chord tone */
  freqs: number[];
  /** Oscillator waveform */
  type: OscillatorType;
  /** Total playback duration in seconds */
  duration: number;
}

// Each section has its own harmonic character
const SECTION_PROFILES: Record<string, SectionProfile> = {
  Intro: { freqs: [261.63, 329.63, 392.00],          type: "sine",     duration: 2.2 },
  V1:    { freqs: [220.00, 261.63, 329.63],           type: "sine",     duration: 2.5 },
  V2:    { freqs: [220.00, 261.63, 329.63],           type: "sine",     duration: 2.5 },
  Pre1:  { freqs: [246.94, 311.13, 369.99],           type: "triangle", duration: 2.0 },
  Pre2:  { freqs: [246.94, 311.13, 369.99],           type: "triangle", duration: 2.0 },
  Ch1:   { freqs: [261.63, 329.63, 392.00, 523.25],  type: "sine",     duration: 3.0 },
  Ch2:   { freqs: [261.63, 329.63, 392.00, 523.25],  type: "sine",     duration: 3.0 },
  Ch3:   { freqs: [261.63, 329.63, 392.00, 523.25],  type: "sine",     duration: 3.0 },
  BR:    { freqs: [293.66, 349.23, 440.00],           type: "triangle", duration: 2.8 },
  Outro: { freqs: [174.61, 220.00, 261.63, 329.63],  type: "sine",     duration: 2.5 },
};

/**
 * Play a synthesised musical preview for the given K-KUT section.
 * @param sectionTag  Canonical section tag (e.g. "Ch1", "V2", "BR").
 * @returns           Playback duration in milliseconds, or 0 if unavailable.
 */
export function playKKutSection(sectionTag: string): number {
  if (typeof window === "undefined") return 0;

  // Support vendor-prefixed AudioContext (older Safari)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AudioCtxCtor = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!AudioCtxCtor) return 0;

  try {
    const ctx = new AudioCtxCtor() as AudioContext;
    const profile = SECTION_PROFILES[sectionTag] ?? SECTION_PROFILES.Ch1;
    const { freqs, type, duration } = profile;
    const now = ctx.currentTime;

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // ADSR: quick staggered attack, brief decay, sustained, long release
      const attackEnd = now + 0.08 + i * 0.025;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.16 / freqs.length, attackEnd);
      gain.gain.setValueAtTime(0.12 / freqs.length, attackEnd + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.02);
      osc.stop(now + duration + 0.1);
    });

    return Math.round(duration * 1000);
  } catch {
    return 0;
  }
}
