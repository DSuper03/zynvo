import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Deletion requested — Zynvo',
  description:
    'Your Zynvo account deletion request has been received. We will process it within 30 days.',
  alternates: { canonical: 'https://zynvosocial.com/delete-account/requested' },
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  method?: string;
  email?: string;
  token?: string;
}>;

export default async function RequestedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const method = params.method === 'clerk' ? 'clerk' : 'email';
  const email = params.email?.trim() || '';

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-gray-200">
      <div className="mx-auto max-w-2xl px-5 py-20 sm:px-6">
        <div className="rounded-2xl border border-yellow-500/30 bg-gray-900/60 p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/15">
            <Checkmark />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            Deletion request received
          </h1>

          {method === 'clerk' ? (
            <p className="mt-4 text-gray-300">
              We&apos;ve logged your request. We sent a confirmation email to
              the address on your account. Click the link in that email to
              finalize deletion.
            </p>
          ) : (
            <p className="mt-4 text-gray-300">
              {email ? (
                <>
                  We sent a one-time confirmation link to{' '}
                  <strong className="text-white">{email}</strong>. Click the
                  link in that email to finalize deletion.
                </>
              ) : (
                <>
                  We sent a one-time confirmation link to the email address on
                  your account. Click the link in that email to finalize
                  deletion.
                </>
              )}
            </p>
          )}

          <ul className="mx-auto mt-8 max-w-md space-y-2 text-left text-sm text-gray-300">
            <li>
              <strong className="text-white">Timeline:</strong> deletion is
              completed within 30 days of confirmation.
            </li>
            <li>
              <strong className="text-white">If you don&apos;t confirm:</strong>{' '}
              the request expires after 14 days and your account stays active.
            </li>
            <li>
              <strong className="text-white">Changed your mind?</strong> just
              ignore the email and keep using Zynvo.
            </li>
          </ul>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              Back to Zynvo
            </Link>
            <Link
              href="/privacy"
              className="rounded-lg border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-yellow-400 hover:text-white"
            >
              Read the Privacy Policy
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Didn&apos;t get the email? Check your spam folder, or try the
          request again from the{' '}
          <Link
            href="/delete-account"
            className="text-yellow-400 underline-offset-2 hover:underline"
          >
            deletion page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

function Checkmark() {
  return (
    <svg
      className="h-8 w-8 text-yellow-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
