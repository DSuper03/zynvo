'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: {
        source: 'app-global-error',
      },
      extra: {
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
          <p className="text-gray-400 mb-6">
            We tracked this issue and our team can investigate it.
          </p>
          <button
            onClick={reset}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
