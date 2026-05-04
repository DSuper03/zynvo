/**
 * Clerk OAuth often lands on `/auth/sso-callback` without `?intent=` (fallback URLs, redirects).
 * We persist intent before starting OAuth so the callback can still branch signup vs sign-in.
 *
 * `resolveSsoIntentStable` uses a module cache so React Strict Mode (double mount) does not
 * consume sessionStorage twice and lose the intent.
 */
const STORAGE_KEY = "zynvo_sso_intent";

export type SsoIntent = "signin" | "signup";

/** Cleared when a new OAuth flow starts so the next callback resolves fresh intent. */
let cachedResolvedIntent: SsoIntent | null | undefined = undefined;

export function setSsoIntentBeforeOAuth(intent: SsoIntent): void {
  cachedResolvedIntent = undefined;
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, intent);
  } catch {
    // ignore quota / private mode
  }
}

export function consumeSsoIntent(): SsoIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    if (raw === "signin" || raw === "signup") return raw;
  } catch {
    // ignore
  }
  return null;
}

export function peekSsoIntent(): SsoIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === "signin" || raw === "signup") return raw;
  } catch {
    // ignore
  }
  return null;
}

/** Normalize intent from URL search param. */
export function intentFromSearchParam(
  param: string | null
): SsoIntent | null {
  if (param === "signin" || param === "signup") return param;
  return null;
}

/**
 * Resolve intent once per OAuth round-trip (URL beats storage).
 * Safe under React Strict Mode — will not strip sessionStorage twice.
 */
export function resolveSsoIntentStable(intentQuery: string | null): SsoIntent | null {
  if (cachedResolvedIntent !== undefined) {
    return cachedResolvedIntent;
  }
  const fromUrl = intentFromSearchParam(intentQuery);
  if (fromUrl) {
    consumeSsoIntent();
    cachedResolvedIntent = fromUrl;
    return fromUrl;
  }
  const stored = consumeSsoIntent();
  cachedResolvedIntent = stored;
  return stored;
}

/** Test / full reset after logout (optional). */
export function resetSsoIntentCache(): void {
  cachedResolvedIntent = undefined;
}
