'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  fetchLeaderboard,
  readLeaderboardFilters,
  leaderboardParams,
  LeaderboardRequestError,
  MAX_LEADERBOARD_PAGE,
} from '@/lib/leaderboard';
import type { LeaderboardFilters, Rankings } from '@/lib/leaderboard';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Search, RefreshCw, ArrowUpRight } from 'lucide-react';

type Period = LeaderboardFilters['period'];
const periods: [Period, string][] = [
  ['week', 'This week'],
  ['month', 'This month'],
  ['all', 'All time'],
];
const number = (value: number) => value.toLocaleString('en-IN');
const date = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value));

function LeaderboardContent() {
  const router = useRouter();
  const params = useSearchParams();
  const filters = readLeaderboardFilters(params);
  const { kind, period, college, search, page } = filters;
  const [input, setInput] = useState(search);
  const [retryAt, setRetryAt] = useState(0);
  const [clock, setClock] = useState(() => Date.now());
  const updateFilters = (changes: Partial<LeaderboardFilters>) => {
    router.replace(
      '/leaderboard?' + leaderboardParams({ ...filters, ...changes }),
      { scroll: false }
    );
  };
  useEffect(() => {
    setInput(search);
  }, [search]);
  useEffect(() => {
    if (input.trim() === search) return;
    const timeout = setTimeout(
      () => updateFilters({ search: input.trim(), page: 1 }),
      400
    );
    return () => clearTimeout(timeout);
    // Keep pending search edits when the other URL filters change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, search, params]);
  const { data, isPending, isFetching, isError, error, refetch } = useQuery<
    Rankings,
    Error
  >({
    queryKey: ['leaderboard', kind, period, college, search, page],
    queryFn: ({ signal }) => fetchLeaderboard(filters, signal),
    enabled: retryAt === 0,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: (attempt, failure) =>
      attempt < 1 &&
      (!(failure instanceof LeaderboardRequestError) ||
        failure.status === 0 ||
        failure.status >= 500),
  });
  useEffect(() => {
    if (error instanceof LeaderboardRequestError && error.status === 429) {
      setClock(Date.now());
      setRetryAt(error.retryAt);
    }
  }, [error]);
  useEffect(() => {
    if (!retryAt) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setClock(now);
      if (now >= retryAt) setRetryAt(0);
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAt]);
  const cooldown = Math.max(0, Math.ceil((retryAt - clock) / 1000));
  const pages = data
    ? Math.min(
        MAX_LEADERBOARD_PAGE,
        Math.max(1, Math.ceil(data.totals.rankedCount / data.pageSize))
      )
    : 1;
  useEffect(() => {
    if (data && page > pages) updateFilters({ page: pages });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page, pages]);
  const leaders = page === 1 ? (data?.entries.slice(0, 5) ?? []) : [];
  const button =
    'rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300';

  return (
    <div className="mx-auto max-w-6xl px-1 pb-10 pt-16 text-slate-200 md:px-4 md:pt-2">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-yellow-300">
            <Trophy size={18} aria-hidden /> Campus leaderboard
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Campus activity, counted.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Discover the clubs and events bringing students together. Ranked by
            approved event registrations.
          </p>
        </div>
        <button
          type="button"
          disabled={isFetching || cooldown > 0}
          onClick={() => refetch()}
          className={`${button} flex items-center gap-2 border border-slate-600 disabled:opacity-60`}
        >
          <RefreshCw
            size={16}
            aria-hidden
            className={isFetching ? 'animate-spin' : ''}
          />
          {cooldown ? `Wait ${cooldown}s` : 'Refresh'}
        </button>
      </header>

      <div className="flex flex-wrap justify-between gap-4">
        <div
          className="flex gap-1 rounded-2xl bg-slate-900 p-1"
          role="group"
          aria-label="Ranked category"
        >
          {(['clubs', 'events'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={kind === value}
              onClick={() => {
                updateFilters({ kind: value, page: 1 });
              }}
              className={`${button} ${kind === value ? 'bg-yellow-300 text-black' : 'text-slate-200 hover:bg-slate-800'}`}
            >
              {value === 'clubs' ? 'Clubs' : 'Events'}
            </button>
          ))}
        </div>
        <div
          className="flex flex-wrap gap-1 rounded-2xl bg-slate-900 p-1"
          role="group"
          aria-label="Ranking period"
        >
          {periods.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={period === value}
              onClick={() => {
                updateFilters({ period: value, page: 1 });
              }}
              className={`${button} ${period === value ? 'bg-yellow-300 text-black' : 'text-slate-200 hover:bg-slate-800'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="my-5 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Search {kind}</span>
          <div className="relative">
            <Search
              aria-hidden
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              type="search"
              maxLength={100}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Name or college"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-3 text-white focus:border-yellow-300 focus:outline-none"
            />
          </div>
        </label>
        <label className="space-y-2 text-sm">
          <span>College</span>
          <select
            value={college}
            onChange={(e) => {
              updateFilters({ college: e.target.value, page: 1 });
            }}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white focus:border-yellow-300 focus:outline-none"
          >
            <option value="">All colleges</option>
            {(data?.colleges ?? (college ? [college] : [])).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!data && retryAt > 0 ? (
        <p role="status" className="rounded-2xl border border-slate-800 p-8">
          Please wait {cooldown}s before requesting rankings again.
        </p>
      ) : isPending ? (
        <p
          role="status"
          className="rounded-2xl border border-slate-800 p-10 text-center"
        >
          Loading campus rankings...
        </p>
      ) : isError && !data ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-900 bg-red-950/30 p-8"
        >
          <p>
            {error?.message ||
              'We could not load the leaderboard. Please try again.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className={`${button} mt-4 bg-yellow-300 text-black`}
          >
            Try again
          </button>
        </div>
      ) : (
        data && (
          <>
            {isError && (
              <p
                role="status"
                className="mb-4 rounded-xl border border-amber-700 p-4 text-sm text-amber-200"
              >
                {error?.message} Showing the last successful results.
              </p>
            )}
            <p className="mb-5 text-xs text-slate-400" role="status">
              {data.start
                ? `${date(data.start)} | ${date(data.end)}`
                : `All recorded activity through ${date(data.end)}`}{' '}
              | India time | Updated{' '}
              {new Intl.DateTimeFormat('en-IN', {
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata',
              }).format(new Date(data.generatedAt))}{' '}
              IST{isFetching ? ' | Updating...' : ''}
            </p>
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                [data.totals.registrations, 'Eligible registrations'],
                [data.totals.uniqueStudents, 'Unique students reached'],
                [data.totals.eventsCount, 'Events with registrations'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="text-3xl font-bold text-yellow-300">
                    {number(value as number)}
                  </div>
                  <div className="mt-1 text-sm text-slate-300">{label}</div>
                </div>
              ))}
            </div>
            {leaders.length > 0 && (
              <section
                aria-labelledby="leaders-title"
                className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
              >
                <h2
                  id="leaders-title"
                  className="text-lg font-semibold text-white"
                >
                  Leading {kind}
                  {search ? ' matching your search' : ''}
                </h2>
                <p className="mb-5 mt-1 text-xs text-slate-400">
                  Eligible registrations in the selected period and college.
                </p>
                <ol className="space-y-4">
                  {leaders.map((entry) => (
                    <li key={entry.id}>
                      <div className="mb-1 flex justify-between gap-4 text-sm">
                        <Link
                          href={`/${kind}/${encodeURIComponent(entry.id)}`}
                          className="truncate font-medium hover:text-yellow-300"
                        >
                          #{entry.rank} {entry.name}
                        </Link>
                        <span className="shrink-0">
                          {number(entry.registrations)}
                        </span>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full bg-slate-700"
                        aria-hidden
                      >
                        <div
                          className="h-full rounded-full bg-yellow-300"
                          style={{
                            width: `${(entry.registrations / Math.max(1, leaders[0].registrations)) * 100}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            {data.entries.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 p-10 text-center">
                <h2 className="text-lg font-semibold text-white">
                  No rankings yet
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  No eligible registrations match these filters. Try another
                  period or college.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    {kind} ranked by eligible registrations
                  </caption>
                  <thead className="bg-slate-900 text-slate-300">
                    <tr>
                      {[
                        'Rank',
                        kind === 'clubs' ? 'Club' : 'Event',
                        'Registrations',
                        'Unique students',
                        ...(kind === 'clubs' ? ['Events'] : []),
                      ].map((label) => (
                        <th
                          key={label}
                          scope="col"
                          className="whitespace-nowrap p-4 font-medium"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.entries.map((entry) => (
                      <tr key={entry.id} className="border-t border-slate-800">
                        <td className="p-4 font-bold text-yellow-300">
                          #{entry.rank}
                        </td>
                        <th
                          scope="row"
                          className="min-w-[200px] p-4 font-normal"
                        >
                          <Link
                            href={`/${kind}/${entry.id}`}
                            className="inline-flex items-center gap-2 font-semibold text-white hover:text-yellow-300"
                          >
                            {entry.name}
                            <ArrowUpRight aria-hidden size={14} />
                          </Link>
                          <div className="mt-1 text-xs text-slate-400">
                            {entry.college}
                            {kind === 'events' ? ` | ${entry.clubName}` : ''}
                          </div>
                        </th>
                        <td className="p-4 font-semibold text-white">
                          {number(entry.registrations)}
                        </td>
                        <td className="p-4">{number(entry.uniqueStudents)}</td>
                        {kind === 'clubs' && (
                          <td className="p-4">{number(entry.eventsCount)}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {pages > 1 && (
              <nav
                aria-label="Ranking pages"
                className="mt-5 flex items-center justify-between gap-3"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => updateFilters({ page: page - 1 })}
                  className={`${button} border border-slate-600 disabled:opacity-40`}
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {page} of {pages}
                </span>
                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() => updateFilters({ page: page + 1 })}
                  className={`${button} border border-slate-600 disabled:opacity-40`}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )
      )}
      {data && data.totals.rankedCount > MAX_LEADERBOARD_PAGE * 25 && (
        <p className="mt-4 text-sm text-slate-300">
          Showing the first 25,000 results. Narrow your college or search to
          find more.
        </p>
      )}
      <aside className="mt-8 rounded-2xl border border-slate-800 p-5 text-xs leading-6 text-slate-300">
        <h2 className="text-sm font-semibold text-white">How rankings work</h2>
        <p>
          Weeks start Monday and months start on the 1st at midnight in India.
          Registrations count in the period they were submitted, once approved.
          Paid registrations require organiser-verified payment. Internal
          core-team events, drafts and cancelled events are excluded.
        </p>
        <p>
          One student counts once per event. Club registration totals can
          include the same student across different events; unique students
          counts each student once. Ties share a rank. College filters
          recalculate ranks; searching keeps those ranks. Counts reflect current
          records and approvals, so historical totals can change. These are
          registrations, not verified attendance.
        </p>
      </aside>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense
      fallback={
        <p role="status" className="p-10 text-slate-200">
          Loading campus rankings...
        </p>
      }
    >
      <LeaderboardContent />
    </Suspense>
  );
}
