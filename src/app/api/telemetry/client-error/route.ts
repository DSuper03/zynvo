import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { createErrorId } from '@/lib/safe-error';
import { resolveRequestId } from '@/lib/server/request';
import { applySecurityHeaders } from '@/lib/server/headers';

type IncomingTelemetryBody = {
  kind?: unknown;
  message?: unknown;
  name?: unknown;
  stack?: unknown;
  status?: unknown;
  url?: unknown;
  method?: unknown;
  requestId?: unknown;
  context?: unknown;
  metadata?: unknown;
  client?: unknown;
  timestamp?: unknown;
};

function toSafeString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength)}...` : trimmed;
}

function toSafeNumber(value: unknown): number | undefined {
  if (typeof value !== 'number') return undefined;
  if (!Number.isFinite(value)) return undefined;
  return value;
}

function toSafeRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  const telemetryId = createErrorId();
  const requestId = resolveRequestId(request.headers.get('x-request-id'));
  const secureHeaders = new Headers({ 'x-request-id': requestId });
  applySecurityHeaders(secureHeaders);

  try {
    const body = (await request.json()) as IncomingTelemetryBody;
    const event = {
      telemetryId,
      kind: toSafeString(body.kind, 64) || 'unknown',
      message: toSafeString(body.message, 300) || 'Unknown client-side error',
      name: toSafeString(body.name, 100),
      stack: toSafeString(body.stack, 1800),
      status: toSafeNumber(body.status),
      url: toSafeString(body.url, 500),
      method: toSafeString(body.method, 16),
      requestId: toSafeString(body.requestId, 64),
      context: toSafeString(body.context, 120),
      metadata: toSafeRecord(body.metadata),
      client: toSafeRecord(body.client),
      timestamp: toSafeString(body.timestamp, 64),
      receivedAt: new Date().toISOString(),
    };

    // For now we log structured events to server logs.
    Sentry.captureMessage(`Client telemetry: ${event.message}`, {
      level: 'error',
      tags: {
        telemetryId: event.telemetryId,
        kind: event.kind,
        context: event.context || 'unknown',
      },
      extra: {
        ...event,
      },
    });

    console.error('[client-telemetry]', event);

    return NextResponse.json({ ok: true, telemetryId }, { headers: secureHeaders });
  } catch (error) {
    console.error(`[${telemetryId}] Failed to ingest client telemetry`, error);
    return NextResponse.json(
      { ok: false, error: 'Failed to ingest client telemetry', telemetryId },
      { status: 400, headers: secureHeaders }
    );
  }
}
