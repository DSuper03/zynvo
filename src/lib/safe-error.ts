import axios from 'axios';

const DEFAULT_USER_ERROR = 'Something went wrong. Please try again.';
const DEFAULT_NETWORK_ERROR = 'Network error. Please check your connection and try again.';
const MAX_SAFE_MESSAGE_LENGTH = 160;

const INTERNAL_ERROR_PATTERNS = [
  /internal server error/i,
  /stack/i,
  /exception/i,
  /sql/i,
  /prisma/i,
  /typeorm/i,
  /syntax error/i,
  /referenceerror/i,
  /typeerror/i,
  /upload failed:/i,
];

function hasInternalDetails(value: string): boolean {
  return INTERNAL_ERROR_PATTERNS.some((pattern) => pattern.test(value));
}

function normalizeMessage(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_SAFE_MESSAGE_LENGTH) return null;
  if (hasInternalDetails(trimmed)) return null;
  return trimmed;
}

export function toSafeUserMessage(
  value: unknown,
  fallback: string = DEFAULT_USER_ERROR
): string {
  return normalizeMessage(value) ?? fallback;
}

export function getSafeErrorMessage(
  error: unknown,
  fallback: string = DEFAULT_USER_ERROR
): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return DEFAULT_NETWORK_ERROR;
    }

    const status = error.response.status ?? 0;
    const data = error.response.data as
      | { message?: unknown; msg?: unknown; error?: unknown; errorId?: unknown; requestId?: unknown }
      | undefined;
    const candidate = data?.message ?? data?.msg ?? data?.error;
    const traceId =
      typeof data?.errorId === 'string'
        ? data.errorId
        : typeof data?.requestId === 'string'
          ? data.requestId
          : null;

    // Never expose raw 5xx backend messages to end users.
    if (status >= 500) {
      return traceId ? `${fallback} (Ref: ${traceId})` : fallback;
    }

    const safeMessage = toSafeUserMessage(candidate, fallback);
    if (safeMessage === fallback && traceId) {
      return `${fallback} (Ref: ${traceId})`;
    }
    return safeMessage;
  }

  if (error instanceof Error) {
    if (/network error|failed to fetch/i.test(error.message)) {
      return DEFAULT_NETWORK_ERROR;
    }
    return toSafeUserMessage(error.message, fallback);
  }

  return fallback;
}

export async function readSafeErrorMessageFromResponse(
  response: Response,
  fallback: string = DEFAULT_USER_ERROR
): Promise<string> {
  try {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const payload = (await response.json()) as
        | { message?: unknown; msg?: unknown; error?: unknown }
        | null;
      return toSafeUserMessage(
        payload?.message ?? payload?.msg ?? payload?.error,
        fallback
      );
    }

    const textPayload = await response.text();
    return toSafeUserMessage(textPayload, fallback);
  } catch {
    return fallback;
  }
}

export function createErrorId(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `ERR-${timestamp}${random}`;
}
