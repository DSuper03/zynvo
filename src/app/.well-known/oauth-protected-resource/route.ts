import { NextResponse } from 'next/server';

import { SITE_URL, getOAuthDiscoveryMetadata } from '@/lib/oauth-discovery';

const RESOURCE = SITE_URL;

export const runtime = 'nodejs';

export async function GET() {
  const discovery = await getOAuthDiscoveryMetadata();

  return NextResponse.json(
    {
      resource: RESOURCE,
      authorization_servers: [discovery.issuer],
      scopes_supported: discovery.scopes_supported,
      bearer_methods_supported: ['header'],
      resource_documentation: `${RESOURCE}/api-docs`,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    },
  );
}
