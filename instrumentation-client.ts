import * as Sentry from '@sentry/nextjs';
import posthog from 'posthog-js';

// Query params that must never reach PostHog (reset tokens, OAuth codes, emails in links).
const SENSITIVE_PARAMS = ['token', 'code', 'state', 'email', 'otp', 'oobCode', '__clerk_ticket', '__clerk_db_jwt'];
const URL_PROPS = ['$current_url', '$referrer', '$initial_current_url', '$initial_referrer', '$pathname'];

function scrubUrl(value: unknown): unknown {
  if (typeof value !== 'string' || !value.includes('?')) return value;
  try {
    const url = new URL(value, 'https://zynvosocial.com');
    let changed = false;
    for (const key of SENSITIVE_PARAMS) {
      if (url.searchParams.has(key)) {
        url.searchParams.set(key, '[redacted]');
        changed = true;
      }
    }
    if (!changed) return value;
    return value.startsWith('http') ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return value;
  }
}

if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-01-30',
    person_profiles: 'identified_only',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
    // Session replay is switched on/sampled in PostHog project settings; these
    // options only control privacy once it is on.
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-ph-mask]',
      blockSelector: '[data-ph-block]',
    },
    // PostHog Logs (browser side). Server logs go through OpenTelemetry in instrumentation.ts.
    logs: {
      serviceName: 'zynvo-web',
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
      serviceVersion: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
      captureConsoleLogs: false,
    },
    before_send: (event) => {
      if (!event) return event;
      const props = event.properties as Record<string, unknown> | undefined;
      if (props) {
        for (const key of URL_PROPS) {
          if (key in props) props[key] = scrubUrl(props[key]);
        }
      }
      const set = event.$set as Record<string, unknown> | undefined;
      const setOnce = event.$set_once as Record<string, unknown> | undefined;
      for (const bag of [set, setOnce]) {
        if (!bag) continue;
        for (const key of URL_PROPS) {
          if (key in bag) bag[key] = scrubUrl(bag[key]);
        }
      }
      return event;
    },
  });
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled:
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',
  tracesSampleRate: Number(
    process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? '0.1'
  ),
  sendDefaultPii: false,
  replaysOnErrorSampleRate: Number(
    process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? '0.1'
  ),
  replaysSessionSampleRate: Number(
    process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? '0.0'
  ),
  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
    }

    return event;
  },
});
