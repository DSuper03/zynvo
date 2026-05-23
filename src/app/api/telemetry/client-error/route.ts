import { NextRequest, NextResponse } from 'next/server';
import { createErrorId } from '@/lib/safe-error';

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
    // This can be forwarded to Sentry/Datadog without changing clients.
    console.error('[client-telemetry]', event);

    return NextResponse.json({ ok: true, telemetryId });
  } catch (error) {
    console.error(`[${telemetryId}] Failed to ingest client telemetry`, error);
    return NextResponse.json(
      { ok: false, error: 'Failed to ingest client telemetry', telemetryId },
      { status: 400 }
    );
  }
}
