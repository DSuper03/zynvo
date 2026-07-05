/**
 * Discover posts BFF route.
 * Refactored to use the shared proxy utility.
 */
import { type NextRequest } from 'next/server';
import { proxyPublicRequest } from '@/lib/server/proxy';

export async function GET(request: NextRequest) {
  // Preserve the `page` query param — proxyRequest forwards all searchParams automatically
  return proxyPublicRequest(request, '/api/v1/post/all', { cache: 'no-store' });
}
