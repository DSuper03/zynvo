'use client';

import { useEffect } from 'react';
import LogRocket from 'logrocket';
import { useWarmup } from '@/components/WarmupProvider'; // optional: to identify the user

export default function LogRocketClient() {
  const { userData, loading } = useWarmup(); // optional: only if you want to identify users and already fetch them in WarmupProvider
  useEffect(() => {
    // Only init on the client and in production (optional).
    // Put your app id in an env var: NEXT_PUBLIC_LOGROCKET_APP_ID
    const appId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID || 'e0zkqp/zynvo';
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'production') {
      // optional: skip in development
      return;
    }

    try {
      LogRocket.init(appId);

      // Optional: identify user once you have their id/email/name
      if (!loading && userData?.name) {
        LogRocket.identify(userData.name ?? undefined, {
          name: userData.name,
          // add other attributes as needed
        });
      }
    } catch (err) {
      // Fail silently in case LogRocket throws in some browsers
      console.error('LogRocket init failed', err);
    }
  }, [loading, userData]);

  return null; // this component doesn't render UI
}
