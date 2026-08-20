// In-memory sliding-window rate limiter. This is intentionally simple: the
// project has no deployed, multi-instance production infrastructure yet
// (Phase 16 is not started), so a per-process store is an honest match for
// the current state rather than a false promise of distributed limiting.
// Revisit this when real hosting is chosen.
const requestTimestampsByKey = new Map();

export function createRateLimiter({ windowMs, maxRequests }) {
  return {
    check(key) {
      const now = Date.now();
      const windowStart = now - windowMs;
      const timestamps = (requestTimestampsByKey.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

      if (timestamps.length >= maxRequests) {
        requestTimestampsByKey.set(key, timestamps);
        return { allowed: false, retryAfterMs: timestamps[0] + windowMs - now };
      }

      timestamps.push(now);
      requestTimestampsByKey.set(key, timestamps);
      return { allowed: true };
    },
  };
}
