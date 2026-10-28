'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useUser, useAuth, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';
import posthog from 'posthog-js';
import { Button } from '@/components/ui/button';
import { getSafeErrorMessage, toSafeUserMessage } from '@/lib/safe-error';

type Mode = 'auth' | 'signedOut';

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
          You can delete your Zynvo account and the data associated with it.
          Deletion happens{' '}
          <strong className="text-white">immediately</strong> once you
          confirm.
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
  const { isLoaded: authLoaded } = useAuth();
  const { signOut } = useClerk();

  const [mode, setMode] = useState<Mode>('auth');
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Once Clerk loads, show the signed-out help if the user is signed out.
  useEffect(() => {
    if (userLoaded && authLoaded) {
      setMode(isSignedIn ? 'auth' : 'signedOut');
    }
  }, [userLoaded, authLoaded, isSignedIn]);

  const deleteAccount = async () => {
    if (confirmText.trim() !== 'DELETE') {
      toast.error('Please type DELETE to confirm.');
      return;
    }

    // The backend verifies its own JWT (set at sign-in), not the Clerk
    // session token.
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Your session has expired. Please sign in again.');
      router.push('/auth/signin?returnTo=/delete-account');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post<{ success?: boolean; msg?: string }>(
        '/api/v1/user/deleteAccount',
        { reason: reason || undefined },
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (res.data?.success !== false) {
        posthog.capture('account_deleted');
        posthog.reset();
        localStorage.removeItem('token');
        // The Clerk user is already deleted server-side; this just clears
        // the local session.
        await signOut().catch(() => {});
        toast.success('Your account has been deleted.');
        router.push('/');
        return;
      }
      toast.error(
        toSafeUserMessage(res.data?.msg, 'Could not delete your account.')
      );
    } catch (err) {
      toast.error(
        getSafeErrorMessage(err, 'Could not delete your account. Please try again.')
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
          active={mode === 'signedOut'}
          onClick={() => setMode('signedOut')}
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
              . Your account and its data will be deleted{' '}
              <strong className="text-white">immediately</strong>. This
              cannot be undone.
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              <Link
                href="/auth/signin?returnTo=/delete-account"
                className="text-yellow-400 underline-offset-2 hover:underline"
              >
                Sign in first
              </Link>{' '}
              to delete your account.
            </p>
          )}

          <label htmlFor="reason" className="mt-6 block text-sm text-gray-300">
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
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="mt-2 w-full rounded-lg border border-gray-700 bg-black/50 p-3 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
          />

          <Button
            type="button"
            disabled={
              !userLoaded ||
              !isSignedIn ||
              submitting ||
              confirmText.trim() !== 'DELETE'
            }
            onClick={deleteAccount}
            className="mt-6 w-full bg-red-500 py-3 font-semibold text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {submitting ? 'Deleting…' : 'Delete my account'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            To protect your account, deletion requires signing in so we know
            the request is really from you.
          </p>
          <p>
            <strong className="text-white">Forgot your password?</strong> Use
            &ldquo;Forgot password&rdquo; on the{' '}
            <Link
              href="/auth/signin?returnTo=/delete-account"
              className="text-yellow-400 underline-offset-2 hover:underline"
            >
              sign-in page
            </Link>{' '}
            to reset it, then come back here.
          </p>
          <p>
            <strong className="text-white">Lost access to your email?</strong>{' '}
            Email{' '}
            <a
              href="mailto:privacy@zynvosocial.com"
              className="text-yellow-400 underline-offset-2 hover:underline"
            >
              privacy@zynvosocial.com
            </a>{' '}
            from any address with your account details and we&apos;ll verify
            and handle it manually.
          </p>
        </div>
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
          Your account and data are deleted{' '}
          <strong className="text-white">immediately</strong> when you
          confirm. Backups are overwritten within 90 days.
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
