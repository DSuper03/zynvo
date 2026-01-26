'use client';

import { useEffect } from 'react';

export function ClerkKeyDebug() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const hasKey = typeof key === 'string' && key.trim().length > 0;
    const tail = hasKey ? key!.trim().slice(-6) : null;

    // Intentionally don't log the full key.
    console.log('[Clerk] publishable key present:', hasKey, hasKey ? `(…${tail})` : '');
  }, []);

  return null;
}

