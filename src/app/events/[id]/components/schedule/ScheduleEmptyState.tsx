'use client';

import Link from 'next/link';
import { AlarmClock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  dayLabel?: string;
  isFounder?: boolean;
  manageHref?: string;
  variant?: 'compact' | 'full';
  /** When true, show helper text instead of link (e.g. on manage page) */
  inlineManageHint?: boolean;
};

export function ScheduleEmptyState({
  dayLabel = 'this day',
  isFounder = false,
  manageHref,
  variant = 'compact',
  inlineManageHint = false,
}: Props) {
  return (
    <div
      className={
        variant === 'full'
          ? 'rounded-2xl border border-dashed border-gray-700/80 bg-gradient-to-b from-black/40 to-transparent px-6 py-14 text-center'
          : 'rounded-xl border border-gray-800/50 bg-black/30 px-4 py-10 text-center'
      }
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10">
        <AlarmClock className="h-6 w-6 text-yellow-400" />
      </div>
      <h3 className="text-base font-semibold text-white">No sessions scheduled yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">
        The schedule for {dayLabel} will appear here once sessions are added.
      </p>
      {isFounder && inlineManageHint && (
        <p className="mt-4 text-sm text-yellow-400/80">
          Use the add session panel to create your first session.
        </p>
      )}
      {isFounder && !inlineManageHint && manageHref && (
        <Link href={manageHref} className="mt-6 inline-block">
          <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:from-yellow-500 hover:to-amber-600 shadow-lg shadow-yellow-500/10">
            <Plus className="mr-2 h-4 w-4" />
            Add first session
          </Button>
        </Link>
      )}
    </div>
  );
}
