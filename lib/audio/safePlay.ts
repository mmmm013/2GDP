/**
 * safePlay - wraps HTMLAudioElement.play() with consistent result handling.
 */

export interface SafePlayResult {
  ok: boolean;
  error?: Error;
  context: string;
  meta?: Record<string, unknown>;
}

const RETRY_DELAYS_MS = [500, 1000, 2000] as const;

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

export async function safePlayWithRetry(
  audio: HTMLAudioElement,
  context: string,
  meta?: Record<string, unknown>
): Promise<SafePlayResult> {
  let lastResult: SafePlayResult = { ok: false, context, meta };

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    lastResult = await safePlay(audio, context, { ...meta, attempt });

    if (lastResult.ok) return lastResult;

    if (lastResult.error?.name === 'NotAllowedError') return lastResult;

    if (attempt < RETRY_DELAYS_MS.length) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }
  }

  return lastResult;
}
