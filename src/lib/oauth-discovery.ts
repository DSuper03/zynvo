export const SITE_URL = 'https://zynvosocial.com';
export const CLERK_ISSUER = 'https://clerk.zynvosocial.com';
export const AUTH_MD_URL = `${SITE_URL}/auth.md`;
export const AGENT_REGISTER_URI = `${SITE_URL}/api/agent/auth`;
export const AGENT_CLAIM_URI = `${SITE_URL}/api/agent/auth/claim`;
export const AGENT_REVOCATION_URI = `${SITE_URL}/api/agent/auth/revoke`;

const fallbackMetadata = {
  issuer: CLERK_ISSUER,
  authorization_endpoint: `${CLERK_ISSUER}/oauth/authorize`,
  token_endpoint: `${CLERK_ISSUER}/oauth/token`,
  revocation_endpoint: `${CLERK_ISSUER}/oauth/token/revoke`,
  introspection_endpoint: `${CLERK_ISSUER}/oauth/token_info`,
  userinfo_endpoint: `${CLERK_ISSUER}/oauth/userinfo`,
  jwks_uri: `${CLERK_ISSUER}/.well-known/jwks.json`,
  scopes_supported: [
    'public_metadata',
    'openid',
    'offline_access',
    'user:org:read',
    'private_metadata',
    'email',
    'profile',
  ],
  response_types_supported: ['code'],
  response_modes_supported: ['form_post', 'query'],
  grant_types_supported: ['authorization_code', 'refresh_token'],
  subject_types_supported: ['public'],
  id_token_signing_alg_values_supported: ['RS256'],
  token_endpoint_auth_methods_supported: ['client_secret_basic', 'none', 'client_secret_post'],
  claims_supported: [
    'family_name',
    'picture',
    'sub',
    'iss',
    'exp',
    'given_name',
    'name',
    'preferred_username',
    'aud',
    'iat',
    'email',
    'email_verified',
    'org_id',
  ],
  code_challenge_methods_supported: ['S256'],
  backchannel_logout_supported: false,
  frontchannel_logout_supported: false,
};

export type OAuthDiscoveryMetadata = typeof fallbackMetadata;

export function buildAgentAuthMetadata() {
  return {
    skill: AUTH_MD_URL,
    register_uri: AGENT_REGISTER_URI,
    claim_uri: AGENT_CLAIM_URI,
    revocation_uri: AGENT_REVOCATION_URI,
    events_supported: ['credential_revoked'],
    identity_types_supported: ['anonymous', 'identity_assertion'],
    anonymous: {
      credential_types_supported: ['access_token'],
      claim_uri: AGENT_CLAIM_URI,
    },
    identity_assertion: {
      assertion_types_supported: ['verified_email'],
      credential_types_supported: ['access_token'],
      claim_uri: AGENT_CLAIM_URI,
    },
  };
}

export async function getOAuthDiscoveryMetadata(): Promise<OAuthDiscoveryMetadata> {
  try {
    const response = await fetch(`${CLERK_ISSUER}/.well-known/openid-configuration`, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return fallbackMetadata;
    }

    return (await response.json()) as OAuthDiscoveryMetadata;
  } catch {
    return fallbackMetadata;
  }
}
