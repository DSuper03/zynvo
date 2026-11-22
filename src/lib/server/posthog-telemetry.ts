/**
 * Server-side PostHog telemetry for the Next.js Node runtime:
 *
 *  - Logs   → PostHog Logs via OpenTelemetry (OTLP/HTTP), per
 *             https://posthog.com/docs/logs/installation/nextjs
 *  - Events → posthog-node (`server_*` events emitted by the API proxy)
 *
 * Both are buffered; call `flushServerTelemetry()` inside `after()` so the
 * buffers drain after the response is sent and before the function freezes.
 *
 * Env:
 *   NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN  (required, phc_… project token — public)
 *   POSTHOG_HOST                        (optional, default https://us.i.posthog.com)
 *   POSTHOG_LOGS_LEVEL                  (optional: debug|info|warn|error, default info)
 *   POSTHOG_LOGS_DISABLED=true          (optional kill switch for server logs)
 */
import { SeverityNumber, type Logger } from '@opentelemetry/api-logs';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { getPostHogClient } from '@/lib/posthog-server';

export type ServerLogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<ServerLogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const SEVERITY: Record<ServerLogLevel, SeverityNumber> = {
  debug: SeverityNumber.DEBUG,
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
  error: SeverityNumber.ERROR,
};

const SERVICE_NAME = 'zynvo-web-server';

let provider: LoggerProvider | null | undefined;
let otelLogger: Logger | null = null;

function minLevel(): ServerLogLevel {
  const v = (process.env.POSTHOG_LOGS_LEVEL || 'info').toLowerCase();
  return (v in LEVEL_ORDER ? v : 'info') as ServerLogLevel;
}

/** Lazily create the OTel LoggerProvider. Returns null when not configured / not Node. */
export function getServerLoggerProvider(): LoggerProvider | null {
  if (provider !== undefined) return provider;

  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token || process.env.POSTHOG_LOGS_DISABLED === 'true' || process.env.NEXT_RUNTIME === 'edge') {
    provider = null;
    return provider;
  }

  const host = (process.env.POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '');

  provider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': SERVICE_NAME,
      'deployment.environment': process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
      'service.version': process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });
  otelLogger = provider.getLogger(SERVICE_NAME);
  return provider;
}

type Attrs = Record<string, string | number | boolean | null | undefined>;

/** Emit one structured log record to PostHog Logs. Never throws. */
export function emitServerLog(level: ServerLogLevel, body: string, attributes: Attrs = {}): void {
  try {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[minLevel()]) return;
    if (!getServerLoggerProvider() || !otelLogger) return;
    const clean: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(attributes)) {
      if (v !== undefined && v !== null) clean[k] = v;
    }
    otelLogger.emit({
      body,
      severityNumber: SEVERITY[level],
      severityText: level.toUpperCase(),
      attributes: clean,
    });
  } catch {
    // logging must never break a request
  }
}

/** Capture a server-side product event (no-op without a distinct id or token). */
export function captureServerEvent(
  distinctId: string | null | undefined,
  event: string,
  properties: Record<string, unknown> = {},
): void {
  if (!distinctId) return;
  try {
    getPostHogClient()?.capture({
      distinctId,
      event,
      properties: { ...properties, source: 'server', $process_person_profile: true },
    });
  } catch {
    // ignore
  }
}

/** Drain both buffers. Use inside `after(() => flushServerTelemetry())`. */
export async function flushServerTelemetry(): Promise<void> {
  await Promise.allSettled([
    provider ? provider.forceFlush() : Promise.resolve(),
    getPostHogClient()?.flush() ?? Promise.resolve(),
  ]);
}
