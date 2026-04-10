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

const RETRY_DELAYS_MS = [500, 1000, 2000] as const;

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

/**
 * safePlayWithRetry — like safePlay but retries up to 3 times on network/decode
 * errors (500ms → 1s → 2s backoff). NotAllowedError (autoplay block) is NOT
 * retried because retrying without a user gesture will keep failing.
 */
export async function safePlayWithRetry(
  audio: HTMLAudioElement,
  context: string,
  meta?: Record<string, unknown>
): Promise<SafePlayResult> {
  let lastResult: SafePlayResult = { ok: false, context, meta };

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    lastResult = await safePlay(audio, context, { ...meta, attempt });

    if (lastResult.ok) return lastResult;

    // Don't retry autoplay policy blocks — user gesture required
    if (lastResult.error?.name === 'NotAllowedError') return lastResult;

    // No delay after the final attempt
    if (attempt < RETRY_DELAYS_MS.length) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }
  }

  return lastResult;
}
