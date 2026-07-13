/**
 * Server-side request helpers: ID generation, cache policy, path utilities.
 */

/**
 * Generates a short unique request ID for tracing across logs and error responses.
 */
export function generateRequestId(): string {
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
  return `REQ-${id}`;
}

/**
 * Returns the request ID from the incoming header, or generates a fresh one.
 */
export function resolveRequestId(incomingHeader: string | null): string {
  if (incomingHeader && /^[A-Z0-9-]{4,64}$/i.test(incomingHeader)) {
    return incomingHeader;
  }
  return generateRequestId();
}

export type CachePolicy = 'no-store' | 'private' | 'revalidate';

/**
 * Resolves a Cache-Control header string for use on proxy responses.
 * Authenticated data must never be cached.
 */
export function resolveCacheControl(
  policy: CachePolicy,
  revalidateSeconds = 60,
): string {
  switch (policy) {
    case 'no-store':
      return 'no-store, no-cache';
    case 'private':
      return 'private, no-store';
    case 'revalidate':
      return `public, s-maxage=${revalidateSeconds}, stale-while-revalidate=${revalidateSeconds * 2}`;
  }
}

/**
 * Joins a dynamic path segment array to a clean URL path string.
 */
export function buildUpstreamPath(segments: string[]): string {
  return '/' + segments.map(encodeURIComponent).join('/');
}

/**
 * Appends a URL search-params string to a base URL string.
 */
export function appendSearchParams(base: string, params: URLSearchParams): string {
  const qs = params.toString();
  if (!qs) return base;
  return `${base}?${qs}`;
}
