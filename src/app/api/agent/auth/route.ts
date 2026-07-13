import { NextResponse } from 'next/server';

import { AGENT_CLAIM_URI, AGENT_REGISTER_URI, AGENT_REVOCATION_URI, AUTH_MD_URL } from '@/lib/oauth-discovery';

export const runtime = 'nodejs';

const responseBody = {
  error: 'agent_registration_not_enabled',
  message:
    'Automated agent registration is not enabled for public self-service yet. Use /auth.md for discovery metadata and registration guidance.',
  register_uri: AGENT_REGISTER_URI,
  claim_uri: AGENT_CLAIM_URI,
  revocation_uri: AGENT_REVOCATION_URI,
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
