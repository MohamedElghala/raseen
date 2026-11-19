/**
 * Sliding-window in-memory rate limiter for Raseen API endpoints.
 * Falls back cleanly in serverless environments without external Redis dependencies.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function extractClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return 'local-client';
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (now - lastCleanup > CLEANUP_INTERVAL_MS && rateLimitStore.size > 500) {
    for (const [k, v] of rateLimitStore.entries()) {
      const valid = v.timestamps.filter((t) => t > windowStart);
      if (valid.length === 0) {
        rateLimitStore.delete(k);
      } else {
        v.timestamps = valid;
      }
    }
    lastCleanup = now;
  }

  const entry = rateLimitStore.get(key) || { timestamps: [] };
  const recent = entry.timestamps.filter((ts) => ts > windowStart);

  if (recent.length >= maxRequests) {
    const oldest = recent[0] || now;
    return {
      allowed: false,
      remaining: 0,
      resetAt: oldest + windowMs,
    };
  }

  recent.push(now);
  rateLimitStore.set(key, { timestamps: recent });

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - recent.length),
    resetAt: now + windowMs,
  };
}

export function resetRateLimitForTests(prefix?: string): void {
  if (!prefix) {
    rateLimitStore.clear();
    return;
  }
  for (const key of rateLimitStore.keys()) {
    if (key.startsWith(prefix)) {
      rateLimitStore.delete(key);
    }
  }
}
