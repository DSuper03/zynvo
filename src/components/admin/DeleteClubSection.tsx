'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { checkClubRole } from '@/hooks/useClubRole';
import { notifyDataChanged } from '@/lib/dataEvents';

interface Props {
  clubId: string;
  clubName: string;
  token: string;
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * Danger zone: delete the club. Shown to the club head only (the server
 * enforces the same rule and re-checks the typed name).
 */
export default function DeleteClubSection({ clubId, clubName, token }: Props) {
  const router = useRouter();
  const [isHead, setIsHead] = useState(false);
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token || !clubId) return;
    let cancelled = false;
    checkClubRole(token, clubId).then((role) => {
      if (!cancelled) setIsHead(role.authorized && role.role === 'founder');
    });
    return () => {
      cancelled = true;
    };
  }, [token, clubId]);

  if (!isHead) return null;

  const matches = norm(typed) === norm(clubName) && typed.trim().length > 0;

  const deleteClub = async () => {
    if (!matches || deleting) return;
    setDeleting(true);
    try {
      await axios.post(
        `/api/v1/clubs/${clubId}/delete`,
        { confirmName: typed },
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast.success(`${clubName} was deleted`);
      notifyDataChanged('club');
      router.push('/clubs');
    } catch (err: any) {
      const status = err?.response?.status;
      toast.error(
        status === 404
          ? 'Deleting clubs isn’t available yet.'
          : err?.response?.data?.msg ?? 'Could not delete the club'
      );
      setDeleting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-red-500/40 bg-red-950/20 p-6">
      <h2 className="mb-1 flex items-center gap-2 text-xl font-semibold text-red-300">
        <AlertTriangle className="h-5 w-5" />
        Danger zone
      </h2>
      <p className="mb-4 text-sm text-red-200/70">
        Deleting the club permanently removes its events (with their registrations, teams and
        schedules), announcements, posts, core team and invites. Members keep their Zynvo accounts.
        This can&apos;t be undone.
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500/60 px-4 py-2 font-semibold text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Delete club
        </button>
      ) : (
        <div className="space-y-3">
          <label htmlFor="confirm-club-name" className="block text-sm text-red-200">
            Type <span className="font-semibold text-white">{clubName}</span> to confirm
          </label>
          <input
            id="confirm-club-name"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            className="w-full rounded-lg border border-red-500/40 bg-black p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/60"
            placeholder={clubName}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={deleteClub}
              disabled={!matches || deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {deleting ? 'Deleting…' : 'Delete this club forever'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setTyped('');
              }}
              disabled={deleting}
              className="rounded-lg px-4 py-2 text-sm text-gray-300 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
