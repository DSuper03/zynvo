import { NextRequest } from 'next/server';
import { proxyAuthenticatedRequest } from '@/lib/server/proxy';

export async function GET(request: NextRequest) {
  return proxyAuthenticatedRequest(request, '/api/v1/user/isClubAdmin');
}
