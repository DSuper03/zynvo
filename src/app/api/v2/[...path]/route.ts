/**
 * Catch-all proxy for /api/v2/* backend routes.
 *
 * In development: calls the backend directly (no proxy layer).
 * In production:  goes through the secure proxy (Clerk auth, rate-limit, etc.).
 */
import { type NextRequest, NextResponse } from 'next/server';
import { proxyAuthenticatedRequest, proxyPublicRequest } from '@/lib/server/proxy';

/**
 * v2 paths that are accessible without a Clerk session.
 * Primarily auth exchange endpoints.
 */
const PUBLIC_V2_PREFIXES = [
  '/api/v2/user/auth/checkUserExists',
  '/api/v2/user/auth/clerkLogin',
];

function isPublicV2Path(method: string, path: string): boolean {
  if (method === 'GET') {
    // Most public GET reads
    if (path.startsWith('/api/v2/user/getPublicUser')) return true;
  }
  return PUBLIC_V2_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/**
 * Direct fetch to backend — used in development to bypass the proxy layer.
 */
async function directFetch(
  request: NextRequest,
  backendPath: string,
): Promise<NextResponse> {
  const base = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_BASE_URL ||
    'https://zynvosocial-be-274792984950.asia-south1.run.app'
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

function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return params.then(({ path }) => {
    const backendPath = '/api/v2/' + path.join('/');

    if (process.env.NODE_ENV === 'development') {
      return directFetch(request, backendPath);
    }

    if (isPublicV2Path(request.method, backendPath)) {
      return proxyPublicRequest(request, backendPath);
    }

    return proxyAuthenticatedRequest(request, backendPath);
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
