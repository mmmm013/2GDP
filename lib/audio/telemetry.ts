export type AudioTelemetryEvent = {
  event: 'audio_play_ok' | 'audio_play_failed' | 'audio_error';
  source: string;
  message?: string;
  track?: string;
  url?: string;
};

export function emitAudioTelemetry(payload: AudioTelemetryEvent): void {
  try {
    const body = JSON.stringify({
      ...payload,
      ts: new Date().toISOString(),
      path: typeof window !== 'undefined' ? window.location.pathname : 'server',
    });

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon('/api/public/audio-event', body);
      return;
    }

    if (typeof fetch !== 'undefined') {
      fetch('/api/public/audio-event', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        // Intentionally swallowed: telemetry must never block UX.
      });
    }
  } catch {
    // Intentionally swallowed: telemetry must never block UX.
  }
}
