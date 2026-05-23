type TelemetryKind =
  | 'window.error'
  | 'window.unhandledrejection'
  | 'react-query.query'
  | 'react-query.mutation'
  | 'api.failure'
  | 'manual';

interface ClientTelemetryEvent {
  kind: TelemetryKind;
  message: string;
  name?: string;
  stack?: string;
  status?: number;
  url?: string;
  method?: string;
  requestId?: string;
  context?: string;
  metadata?: Record<string, unknown>;
}

const MAX_MESSAGE_LENGTH = 300;
const MAX_STACK_LENGTH = 1800;
const DEDUPE_WINDOW_MS = 30_000;

const recentEvents = new Map<string, number>();
let globalListenerAttached = false;
let listenerCleanup: (() => void) | null = null;

function trimText(value: string | undefined, max: number): string | undefined {
  if (!value) return undefined;
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

function normalizeUnknownError(error: unknown): {
  name?: string;
  message: string;
  stack?: string;
} {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: trimText(error.message, MAX_MESSAGE_LENGTH) || 'Unknown error',
      stack: trimText(error.stack, MAX_STACK_LENGTH),
    };
  }

  if (typeof error === 'string') {
    return { message: trimText(error, MAX_MESSAGE_LENGTH) || 'Unknown error' };
  }

  try {
    const serialized = JSON.stringify(error);
    return {
      message:
        trimText(serialized, MAX_MESSAGE_LENGTH) || 'Unknown non-error rejection',
    };
  } catch {
    return { message: 'Unknown non-error rejection' };
  }
}

function shouldSendEvent(kind: TelemetryKind, message: string): boolean {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const prev = recentEvents.get(key);
  if (prev && now - prev < DEDUPE_WINDOW_MS) {
    return false;
  }
  recentEvents.set(key, now);
  return true;
}

function currentClientContext() {
  if (typeof window === 'undefined') return {};
  return {
    pathname: window.location.pathname,
    href: window.location.href,
    userAgent: navigator.userAgent,
  };
}

export async function sendClientTelemetryEvent(
  event: ClientTelemetryEvent
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!shouldSendEvent(event.kind, event.message)) return;

  try {
    await fetch('/api/telemetry/client-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...event,
        message: trimText(event.message, MAX_MESSAGE_LENGTH),
        stack: trimText(event.stack, MAX_STACK_LENGTH),
        client: currentClientContext(),
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch {
    // Do not throw from telemetry path.
  }
}

export function captureApiFailure(input: {
  error: unknown;
  context?: string;
  status?: number;
  url?: string;
  method?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}): void {
  const normalized = normalizeUnknownError(input.error);
  void sendClientTelemetryEvent({
    kind: 'api.failure',
    message: normalized.message,
    name: normalized.name,
    stack: normalized.stack,
    status: input.status,
    url: input.url,
    method: input.method,
    requestId: input.requestId,
    context: input.context,
    metadata: input.metadata,
  });
}

export function captureReactQueryError(
  type: 'query' | 'mutation',
  error: unknown,
  context?: string
): void {
  const normalized = normalizeUnknownError(error);
  void sendClientTelemetryEvent({
    kind: type === 'query' ? 'react-query.query' : 'react-query.mutation',
    message: normalized.message,
    name: normalized.name,
    stack: normalized.stack,
    context,
  });
}

export function initGlobalErrorTelemetry(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (globalListenerAttached) return listenerCleanup || (() => {});

  const onError = (event: ErrorEvent) => {
    const normalized = normalizeUnknownError(event.error ?? event.message);
    void sendClientTelemetryEvent({
      kind: 'window.error',
      message: normalized.message,
      name: normalized.name,
      stack: normalized.stack,
      context: 'global-error-listener',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  };

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    const normalized = normalizeUnknownError(event.reason);
    void sendClientTelemetryEvent({
      kind: 'window.unhandledrejection',
      message: normalized.message,
      name: normalized.name,
      stack: normalized.stack,
      context: 'global-unhandled-rejection',
    });
  };

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onUnhandledRejection);

  const cleanup = () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onUnhandledRejection);
    globalListenerAttached = false;
    listenerCleanup = null;
  };

  globalListenerAttached = true;
  listenerCleanup = cleanup;
  return cleanup;
}
