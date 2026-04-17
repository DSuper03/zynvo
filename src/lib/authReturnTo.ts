const STORAGE_KEY = 'zynvo_return_to';

/**
 * Validates a same-origin path for post-auth redirect (blocks open redirects).
 */
export function normalizeReturnTo(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== 'string') return null;
  let p = raw.trim();
  try {
    p = decodeURIComponent(p);
  } catch {
    return null;
  }
  if (!p.startsWith('/') || p.startsWith('//')) return null;
  if (p.includes('://')) return null;
  if (p.startsWith('/auth/')) return null;
  return p;
}

export function persistReturnTo(path: string | null | undefined): void {
  const n = normalizeReturnTo(path);
  if (!n || typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, n);
  } catch {
    // ignore
  }
}

export function clearStoredReturnTo(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function peekReturnTo(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return normalizeReturnTo(sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

/** Read stored return path and remove it (call once after successful auth). */
export function consumeReturnTo(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return normalizeReturnTo(raw);
  } catch {
    return null;
  }
}

export function buildAuthHref(
  base: '/auth/signin' | '/auth/signup',
  pathname: string | null | undefined
): string {
  const n = normalizeReturnTo(pathname ?? '');
  if (!n) return base;
  return `${base}?returnTo=${encodeURIComponent(n)}`;
}

/**
 * Prefer `returnTo` from the current URL (OAuth callback), else consume from sessionStorage.
 */
export function consumePostAuthRedirect(searchParams: {
  get(name: string): string | null;
}): string {
  const fromUrl = normalizeReturnTo(searchParams.get('returnTo'));
  if (fromUrl) {
    clearStoredReturnTo();
    return fromUrl;
  }
  return consumeReturnTo() ?? '/dashboard';
}
