'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ConfirmClient({
  token,
  maskedEmail,
}: {
  token: string;
  maskedEmail: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!token) {
        setStatus('error');
        setMessage(
          'Please open the link from the email we sent. If you deleted the email by accident, you can request a new one from the deletion page.'
        );
        return;
      }

      setStatus('loading');
      try {
        const res = await axios.get<{ success?: boolean; msg?: string; message?: string }>(
          `/api/v1/user/deleteAccount/confirm`,
          { params: { token } }
        );

        if (cancelled) return;

        const data = res.data ?? {};
        if (res.status >= 200 && res.status < 300 && data.success !== false) {
          setStatus('success');
          setMessage(
            data.msg ||
              data.message ||
              'Your account has been scheduled for deletion.'
          );
        } else {
          setStatus('error');
          setMessage(
            data.msg ||
              data.message ||
              'This confirmation link is invalid, expired, or already used.'
          );
        }
      } catch (err: any) {
        if (cancelled) return;
        const apiMsg =
          err?.response?.data?.msg ||
          err?.response?.data?.message ||
          err?.message;
        setStatus('error');
        setMessage(
          apiMsg ||
            'We could not reach our servers right now. Please try again, or email privacy@zynvosocial.com.'
        );
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-gray-200">
      <div className="mx-auto max-w-2xl px-5 py-20 sm:px-6">
        <div
          className={`rounded-2xl border p-8 text-center shadow-xl ${panelBorder(
            status
          )}`}
        >
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${panelBg(status)}`}>
            {status === 'success' ? (
              <CheckIcon />
            ) : status === 'error' ? (
              <CrossIcon />
            ) : (
              <Spinner />
            )}
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            {panelTitle(status)}
          </h1>
          <p className="mt-4 text-gray-300">{message || panelBody(status)}</p>

          {maskedEmail ? (
            <p className="mt-3 text-xs text-gray-500">
              Confirmation target: {maskedEmail}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {status === 'success' ? (
              <Link
                href="/"
                className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
              >
                Back to Zynvo
              </Link>
            ) : (
              <Link
                href="/delete-account"
                className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
              >
                Request a new link
              </Link>
            )}
            <Link
              href="/privacy"
              className="rounded-lg border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-yellow-400 hover:text-white"
            >
              Read the Privacy Policy
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Questions? Email{' '}
          <a
            href="mailto:privacy@zynvosocial.com"
            className="text-yellow-400 underline-offset-2 hover:underline"
          >
            privacy@zynvosocial.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}

function panelBorder(s: Status) {
  if (s === 'success') return 'border-green-500/30 bg-gray-900/60';
  if (s === 'error') return 'border-red-500/30 bg-gray-900/60';
  return 'border-gray-700 bg-gray-900/60';
}

function panelBg(s: Status) {
  if (s === 'success') return 'bg-green-500/15';
  if (s === 'error') return 'bg-red-500/15';
  return 'bg-yellow-500/10';
}

function panelTitle(s: Status) {
  if (s === 'success') return 'Your account is being deleted';
  if (s === 'error') return 'We could not confirm that link';
  return 'Confirming your deletion…';
}

function panelBody(s: Status) {
  if (s === 'loading')
    return 'Hang on a second while we verify the link in your email.';
  return '';
}

function CheckIcon() {
  return (
    <svg
      className="h-8 w-8 text-green-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      className="h-8 w-8 text-red-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-8 w-8 animate-spin text-yellow-400"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
