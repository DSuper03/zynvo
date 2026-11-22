/**
 * Server-confirmed product events, emitted by the API proxy when the backend
 * returns 2xx for a key mutation. Unlike client events these can't be dropped
 * by ad-blockers or closed tabs, so use them for source-of-truth metrics.
 *
 * Event names are prefixed `server_` so they never double-count with the
 * client-side events (which carry UX context like `source`).
 */

/** Decode (NOT verify) a backend JWT to read the user id. Only trust it after the backend returned 2xx. */
export function distinctIdFromAuthHeader(header: string | null | undefined): string | null {
  if (!header) return null;
  const token = header.replace(/^Bearer\s+/i, '').trim();
  return distinctIdFromJwt(token);
}

export function distinctIdFromJwt(token: string | null | undefined): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const json = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const payload = JSON.parse(json) as { id?: unknown; user_id?: unknown; iss?: unknown };
    // Clerk session tokens have an issuer URL and a `sub` of user_…; we only want our backend ids.
    const id = payload.id ?? payload.user_id;
    return typeof id === 'string' || typeof id === 'number' ? String(id) : null;
  } catch {
    return null;
  }
}

interface ServerEventRule {
  method: string;
  /** Matched against the backend path; capture groups become properties. */
  pattern: RegExp;
  event: string;
  params?: string[];
}

const RULES: ServerEventRule[] = [
  { method: 'POST', pattern: /^\/api\/v1\/user\/joinClub\/([^/]+)$/, event: 'server_club_joined', params: ['club_id'] },
  { method: 'POST', pattern: /^\/api\/v1\/user\/leaveClub\/([^/]+)$/, event: 'server_club_left', params: ['club_id'] },
  { method: 'POST', pattern: /^\/api\/v1\/clubs\/club$/, event: 'server_club_created' },
  { method: 'POST', pattern: /^\/api\/v1\/events\/event$/, event: 'server_event_created' },
  { method: 'POST', pattern: /^\/api\/v1\/events\/registerEvent$/, event: 'server_event_registered' },
  { method: 'POST', pattern: /^\/api\/v1\/post\/create$/, event: 'server_post_created' },
  { method: 'PUT', pattern: /^\/api\/v1\/user\/updateProfile$/, event: 'server_profile_updated' },
  { method: 'POST', pattern: /^\/api\/v1\/user\/deleteAccount$/, event: 'server_account_deleted' },
  { method: 'POST', pattern: /^\/api\/v2\/user\/auth\/clerkLogin$/, event: 'server_user_authenticated' },
  { method: 'POST', pattern: /^\/api\/v1\/user\/syncWithClerk$/, event: 'server_user_authenticated' },
  { method: 'POST', pattern: /^\/api\/v2\/admin\/transferOwnership\/([^/]+)$/, event: 'server_club_ownership_transferred', params: ['club_id'] },
  { method: 'POST', pattern: /^\/api\/v1\/events\/eventQueue\/([^/]+)\/approve$/, event: 'server_event_application_approved', params: ['event_id'] },
];

/** Paths whose JSON response carries a fresh backend token (used as the distinct id). */
export const AUTH_RESPONSE_PATHS = /^\/api\/(v2\/user\/auth\/clerkLogin|v1\/user\/syncWithClerk)$/;

export function matchServerEvent(
  method: string,
  backendPath: string,
): { event: string; properties: Record<string, string> } | null {
  for (const rule of RULES) {
    if (rule.method !== method) continue;
    const m = rule.pattern.exec(backendPath);
    if (!m) continue;
    const properties: Record<string, string> = {};
    rule.params?.forEach((name, i) => {
      if (m[i + 1]) properties[name] = decodeURIComponent(m[i + 1]);
    });
    return { event: rule.event, properties };
  }
  return null;
}
