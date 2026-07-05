/**
 * Server-side Clerk authentication helpers for the proxy layer.
 * Only runs on the server — never imported by client code.
 */
import { auth } from '@clerk/nextjs/server';

export interface ProxyAuthResult {
  userId: string;
  token: string;
}

/**
 * Extracts the Clerk user ID and a short-lived Clerk session token
 * to be forwarded as `Authorization: Bearer <token>` to the backend.
 *
 * Returns null if there is no active Clerk session.
 */
export async function getProxyAuth(): Promise<ProxyAuthResult | null> {
  try {
    const session = await auth();

    if (!session?.userId) {
      return null;
    }

    // getToken() returns the short-lived Clerk session JWT.
    // The backend must validate it via Clerk's JWKS endpoint.
    const token = await session.getToken();

    if (!token) {
      return null;
    }

    return { userId: session.userId, token };
  } catch {
    return null;
  }
}

/**
 * Returns just the userId from the current Clerk session,
 * without fetching a token (useful for logging).
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.userId ?? null;
  } catch {
    return null;
  }
}
