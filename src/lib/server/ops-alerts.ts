/**
 * Reports backend failures the backend can't report itself (timeouts,
 * unreachable worker, Cloudflare error pages) to the worker's Telegram alerts.
 * See zynvo-backend src/worker/routes/ops.ts.
 *
 * Fire-and-forget: runs after the response is sent and never throws.
 */
import { after } from 'next/server';

import { getServerEnv } from './env';

const REPORT_TIMEOUT_MS = 5000;

export type OpsReport = {
  /** Stable identity used for dedup, e.g. "timeout POST /api/v2/user/auth/clerkLogin". */
  key: string;
  title: string;
  detail?: string;
};

async function send(report: OpsReport): Promise<void> {
  try {
    const env = getServerEnv();
    const base = env.BACKEND_BASE_URL.replace(/\/$/, '');
    await fetch(`${base}/api/v1/ops/report`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-internal-proxy-secret': env.INTERNAL_PROXY_SECRET,
      },
      body: JSON.stringify({ ...report, source: 'website' }),
      signal: AbortSignal.timeout(REPORT_TIMEOUT_MS),
    });
  } catch {
    // The backend may be the thing that's down; the proxy logs already have it.
  }
}

export function reportToOps(report: OpsReport): void {
  try {
    after(() => send(report));
  } catch {
    // Outside a request scope (tests): send without waiting.
    void send(report);
  }
}
