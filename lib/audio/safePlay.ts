import { emitAudioTelemetry } from '@/lib/audio/telemetry';

export async function safePlay(
  audio: HTMLAudioElement,
  source: string,
  details?: { track?: string; url?: string }
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await audio.play();
    emitAudioTelemetry({
      event: 'audio_play_ok',
      source,
      track: details?.track,
      url: details?.url,
    });
    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Playback blocked';
    emitAudioTelemetry({
      event: 'audio_play_failed',
      source,
      message,
      track: details?.track,
      url: details?.url,
    });
    return { ok: false, message };
  }
}
