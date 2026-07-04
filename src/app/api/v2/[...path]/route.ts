/**
 * Catch-all proxy for /api/v2/* backend routes.
 *
 * Browser calls /api/v2/<anything> → this handler → secure proxy → backend.
 * The actual backend URL is never sent to the browser.
 *
 * v2 routes include auth flows and admin operations.
 * Auth endpoints are public (no session needed to authenticate);
 * admin routes require a Clerk session.
 */
import { type NextRequest } from 'next/server';
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

function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return params.then(({ path }) => {
    const backendPath = '/api/v2/' + path.join('/');

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
