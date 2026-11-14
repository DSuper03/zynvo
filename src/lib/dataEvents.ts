'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight "something changed" signal between screens that keep their own
 * data (no shared cache): after creating a club or event, listening lists
 * refetch immediately instead of waiting for a manual reload.
 */
export type DataKind = 'club' | 'event';

const EVENT_NAME = 'zynvo:data-changed';

export function notifyDataChanged(kind: DataKind): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<{ kind: DataKind }>(EVENT_NAME, { detail: { kind } }));
}

/** Calls `onChange` whenever data of one of `kinds` changes elsewhere in the app. */
export function useDataChanged(kinds: DataKind | DataKind[], onChange: () => void): void {
  const cb = useRef(onChange);
  cb.current = onChange;
  const key = Array.isArray(kinds) ? kinds.join(',') : kinds;

  useEffect(() => {
    const wanted = new Set(key.split(','));
    const handler = (e: Event) => {
      const kind = (e as CustomEvent<{ kind: DataKind }>).detail?.kind;
      if (kind && wanted.has(kind)) cb.current();
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [key]);
}
