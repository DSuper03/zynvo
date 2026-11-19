import { NextRequest, NextResponse, after } from 'next/server';
import {
  captureServerEvent,
  emitServerLog,
  flushServerTelemetry,
} from '@/lib/server/posthog-telemetry';
import { distinctIdFromJwt } from '@/lib/server/server-events';
import { fetchWithRetry } from '@/lib/server/backend-fetch';

const BACKEND_URL =
  process.env.BACKEND_BASE_URL ||
  'https://zynvo-backend-worker.anirbanghosh060.workers.dev';

export async function POST(request: NextRequest) {
  after(() => flushServerTelemetry());
  const startedAt = Date.now();

  try {
    const body = await request.text();

    // Without these the backend rate-limits every website login together
    // under this server's IP; with them it counts per visitor, like the
    // other proxied routes (see src/lib/server/headers.ts).
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      undefined;
    const proxySecret = process.env.INTERNAL_PROXY_SECRET;

    // Signing in only verifies credentials, so repeating it after a dropped
    // connection is safe. (Stale keep-alive connections fail with
    // "fetch failed / other side closed" before any response.)
    const upstream = await fetchWithRetry(`${BACKEND_URL}/api/v1/user/syncWithClerk`, {
      method: 'POST',
      headers: {
        'content-type': request.headers.get('content-type') || 'application/json',
        accept: 'application/json',
        ...(proxySecret ? { 'x-internal-proxy-secret': proxySecret } : {}),
        ...(proxySecret && clientIp ? { 'x-zynvo-client-ip': clientIp } : {}),
      },
      body,
    });

    const data = await upstream.text();
    const durationMs = Date.now() - startedAt;

    if (upstream.ok) {
      let issuedToken: string | null = null;
      try {
        const parsed = JSON.parse(data) as { token?: unknown };
        issuedToken = typeof parsed.token === 'string' ? parsed.token : null;
      } catch {
        // non-JSON body — nothing to attribute
      }
      captureServerEvent(distinctIdFromJwt(issuedToken), 'server_user_authenticated', {
        endpoint: '/api/v1/user/syncWithClerk',
        auth_method: 'email',
        duration_ms: durationMs,
      });
    }

    emitServerLog(upstream.status >= 500 ? 'error' : upstream.ok ? 'info' : 'warn',
      `POST /api/v1/user/syncWithClerk ${upstream.status}`, {
        status: upstream.status,
        durationMs,
        backendEndpoint: '/api/v1/user/syncWithClerk',
      });

    return new NextResponse(data, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
    });
  } catch (error) {
    console.error('[syncWithClerk] Backend unreachable:', error);
    emitServerLog('error', 'POST /api/v1/user/syncWithClerk → backend unreachable', {
      error: error instanceof Error ? error.message : 'unknown',
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json(
      { success: false, message: 'Backend unreachable. Is the backend server running?' },
      { status: 502 },
    );
  }
}
