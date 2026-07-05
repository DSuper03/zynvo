/**
 * Public top-clubs BFF route.
 * Refactored to use the shared proxy utility instead of hand-rolled fetch logic.
 */
import { type NextRequest } from 'next/server';
import { proxyPublicRequest } from '@/lib/server/proxy';

export async function GET(request: NextRequest) {
  return proxyPublicRequest(request, '/api/v1/clubs/getAll', {
    cache: 'revalidate',
    revalidateSeconds: 300,
  });
}
