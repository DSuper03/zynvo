import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

/**
 * Server-side PostHog client (Node runtime only). Returns null when the
 * project token isn't configured so callers can no-op in local/dev setups.
 *
 * Serverless note: call `await client.flush()` (or use `flushServerTelemetry`
 * from '@/lib/server/posthog-telemetry' inside `after()`) before the function freezes.
 */
export function getPostHogClient(): PostHog | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return null;
  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host: process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 20,
      flushInterval: 0,
    });
  }
  return posthogClient;
}
