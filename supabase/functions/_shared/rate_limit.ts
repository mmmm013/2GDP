// supabase/functions/_shared/rate_limit.ts
// In-memory rate limiter keyed on token_hash + ip_hash
// Limits reset on cold start; suitable for Edge Function warm instances.
// For cross-instance enforcement, replace the Map with an Upstash Redis call.

type WindowEntry = {
  count: number;
  windowStart: number;
};

const store = new Map<string, WindowEntry>();

/**
 * Check and record a rate-limit hit.
 * @param key        Composite key, e.g. `${token_hash}:${ip_hash}:open`
 * @param limit      Max requests allowed in the window
 * @param windowMs   Window size in milliseconds
 * @returns { allowed: boolean; retryAfterMs: number }
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    // New window
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count < limit) {
    entry.count += 1;
    return { allowed: true, retryAfterMs: 0 };
  }

  const retryAfterMs = windowMs - (now - entry.windowStart);
  return { allowed: false, retryAfterMs };
}

// Route-specific limit configs
export const RATE_LIMITS = {
  open:    { limit: 10,  windowMs: 5  * 60 * 1000 }, // 10 / 5 min
  event:   { limit: 120, windowMs: 5  * 60 * 1000 }, // 120 / 5 min
  respond: { limit: 20,  windowMs: 10 * 60 * 1000 }, // 20 / 10 min
} as const;

export type RateLimitRoute = keyof typeof RATE_LIMITS;

/**
 * Convenience wrapper — pass route name + composite key.
 */
export function checkRoute(
  route: RateLimitRoute,
  compositeKey: string
): { allowed: boolean; retryAfterMs: number } {
  const cfg = RATE_LIMITS[route];
  return checkRateLimit(`${route}:${compositeKey}`, cfg.limit, cfg.windowMs);
}
