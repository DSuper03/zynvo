/**
 * Catch-all proxy for /api/v1/* backend routes.
 *
 * In development: calls the backend directly (no proxy layer).
 * In production:  goes through the secure proxy (Clerk auth, rate-limit, etc.).
 */
import { type NextRequest, NextResponse } from 'next/server';
import { proxyAuthenticatedRequest, proxyPublicRequest } from '@/lib/server/proxy';

/**
 * Paths under /api/v1 that are accessible without a Clerk session.
 * All other paths require authentication.
 */
const PUBLIC_GET_PREFIXES = [
  '/api/v1/events/events',
  '/api/v1/events/event/',
  '/api/v1/events/all',
  '/api/v1/events/search',
  '/api/v1/events/event-details',
  '/api/v1/events/user-details',
  '/api/v1/clubs/getAll',
  '/api/v1/clubs/getClubs',
  '/api/v1/clubs/public',
  '/api/v1/post/all',
  '/api/v1/post/',
  '/api/v1/user/getAllUsers',
  '/api/v1/user/getPublicUser',
  '/api/v1/user/SearchUser',
  '/api/v1/user/isClubAdmin/',
  // Public on the backend; signed-out visitors (e.g. from Instagram links)
  // got 401s here: no event schedule/speakers, no college suggestions at signup.
  '/api/v1/events/schedule/',
  '/api/v1/events/getSpeakers',
  '/api/v1/user/colleges',
];

/** Public GETs with an id in the middle of the path: event gallery and judges. */
const PUBLIC_GET_PATTERNS = [/^\/api\/v1\/leaderboard\/?$/, /^\/api\/v1\/events\/[^/]+\/(gallery|judges)$/];

const PUBLIC_POST_PREFIXES = [
  '/api/v1/user/signup',
  '/api/v1/user/forgot',
  '/api/v1/user/reset-password/confirm',
  '/api/v1/user/reset-password/prepare',
  // Carries a Clerk session token in the body; the backend verifies it.
  '/api/v1/user/reset-password/clerk',
  '/api/v1/user/verify',
  '/api/v1/user/ResendEmail',
  '/api/v1/user/syncWithClerk',
  // Backend enforces its own JWT via AuthMiddleware; listed here so the
  // client's backend token is forwarded instead of the Clerk session token.
  '/api/v1/user/deleteAccount',
  '/api/v1/contact/contact',
  '/api/v1/contact/feedback',
];

/**
 * Public, non-personalised GETs that Vercel's edge may cache (seconds).
 * Repeat visits are then served without reaching the backend worker.
 * Stale copies are served for twice as long while one refresh runs.
 * Never add routes whose answer depends on the caller (posts, users,
 * tickets/passes): the edge cache does not vary by viewer.
 */
const EDGE_CACHE_SECONDS: [prefix: string, seconds: number][] = [
  ['/api/v1/events/all', 60],
  ['/api/v1/events/event/', 60],
  ['/api/v1/events/search', 30],
  ['/api/v1/clubs/getAll', 120],
  ['/api/v1/clubs/public', 120],
  ['/api/v1/clubs/getClubs', 120],
];

function edgeCacheSeconds(request: NextRequest, path: string): number | null {
  if (request.method !== 'GET') return null;
  // Signed-in requests stay uncached: keeps personal data out of shared caches
  // even if a route later starts tailoring its answer.
  if (request.headers.get('authorization')) return null;
  return EDGE_CACHE_SECONDS.find(([prefix]) => path.startsWith(prefix))?.[1] ?? null;
}

function isPublicPath(method: string, path: string): boolean {
  if (method === 'GET') {
    return (
      PUBLIC_GET_PREFIXES.some((prefix) => path.startsWith(prefix)) ||
      PUBLIC_GET_PATTERNS.some((re) => re.test(path))
    );
  }
  if (method === 'POST') {
    return PUBLIC_POST_PREFIXES.some((prefix) => path.startsWith(prefix));
  }
  return false;
}

/**
 * Direct fetch to backend — used in development to bypass the proxy layer.
 * Mirrors the old pre-proxy behaviour so Clerk keys, proxy secrets, etc.
 * are not required when running locally.
 */
async function directFetch(
  request: NextRequest,
  backendPath: string,
): Promise<NextResponse> {
  const base = (
    process.env.BACKEND_BASE_URL ||
    'https://zynvo-backend-worker.anirbanghosh060.workers.dev'
  ).replace(/\/$/, '');

  const upstreamUrl = new URL(backendPath, base);
  request.nextUrl.searchParams.forEach((v, k) => upstreamUrl.searchParams.set(k, v));

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  const headers: Record<string, string> = {};
  for (const h of ['content-type', 'accept', 'authorization', 'user-agent']) {
    const val = request.headers.get(h);
    if (val) headers[h] = val;
  }

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl.toString(), {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      // @ts-expect-error
      duplex: 'half',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Backend unreachable. Is the backend server running?',
        timestamp: new Date().toISOString(),
      },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  const safeHeaders = new Set([
    'content-type',
    'content-length',
    'cache-control',
    'etag',
    'retry-after',
    'retry-after',
    'x-request-id',
  ]);
  upstream.headers.forEach((value, key) => {
    if (safeHeaders.has(key.toLowerCase())) responseHeaders.set(key, value);
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const backendPath = '/api/v1/' + path.join('/');

    if (process.env.NODE_ENV === 'development') {
      return await directFetch(request, backendPath);
    }

    if (isPublicPath(request.method, backendPath)) {
      const seconds = edgeCacheSeconds(request, backendPath);
      return await proxyPublicRequest(
        request,
        backendPath,
        seconds ? { cache: 'revalidate', revalidateSeconds: seconds } : { cache: 'no-store' },
      );
    }

    return await proxyAuthenticatedRequest(request, backendPath);
  } catch (error) {
    console.error('[v1 proxy] Unhandled error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An internal error occurred.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
