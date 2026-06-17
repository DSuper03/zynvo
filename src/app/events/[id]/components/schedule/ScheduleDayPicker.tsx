'use client';

import { CalendarDays } from 'lucide-react';
import type { ScheduleDay } from '@/types/schedule';
import { cn } from '@/lib/utils';

type Props = {
  days: ScheduleDay[];
  activeDay: number;
  onDayChange: (day: number) => void;
  className?: string;
};

export function ScheduleDayPicker({ days, activeDay, onDayChange, className }: Props) {
  if (days.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <CalendarDays className="h-3.5 w-3.5 text-yellow-400" />
        Event days
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-700">
        {days.map((day) => {
          const isActive = day.day === activeDay;
          const sessionCount = day.sessions?.length ?? 0;

          return (
            <button
              key={day.id || day.day}
              type="button"
              onClick={() => onDayChange(day.day)}
              className={cn(
                'shrink-0 rounded-xl border px-4 py-3 text-left transition-all min-w-[120px]',
                isActive
                  ? 'border-yellow-400/60 bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/20'
                  : 'border-gray-800 bg-black/40 text-gray-300 hover:border-gray-600 hover:bg-gray-800/60'
              )}
            >
              <div className="text-sm font-bold leading-tight">
                {day.name || `Day ${day.day}`}
              </div>
              {day.date && (
                <div
                  className={cn(
                    'mt-0.5 text-[11px] font-medium',
                    isActive ? 'text-black/70' : 'text-gray-500'
                  )}
                >
                  {day.date}
                </div>
              )}
              <div
                className={cn(
                  'mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                  isActive ? 'bg-black/15 text-black/80' : 'bg-gray-800 text-gray-400'
                )}
              >
                {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function getScheduleStats(days: ScheduleDay[]) {
  const totalSessions = days.reduce((sum, day) => sum + (day.sessions?.length ?? 0), 0);
  return { dayCount: days.length, totalSessions };
}
