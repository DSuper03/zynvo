'use client';

import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Mail, X, Loader2 } from 'lucide-react';

type InviteStatus =
  | 'added'
  | 'invited'
  | 'already_member'
  | 'already_invited'
  | 'team_full'
  | 'invalid';

type ByEmailResult = { email: string; status: InviteStatus };

type PendingInvite = {
  id: string;
  email: string;
  expiresAt: string;
  createdAt: string;
};

const MAX_EMAILS = 20;

const STATUS_STYLE: Record<InviteStatus, { label: string; className: string }> = {
  added: { label: 'Added', className: 'bg-green-500/15 text-green-300 border-green-500/40' },
  invited: { label: 'Invited', className: 'bg-blue-500/15 text-blue-300 border-blue-500/40' },
  already_member: { label: 'Already a member', className: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/40' },
  already_invited: { label: 'Already invited', className: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/40' },
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
 * "Add by email" + pending invites for the Core Team section. Renders nothing
 * unless the caller is the club head (the server answers 403 otherwise; the
 * same check guards the add/revoke endpoints).
 */
export default function CoreTeamByEmail({ clubId, token, onChanged }: Props) {
  const [isHead, setIsHead] = useState(false);
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<ByEmailResult[] | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const auth = { headers: { authorization: `Bearer ${token}` } };

  const loadInvites = useCallback(async () => {
    if (!clubId || !token) return;
    try {
      const res = await axios.get<{ invites: PendingInvite[] }>(
        `/api/v1/clubs/${clubId}/core-invites`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      setIsHead(true);
      setInvites(res.data.invites ?? []);
    } catch (err: any) {
      // 403 = not the head; 404 = backend without this feature yet. Stay hidden.
      const status = err?.response?.status;
      if (status !== 403 && status !== 404) toast.error('Could not load pending invites');
      setIsHead(false);
    }
  }, [clubId, token]);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  if (!isHead) return null;

  const emails = splitEmails(input);
  const tooMany = emails.length > MAX_EMAILS;

  const submit = async () => {
    if (emails.length === 0 || tooMany) return;
    setSubmitting(true);
    try {
      const res = await axios.post<{ results: ByEmailResult[] }>(
        `/api/v1/clubs/${clubId}/core-members/by-email`,
        { emails },
        auth
      );
      setResults(res.data.results);
      setInput('');
      const changed = res.data.results.some((r) => r.status === 'added' || r.status === 'invited');
      if (changed) {
        await loadInvites();
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

  const revoke = async (invite: PendingInvite) => {
    setRevokingId(invite.id);
    try {
      await axios.delete(`/api/v1/clubs/${clubId}/core-invites/${invite.id}`, auth);
      setInvites((prev) => prev.filter((i) => i.id !== invite.id));
      toast.success(`Invite to ${invite.email} revoked`);
    } catch (err: any) {
      toast.error(err?.response?.data?.msg ?? 'Could not revoke invite');
      loadInvites();
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {invites.length > 0 && (
        <div className="space-y-2">
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-yellow-400/20 pb-3"
            >
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="text-yellow-200 break-all">{invite.email}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold border bg-yellow-500/10 text-yellow-300 border-yellow-500/40">
                  Pending
                </span>
                <span className="text-xs text-yellow-400/60">
                  expires {new Date(invite.expiresAt).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => revoke(invite)}
                disabled={revokingId === invite.id}
                className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                {revokingId === invite.id ? 'Revoking…' : 'Revoke'}
              </button>
            </div>
          ))}
        </div>
      )}

      {!open ? (
        <button
          onClick={() => {
            setOpen(true);
            setResults(null);
          }}
          className="inline-flex items-center gap-2 border border-yellow-400/60 text-yellow-300 px-4 py-2 rounded-lg hover:bg-yellow-400/10 font-semibold"
        >
          <Mail className="w-4 h-4" />
          Add by email
        </button>
      ) : (
        <div className="bg-black border border-yellow-400/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-yellow-300">Add core members by email</h3>
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
            One or more emails, separated by commas or new lines (max {MAX_EMAILS}). People
            with a Zynvo account are added right away; everyone else gets an invite that
            expires in 14 days. The core team has 3 seats, and pending invites hold a seat.
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder={'alex@college.edu\nsam@college.edu'}
            className="w-full bg-zinc-950 text-yellow-300 border border-yellow-500/40 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`text-xs ${tooMany ? 'text-red-400' : 'text-yellow-400/60'}`}>
              {emails.length} email{emails.length === 1 ? '' : 's'}
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
