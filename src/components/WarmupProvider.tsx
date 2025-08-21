'use client';

import { useEffect } from 'react';

export function WarmupProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`, { method: 'GET' }).catch(() => {});
  }, []);

  return <>{children}</>;
}