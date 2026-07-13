import { NextResponse } from 'next/server';

import { getOAuthDiscoveryMetadata } from '@/lib/oauth-discovery';

export const runtime = 'nodejs';

export async function GET() {
  const metadata = await getOAuthDiscoveryMetadata();

  return NextResponse.json(metadata, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
