'use client';

/**
 * PostHogIdentifyBootstrap
 *
 * Runs once on page load for returning visitors. If the user already has a
 * session token in localStorage we identify them by their backend user id
 * (same id the sign-in / sign-up flows use), so returning sessions aren't
 * anonymous and people aren't split across email-vs-id profiles.
 */

import { useEffect } from 'react';
import { identifyFromToken } from '@/lib/analytics';

export default function PostHogIdentifyBootstrap() {
  useEffect(() => {
    identifyFromToken();
  }, []);

  return null;
}
