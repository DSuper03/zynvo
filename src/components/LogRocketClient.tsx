'use client';

import { useEffect } from 'react';
import LogRocket from 'logrocket';
import { useWarmup } from '@/components/WarmupProvider';

export default function LogRocketClient() {
  const { userData, loading } = useWarmup();
  const appId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID || 'e0zkqp/zynvo';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Optional: only initialize in production. Remove this check to enable in dev/staging.
    if (process.env.NODE_ENV !== 'production') return;
    if (!appId) return;

    try {
      LogRocket.init(appId);

      // If you have user info available from WarmupProvider, identify them
      if (!loading && userData?.name) {
        // Use name as identifier if that's all you have; ideally use a stable user id/email
        LogRocket.identify(userData.name, {
          name: userData.name,
        });
      }
    } catch (err) {
      // Fail silently but log for debugging
      // eslint-disable-next-line no-console
      console.error('LogRocket init failed', err);
    }
  }, [loading, userData, appId]);

  return null;
}
