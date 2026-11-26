'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Trophy, RefreshCw, Crown } from 'lucide-react';

type Period = 'week' | 'month' | 'all';
type Kind = 'clubs' | 'events';
interface Entry {
  id: string;
  name: string;
  college: string;
  clubName: string | null;
  image: string | null;
  registrations: number;
  uniqueStudents: number;
  eventsCount: number;
  rank: number;
}
interface Rankings {
  entries: Entry[];
  colleges: string[];
  totals: {
    registrations: number;
    uniqueStudents: number;
    eventsCount: number;
    rankedCount: number;
  };
  page: number;
  pageSize: number;
  generatedAt: string;
  start: string | null;
  end: string;
}

const periods: [Period, string][] = [
  ['all', 'All time'],
  ['month', 'This month'],
  ['week', 'This week'],
];
const number = (value: number) => value.toLocaleString('en-IN');

// Podium styling per place: gold, silver, bronze.
const places = [
  {
    label: '1st',
    block: 'h-32 sm:h-40 bg-gradient-to-b from-yellow-300 to-yellow-500',
    ring: 'ring-yellow-300',
    text: 'text-yellow-300',
  },
  {
    label: '2nd',
    block: 'h-24 sm:h-28 bg-gradient-to-b from-slate-200 to-slate-400',
    ring: 'ring-slate-300',
    text: 'text-slate-200',
  },
  {
    label: '3rd',
    block: 'h-16 sm:h-20 bg-gradient-to-b from-amber-600 to-amber-800',
    ring: 'ring-amber-600',
    text: 'text-amber-500',
  },
];

function Avatar({ entry, className }: { entry: Entry; className: string }) {
  return entry.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={entry.image}
      alt=""
      className={`${className} object-cover`}
      loading="lazy"
    />
  ) : (
    <div
      aria-hidden
      className={`${className} flex items-center justify-center bg-slate-800 font-bold text-white`}
    >
      {entry.name.trim().charAt(0).toUpperCase() || '?'}
    </div>
  );
}

function Podium({ entries, kind }: { entries: Entry[]; kind: Kind }) {
  // Visual order: 2nd, 1st, 3rd so the winner stands in the middle.
  const order = [1, 0, 2].filter((index) => entries[index]);
  return (
    <ol
      aria-label={`Top ${kind}`}
      className="mx-auto mb-8 flex max-w-2xl items-end justify-center gap-2 sm:gap-4"
    >
      {order.map((index) => {
        const entry = entries[index];
        const place = places[index];
        return (
          <li key={entry.id} className="flex min-w-0 flex-1 flex-col items-center">
            {index === 0 && (
              <Crown aria-hidden size={26} className="mb-1 text-yellow-300" />
            )}
            <Avatar
              entry={entry}
              className={`mb-2 rounded-full ring-4 ${place.ring} ${index === 0 ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-12 w-12 sm:h-16 sm:w-16'}`}
            />
            <Link
              href={`/${kind}/${entry.id}`}
              className="line-clamp-2 w-full break-words text-center text-xs font-semibold text-white hover:text-yellow-300 sm:text-sm"
            >
              {entry.name}
            </Link>
            <span className="mt-0.5 line-clamp-1 w-full text-center text-[11px] text-slate-400">
              {kind === 'events' && entry.clubName
                ? entry.clubName
                : entry.college}
            </span>
            <span className={`mt-1 text-lg font-bold sm:text-2xl ${place.text}`}>
              {number(entry.registrations)}
            </span>
            <span className="mb-2 text-[11px] text-slate-400">registrations</span>
            <div
              className={`flex w-full items-start justify-center rounded-t-xl pt-2 text-xl font-extrabold text-black sm:text-3xl ${place.block}`}
            >
              {entry.rank === 1
                ? '1st'
                : entry.rank === 2
                  ? '2nd'
                  : entry.rank === 3
                    ? '3rd'
                    : place.label}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function LeaderboardPage() {
  const [kind, setKind] = useState<Kind>('clubs');
  const [period, setPeriod] = useState<Period>('all');
  const [page, setPage] = useState(1);
  const { data, isPending, isFetching, isError, refetch } = useQuery<Rankings>({
    queryKey: ['leaderboard', kind, period, page],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        kind,
        period,
        college: '',
        search: '',
        page: String(page),
      });
      const response = await fetch(`/api/v1/leaderboard?${params}`, { signal });
      if (!response.ok) throw new Error('Unable to load rankings');
      return response.json();
    },
    staleTime: 180_000,
    refetchInterval: 180_000,
    retry: 1,
  });
  const pages = data
    ? Math.max(1, Math.ceil(data.totals.rankedCount / data.pageSize))
    : 1;
  const podium = page === 1 ? (data?.entries.slice(0, 3) ?? []) : [];
  const rest = page === 1 ? (data?.entries.slice(3) ?? []) : (data?.entries ?? []);
  const button =
    'rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300';
  const tab = (active: boolean) =>
    `${button} ${active ? 'bg-yellow-300 text-black' : 'text-slate-200 hover:bg-slate-800'}`;

  return (
    <div className="mx-auto max-w-3xl px-1 pb-10 pt-16 text-slate-200 md:px-4 md:pt-2">
      <header className="mb-6 text-center">
        <p className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-yellow-300">
          <Trophy size={18} aria-hidden /> Campus leaderboard
        </p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Top {kind} on campus
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
          Ranked by eligible registrations.
          {period === 'all' ? ' Includes every past event.' : ''}
        </p>
      </header>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
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
                setKind(value);
                setPage(1);
              }}
              className={tab(kind === value)}
            >
              {value === 'clubs' ? 'Clubs' : 'Events'}
            </button>
          ))}
        </div>
        <div
          className="flex gap-1 rounded-2xl bg-slate-900 p-1"
          role="group"
          aria-label="Ranking period"
        >
          {periods.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={period === value}
              onClick={() => {
                setPeriod(value);
                setPage(1);
              }}
              className={tab(period === value)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={isFetching}
          onClick={() => refetch()}
          aria-label="Refresh rankings"
          className={`${button} border border-slate-600 disabled:opacity-60`}
        >
          <RefreshCw
            size={16}
            aria-hidden
            className={isFetching ? 'animate-spin' : ''}
          />
        </button>
      </div>

      {isPending ? (
        <p
          role="status"
          className="rounded-2xl border border-slate-800 p-10 text-center"
        >
          Loading rankings…
        </p>
      ) : isError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-900 bg-red-950/30 p-8 text-center"
        >
          <p>We couldn’t load the leaderboard. Please try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className={`${button} mt-4 bg-yellow-300 text-black`}
          >
            Try again
          </button>
        </div>
      ) : (
        data &&
        (data.entries.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 p-10 text-center">
            <h2 className="text-lg font-semibold text-white">No rankings yet</h2>
            <p className="mt-2 text-sm text-slate-300">
              No eligible registrations in this period. Try “All time”.
            </p>
          </div>
        ) : (
          <>
            {podium.length > 0 && <Podium entries={podium} kind={kind} />}

            {rest.length > 0 && (
              <ol className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                {rest.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={`/${kind}/${entry.id}`}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-800"
                    >
                      <span className="w-8 shrink-0 text-center text-sm font-bold text-yellow-300">
                        {entry.rank}
                      </span>
                      <Avatar entry={entry} className="h-9 w-9 shrink-0 rounded-full" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-white">
                          {entry.name}
                        </span>
                        <span className="block truncate text-xs text-slate-400">
                          {kind === 'events' && entry.clubName
                            ? `${entry.clubName} · ${entry.college}`
                            : entry.college}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-sm font-bold text-white">
                          {number(entry.registrations)}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          registrations
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}

            {pages > 1 && (
              <nav
                aria-label="Ranking pages"
                className="mt-5 flex items-center justify-between gap-3"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
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
                  onClick={() => setPage(page + 1)}
                  className={`${button} border border-slate-600 disabled:opacity-40`}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        ))
      )}

      <p className="mt-8 text-center text-xs leading-6 text-slate-400">
        Counts approved registrations (paid ones once verified by the organiser),
        one per student per event. Weeks start Monday and months on the 1st, India
        time. These are registrations, not verified attendance.
      </p>
    </div>
  );
}
