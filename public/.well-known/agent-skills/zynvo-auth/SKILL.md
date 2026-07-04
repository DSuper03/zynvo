# Zynvo Authentication Discovery

Use this skill when an agent needs to discover how Zynvo protects APIs and how registration metadata is published.

## Discovery endpoints

1. Fetch `https://zynvosocial.com/.well-known/oauth-protected-resource` to discover the protected resource identifier, authorization servers, supported scopes, and bearer methods.
2. Fetch `https://zynvosocial.com/.well-known/oauth-authorization-server` to inspect OAuth authorization server metadata and the `agent_auth` block.
3. Fetch `https://zynvosocial.com/.well-known/openid-configuration` for OpenID Connect discovery details.
4. Read `https://zynvosocial.com/auth.md` for human-readable registration and credential guidance.

## Important metadata

- Issuer: `https://clerk.zynvosocial.com`
- Authorization endpoint: `https://clerk.zynvosocial.com/oauth/authorize`
- Token endpoint: `https://clerk.zynvosocial.com/oauth/token`
- JWKS URI: `https://clerk.zynvosocial.com/.well-known/jwks.json`

## Agent registration hints

- Registration URI: `https://zynvosocial.com/api/agent/auth`
- Claim URI: `https://zynvosocial.com/api/agent/auth/claim`
- Revocation URI: `https://zynvosocial.com/api/agent/auth/revoke`

## Guidance

- Discover metadata first; do not guess authorization endpoints.
- Present bearer tokens in the `Authorization` header.
- If public self-service registration is unavailable, use `auth.md` as the source of truth for supported flows and current limitations.
