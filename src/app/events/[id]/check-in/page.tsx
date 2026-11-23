'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Keyboard,
  ScanLine,
  ShieldX,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import QrCameraScanner from '@/components/QrCameraScanner';
import { buildAuthHref } from '@/lib/authReturnTo';

type CheckInStatus =
  | 'checked_in'
  | 'already'
  | 'invalid'
  | 'not_approved'
  | 'payment_pending';

interface CheckInResult {
  status: CheckInStatus;
  msg: string;
  checkedInAt?: string;
  attendee?: {
    id?: string;
    name?: string | null;
    profileAvatar?: string | null;
    collegeName?: string | null;
  };
}

interface RecentScan {
  key: number;
  name: string;
  status: CheckInStatus;
  at: Date;
}

/** Ignore the same code for this long so one pass held up to the camera isn't re-sent. */
const SAME_CODE_COOLDOWN_MS = 4000;

const RESULT_STYLE: Record<
  CheckInStatus,
  { tone: string; icon: React.ReactNode; title: string }
> = {
  checked_in: {
    tone: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    icon: <CheckCircle2 className="h-8 w-8" aria-hidden />,
    title: 'Checked in',
  },
  already: {
    tone: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    icon: <AlertCircle className="h-8 w-8" aria-hidden />,
    title: 'Already checked in',
  },
  invalid: {
    tone: 'border-red-500/50 bg-red-500/10 text-red-300',
    icon: <XCircle className="h-8 w-8" aria-hidden />,
    title: 'Not valid for this event',
  },
  not_approved: {
    tone: 'border-red-500/50 bg-red-500/10 text-red-300',
    icon: <ShieldX className="h-8 w-8" aria-hidden />,
    title: 'Registration not approved',
  },
  payment_pending: {
    tone: 'border-red-500/50 bg-red-500/10 text-red-300',
    icon: <CreditCard className="h-8 w-8" aria-hidden />,
    title: 'Payment not confirmed',
  },
};

const isCheckInStatus = (value: unknown): value is CheckInStatus =>
  typeof value === 'string' && value in RESULT_STYLE;

export default function EventCheckInPage() {
  const params = useParams();
  const rawId = (params as Record<string, string | string[]>).id;
  const eventId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [eventName, setEventName] = useState('');
  const [stats, setStats] = useState<{ registered: number; checkedIn: number } | null>(null);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recent, setRecent] = useState<RecentScan[]>([]);
  const [manual, setManual] = useState('');
  const [sound, setSound] = useState(true);

  const busyRef = useRef(false);
  const lastScan = useRef<{ code: string; at: number }>({ code: '', at: 0 });
  const audio = useRef<AudioContext | null>(null);
  const counter = useRef(0);

  useEffect(() => {
    try {
      setToken(localStorage.getItem('token'));
    } catch {
      setToken(null);
    }
  }, []);

  const authHeaders = useCallback(
    () => ({ authorization: `Bearer ${token}` }),
    [token]
  );

  // Event title (public) for the header.
  useEffect(() => {
    if (!eventId) return;
    axios
      .get(`/api/v1/events/event/${encodeURIComponent(eventId)}`)
      .then((res) => {
        const name = (res.data as any)?.response?.EventName;
        if (typeof name === 'string') setEventName(name);
      })
      .catch(() => undefined);
  }, [eventId]);

  const loadStats = useCallback(async () => {
    if (!eventId || !token) return;
    try {
      const res = await axios.get<{ registered?: number; checkedIn?: number }>(
        `/api/v1/events/${encodeURIComponent(eventId)}/check-in/stats`,
        { headers: authHeaders() }
      );
      setStats({
        registered: res.data?.registered ?? 0,
        checkedIn: res.data?.checkedIn ?? 0,
      });
      setDenied(false);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401 || status === 403) {
        setDenied(true);
      } else {
        setError('Could not load check-in numbers. Scanning may still work.');
      }
    }
  }, [eventId, token, authHeaders]);

  useEffect(() => {
    if (token) void loadStats();
  }, [token, loadStats]);

  const beep = useCallback(
    (ok: boolean) => {
      if (!sound) return;
      try {
        const Ctx =
          window.AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) return;
        audio.current = audio.current || new Ctx();
        const ctx = audio.current;
        void ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = ok ? 880 : 220;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (ok ? 0.15 : 0.35));
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + (ok ? 0.15 : 0.35));
      } catch {
        // sound is a nicety; never block check-in on it
      }
    },
    [sound]
  );

  const submit = useCallback(
    async (scanned: string, force = false) => {
      const code = scanned.trim();
      if (!code || !eventId || !token) return;
      const now = Date.now();
      if (busyRef.current) return;
      if (
        !force &&
        code === lastScan.current.code &&
        now - lastScan.current.at < SAME_CODE_COOLDOWN_MS
      ) {
        return;
      }
      lastScan.current = { code, at: now };

      busyRef.current = true;
      setBusy(true);
      setError(null);
      try {
        // The server accepts the full QR link or a bare pass id.
        const res = await axios.post<CheckInResult | { msg?: string }>(
          `/api/v1/events/${encodeURIComponent(eventId)}/check-in`,
          { passId: code },
          {
            headers: authHeaders(),
            validateStatus: (s) => s < 500 && s !== 401 && s !== 403,
          }
        );
        const body = res.data as CheckInResult;
        if (!isCheckInStatus(body?.status)) {
          setResult(null);
          setError(
            (res.data as { msg?: string })?.msg || 'Unexpected response. Please try again.'
          );
          beep(false);
          return;
        }
        setResult(body);
        beep(body.status === 'checked_in');
        setRecent((prev) =>
          [
            {
              key: ++counter.current,
              name: body.attendee?.name || 'Attendee',
              status: body.status,
              at: new Date(),
            },
            ...prev,
          ].slice(0, 8)
        );
        if (body.status === 'checked_in') {
          setStats((s) => (s ? { ...s, checkedIn: s.checkedIn + 1 } : s));
        }
      } catch (e: any) {
        setResult(null);
        const status = e?.response?.status;
        if (status === 401 || status === 403) {
          setDenied(true);
        } else if (!e?.response) {
          setError('No connection. Check your internet and scan again.');
        } else {
          setError('Something went wrong. Please try again.');
        }
        beep(false);
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [eventId, token, authHeaders, beep]
  );

  const back = (
    <Link
      href={`/events/${eventId}`}
      className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-yellow-300"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden /> Back to event
    </Link>
  );

  if (token === undefined) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-sm text-gray-400" role="status">
        Loading…
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <ScanLine className="mx-auto mb-3 h-10 w-10 text-yellow-400" aria-hidden />
        <h1 className="text-xl font-bold text-white">Sign in to check people in</h1>
        <p className="mt-2 text-sm text-gray-400">
          Only the event’s organisers can scan passes.
        </p>
        <Link
          href={buildAuthHref('/auth/signin', `/events/${eventId}/check-in`)}
          className="mt-5 inline-block rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black hover:bg-yellow-500"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <ShieldX className="mx-auto mb-3 h-10 w-10 text-red-400" aria-hidden />
        <h1 className="text-xl font-bold text-white">You can’t check people in here</h1>
        <p className="mt-2 text-sm text-gray-400">
          Only this event’s organisers (club founder, core team or the event
          creator) can scan passes. If that’s you, sign in with that account.
        </p>
        <div className="mt-5">{back}</div>
      </div>
    );
  }

  const style = result ? RESULT_STYLE[result.status] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-4 text-gray-200">
      {back}
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-yellow-300">
            <ScanLine className="h-4 w-4" aria-hidden /> Check-in
          </p>
          <h1 className="text-2xl font-bold text-white">{eventName || 'Event check-in'}</h1>
          <p className="mt-1 text-sm text-gray-400">
            Hold an attendee’s ticket QR up to the camera. They’re checked in
            automatically and their ticket updates.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSound((s) => !s)}
          aria-pressed={sound}
          aria-label={sound ? 'Mute scan sounds' : 'Unmute scan sounds'}
          className="rounded-lg border border-gray-700 p-2 text-gray-300 hover:border-yellow-500 hover:text-yellow-300"
        >
          {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </header>

      {stats && (
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="text-3xl font-bold text-yellow-300">{stats.checkedIn}</div>
            <div className="text-xs text-gray-400">Checked in</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="text-3xl font-bold text-white">{stats.registered}</div>
            <div className="text-xs text-gray-400">Registered</div>
          </div>
        </div>
      )}

      <QrCameraScanner onScan={(text) => void submit(text)} paused={busy} />

      <div aria-live="polite" className="mt-4">
        {style && result && (
          <div className={`flex items-center gap-4 rounded-2xl border p-4 ${style.tone}`}>
            {result.attendee?.profileAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.attendee.profileAvatar}
                alt=""
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-current"
              />
            ) : (
              style.icon
            )}
            <div className="min-w-0">
              <div className="text-lg font-semibold">{style.title}</div>
              {result.attendee?.name && (
                <div className="truncate text-sm text-white">{result.attendee.name}</div>
              )}
              {result.attendee?.collegeName && (
                <div className="truncate text-xs text-gray-300">
                  {result.attendee.collegeName}
                </div>
              )}
              <div className="mt-0.5 text-xs opacity-80">{result.msg}</div>
            </div>
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}
      </div>

      <form
        className="mt-5 flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(manual, true);
          setManual('');
        }}
      >
        <label htmlFor="manual-pass" className="flex items-center gap-1.5 text-xs text-gray-400">
          <Keyboard className="h-4 w-4" aria-hidden /> Can’t scan? Enter the pass ID
        </label>
        <input
          id="manual-pass"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          maxLength={200}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
          placeholder="Pass ID or the link under the QR"
        />
        <button
          type="submit"
          disabled={busy || !manual.trim()}
          className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500 disabled:opacity-50"
        >
          Check in
        </button>
      </form>

      {recent.length > 0 && (
        <section className="mt-6" aria-labelledby="recent-title">
          <h2 id="recent-title" className="mb-2 text-sm font-semibold text-white">
            This session
          </h2>
          <ul className="divide-y divide-gray-800 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
            {recent.map((scan) => (
              <li key={scan.key} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <span className="min-w-0 truncate text-white">{scan.name}</span>
                <span className="flex shrink-0 items-center gap-3 text-xs">
                  <span
                    className={
                      scan.status === 'checked_in'
                        ? 'text-emerald-300'
                        : scan.status === 'already'
                          ? 'text-amber-300'
                          : 'text-red-300'
                    }
                  >
                    {RESULT_STYLE[scan.status].title}
                  </span>
                  <span className="text-gray-500">
                    {scan.at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
