'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import posthog from 'posthog-js';
import { Button } from '@/components/ui/button';
import { getSafeErrorMessage, toSafeUserMessage } from '@/lib/safe-error';

type Mode = 'auth' | 'email';

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-gray-200">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <span aria-hidden>&larr;</span> Back to Zynvo
        </Link>

        <p className="mt-8 text-sm font-medium uppercase tracking-widest text-yellow-400">
          Account deletion
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          Delete your Zynvo account
        </h1>
        <p className="mt-4 text-gray-300">
          You can request deletion of your Zynvo account and the data
          associated with it. After confirmation, deletion is completed within{' '}
          <strong className="text-white">30 days</strong>.
        </p>

        <WhatHappens />

        <DeleteRequestForm />

        <Faq />
        <NeedHelp />
      </div>
    </main>
  );
}

function WhatHappens() {
  return (
    <section className="mt-10 grid gap-4 sm:grid-cols-2">
      <Card title="What gets deleted">
        <ul className="ml-5 list-disc space-y-1.5 text-sm">
          <li>Your profile, name, bio, photo, and social links</li>
          <li>Your posts, comments, RSVPs, and team memberships</li>
          <li>Uploaded images, videos, and payment screenshots</li>
          <li>Push notification tokens (Expo / FCM)</li>
          <li>Your Clerk authentication session and app tokens</li>
        </ul>
      </Card>
      <Card title="What may be retained temporarily">
        <ul className="ml-5 list-disc space-y-1.5 text-sm">
          <li>
            <strong>Financial records</strong> (up to 8 years) where required
            for tax and accounting law
          </li>
          <li>
            <strong>Abuse / fraud records</strong> (up to 2 years) when there
            has been a Terms violation or an active dispute
          </li>
          <li>
            <strong>Backups</strong> for up to 90 days before being overwritten
          </li>
          <li>
            <strong>Aggregated analytics</strong> in a form that can no longer
            identify you
          </li>
        </ul>
      </Card>
    </section>
  );
}

function DeleteRequestForm() {
  const router = useRouter();
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { isLoaded: authLoaded, getToken } = useAuth();

  const [mode, setMode] = useState<Mode>('auth');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Once Clerk loads, switch to email fallback if the user is signed out.
  useEffect(() => {
    if (userLoaded && authLoaded) {
      setMode(isSignedIn ? 'auth' : 'email');
    }
  }, [userLoaded, authLoaded, isSignedIn]);

  const submitAuthenticated = async () => {
    setSubmitting(true);
    try {
      const token = await getToken().catch(() => null);
      const headers: Record<string, string> = {};
      if (token) headers.authorization = `Bearer ${token}`;

      const res = await axios.post<{ success?: boolean; msg?: string }>(
        '/api/v1/user/deleteAccount/request',
        {
          confirmMethod: 'clerk',
          reason: reason || undefined,
        },
        { headers }
      );

      if (res.data?.success !== false) {
        posthog.capture('account_deletion_requested', {
          method: 'clerk',
        });
        toast.success('Deletion requested. Check your email for confirmation.');
        router.push('/delete-account/requested?method=clerk');
        return;
      }
      toast.error(
        toSafeUserMessage(res.data?.msg, 'Could not submit request.')
      );
    } catch (err) {
      toast.error(
        getSafeErrorMessage(err, 'Could not submit request. Please try again.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submitEmailFallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter the email address on your account.');
      return;
    }
    if (confirmText.trim() !== 'DELETE') {
      toast.error('Please type DELETE to confirm.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post<{ success?: boolean; msg?: string }>(
        '/api/v1/user/deleteAccount/request',
        {
          confirmMethod: 'email',
          email,
          reason: reason || undefined,
        }
      );

      if (res.data?.success !== false) {
        posthog.capture('account_deletion_requested', {
          method: 'email',
        });
        toast.success('Check your inbox for a confirmation link.');
        router.push(
          `/delete-account/requested?method=email&email=${encodeURIComponent(
            email
          )}`
        );
        return;
      }
      toast.error(
        toSafeUserMessage(res.data?.msg, 'Could not submit request.')
      );
    } catch (err) {
      toast.error(
        getSafeErrorMessage(err, 'Could not submit request. Please try again.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-900/40 p-6 sm:p-8">
      <div className="mb-6 flex gap-2 rounded-lg bg-black/40 p-1">
        <TabButton
          active={mode === 'auth'}
          onClick={() => setMode('auth')}
          label="I'm signed in"
          disabled={!userLoaded || !authLoaded}
        />
        <TabButton
          active={mode === 'email'}
          onClick={() => setMode('email')}
          label="I can't sign in"
        />
      </div>

      {mode === 'auth' ? (
        <div>
          {userLoaded && isSignedIn ? (
            <p className="text-sm text-gray-300">
              Signed in as{' '}
              <strong className="text-white">
                {user?.primaryEmailAddress?.emailAddress ||
                  user?.emailAddresses?.[0]?.emailAddress ||
                  'your account'}
              </strong>
              . Click the button below and we&apos;ll send a confirmation
              email. The account will be deleted within 30 days of
              confirmation.
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              <Link
                href="/auth/signin?returnTo=/delete-account"
                className="text-yellow-400 underline-offset-2 hover:underline"
              >
                Sign in first
              </Link>{' '}
              for the fastest path, or use the &ldquo;I can&apos;t sign in&rdquo;
              tab to verify by email.
            </p>
          )}

          <label className="mt-6 block text-sm text-gray-300">
            Reason (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Help us improve. (Not required.)"
            className="mt-2 w-full rounded-lg border border-gray-700 bg-black/50 p-3 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
          />

          <Button
            type="button"
            disabled={!userLoaded || !isSignedIn || submitting}
            onClick={submitAuthenticated}
            className="mt-6 w-full bg-red-500 py-3 font-semibold text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {submitting ? 'Requesting…' : 'Request account deletion'}
          </Button>
        </div>
      ) : (
        <form onSubmit={submitEmailFallback}>
          <p className="text-sm text-gray-300">
            Enter the email address on your Zynvo account. We&apos;ll send a
            one-time confirmation link. Click the link to confirm deletion.
          </p>

          <label htmlFor="email" className="mt-6 block text-sm text-gray-300">
            Account email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@college.edu"
            className="mt-2 w-full rounded-lg border border-gray-700 bg-black/50 p-3 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
          />

          <label htmlFor="reason" className="mt-5 block text-sm text-gray-300">
            Reason (optional)
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Help us improve. (Not required.)"
            className="mt-2 w-full rounded-lg border border-gray-700 bg-black/50 p-3 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
          />

          <label
            htmlFor="confirmText"
            className="mt-5 block text-sm text-gray-300"
          >
            Type <strong className="text-white">DELETE</strong> to confirm
          </label>
          <input
            id="confirmText"
            type="text"
            required
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="mt-2 w-full rounded-lg border border-gray-700 bg-black/50 p-3 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
          />

          <Button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-red-500 py-3 font-semibold text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {submitting ? 'Sending link…' : 'Email me a confirmation link'}
          </Button>

          <p className="mt-3 text-xs text-gray-500">
            The link is single-use and expires in 24 hours. You can request a
            new one any time.
          </p>
        </form>
      )}
    </section>
  );
}

function Faq() {
  return (
    <section className="mt-12 border-t border-gray-800 pt-8">
      <h2 className="text-2xl font-semibold text-white">
        Frequently asked questions
      </h2>
      <dl className="mt-6 space-y-5 text-sm">
        <QA q="How long does deletion take?">
          Up to <strong className="text-white">30 days</strong> from the time
          you confirm. Most deletions complete within 7 days.
        </QA>
        <QA q="Can I undo the deletion?">
          No. Once confirmed, deletion is permanent. If you change your mind,
          you can sign up again with the same email, but previous content
          cannot be recovered.
        </QA>
        <QA q="What about messages or posts other people can see?">
          Posts and comments you made on other profiles, clubs, or events will
          be removed. In limited cases (e.g. an active legal hold), we may
          retain the minimum information needed.
        </QA>
        <QA q="I never got the confirmation email.">
          Check your spam folder, then try again from this page. If it still
          doesn&apos;t arrive, contact{' '}
          <a
            href="mailto:privacy@zynvosocial.com"
            className="text-yellow-400 underline-offset-2 hover:underline"
          >
            privacy@zynvosocial.com
          </a>
          .
        </QA>
      </dl>
    </section>
  );
}

function NeedHelp() {
  return (
    <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-900/40 p-6 text-sm text-gray-300">
      <h2 className="text-lg font-semibold text-white">Need help?</h2>
      <p className="mt-2">
        Email{' '}
        <a
          href="mailto:privacy@zynvosocial.com"
          className="text-yellow-400 underline-offset-2 hover:underline"
        >
          privacy@zynvosocial.com
        </a>{' '}
        or read our{' '}
        <Link
          href="/privacy"
          className="text-yellow-400 underline-offset-2 hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </section>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <div className="mt-3 text-gray-300">{children}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
        active
          ? 'bg-yellow-400 text-black'
          : 'text-gray-300 hover:bg-white/5'
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}

function QA({
  q,
  children,
}: {
  q: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-semibold text-white">{q}</dt>
      <dd className="mt-1 text-gray-300">{children}</dd>
    </div>
  );
}
