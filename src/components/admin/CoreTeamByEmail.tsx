'use client';

import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { UserPlus, X, Loader2 } from 'lucide-react';
import MemberSelect from '@/components/MemberSelect';

type AddStatus = 'added' | 'already_member' | 'not_found' | 'team_full' | 'invalid';

type AddResult = { email: string; status: AddStatus };

const MAX_EMAILS = 20;

const STATUS_STYLE: Record<AddStatus, { label: string; className: string }> = {
  added: { label: 'Added', className: 'bg-green-500/15 text-green-300 border-green-500/40' },
  already_member: { label: 'Already on core team', className: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/40' },
  not_found: { label: 'Not on Zynvo yet', className: 'bg-orange-500/15 text-orange-300 border-orange-500/40' },
  team_full: { label: 'Core team full', className: 'bg-orange-500/15 text-orange-300 border-orange-500/40' },
  invalid: { label: 'Invalid email', className: 'bg-red-500/15 text-red-300 border-red-500/40' },
};

/** Splits on commas / newlines / semicolons; trims, lowercases and dedupes. */
const splitEmails = (raw: string): string[] => [
  ...new Set(
    raw
      .split(/[,\n\r;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  ),
];

interface Props {
  clubId: string;
  token: string;
  /** Called after core members change so the parent can refetch the club. */
  onChanged?: () => void;
}

/**
 * Adds people to the core team directly — by search (name or email) or by
 * pasting emails. Anyone with a Zynvo account is added instantly; there are no
 * invites. Renders nothing unless the caller is the club head (the server
 * answers 403 otherwise; the same check guards the add endpoint).
 */
export default function CoreTeamByEmail({ clubId, token, onChanged }: Props) {
  const [isHead, setIsHead] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  // People chosen from search (already on Zynvo).
  const [picked, setPicked] = useState<{ email: string; name?: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<AddResult[] | null>(null);
  // The parent passes a new function each render; a ref keeps checkHead stable.
  const onChangedRef = useRef(onChanged);
  onChangedRef.current = onChanged;

  // Head check. The same call settles invites left from the old invite flow
  // (people with an account are added), so refresh the slots if any were.
  const checkHead = useCallback(async () => {
    if (!clubId || !token) return;
    try {
      const res = await axios.get<{ added?: number }>(`/api/v1/clubs/${clubId}/core-invites`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setIsHead(true);
      if ((res.data?.added ?? 0) > 0) onChangedRef.current?.();
    } catch {
      // 403 = not the head. Stay hidden.
      setIsHead(false);
    }
  }, [clubId, token]);

  useEffect(() => {
    checkHead();
  }, [checkHead]);

  // Signed-in SearchUser matches name or email and returns email.
  const searchPeople = useCallback(async (query: string): Promise<any[]> => {
    if (!token || !query.trim()) return [];
    try {
      const res = await fetch(`/api/v1/user/SearchUser?name=${encodeURIComponent(query.trim())}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data?.users) ? data.users : [];
    } catch {
      return [];
    }
  }, [token]);

  if (!isHead) return null;

  const emails = [...new Set([...picked.map((p) => p.email.toLowerCase()), ...splitEmails(input)])];
  const tooMany = emails.length > MAX_EMAILS;

  const submit = async () => {
    if (emails.length === 0 || tooMany) return;
    setSubmitting(true);
    try {
      const res = await axios.post<{ results: AddResult[] }>(
        `/api/v1/clubs/${clubId}/core-members/by-email`,
        { emails },
        { headers: { authorization: `Bearer ${token}` } }
      );
      const list = res.data.results ?? [];
      setResults(list);
      setInput('');
      setPicked([]);
      const added = list.filter((r) => r.status === 'added').length;
      if (added > 0) {
        toast.success(`${added} ${added === 1 ? 'person' : 'people'} added to the core team`);
        onChanged?.();
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 429) toast.error('Too many requests — try again in a minute');
      else toast.error(err?.response?.data?.msg ?? 'Could not add core members');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {!open ? (
        <button
          onClick={() => {
            setOpen(true);
            setResults(null);
          }}
          className="inline-flex items-center gap-2 border border-yellow-400/60 text-yellow-300 px-4 py-2 rounded-lg hover:bg-yellow-400/10 font-semibold"
        >
          <UserPlus className="w-4 h-4" />
          Add people to core team
        </button>
      ) : (
        <div className="bg-black border border-yellow-400/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-yellow-300">Add core members</h3>
            <button
              onClick={() => {
                setOpen(false);
                setResults(null);
              }}
              className="text-yellow-400/70 hover:text-yellow-300"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-yellow-400/70">
            Anyone with a Zynvo account is added to the core team right away and gets a
            notification. People who aren&apos;t on Zynvo yet need to sign up first. The core
            team has 3 seats.
          </p>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-yellow-300">Search people on Zynvo</label>
            <MemberSelect
              members={[]}
              value=""
              placeholder="Search by name or email"
              onSearch={searchPeople}
              allowCustomEmail
              onChange={(email) => {
                if (!email) return;
                setPicked((prev) =>
                  prev.some((p) => p.email.toLowerCase() === email.toLowerCase())
                    ? prev
                    : [...prev, { email }]
                );
              }}
            />
            {picked.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {picked.map((p) => (
                  <span
                    key={p.email}
                    className="inline-flex items-center gap-1 pl-3 pr-1 py-1 rounded-full text-xs bg-yellow-400/15 text-yellow-200 border border-yellow-400/40"
                  >
                    <span className="break-all">{p.email}</span>
                    <button
                      type="button"
                      onClick={() => setPicked((prev) => prev.filter((x) => x.email !== p.email))}
                      className="p-0.5 rounded-full hover:bg-yellow-400/20"
                      aria-label={`Remove ${p.email}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <label className="block text-xs font-medium text-yellow-300">
            Or paste emails (comma or new line separated)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder={'alex@college.edu\nsam@college.edu'}
            className="w-full bg-zinc-950 text-yellow-300 border border-yellow-500/40 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`text-xs ${tooMany ? 'text-red-400' : 'text-yellow-400/60'}`}>
              {emails.length} {emails.length === 1 ? 'person' : 'people'}
              {tooMany ? ` — max ${MAX_EMAILS}` : ''}
            </span>
            <button
              onClick={submit}
              disabled={submitting || emails.length === 0 || tooMany}
              className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 font-semibold disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Add
            </button>
          </div>

          {results && (
            <ul className="space-y-1.5 pt-2 border-t border-yellow-400/20">
              {results.map((r) => {
                const style = STATUS_STYLE[r.status] ?? STATUS_STYLE.invalid;
                return (
                  <li key={r.email} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-yellow-200 break-all">{r.email}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${style.className}`}>
                      {style.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
