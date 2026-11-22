import { z } from 'zod';

export type LeaderboardFilters = {
  kind: 'clubs' | 'events';
  period: 'week' | 'month' | 'all';
  college: string;
  search: string;
  page: number;
};
export const MAX_LEADERBOARD_PAGE = 1000;
const count = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const entry = z.object({
  id: z.string().min(1).max(200),
  name: z.string(),
  college: z.string(),
  clubName: z.string().nullable(),
  image: z.string().nullable(),
  registrations: count.positive(),
  uniqueStudents: count.positive(),
  eventsCount: count.positive(),
  rank: count.positive(),
});
export const rankingsSchema = z
  .object({
    entries: z.array(entry).max(25),
    colleges: z.array(z.string()),
    totals: z.object({
      registrations: count,
      uniqueStudents: count,
      eventsCount: count,
      rankedCount: count,
    }),
    kind: z.enum(['clubs', 'events']),
    period: z.enum(['week', 'month', 'all']),
    college: z.string(),
    page: count.positive().max(MAX_LEADERBOARD_PAGE),
    pageSize: z.literal(25),
    maxPage: z.literal(MAX_LEADERBOARD_PAGE),
    timezone: z.literal('Asia/Kolkata'),
    start: z.string().datetime().nullable(),
    end: z.string().datetime(),
    generatedAt: z.string().datetime(),
  })
  .superRefine((data, ctx) => {
    if (
      new Set(data.entries.map((row) => row.id)).size !== data.entries.length ||
      data.entries.some(
        (row, index) =>
          row.uniqueStudents > row.registrations ||
          row.eventsCount > row.registrations ||
          (index > 0 && row.rank < data.entries[index - 1].rank)
      )
    ) {
      ctx.addIssue({ code: 'custom', message: 'Inconsistent rankings' });
    }
  });
export type Rankings = z.infer<typeof rankingsSchema>;

export function readLeaderboardFilters(
  params: Pick<URLSearchParams, 'get'>
): LeaderboardFilters {
  const kind = params.get('kind');
  const period = params.get('period');
  const rawPage = params.get('page') ?? '1';
  const text = (key: string, limit: number) =>
    (params.get(key) ?? '')
      .replace(/[\u0000-\u001f\u007f]/g, '')
      .trim()
      .slice(0, limit);
  return {
    kind: kind === 'events' ? 'events' : 'clubs',
    period: period === 'month' || period === 'all' ? period : 'week',
    college: text('college', 200),
    search: text('search', 100),
    page: /^[1-9]\d{0,3}$/.test(rawPage)
      ? Math.min(MAX_LEADERBOARD_PAGE, Number(rawPage))
      : 1,
  };
}
export function leaderboardParams(
  filters: LeaderboardFilters
): URLSearchParams {
  return new URLSearchParams({ ...filters, page: String(filters.page) });
}
export class LeaderboardRequestError extends Error {
  constructor(
    message: string,
    public status = 0,
    public retryAt = 0
  ) {
    super(message);
  }
}
export function retryAfterTime(value: string | null, now = Date.now()): number {
  const seconds = value && /^\d+$/.test(value) ? Number(value) : NaN;
  const delay = Number.isFinite(seconds)
    ? seconds * 1000
    : value
      ? Date.parse(value) - now
      : 60_000;
  return (
    now +
    Math.max(1000, Math.min(300_000, Number.isFinite(delay) ? delay : 60_000))
  );
}
/** Abort both timed-out and superseded requests; never trust a successful HTTP status alone. */
export async function fetchLeaderboard(
  filters: LeaderboardFilters,
  signal?: AbortSignal
): Promise<Rankings> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  else signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, 15_000);
  try {
    const response = await fetch(
      `/api/v1/leaderboard?${leaderboardParams(filters)}`,
      { signal: controller.signal, cache: 'no-store' }
    );
    if (!response.ok) {
      if (response.status === 429)
        throw new LeaderboardRequestError(
          'Too many requests. Please wait before refreshing.',
          429,
          retryAfterTime(response.headers.get('retry-after'))
        );
      throw new LeaderboardRequestError(
        'We could not load the leaderboard. Please try again.',
        response.status
      );
    }
    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      if (controller.signal.aborted) throw error;
      throw new LeaderboardRequestError(
        'The leaderboard response was incomplete. Please try again.',
        502
      );
    }
    const parsed = rankingsSchema.safeParse(payload);
    if (
      !parsed.success ||
      parsed.data.kind !== filters.kind ||
      parsed.data.period !== filters.period ||
      parsed.data.college !== filters.college ||
      parsed.data.page !== filters.page
    ) {
      throw new LeaderboardRequestError(
        'The leaderboard response was incomplete. Please try again.',
        502
      );
    }
    return parsed.data;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (error instanceof LeaderboardRequestError) throw error;
    throw new LeaderboardRequestError(
      controller.signal.aborted
        ? 'The leaderboard took too long to respond. Please try again.'
        : 'Check your connection and try again.'
    );
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
