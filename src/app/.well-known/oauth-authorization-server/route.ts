import { NextResponse } from 'next/server';

import { buildAgentAuthMetadata, getOAuthDiscoveryMetadata } from '@/lib/oauth-discovery';

export const runtime = 'nodejs';

export async function GET() {
  const metadata = await getOAuthDiscoveryMetadata();

  return NextResponse.json(
    {
      ...metadata,
      agent_auth: buildAgentAuthMetadata(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    },
  );
}
