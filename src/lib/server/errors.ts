/**
 * Standardized proxy error responses.
 * Never leaks backend stack traces or internal URLs.
 */
import { NextResponse } from 'next/server';
import { applySecurityHeaders } from './headers';

export interface ProxyErrorPayload {
  success: false;
  message: string;
  requestId: string;
  timestamp: string;
}

function makeErrorPayload(message: string, requestId: string): ProxyErrorPayload {
  return {
    success: false,
    message,
    requestId,
    timestamp: new Date().toISOString(),
  };
}

function errorResponse(
  message: string,
  requestId: string,
  status: number,
): NextResponse {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  applySecurityHeaders(headers);

  return NextResponse.json(makeErrorPayload(message, requestId), {
    status,
    headers,
  });
}

export function gatewayTimeout(requestId: string): NextResponse {
  return errorResponse('The upstream service did not respond in time.', requestId, 504);
}

export function badGateway(requestId: string): NextResponse {
  return errorResponse('Failed to reach the upstream service.', requestId, 502);
}

export function internalError(requestId: string): NextResponse {
  return errorResponse('An internal error occurred.', requestId, 500);
}

export function unauthorized(requestId: string, message = 'Authentication required.'): NextResponse {
  return errorResponse(message, requestId, 401);
}

export function forbidden(requestId: string, message = 'Access denied.'): NextResponse {
  return errorResponse(message, requestId, 403);
}

export function tooManyRequests(requestId: string): NextResponse {
  return errorResponse('Too many requests. Please slow down and try again.', requestId, 429);
}

export function badRequest(requestId: string, message: string): NextResponse {
  return errorResponse(message, requestId, 400);
}

/**
 * Wraps an upstream non-2xx response without leaking backend details.
 * 5xx responses are always normalized; 4xx responses pass the message if it is safe.
 */
export async function normalizeUpstreamError(
  upstream: Response,
  requestId: string,
): Promise<NextResponse> {
  const status = upstream.status;

  if (status >= 500) {
    return errorResponse('The upstream service returned an error.', requestId, 502);
  }

  // For 4xx, attempt to surface a safe message
  let message = 'The request could not be processed.';
  try {
    const ct = upstream.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
      const body = (await upstream.json()) as Record<string, unknown>;
      const candidate = body?.message ?? body?.msg ?? body?.error;
      if (typeof candidate === 'string' && candidate.length < 200) {
        message = candidate;
      }
    }
  } catch {
    // Leave default message
  }

  return errorResponse(message, requestId, status);
}
