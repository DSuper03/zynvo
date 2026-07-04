/**
 * In-memory sliding-window rate limiter for the proxy layer.
 *
 * NOTE: This implementation is per-process. For multi-instance / serverless
 * deployments (Vercel Edge, multiple Node replicas), replace the store with
 * Upstash Redis (@upstash/ratelimit) to share state across instances.
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60_000, max: 20 });
 *   const result = await limiter.check(identifier);
 *   if (!result.allowed) { return tooManyRequests(requestId); }
 */

export interface RateLimitOptions {
  /** Sliding window duration in milliseconds. */
  windowMs: number;
  /** Maximum number of requests allowed within the window. */
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAtMs: number;
}

interface WindowEntry {
  timestamps: number[];
}

export interface RateLimiter {
  check(identifier: string): Promise<RateLimitResult>;
  reset(identifier: string): void;
}

/**
 * Creates a sliding-window rate limiter backed by an in-memory Map.
 */
export function createRateLimiter(options: RateLimitOptions): RateLimiter {
  const store = new Map<string, WindowEntry>();

  // Periodically prune stale entries to prevent unbounded memory growth
  const pruneInterval = setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      const fresh = entry.timestamps.filter((t) => now - t < options.windowMs);
      if (fresh.length === 0) {
        store.delete(key);
      } else {
        entry.timestamps = fresh;
      }
    });
  }, options.windowMs * 2);

  // In environments that support unref (Node.js) avoid blocking process exit
  if (pruneInterval.unref) pruneInterval.unref();

  return {
    async check(identifier: string): Promise<RateLimitResult> {
      const now = Date.now();
      const cutoff = now - options.windowMs;

      let entry = store.get(identifier);
      if (!entry) {
        entry = { timestamps: [] };
        store.set(identifier, entry);
      }

      // Prune timestamps outside the window
      entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

      if (entry.timestamps.length >= options.max) {
        const oldest = entry.timestamps[0]!;
        return {
          allowed: false,
          remaining: 0,
          resetAtMs: oldest + options.windowMs,
        };
      }

      entry.timestamps.push(now);
      return {
        allowed: true,
        remaining: options.max - entry.timestamps.length,
        resetAtMs: now + options.windowMs,
      };
    },

    reset(identifier: string): void {
      store.delete(identifier);
    },
  };
}

// ----- Pre-configured limiters for common route policies -----

/** Auth endpoints: login, signup, password reset — strict */
export const authLimiter = createRateLimiter({ windowMs: 60_000, max: 10 });

/** Event registration and ticket booking — moderate */
export const registrationLimiter = createRateLimiter({ windowMs: 60_000, max: 20 });

/** Community / club creation — moderate */
export const clubCreationLimiter = createRateLimiter({ windowMs: 60_000, max: 10 });

/** Admin routes — strict */
export const adminLimiter = createRateLimiter({ windowMs: 60_000, max: 30 });

/** General authenticated mutation routes — permissive */
export const defaultMutationLimiter = createRateLimiter({ windowMs: 60_000, max: 60 });

/**
 * Resolves the appropriate rate limiter for a given upstream API path.
 * Returns null for read-only GET routes that don't need rate limiting.
 */
export function resolveRateLimiter(
  method: string,
  apiPath: string,
): RateLimiter | null {
  const lower = apiPath.toLowerCase();

  // Auth routes
  if (
    lower.includes('/auth/') ||
    lower.includes('/syncwithclerk') ||
    lower.includes('/clerklogin') ||
    lower.includes('/forgot') ||
    lower.includes('/reset-password') ||
    lower.includes('/resend') ||
    lower.includes('/verify')
  ) {
    return authLimiter;
  }

  // Admin routes
  if (lower.includes('/admin/') || lower.includes('/v2/admin')) {
    return adminLimiter;
  }

  // Registration / ticket routes
  if (
    lower.includes('/register') ||
    lower.includes('/tickets') ||
    lower.includes('/booking')
  ) {
    return registrationLimiter;
  }

  // Club / community creation
  if (method === 'POST' && (lower.includes('/clubs') || lower.includes('/club'))) {
    return clubCreationLimiter;
  }

  // General mutations
  if (method !== 'GET' && method !== 'HEAD') {
    return defaultMutationLimiter;
  }

  return null;
}
