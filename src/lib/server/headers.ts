/**
 * Header utilities for the secure proxy layer.
 *
 * - Only safe headers are forwarded upstream.
 * - Security headers are added to every proxy response.
 * - Cookies, Origin, Referer, Host, and Connection are never forwarded.
 */
type HeaderLike = Pick<Headers, 'forEach'>;

/** Headers forwarded from the browser request to the upstream backend. */
const FORWARD_REQUEST_HEADERS = new Set([
  'content-type',
  'accept',
  'accept-language',
  'accept-encoding',
  'user-agent',
  'x-request-id',
]);

/** Headers explicitly blocked from forwarding to the backend. */
const BLOCKED_REQUEST_HEADERS = new Set([
  'cookie',
  'origin',
  'referer',
  'host',
  'connection',
  'authorization', // Replaced by the server-side token
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-real-ip',
]);

/**
 * Builds the headers to be sent upstream to the backend.
 *
 * @param incomingHeaders - Headers from the browser request
 * @param requestId - Trace ID for this request
 * @param authToken - Server-side Authorization token (replaces any client-supplied value)
 * @param proxySecret - x-internal-proxy-secret value from env
 */
export function buildUpstreamHeaders(
  incomingHeaders: Headers | ReadonlyHeaders,
  requestId: string,
  authToken: string | null,
  proxySecret: string,
): Record<string, string> {
  const out: Record<string, string> = {};

  // Iterate over safe forwarded headers
  incomingHeaders.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (FORWARD_REQUEST_HEADERS.has(lower) && !BLOCKED_REQUEST_HEADERS.has(lower)) {
      out[lower] = value;
    }
  });

  // Always inject
  out['x-request-id'] = requestId;
  out['x-internal-proxy-secret'] = proxySecret;

  if (authToken) {
    out['authorization'] = authToken;
  }

  return out;
}

/**
 * Security headers added to every proxy response.
 */
export const SECURITY_RESPONSE_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

/**
 * Applies security headers to a Headers object (mutates).
 */
export function applySecurityHeaders(headers: Headers): void {
  for (const [key, value] of Object.entries(SECURITY_RESPONSE_HEADERS)) {
    headers.set(key, value);
  }
}

/**
 * Safe upstream response headers to pass back to the browser.
 * Sensitive backend infrastructure headers are stripped.
 */
const SAFE_RESPONSE_HEADERS = new Set([
  'content-type',
  'content-length',
  'content-disposition',
  'content-encoding',
  'cache-control',
  'etag',
  'last-modified',
  'x-request-id',
]);

/**
 * Extracts safe response headers from the upstream response.
 */
export function extractSafeResponseHeaders(
  upstreamHeaders: Headers,
): Record<string, string> {
  const out: Record<string, string> = {};
  upstreamHeaders.forEach((value, key) => {
    if (SAFE_RESPONSE_HEADERS.has(key.toLowerCase())) {
      out[key] = value;
    }
  });
  return out;
}
