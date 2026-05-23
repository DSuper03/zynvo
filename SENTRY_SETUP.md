# Sentry Setup

## 1) Required environment variables

Add these in your deployment platform and local `.env`:

- `NEXT_PUBLIC_SENTRY_DSN` (required for browser events)
- `SENTRY_DSN` (optional; if omitted, server uses `NEXT_PUBLIC_SENTRY_DSN`)

Optional toggles:

- `NEXT_PUBLIC_SENTRY_ENABLED=true`
- `SENTRY_ENABLED=true`
- `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1`
- `SENTRY_TRACES_SAMPLE_RATE=0.1`
- `NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=0.1`
- `NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.0`

## 2) Source map upload (recommended for production)

Set these in CI/CD:

- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

These are already wired in `next.config.mjs` via `withSentryConfig(...)`.

## 3) Verify quickly

1. Start app and open any page.
2. In browser console run:
   - `throw new Error("sentry smoke test")`
3. Confirm event appears in Sentry Issues.

## 4) Privacy defaults in this repo

- Authorization and cookie headers are stripped in `beforeSend`.
- `sendDefaultPii` is disabled in client/server/edge configs.
- Client telemetry route sanitizes payload fields before forwarding.
