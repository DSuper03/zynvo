'use client';

/**
 * Single entry point for PostHog product analytics on the client.
 *
 * - Identity: always keyed on the backend user `id` from our JWT (never email),
 *   so a person is the same across email login, Google OAuth and returning visits.
 * - Every call is wrapped so analytics can never break a user flow.
 */

import posthog from 'posthog-js';
import { jwtDecode } from 'jwt-decode';

type Props = Record<string, unknown>;

interface ZynvoJwt {
  id?: string;
  sub?: string;
  user_id?: string;
  email?: string;
  name?: string;
}

/** Every custom event we send. Add new names here so typos fail at compile time. */
export type AnalyticsEvent =
  // auth
  | 'user_signed_up'
  | 'user_signed_in'
  | 'user_oauth_signup'
  | 'user_oauth_signin'
  | 'user_logged_out'
  | 'auth_failed'
  | 'password_reset_requested'
  | 'password_reset_completed'
  | 'account_deleted'
  // onboarding / profile
  | 'profile_updated'
  | 'profile_completed'
  // clubs
  | 'club_created'
  | 'club_joined'
  | 'club_join_failed'
  | 'club_left'
  | 'club_viewed'
  | 'club_shared'
  // events
  | 'event_created'
  | 'event_creation_failed'
  | 'event_registered'
  | 'event_registration_failed'
  | 'event_viewed'
  | 'event_shared'
  // content
  | 'post_created'
  | 'post_voted'
  | 'post_shared'
  | 'search_performed'
  // other
  | 'ai_queried'
  | 'ai_response_received'
  | 'ai_query_failed'
  | 'contact_form_submitted';

function safe(fn: () => void): void {
  try {
    if (typeof window === 'undefined') return;
    fn();
  } catch {
    // analytics must never throw into product code
  }
}

export function track(event: AnalyticsEvent, properties?: Props): void {
  safe(() => {
    posthog.capture(event, properties);
  });
}

function decodeToken(token: string | null | undefined): ZynvoJwt | null {
  if (!token) return null;
  try {
    return jwtDecode<ZynvoJwt>(token);
  } catch {
    return null;
  }
}

/** Resolve the stable distinct id we use for a user from our backend JWT. */
export function distinctIdFromToken(token: string | null | undefined): string | null {
  const payload = decodeToken(token);
  if (!payload) return null;
  return payload.id ?? payload.user_id ?? payload.sub ?? null;
}

/**
 * Identify the current user from the backend JWT (defaults to the one in
 * localStorage). Extra person properties (college, name…) are merged in.
 */
export function identifyFromToken(
  token?: string | null,
  personProperties?: Props
): void {
  safe(() => {
    const tok = token ?? localStorage.getItem('token');
    const payload = decodeToken(tok);
    const userId = distinctIdFromToken(tok);
    if (!payload || !userId) return;

    const props: Props = Object.fromEntries(
      Object.entries({
        email: payload.email,
        name: payload.name,
        ...personProperties,
      }).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );

    if (posthog.get_distinct_id() !== userId) {
      posthog.identify(userId, props);
    } else if (Object.keys(props).length) {
      posthog.setPersonProperties(props);
    }
  });
}

/** Call on every explicit logout so the next user on this device starts fresh. */
export function resetAnalytics(
  reason: 'logout' | 'account_deleted' | 'session_expired' = 'logout'
): void {
  safe(() => {
    if (reason === 'logout') posthog.capture('user_logged_out');
    posthog.reset();
  });
}

/** Attach subsequent events to a club (PostHog group analytics, group type `club`). */
export function setClubGroup(
  clubId: string | null | undefined,
  properties?: { name?: string; college?: string; type?: string; [k: string]: unknown }
): void {
  if (!clubId) return;
  safe(() => {
    const clean = Object.fromEntries(
      Object.entries(properties ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    posthog.group('club', String(clubId), clean);
  });
}

/** Attach subsequent events to a college (group type `college`). */
export function setCollegeGroup(college: string | null | undefined): void {
  const key = college?.trim();
  if (!key || /^not joined$/i.test(key)) return;
  safe(() => {
    posthog.group('college', key.toLowerCase(), { name: key });
  });
}

/** Bucket free text length so we never send the text itself. */
export function lengthBucket(text: string | null | undefined): string {
  const n = text?.length ?? 0;
  if (n === 0) return '0';
  if (n <= 20) return '1-20';
  if (n <= 100) return '21-100';
  if (n <= 500) return '101-500';
  return '500+';
}
