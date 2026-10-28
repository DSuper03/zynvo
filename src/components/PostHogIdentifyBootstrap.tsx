'use client';

/**
 * PostHogIdentifyBootstrap
 *
 * Runs once on page load for returning visitors. If the user already has
 * a session token in localStorage (i.e. they're logged in but didn't just
 * sign in/up this visit), we call posthog.identify() so their events are
 * attributed to their user ID rather than landing as anonymous events.
 *
 * Fresh sign-in / sign-up flows already call posthog.identify() themselves,
 * so this is purely for the returning-visitor gap.
 */

import { useEffect } from 'react';
import posthog from 'posthog-js';

export default function PostHogIdentifyBootstrap() {
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Decode the JWT payload (no verification needed — we just want the sub/email).
      const parts = token.split('.');
      if (parts.length !== 3) return;

      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const userId: string | undefined = payload.sub ?? payload.user_id ?? payload.id;

      if (!userId) return;

      // Only call identify if this distinct_id isn't already set for this session.
      // posthog.get_distinct_id() returns the anonymous ID if identify hasn't been
      // called yet; once identified it returns the userId we pass in.
      if (posthog.get_distinct_id() !== userId) {
        posthog.identify(userId, {
          email: payload.email,
          name: payload.name,
        });
      }
    } catch {
      // Never throw from analytics bootstrapping.
    }
  }, []);

  return null;
}
