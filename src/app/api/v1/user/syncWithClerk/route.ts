import { NextRequest, NextResponse, after } from 'next/server';
import {
  captureServerEvent,
  emitServerLog,
  flushServerTelemetry,
} from '@/lib/server/posthog-telemetry';
import { distinctIdFromJwt } from '@/lib/server/server-events';

const BACKEND_URL =
  process.env.BACKEND_BASE_URL ||
  'https://zynvo-backend-worker.anirbanghosh060.workers.dev';

export async function POST(request: NextRequest) {
  after(() => flushServerTelemetry());
  const startedAt = Date.now();

  try {
    const body = await request.text();

    const upstream = await fetch(`${BACKEND_URL}/api/v1/user/syncWithClerk`, {
      method: 'POST',
      headers: {
        'content-type': request.headers.get('content-type') || 'application/json',
        accept: 'application/json',
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
