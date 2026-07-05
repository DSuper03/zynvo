import { NextResponse } from 'next/server';

import {
  AGENT_CLAIM_URI,
  AGENT_REGISTER_URI,
  AGENT_REVOCATION_URI,
  AUTH_MD_URL,
  CLERK_ISSUER,
  SITE_URL,
} from '@/lib/oauth-discovery';

export const runtime = 'nodejs';

const body = `# auth.md

Zynvo publishes agent authentication and registration discovery metadata for protected APIs.

## Discovery

- Protected resource metadata: ${SITE_URL}/.well-known/oauth-protected-resource
- Authorization server metadata: ${SITE_URL}/.well-known/oauth-authorization-server
- OpenID Connect discovery: ${SITE_URL}/.well-known/openid-configuration
- Agent registration skill: ${AUTH_MD_URL}
- DNS-AID records: publish under the \`_agents.${SITE_URL.replace('https://', '')}\` zone at your DNS provider

## Authorization server

- Issuer: ${CLERK_ISSUER}
- Authorization endpoint: ${CLERK_ISSUER}/oauth/authorize
- Token endpoint: ${CLERK_ISSUER}/oauth/token
- JWKS URI: ${CLERK_ISSUER}/.well-known/jwks.json

## Agent registration

Agents should discover the OAuth protected resource metadata first, then fetch the authorization server metadata and inspect the \`agent_auth\` block.

### Supported identity types

1. \`anonymous\`
   Request a limited \`access_token\` credential type for agent bootstrap.
2. \`identity_assertion\`
   Supported assertion type: \`verified_email\`.
   Credential type: \`access_token\`.

## Registration endpoints

- Register URI: ${AGENT_REGISTER_URI}
- Claim URI: ${AGENT_CLAIM_URI}
- Revocation URI: ${AGENT_REVOCATION_URI}

## Expected flow

1. Read ${SITE_URL}/.well-known/oauth-protected-resource.
2. Fetch ${SITE_URL}/.well-known/oauth-authorization-server.
3. Read the \`agent_auth\` block and choose a supported identity type.
4. Call the register URI to begin registration.
5. If the selected method requires proof of identity, complete the claim step at the claim URI.
6. Use the issued credential as a Bearer token in the \`Authorization\` header when calling protected APIs.

## Notes

- OAuth bearer tokens are presented in the HTTP \`Authorization: Bearer <token>\` header.
- Human-readable API documentation is available at ${SITE_URL}/api-docs.
- Machine-readable API metadata is available at ${SITE_URL}/openapi.json.
`;

export async function GET() {
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
