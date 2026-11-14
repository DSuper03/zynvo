import axios from 'axios';

export interface ClubRole {
  /** Founder or core member of a club. */
  authorized: boolean;
  role: 'founder' | 'core' | null;
  /** The club the user runs (when authorized). */
  clubId: string | null;
  clubName: string | null;
  msg: string;
}

interface IsClubAdminResponse {
  founder?: string | boolean;
  role?: 'founder' | 'core';
  clubId?: string;
  clubName?: string;
  msg?: string;
}

const NOT_ADMIN: ClubRole = {
  authorized: false,
  role: null,
  clubId: null,
  clubName: null,
  msg: 'Only club heads and core members can do this.',
};

// One request per token per page load: several components ask the same question.
const cache = new Map<string, Promise<ClubRole>>();

/**
 * Is the signed-in user a club head or core member, and of which club?
 *
 * Uses GET /api/v1/user/isClubAdmin, which matches the user's email against
 * every club's founder and core slots. (The /isClubAdmin/:clubId variant also
 * requires a membership row, which founders of older clubs often lack, and it
 * was being called with the user's *first* membership rather than the club
 * they run.) The server answers "no" with 403 — that is a normal result here.
 *
 * @param clubId When given, the user must manage this specific club.
 */
export async function checkClubRole(token?: string, clubId?: string): Promise<ClubRole> {
  if (!token) return { ...NOT_ADMIN, msg: 'Please sign in.' };

  let pending = cache.get(token);
  if (!pending) {
    pending = axios
      .get<IsClubAdminResponse>('/api/v1/user/isClubAdmin', {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(({ data }): ClubRole => {
        const ok = (data.founder === 'true' || data.founder === true) && !!data.clubId;
        return ok
          ? {
              authorized: true,
              role: data.role ?? 'founder',
              clubId: data.clubId ?? null,
              clubName: data.clubName ?? null,
              msg: 'ok',
            }
          : NOT_ADMIN;
      })
      .catch((err) => {
        // 403 is the server's "no" and is kept; only forget network failures.
        if (!axios.isAxiosError(err) || !err.response) cache.delete(token);
        return NOT_ADMIN;
      });
    cache.set(token, pending);
  }

  const role = await pending;
  if (clubId && role.authorized && role.clubId !== clubId) return NOT_ADMIN;
  return role;
}
