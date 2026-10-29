'use client';
import axios from 'axios';
import posthog from 'posthog-js';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

const MIN_PASSWORD_LENGTH = 8;

/** Landing page for the one-time link emailed by POST /api/v1/user/forgot. */
function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!token || !email) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-gray-300">This reset link is incomplete or has expired.</p>
        <Link href="/auth/forgot-password" className="text-yellow-500 hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post<{ msg: string }>(
        '/api/v1/user/reset-password/confirm',
        { email, token, password }
      );
      posthog.capture('password_reset_completed');
      toast.success(res.data.msg || 'Password updated.');
      router.push('/auth/signin');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.msg ||
          'Could not reset your password. Request a new link and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 mt-1 text-gray-900 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500';

  return (
    <form className="space-y-6" onSubmit={submit}>
      <p className="text-sm text-gray-400 text-center break-all">{email}</p>
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
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-2 text-lg font-semibold text-gray-900 bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-60"
      >
        {submitting ? 'Saving…' : 'Set new password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Choose a new password</h1>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
