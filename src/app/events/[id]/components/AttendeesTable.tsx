'use client';
/**
 * Spreadsheet-style attendee view: the same columns as the CSV export, one
 * row per attendee, so organizers rarely need to download the file.
 * Search runs on the server across every attendee; results are paginated.
 */
import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import type { Participant } from '@/hooks/useParticipants';

type Props = {
  participants: Participant[];
  /** Payment columns are shown only for paid events (matches the CSV). */
  isPaid: boolean;
  /** Custom question labels in configured order (from the API). */
  questions?: string[];
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  limit: number;
  totalPages: number;
  /** Attendees matching the search. */
  total: number;
  /** All attendees of the event. */
  totalAll: number;
  onPageChange: (page: number) => void;
  /** A page or search request is in flight (rows shown are the previous ones). */
  isFetching?: boolean;
};

const formatDateTime = (value?: string | null): string => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isUrl = (value: string) => /^https?:\/\//i.test(value.trim());

function Cell({ value, linkText = 'Open link' }: { value?: string | null; linkText?: string }) {
  if (!value) return <span className="text-gray-600">—</span>;
  if (isUrl(value)) {
    return (
      <a href={value.trim()} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
        {linkText}
      </a>
    );
  }
  return <>{value}</>;
}

function PaymentBadge({ status }: { status?: string | null }) {
  const s = (status || 'PENDING').toUpperCase();
  const cls =
    s === 'CONFIRMED'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      : s === 'REJECTED' || s === 'FAILED'
        ? 'bg-red-500/15 text-red-300 border-red-500/30'
        : 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
  return <span className={`inline-block px-2 py-0.5 text-xs rounded-full border ${cls}`}>{s}</span>;
}

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 12 */
function pageList(current: number, last: number): (number | '…')[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const pages = new Set([1, last, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export default function AttendeesTable({
  participants,
  isPaid,
  questions,
  search,
  onSearchChange,
  page,
  limit,
  totalPages,
  total,
  totalAll,
  onPageChange,
  isFetching = false,
}: Props) {
  // Prefer the event's configured questions; fall back to labels seen in rows
  // (older backend) so answers never disappear.
  const questionLabels = useMemo(() => {
    const labels = [...(questions ?? [])];
    const seen = new Set(labels);
    for (const p of participants) {
      for (const a of p.customAnswers ?? []) {
        if (!seen.has(a.label)) {
          seen.add(a.label);
          labels.push(a.label);
        }
      }
    }
    return labels;
  }, [participants, questions]);

  const rows = useMemo(
    () =>
      participants.map((p, i) => {
        const answers: Record<string, string> = {};
        for (const a of p.customAnswers ?? []) answers[a.label] = a.answer;
        return { p, n: (page - 1) * limit + i + 1, answers };
      }),
    [participants, page, limit]
  );

  const searching = search.trim().length > 0;
  const columnCount = 9 + (isPaid ? 2 : 0) + questionLabels.length;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const th =
    'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap border-b border-gray-800 bg-gray-900';
  const td = 'px-3 py-2 text-sm text-gray-200 whitespace-nowrap border-b border-gray-800/70 group-hover:bg-gray-900';
  const pageBtn =
    'min-w-9 h-9 px-2 rounded-md text-sm border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search all attendees: name, email, college, answers…"
            aria-label="Search attendees"
            className="w-full pl-9 pr-9 py-2 text-sm bg-gray-900 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-500/60"
          />
          {isFetching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 animate-spin" />
          )}
        </div>
        <p className="text-sm text-gray-400 tabular-nums">
          {searching
            ? `${total} of ${totalAll} attendees match`
            : `${totalAll} attendee${totalAll === 1 ? '' : 's'}`}
          {total > 0 && totalPages > 1 && ` · showing ${from}–${to}`}
        </p>
      </div>

      <div
        className={`overflow-auto max-h-[70vh] rounded-lg border border-gray-800 transition-opacity ${isFetching ? 'opacity-60' : ''}`}
      >
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className={`${th} sticky left-0 z-30 w-12`}>#</th>
              <th className={`${th} sticky left-12 z-30`}>Name</th>
              <th className={th}>Email</th>
              <th className={th}>College</th>
              <th className={th}>Course</th>
              <th className={th}>Year</th>
              <th className={th}>Joined At</th>
              <th className={th}>Pass ID</th>
              {isPaid && <th className={th}>Payment Status</th>}
              {isPaid && <th className={th}>Payment Screenshot</th>}
              <th className={th}>Checked In</th>
              {questionLabels.map((label) => (
                <th key={label} className={th} title={label}>
                  <span className="inline-block max-w-[16rem] truncate align-bottom">{label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-3 py-8 text-sm text-center text-gray-500">
                  {searching ? `No attendees match “${search.trim()}”.` : 'No attendees on this page.'}
                </td>
              </tr>
            ) : (
              rows.map(({ p, n, answers }) => (
                <tr key={`${p.user.id}-${p.joinedAt}`} className="group">
                  <td className={`${td} sticky left-0 z-10 bg-[#0B0B0B] text-gray-500 tabular-nums`}>{n}</td>
                  <td className={`${td} sticky left-12 z-10 bg-[#0B0B0B] font-medium text-white`}>
                    {p.user.name || 'Anonymous User'}
                  </td>
                  <td className={td}>
                    <a href={`mailto:${p.user.email}`} className="text-yellow-400 hover:underline">
                      {p.user.email}
                    </a>
                  </td>
                  <td className={td}><Cell value={p.user.collegeName} /></td>
                  <td className={td}><Cell value={p.user.course} /></td>
                  <td className={td}><Cell value={p.user.year} /></td>
                  <td className={`${td} tabular-nums`}>{formatDateTime(p.joinedAt)}</td>
                  <td className={`${td} font-mono text-xs`}><Cell value={p.passId} /></td>
                  {isPaid && (
                    <td className={td}><PaymentBadge status={p.paymentStatus} /></td>
                  )}
                  {isPaid && (
                    <td className={td}>
                      <Cell value={p.paymentScreenshotUrl ?? p.paymentProofUrl} linkText="View screenshot" />
                    </td>
                  )}
                  <td className={`${td} tabular-nums`}>
                    {p.checkedInAt ? (
                      <span className="text-emerald-400">{formatDateTime(p.checkedInAt)}</span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  {questionLabels.map((label) => (
                    <td key={label} className={`${td} max-w-[20rem] truncate`} title={answers[label] ?? ''}>
                      <Cell value={answers[label]} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-1.5 pt-1" aria-label="Attendee pages">
          <button
            type="button"
            className={pageBtn}
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 mx-auto" />
          </button>
          {pageList(page, totalPages).map((p, i) =>
            p === '…' ? (
              <span key={`gap-${i}`} className="px-1 text-gray-500">…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={
                  p === page
                    ? 'min-w-9 h-9 px-2 rounded-md text-sm font-semibold bg-yellow-400 text-black border border-yellow-400'
                    : pageBtn
                }
              >
                {p}
              </button>
            )
          )}
          <button
            type="button"
            className={pageBtn}
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 mx-auto" />
          </button>
        </nav>
      )}
    </div>
  );
}
