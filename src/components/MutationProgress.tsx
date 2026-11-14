'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

/**
 * Instant feedback for every action on the site: while any create / update /
 * delete request to our API is in flight, a thin progress bar runs across the
 * top of the page and the cursor shows "busy". Hooks into axios and fetch once,
 * so buttons without their own spinner still respond on the first click.
 *
 * Only user actions count: GET/HEAD reads, telemetry and background bookkeeping
 * (marking notifications read) are ignored.
 */
const TRACKED = /^\/api\/(v1|v2|upload)\//;
const IGNORED = [/\/notifications\/read/, /\/telemetry/, /\/user\/syncWithClerk/];

let inFlight = 0;
const listeners = new Set<(n: number) => void>();
const emit = () => listeners.forEach((l) => l(inFlight));
const start = () => { inFlight += 1; emit(); };
const done = () => { inFlight = Math.max(0, inFlight - 1); emit(); };

const pathOf = (url: string): string | null => {
  try {
    const u = new URL(url, window.location.origin);
    return u.origin === window.location.origin ? u.pathname : null;
  } catch {
    return null;
  }
};

const isUserAction = (method: string | undefined, url: string | undefined): boolean => {
  const m = (method ?? 'GET').toUpperCase();
  if (m === 'GET' || m === 'HEAD' || m === 'OPTIONS' || !url) return false;
  const path = pathOf(url);
  return !!path && TRACKED.test(path) && !IGNORED.some((re) => re.test(path));
};

let installed = false;
function install() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  axios.interceptors.request.use((config) => {
    if (isUserAction(config.method, config.url)) {
      (config as any).__zynvoTracked = true;
      start();
    }
    return config;
  });
  axios.interceptors.response.use(
    (res) => {
      if ((res.config as any)?.__zynvoTracked) done();
      return res;
    },
    (err) => {
      if (err?.config?.__zynvoTracked) done();
      return Promise.reject(err);
    }
  );

  const originalFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = init?.method ?? (input instanceof Request ? input.method : 'GET');
    if (!isUserAction(method, url)) return originalFetch(input, init);
    start();
    return originalFetch(input, init).finally(done);
  };
}

export default function MutationProgress() {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    install();
    const listener = (n: number) => setBusy(n > 0);
    listeners.add(listener);
    listener(inFlight);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('zynvo-busy', busy);
  }, [busy]);

  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 z-[10000] h-[3px] overflow-hidden transition-opacity duration-200 ${
          busy ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="zynvo-progress-bar h-full w-1/3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {busy ? 'Working…' : ''}
      </span>
      <style>{`
        @keyframes zynvoProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .zynvo-progress-bar { animation: zynvoProgress 1.1s ease-in-out infinite; }
        html.zynvo-busy, html.zynvo-busy * { cursor: progress !important; }
        @media (prefers-reduced-motion: reduce) {
          .zynvo-progress-bar { animation: none; width: 100%; opacity: 0.8; }
        }
      `}</style>
    </>
  );
}
