/**
 * Catch-all proxy for /api/v1/* backend routes.
 *
 * Browser calls /api/v1/<anything> → this handler → secure proxy → backend.
 * The actual backend URL is never sent to the browser.
 *
 * Authentication: Clerk session is extracted server-side. Public GET paths
 * (events list, clubs list, posts) do not require a session.
 */
import { type NextRequest } from 'next/server';
import { proxyAuthenticatedRequest, proxyPublicRequest } from '@/lib/server/proxy';

/**
 * Paths under /api/v1 that are accessible without a Clerk session.
 * All other paths require authentication.
 */
const PUBLIC_PATH_PREFIXES = [
  '/api/v1/events/events',
  '/api/v1/events/event/',
  '/api/v1/clubs/getAll',
  '/api/v1/clubs/getClubs',
  '/api/v1/post/all',
  '/api/v1/user/getAllUsers',
  '/api/v1/user/getPublicUser',
  '/api/v1/user/SearchUser',
];

function isPublicPath(method: string, path: string): boolean {
  if (method !== 'GET') return false;
  return PUBLIC_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return params.then(({ path }) => {
    const backendPath = '/api/v1/' + path.join('/');

    if (isPublicPath(request.method, backendPath)) {
      return proxyPublicRequest(request, backendPath, { cache: 'no-store' });
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
