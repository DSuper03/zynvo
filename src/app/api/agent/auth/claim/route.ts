import { NextResponse } from 'next/server';

import { AGENT_CLAIM_URI, AUTH_MD_URL } from '@/lib/oauth-discovery';

export const runtime = 'nodejs';

const responseBody = {
  error: 'agent_claim_not_enabled',
  message:
    'Automated claim ceremonies are not enabled for public self-service yet. Use /auth.md for the published discovery metadata and current guidance.',
  claim_uri: AGENT_CLAIM_URI,
  documentation_uri: AUTH_MD_URL,
};

export async function GET() {
  return NextResponse.json(responseBody, {
    status: 501,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function POST() {
  return NextResponse.json(responseBody, {
    status: 501,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
