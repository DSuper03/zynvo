/**
 * Helpers for server-side calls to the backend worker.
 *
 * Serverless functions keep HTTP connections alive between invocations. When
 * Cloudflare has already closed one while the function was frozen, the next
 * request on it fails instantly with
 *   TypeError: fetch failed  [cause: SocketError: other side closed]
 * before any response arrives. A fresh connection fixes it, so these calls are
 * worth repeating.
 */

export const errorText = (err: unknown): string => {
  const e = err as { message?: string; cause?: { code?: string; message?: string } } | null;
  return [e?.message, e?.cause?.code, e?.cause?.message].filter(Boolean).join(' / ');
};

/** Network-level failure before any response (not a timeout, not an HTTP error). */
export const isDroppedConnection = (err: unknown): boolean => {
  if (err instanceof DOMException && err.name === 'AbortError') return false;
  return /fetch failed|other side closed|UND_ERR_SOCKET|ECONNRESET|ETIMEDOUT|EPIPE|socket hang up/i.test(errorText(err));
};

/**
 * fetch() that retries when the connection was dropped before any response.
 * Only use it for requests that are safe to repeat and whose body can be sent
 * again (a string or no body, not a stream): reads, and idempotent calls such
 * as a login that just verifies credentials.
 */
export async function fetchWithRetry(
  input: string | URL,
  init?: RequestInit,
  { retries = 2, delayMs = 150 }: { retries?: number; delayMs?: number } = {},
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetch(input, init);
    } catch (err) {
      if (attempt >= retries || !isDroppedConnection(err)) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
}
