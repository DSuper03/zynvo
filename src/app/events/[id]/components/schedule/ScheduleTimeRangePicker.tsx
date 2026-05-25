'use client';

import { AlarmClock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  formatTimeRange,
  HOUR_OPTIONS,
  isEndAfterStart,
  MINUTE_OPTIONS,
  parseTimeRangeOrDefault,
  PERIOD_OPTIONS,
  type ParsedTimeRange,
  type TimeParts,
} from '@/lib/schedule-time';

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const selectTriggerClass =
  'border-gray-700 bg-gray-900/80 text-white focus:ring-yellow-400/30 focus:ring-offset-0';

export function ScheduleTimeRangePicker({ value, onChange, className }: Props) {
  const range = parseTimeRangeOrDefault(value);
  const invalidRange = !isEndAfterStart(range.start, range.end);

  const updateRange = (next: ParsedTimeRange) => {
    onChange(formatTimeRange(next.start, next.end));
  };

  const updatePart = (side: 'start' | 'end', patch: Partial<TimeParts>) => {
    updateRange({
      ...range,
      [side]: { ...range[side], ...patch },
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      <TimeRow
        label="Start"
        parts={range.start}
        onChange={(patch) => updatePart('start', patch)}
      />

      <div className="flex items-center gap-2 px-1">
        <div className="h-px flex-1 bg-gray-800" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">to</span>
        <div className="h-px flex-1 bg-gray-800" />
      </div>

      <TimeRow
        label="End"
        parts={range.end}
        onChange={(patch) => updatePart('end', patch)}
      />

      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs',
          invalidRange
            ? 'border-red-500/30 bg-red-500/10 text-red-300'
            : 'border-yellow-400/20 bg-yellow-400/5 text-yellow-200/90'
        )}
      >
        <AlarmClock className="h-3.5 w-3.5 shrink-0" />
        <span>
          {invalidRange
            ? 'End time must be after start time'
            : formatTimeRange(range.start, range.end)}
        </span>
      </div>
    </div>
  );
}

function TimeRow({
  label,
  parts,
  onChange,
}: {
  label: string;
  parts: TimeParts;
  onChange: (patch: Partial<TimeParts>) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <div className="grid grid-cols-3 gap-2">
        <Select value={parts.hour} onValueChange={(hour) => onChange({ hour })}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Hr" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-900 text-white">
            {HOUR_OPTIONS.map((hour) => (
              <SelectItem key={hour} value={hour} className="focus:bg-yellow-400/20 focus:text-white">
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={parts.minute} onValueChange={(minute) => onChange({ minute })}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-900 text-white">
            {MINUTE_OPTIONS.map((minute) => (
              <SelectItem key={minute} value={minute} className="focus:bg-yellow-400/20 focus:text-white">
                :{minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={parts.period}
          onValueChange={(period) => onChange({ period: period as 'AM' | 'PM' })}
        >
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-900 text-white">
            {PERIOD_OPTIONS.map((period) => (
              <SelectItem key={period} value={period} className="focus:bg-yellow-400/20 focus:text-white">
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function isValidScheduleTimeRange(value: string): boolean {
  const range = parseTimeRangeOrDefault(value);
  return isEndAfterStart(range.start, range.end);
}
