'use client';
/**
 * Spreadsheet-style attendee view: the same columns as the CSV export, one
 * row per attendee, so organizers rarely need to download the file.
 */
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Participant } from '@/hooks/useParticipants';

type Props = {
  participants: Participant[];
  /** 1-based index of the first row on this page, for the # column. */
  startIndex: number;
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

function Cell({ value }: { value?: string | null }) {
  if (!value) return <span className="text-gray-600">—</span>;
  if (isUrl(value)) {
    return (
      <a
        href={value.trim()}
        target="_blank"
        rel="noreferrer"
        className="text-blue-400 hover:underline"
      >
        Open link
      </a>
    );
  }
  return <>{value}</>;
}

export default function AttendeesTable({ participants, startIndex }: Props) {
  const [query, setQuery] = useState('');

  // One column per custom question, in the order questions first appear.
  const questionLabels = useMemo(() => {
    const seen = new Set<string>();
    const labels: string[] = [];
    for (const p of participants) {
      for (const a of p.customAnswers ?? []) {
        if (!seen.has(a.label)) {
          seen.add(a.label);
          labels.push(a.label);
        }
      }
    }
    return labels;
  }, [participants]);

  const rows = useMemo(
    () =>
      participants.map((p, i) => {
        const answers: Record<string, string> = {};
        for (const a of p.customAnswers ?? []) answers[a.label] = a.answer;
        return { p, n: startIndex + i, answers };
      }),
    [participants, startIndex]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(({ p, answers }) =>
      [
        p.user.name,
        p.user.email,
        p.user.collegeName,
        p.user.course,
        p.passId,
        ...Object.values(answers),
      ].some((v) => v?.toLowerCase().includes(q))
    );
  }, [rows, query]);

  const th =
    'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap border-b border-gray-800 bg-gray-900';
  const td = 'px-3 py-2 text-sm text-gray-200 whitespace-nowrap border-b border-gray-800/70';

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, college, answers…"
          aria-label="Search attendees"
          className="w-full pl-9 pr-3 py-2 text-sm bg-gray-900 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-500/60"
        />
      </div>

      <div className="overflow-auto max-h-[70vh] rounded-lg border border-gray-800">
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
              <th className={th}>Checked In</th>
              {questionLabels.map((label) => (
                <th key={label} className={th} title={label}>
                  <span className="inline-block max-w-[16rem] truncate align-bottom">{label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9 + questionLabels.length} className={`${td} text-center text-gray-500 py-6`}>
                  No attendees match “{query.trim()}” on this page.
                </td>
              </tr>
            ) : (
              filtered.map(({ p, n, answers }) => (
                <tr key={`${p.user.id}-${p.joinedAt}`} className="group">
                  <td className={`${td} sticky left-0 z-10 bg-[#0B0B0B] group-hover:bg-gray-900 text-gray-500 tabular-nums`}>
                    {n}
                  </td>
                  <td className={`${td} sticky left-12 z-10 bg-[#0B0B0B] group-hover:bg-gray-900 font-medium text-white`}>
                    {p.user.name || 'Anonymous User'}
                  </td>
                  <td className={`${td} group-hover:bg-gray-900`}>
                    <a href={`mailto:${p.user.email}`} className="text-yellow-400 hover:underline">
                      {p.user.email}
                    </a>
                  </td>
                  <td className={`${td} group-hover:bg-gray-900`}><Cell value={p.user.collegeName} /></td>
                  <td className={`${td} group-hover:bg-gray-900`}><Cell value={p.user.course} /></td>
                  <td className={`${td} group-hover:bg-gray-900`}><Cell value={p.user.year} /></td>
                  <td className={`${td} group-hover:bg-gray-900 tabular-nums`}>{formatDateTime(p.joinedAt)}</td>
                  <td className={`${td} group-hover:bg-gray-900 font-mono text-xs`}><Cell value={p.passId} /></td>
                  <td className={`${td} group-hover:bg-gray-900 tabular-nums`}>
                    {p.checkedInAt ? (
                      <span className="text-emerald-400">{formatDateTime(p.checkedInAt)}</span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  {questionLabels.map((label) => (
                    <td
                      key={label}
                      className={`${td} group-hover:bg-gray-900 max-w-[20rem] truncate`}
                      title={answers[label] ?? ''}
                    >
                      <Cell value={answers[label]} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
