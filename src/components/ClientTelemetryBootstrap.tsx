'use client';

import { useEffect } from 'react';
import { initGlobalErrorTelemetry } from '@/lib/telemetry';

export default function ClientTelemetryBootstrap() {
  useEffect(() => {
    const cleanup = initGlobalErrorTelemetry();
    return cleanup;
  }, []);

  return null;
}
