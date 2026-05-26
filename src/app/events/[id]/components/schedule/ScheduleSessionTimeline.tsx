'use client';

import { useState } from 'react';
import {
  AlarmClock,
  ChevronDown,
  Loader2,
  MapPin,
  Mic2,
  Trash2,
} from 'lucide-react';
import type { ScheduleSession } from '@/types/schedule';
import { cn } from '@/lib/utils';

type Props = {
  sessions: ScheduleSession[];
  manageMode?: boolean;
  showDescriptionInline?: boolean;
  pendingDeleteId?: string | null;
  isDeleting?: boolean;
  onRequestDelete?: (sessionId: string) => void;
  onConfirmDelete?: (sessionId: string) => void;
  onCancelDelete?: () => void;
};

export function ScheduleSessionTimeline({
  sessions,
  manageMode = false,
  showDescriptionInline = false,
  pendingDeleteId = null,
  isDeleting = false,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (sessionId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) next.delete(sessionId);
      else next.add(sessionId);
      return next;
    });
  };

  return (
    <div className="relative space-y-0">
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-yellow-400/60 via-gray-700 to-transparent" />

      {sessions.map((session, idx) => {
        const isExpanded = expandedIds.has(session.id);
        const hasDescription = Boolean(session.description?.trim());
        const isPendingDelete = pendingDeleteId === session.id;
        const speakers = session.speakers ?? [];

        return (
          <div key={session.id || idx} className="relative pl-9 pb-8 last:pb-0">
            <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-yellow-400/80 bg-[#0B0B0B] shadow-[0_0_12px_rgba(250,204,21,0.35)]">
              <span className="text-[9px] font-bold text-yellow-400">
                {String(idx + 1).padStart(2, '0')}
              </span>
            </div>

            <article
              className={cn(
                'group relative overflow-hidden rounded-2xl border bg-[#0e0e0e] transition-all',
                isPendingDelete
                  ? 'border-red-500/40 ring-1 ring-red-500/20'
                  : 'border-gray-800/80 hover:border-yellow-400/25 hover:shadow-lg hover:shadow-yellow-500/5'
              )}
            >
              {isPendingDelete && (
                <div className="flex items-center justify-between gap-3 border-b border-red-500/20 bg-red-500/10 px-4 py-3">
                  <p className="text-sm text-red-200">Delete this session?</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onConfirmDelete?.(session.id)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={onCancelDelete}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                      <AlarmClock className="h-3.5 w-3.5" />
                      {session.time}
                    </div>

                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-yellow-400">
                      {session.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {session.location && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-800 bg-black/50 px-2.5 py-1 text-xs text-gray-300">
                          <MapPin className="h-3.5 w-3.5 text-yellow-400" />
                          {session.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {manageMode && !isPendingDelete && (
                    <button
                      type="button"
                      onClick={() => onRequestDelete?.(session.id)}
                      className="shrink-0 rounded-lg border border-transparent p-2 text-gray-500 opacity-0 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                      aria-label={`Delete ${session.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {hasDescription && showDescriptionInline && (
                  <p className="mt-4 text-sm leading-relaxed text-gray-300 border-t border-gray-900 pt-4">
                    {session.description}
                  </p>
                )}

                {hasDescription && !showDescriptionInline && (
                  <div className="mt-4 border-t border-gray-900 pt-4">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(session.id)}
                      className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-300"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Mic2 className="h-3.5 w-3.5" />
                        Details
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <p className="mt-3 text-sm leading-relaxed text-gray-300">
                        {session.description}
                      </p>
                    )}
                  </div>
                )}

                {speakers.length > 0 && (
                  <div className="mt-4 border-t border-gray-900 pt-4">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Speakers
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {speakers.map((speaker, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-full border border-gray-800 bg-[#171717] px-3 py-1 text-[11px] font-medium text-gray-200"
                        >
                          {speaker}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
