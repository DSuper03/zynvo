import posthog from 'posthog-js';
import { captureApiFailure } from '@/lib/telemetry';

/**
 * Client logger.
 *
 * - Development: everything goes to the console.
 * - Production: console stays quiet; `info`/`warn` go to PostHog Logs and
 *   `error` goes to PostHog Logs (via the telemetry pipeline, deduped) plus
 *   the existing /api/telemetry/client-error → Sentry path.
 *
 * Call style: logger.info('club.join.success', { clubId }) — a short dotted
 * message first, then plain objects with context. Sensitive keys are redacted.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const SENSITIVE_KEY = /pass(word)?|token|secret|authorization|cookie|otp|jwt|api[-_]?key|private[-_]?key/i;

type Attr = Record<string, unknown>;

function redact(value: unknown, depth = 0): unknown {
  if (depth > 3) return '[deep]';
  if (value instanceof Error) {
    return { name: value.name, message: value.message };
  }
  if (value === null || typeof value !== 'object') {
    return typeof value === 'string' && value.length > 500 ? `${value.slice(0, 500)}...` : value;
  }
  if (Array.isArray(value)) return value.slice(0, 20).map((v) => redact(v, depth + 1));
  const out: Attr = {};
  for (const [k, v] of Object.entries(value as Attr)) {
    out[k] = SENSITIVE_KEY.test(k) ? '[REDACTED]' : redact(v, depth + 1);
  }
  return out;
}

/** Turn variadic console-style args into a log body + attributes. */
function toRecord(args: unknown[]): { body: string; attributes: Attr } {
  const [first, ...rest] = args;
  const body =
    typeof first === 'string'
      ? first
      : first instanceof Error
        ? first.message
        : 'log';
  const attributes: Attr = {};
  if (first instanceof Error) attributes.error = redact(first);
  rest.forEach((arg, i) => {
    if (arg && typeof arg === 'object' && !Array.isArray(arg) && !(arg instanceof Error)) {
      Object.assign(attributes, redact(arg) as Attr);
    } else {
      attributes[i === 0 ? 'detail' : `detail_${i}`] = redact(arg);
    }
  });
  if (typeof window !== 'undefined') attributes.pathname = window.location.pathname;
  return { body: body.slice(0, 300), attributes };
}

function sendToPostHog(level: 'info' | 'warn', args: unknown[]) {
  if (typeof window === 'undefined') return;
  try {
    const { body, attributes } = toRecord(args);
    posthog.logger[level](body, attributes as never);
  } catch {
    // never throw from logging
  }
}

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) console.log(...args);
  },
  debug: (...args: any[]) => {
    if (isDevelopment) console.debug(...args);
  },
  info: (...args: any[]) => {
    if (isDevelopment) console.info(...args);
    sendToPostHog('info', args);
  },
  warn: (...args: any[]) => {
    if (isDevelopment) console.warn(...args);
    sendToPostHog('warn', args);
  },
  error: (...args: any[]) => {
    if (isDevelopment) console.error(...args);
    if (typeof window === 'undefined') return;
    const [firstArg] = args;
    const { body, attributes } = toRecord(args);
    // Goes to PostHog Logs + Sentry via the telemetry pipeline (deduped there).
    captureApiFailure({
      error:
        firstArg instanceof Error
          ? firstArg
          : (args.find((a) => a instanceof Error) as Error | undefined) ?? new Error(body),
      context: typeof firstArg === 'string' ? firstArg.slice(0, 120) : 'logger.error',
      metadata: attributes,
    });
  },
};

// Error boundary helper
export const handleError = (error: Error, context?: string) => {
  logger.error(`Error in ${context || 'unknown context'}`, error);
  try {
    posthog.captureException(error, { context: context || 'unknown' });
  } catch {
    // ignore
  }
};
