'use client';

/**
 * PostHog feature flags.
 *
 *   const newCheckout = useFeatureFlag('new-event-checkout');      // boolean | undefined
 *   const variant = useFeatureFlagVariant('discover-feed-layout'); // string | boolean | undefined
 *
 * `undefined` means flags haven't loaded yet — render the existing UI in that case
 * so users never see a flash of the new variant. Create flags in PostHog →
 * Feature flags; for gradual rollouts set a percentage there, not in code.
 */

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';

export function useFeatureFlagVariant(flag: string): string | boolean | undefined {
  const [value, setValue] = useState<string | boolean | undefined>(() => {
    try {
      return typeof window === 'undefined' ? undefined : posthog.getFeatureFlag(flag);
    } catch {
      return undefined;
    }
  });

  useEffect(() => {
    try {
      // Fires once flags load and again whenever they're reloaded (e.g. after identify).
      return posthog.onFeatureFlags(() => {
        setValue(posthog.getFeatureFlag(flag));
      });
    } catch {
      return undefined;
    }
  }, [flag]);

  return value;
}

export function useFeatureFlag(flag: string): boolean | undefined {
  const value = useFeatureFlagVariant(flag);
  return value === undefined ? undefined : Boolean(value);
}
