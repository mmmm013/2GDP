// supabase/functions/_shared/crypto.ts
// Deterministic SHA-256 hashing for tokens and IPs

/**
 * Returns a lowercase hex SHA-256 digest of the input string.
 * Used for: token_hash (never store raw token), ip_hash (never store raw IP).
 */
export async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Derives ip_hash from the request headers.
 * Checks x-forwarded-for, x-real-ip, then falls back to "unknown".
 * Result is salted with a fixed prefix to prevent rainbow table attacks.
 */
export async function deriveIpHash(req: Request): Promise<string> {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const raw = (forwarded ? forwarded.split(",")[0].trim() : realIp) ?? "unknown";
  // Salt to prevent preimage attacks on known IPs
  return sha256Hex(`kut:ip:${raw}`);
}

/** Generates a random UUID-style request correlation id. */
export function newRequestId(): string {
  return crypto.randomUUID();
}
