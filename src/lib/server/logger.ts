/**
 * Structured server-side logger for the proxy layer.
 *
 * - Always logs errors in production.
 * - Logs info/debug only in development.
 * - Never logs passwords, JWTs, cookies, secrets, or OTPs.
 * - Also ships every record (info in prod too) to PostHog Logs via OpenTelemetry.
 *   Tune with POSTHOG_LOGS_LEVEL; flushed by the proxy inside `after()`.
 */
import { emitServerLog, type ServerLogLevel } from './posthog-telemetry';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'authorization',
  'cookie',
  'secret',
  'otp',
  'jwt',
  'key',
  'apikey',
  'api_key',
  'privatekey',
  'private_key',
  'x-internal-proxy-secret',
]);

function redact(obj: unknown, depth = 0): unknown {
  if (depth > 4) return '[deep]';
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((v) => redact(v, depth + 1));

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    out[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : redact(v, depth + 1);
  }
  return out;
}

function toPostHog(level: ServerLogLevel, fields: ProxyLogFields): void {
  const safe = redact(fields) as Record<string, unknown>;
  const attrs: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(safe)) {
    if (v === undefined || v === null) continue;
    attrs[k] = typeof v === 'object' ? JSON.stringify(v).slice(0, 500) : (v as string | number | boolean);
  }
  // Link logs to the PostHog person when we know who it is.
  if (typeof safe.distinctId === 'string') attrs.posthogDistinctId = safe.distinctId;
  const body =
    typeof safe.error === 'string'
      ? `${fields.method ?? ''} ${fields.backendEndpoint ?? fields.route ?? ''} → ${safe.error}`.trim()
      : `${fields.method ?? ''} ${fields.backendEndpoint ?? fields.route ?? ''} ${fields.status ?? ''}`.trim();
  emitServerLog(level, body.slice(0, 400), attrs);
}

function formatMessage(fields: ProxyLogFields): string {
  const safe = redact(fields) as Record<string, unknown>;
  return JSON.stringify({ timestamp: new Date().toISOString(), ...safe });
}

export interface ProxyLogFields {
  requestId: string;
  method?: string;
  route?: string;
  userId?: string | null;
  /** Backend user id (PostHog distinct id) when the request carried a backend JWT. */
  distinctId?: string | null;
  backendEndpoint?: string;
  durationMs?: number;
  status?: number;
  timedOut?: boolean;
  error?: string;
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV === 'development';

export const proxyLogger = {
  info(fields: ProxyLogFields): void {
    if (isDev) {
      console.info('[proxy:info]', formatMessage(fields));
    }
    toPostHog('info', fields);
  },

  error(fields: ProxyLogFields & { error: string }): void {
    // Always log errors, even in production (no sensitive data thanks to redaction)
    console.error('[proxy:error]', formatMessage(fields));
    toPostHog('error', fields);
  },

  warn(fields: ProxyLogFields): void {
    console.warn('[proxy:warn]', formatMessage(fields));
    toPostHog('warn', fields);
  },
};
