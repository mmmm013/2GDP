/**
 * safePlay — wraps HTMLAudioElement.play() with error handling.
 * Returns a result object so callers can react without try/catch.
 */

export interface SafePlayResult {
  ok: boolean;
  error?: Error;
  context: string;
  meta?: Record<string, unknown>;
}

/**
 * Attempt to play an HTMLAudioElement safely.
 * @param audio   The HTMLAudioElement to play
 * @param context A short string identifying the call site (e.g. 'GpmBot-greeting')
 * @param meta    Optional extra metadata for logging
 */
export async function safePlay(
  audio: HTMLAudioElement,
  context: string,
  meta?: Record<string, unknown>
): Promise<SafePlayResult> {
  try {
    await audio.play();
    return { ok: true, context, meta };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { ok: false, error, context, meta };
  }
}
