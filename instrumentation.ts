import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');

    // PostHog Logs via OpenTelemetry: make our provider the global one so any
    // OTel-aware library logging through @opentelemetry/api-logs also lands in PostHog.
    const { getServerLoggerProvider } = await import('./src/lib/server/posthog-telemetry');
    const provider = getServerLoggerProvider();
    if (provider) {
      const { logs } = await import('@opentelemetry/api-logs');
      logs.setGlobalLoggerProvider(provider);
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError: typeof Sentry.captureRequestError = async (error, request, context) => {
  Sentry.captureRequestError(error, request, context);

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { emitServerLog, flushServerTelemetry } = await import('./src/lib/server/posthog-telemetry');
      const err = error as { message?: string; digest?: string; name?: string };
      emitServerLog('error', `Unhandled ${context.routeType} error: ${err?.message ?? 'unknown'}`.slice(0, 400), {
        error_name: err?.name,
        digest: err?.digest,
        path: request.path,
        method: request.method,
        route_path: context.routePath,
        route_type: context.routeType,
        render_source: (context as { renderSource?: string }).renderSource,
      });
      await flushServerTelemetry();
    } catch {
      // never throw from error reporting
    }
  }
};
