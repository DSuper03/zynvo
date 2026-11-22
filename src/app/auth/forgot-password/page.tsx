'use client';
/**
 * Password reset without our own email provider: Clerk emails a code and
 * proves the person owns the address, then the backend hash is updated to
 * match (web email sign-in checks the backend hash).
 *
 *   1. POST /api/v1/user/reset-password/prepare  → ensures a Clerk user exists
 *   2. Clerk reset_password_email_code            → Clerk emails a 6-digit code
 *   3. Clerk attemptFirstFactor(code, password)   → Clerk password updated + session
 *   4. POST /api/v1/user/reset-password/clerk     → backend hash updated (email from
 *                                                   the verified Clerk session only)
 *   5. /auth/sso-callback                         → signed in to Zynvo
 */
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useClerk, useSignIn } from '@clerk/nextjs';
import { track } from '@/lib/analytics';

const MIN_PASSWORD_LENGTH = 8;

const clerkMessage = (err: any, fallback: string): string =>
  err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || fallback;

const apiMessage = (err: any, fallback: string): string =>
  err?.response?.data?.message || err?.response?.data?.msg || fallback;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const clerk = useClerk();
  const { isLoaded, signIn } = useSignIn();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const sendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    const address = email.trim();
    if (!address) return;
    setBusy(true);
    try {
      await axios.post('/api/v1/user/reset-password/prepare', { email: address });
      // A leftover Clerk session (e.g. an earlier Google sign-in) blocks a new
      // sign-in attempt; this only ends the Clerk session.
      if (clerk.session) await clerk.signOut();
      await signIn.create({ strategy: 'reset_password_email_code', identifier: address });
      track('password_reset_requested');
      toast.success(`We sent a code to ${address}.`);
      setStep('code');
    } catch (err: any) {
      const clerkCode = err?.errors?.[0]?.code;
      if (clerkCode === 'form_identifier_not_found') {
        toast.error('No account found with this email. Please sign up first.');
      } else if (err?.response) {
        toast.error(apiMessage(err, 'Could not start the reset. Please try again.'));
      } else {
        toast.error(clerkMessage(err, 'Could not send the code. Please try again.'));
      }
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password,
      });
      if (result.status !== 'complete' || !result.createdSessionId) {
        toast.error('Additional verification is required. Please contact support.');
        return;
      }
      await clerk.setActive({ session: result.createdSessionId });
      const clerkToken = await clerk.session?.getToken();
      if (!clerkToken) {
        toast.error('Your reset session expired. Please start again.');
        setStep('email');
        return;
      }
      await axios.post('/api/v1/user/reset-password/clerk', { clerkToken, password });
      track('password_reset_completed');
      toast.success('Password updated. Signing you in…');
      router.replace('/auth/sso-callback?intent=signin');
    } catch (err: any) {
      if (err?.response) {
        toast.error(apiMessage(err, 'Could not save your new password. Please try again.'));
      } else {
        toast.error(clerkMessage(err, 'That code is invalid or has expired.'));
      }
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 mt-1 text-gray-900 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500';
  const buttonClass =
    'w-full px-4 py-2 text-lg font-semibold text-gray-900 bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-60';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          {step === 'email' ? 'Forgot Password' : 'Choose a new password'}
        </h1>

        {step === 'email' ? (
          <form className="space-y-6" onSubmit={sendCode}>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={busy || !isLoaded} className={buttonClass}>
              {busy ? 'Sending…' : 'Send reset code'}
            </button>
            <p className="text-center text-sm text-gray-400">
              Remembered it?{' '}
              <Link href="/auth/signin" className="text-yellow-500 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={resetPassword}>
            <p className="text-sm text-gray-400 text-center break-all">
              Enter the code sent to {email.trim()}
            </p>
            <div>
              <label htmlFor="code" className="text-sm font-medium text-gray-300">
                Reset code
              </label>
              <input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                className={inputClass}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                New password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                required
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm" className="text-sm font-medium text-gray-300">
                Confirm new password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                required
                className={inputClass}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <button type="submit" disabled={busy} className={buttonClass}>
              {busy ? 'Saving…' : 'Set new password'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
              }}
              className="w-full text-sm text-gray-400 hover:text-gray-200"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
