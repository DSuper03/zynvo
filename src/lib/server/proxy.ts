/**
 * Secure proxy utility — the single gateway through which all frontend-to-backend
 * communication flows.
 *
 * Architecture:
 *   Browser → Next.js Route Handler → proxyRequest() → Express Backend
 *
 * Every request:
 *   1. Receives a unique request ID for end-to-end tracing.
 *   2. Is rate-limited based on the target API path.
 *   3. Attaches x-internal-proxy-secret so the backend can reject direct calls.
 *   4. Replaces any client-supplied Authorization header with the server-side
 *      Clerk session token (for authenticated routes).
 *   5. Streams non-JSON responses directly without buffering.
 *   6. Times out after PROXY_TIMEOUT ms and returns a standardized 504.
 *   7. Never leaks backend URLs, stack traces, or secrets to the browser.
 */
import { NextRequest, NextResponse } from 'next/server';

import { getServerEnv } from './env';
import { getProxyAuth } from './auth';
import { resolveRequestId, appendSearchParams } from './request';
import {
  buildUpstreamHeaders,
  applySecurityHeaders,
  extractSafeResponseHeaders,
} from './headers';
import {
  proxyLogger,
  type ProxyLogFields,
} from './logger';
import {
  gatewayTimeout,
  badGateway,
  internalError,
  unauthorized,
  tooManyRequests,
  normalizeUpstreamError,
} from './errors';
import { resolveRateLimiter } from './rate-limit';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProxyOptions {
  /**
   * If true, a valid Clerk session is required. Returns 401 when missing.
   * If false, the request is forwarded without an Authorization header.
   * Defaults to true.
   */
  requireAuth?: boolean;

  /**
   * Cache policy applied to successful GET responses.
   * Authenticated routes always use 'no-store'.
   */
  cache?: 'no-store' | 'private' | 'revalidate';

  /** Override revalidate seconds when cache is 'revalidate'. */
  revalidateSeconds?: number;

  /**
   * When true, the response body is streamed directly to the browser.
   * Useful for file downloads, SSE, and large responses.
   * Auto-detected from content-type when not specified.
   */
  stream?: boolean;
}

// ─── Core implementation ──────────────────────────────────────────────────────

/**
 * Proxies a Next.js route handler request to the backend.
 *
 * @param request     - The incoming Next.js request
 * @param backendPath - Backend API path (e.g. '/api/v1/events/events')
 * @param options     - Proxy behaviour options
 */
export async function proxyRequest(
  request: NextRequest,
  backendPath: string,
  options: ProxyOptions = {},
): Promise<NextResponse> {
  const env = getServerEnv();
  const { requireAuth = true, cache = 'no-store', revalidateSeconds = 60 } = options;

  const requestId = resolveRequestId(request.headers.get('x-request-id'));
  const startMs = Date.now();
  const method = request.method.toUpperCase();

  const logBase: ProxyLogFields = {
    requestId,
    method,
    route: request.nextUrl.pathname,
    backendEndpoint: backendPath,
  };

  // ── 1. Resolve auth ────────────────────────────────────────────────────────
  const proxyAuth = requireAuth ? await getProxyAuth() : null;

  if (requireAuth && !proxyAuth) {
    proxyLogger.warn({ ...logBase, error: 'No Clerk session' });
    return unauthorized(requestId);
  }

  const userId = proxyAuth?.userId ?? null;
  const authorizationHeader = proxyAuth ? `Bearer ${proxyAuth.token}` : null;

  // ── 2. Rate limiting ───────────────────────────────────────────────────────
  const limiter = resolveRateLimiter(method, backendPath);
  if (limiter) {
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'anonymous';
    const identifier = userId ?? clientIp;
    const limitResult = await limiter.check(identifier);
    if (!limitResult.allowed) {
      proxyLogger.warn({ ...logBase, userId, error: 'Rate limit exceeded' });
      return tooManyRequests(requestId);
    }
  }

  // ── 3. Build upstream URL ──────────────────────────────────────────────────
  const base = env.BACKEND_BASE_URL.replace(/\/$/, '');
  const upstreamUrl = appendSearchParams(
    `${base}${backendPath}`,
    request.nextUrl.searchParams,
  );

  // ── 4. Build upstream headers ──────────────────────────────────────────────
  const upstreamHeaders = buildUpstreamHeaders(
    request.headers,
    requestId,
    authorizationHeader,
    env.INTERNAL_PROXY_SECRET,
  );

  // ── 5. Prepare request body ────────────────────────────────────────────────
  const hasBody = method !== 'GET' && method !== 'HEAD';
  let bodyInit: BodyInit | null = null;

  if (hasBody) {
    const contentType = request.headers.get('content-type') ?? '';

    if (contentType.includes('multipart/form-data')) {
      // Stream multipart bodies — do NOT buffer into memory
      bodyInit = request.body;
      // Preserve the full content-type including boundary
      upstreamHeaders['content-type'] = contentType;
    } else {
      bodyInit = request.body;
    }
  }

  // ── 6. Upstream fetch with timeout ────────────────────────────────────────
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    env.PROXY_TIMEOUT,
  );

  let upstream: Response;

  try {
    upstream = await fetch(upstreamUrl, {
      method,
      headers: upstreamHeaders,
      body: bodyInit,
      signal: controller.signal,
      // @ts-expect-error — Next.js 15 fetch does not expose duplex in typings
      duplex: 'half',
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const durationMs = Date.now() - startMs;

    if (err instanceof DOMException && err.name === 'AbortError') {
      proxyLogger.error({ ...logBase, userId, durationMs, timedOut: true, error: 'Upstream timeout' });
      return gatewayTimeout(requestId);
    }

    const msg = err instanceof Error ? err.message : 'Unknown fetch error';
    proxyLogger.error({ ...logBase, userId, durationMs, error: msg });
    return badGateway(requestId);
  } finally {
    clearTimeout(timeoutId);
  }

  const durationMs = Date.now() - startMs;

  proxyLogger.info({
    ...logBase,
    userId,
    status: upstream.status,
    durationMs,
  });

  // ── 7. Handle non-2xx upstream responses ──────────────────────────────────
  if (!upstream.ok) {
    return normalizeUpstreamError(upstream, requestId);
  }

  // ── 8. Build response ──────────────────────────────────────────────────────
  const upstreamContentType = upstream.headers.get('content-type') ?? '';
  const safeHeaders = extractSafeResponseHeaders(upstream.headers);

  const responseHeaders = new Headers(safeHeaders);
  responseHeaders.set('x-request-id', requestId);
  applySecurityHeaders(responseHeaders);

  // Cache-control
  const isAuthenticated = !!userId;
  if (isAuthenticated || cache === 'no-store' || cache === 'private') {
    responseHeaders.set('cache-control', 'no-store, no-cache');
  } else if (cache === 'revalidate') {
    responseHeaders.set(
      'cache-control',
      `public, s-maxage=${revalidateSeconds}, stale-while-revalidate=${revalidateSeconds * 2}`,
    );
  }

  // ── 9. Stream non-JSON content directly ───────────────────────────────────
  const shouldStream =
    options.stream ??
    (!upstreamContentType.includes('application/json') && upstream.body !== null);

  if (shouldStream && upstream.body) {
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  }

  // ── 10. JSON response ──────────────────────────────────────────────────────
  try {
    const json = await upstream.json();
    return NextResponse.json(json, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    proxyLogger.error({ ...logBase, userId, durationMs, error: 'Failed to parse upstream JSON' });
    return internalError(requestId);
  }
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

/**
 * Proxy an authenticated request. Requires a valid Clerk session (401 if missing).
 */
export async function proxyAuthenticatedRequest(
  request: NextRequest,
  backendPath: string,
  options: Omit<ProxyOptions, 'requireAuth'> = {},
): Promise<NextResponse> {
  return proxyRequest(request, backendPath, { ...options, requireAuth: true });
}

/**
 * Proxy a public request. No Clerk session required.
 * Use only for truly public read endpoints.
 */
export async function proxyPublicRequest(
  request: NextRequest,
  backendPath: string,
  options: Omit<ProxyOptions, 'requireAuth'> = {},
): Promise<NextResponse> {
  return proxyRequest(request, backendPath, { ...options, requireAuth: false });
}

/**
 * Proxy an admin request. Requires a valid Clerk session and applies the strict admin rate limiter.
 */
export async function proxyAdminRequest(
  request: NextRequest,
  backendPath: string,
  options: Omit<ProxyOptions, 'requireAuth'> = {},
): Promise<NextResponse> {
  return proxyRequest(request, backendPath, { ...options, requireAuth: true });
}
