const TIME_RANGE_RE =
  /^(\d{1,2}):(\d{2})\s*(AM|PM)\s*[-–—]\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

export type TimeParts = {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
};

export type ParsedTimeRange = {
  start: TimeParts;
  end: TimeParts;
};

function normalizePeriod(value: string): 'AM' | 'PM' {
  return value.toUpperCase() === 'PM' ? 'PM' : 'AM';
}

function to24Hour(hour: string, minute: string, period: 'AM' | 'PM'): string {
  let h = parseInt(hour, 10);
  const m = minute.padStart(2, '0');

  if (period === 'AM') {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }

  return `${String(h).padStart(2, '0')}:${m}`;
}

function from24Hour(hhmm: string): TimeParts {
  const [hourStr, minuteStr] = hhmm.split(':');
  let h = parseInt(hourStr, 10);
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';

  if (h === 0) h = 12;
  else if (h > 12) h -= 12;

  return {
    hour: String(h),
    minute: minuteStr.padStart(2, '0'),
    period,
  };
}

export function formatTimeRange(start: TimeParts, end: TimeParts): string {
  const fmt = (parts: TimeParts) =>
    `${parts.hour}:${parts.minute} ${parts.period}`;
  return `${fmt(start)} - ${fmt(end)}`;
}

export function parseTimeRange(value: string): ParsedTimeRange | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = trimmed.match(TIME_RANGE_RE);
  if (match) {
    return {
      start: {
        hour: String(parseInt(match[1], 10)),
        minute: match[2],
        period: normalizePeriod(match[3]),
      },
      end: {
        hour: String(parseInt(match[4], 10)),
        minute: match[5],
        period: normalizePeriod(match[6]),
      },
    };
  }

  return null;
}

export function getDefaultTimeRange(): ParsedTimeRange {
  return {
    start: { hour: '9', minute: '00', period: 'AM' },
    end: { hour: '10', minute: '00', period: 'AM' },
  };
}

export function parseTimeRangeOrDefault(value: string): ParsedTimeRange {
  return parseTimeRange(value) ?? getDefaultTimeRange();
}

export function isEndAfterStart(start: TimeParts, end: TimeParts): boolean {
  const startMins = timePartsToMinutes(start);
  const endMins = timePartsToMinutes(end);
  return endMins > startMins;
}

function timePartsToMinutes(parts: TimeParts): number {
  const [h, m] = to24Hour(parts.hour, parts.minute, parts.period).split(':').map(Number);
  return h * 60 + m;
}

export const HOUR_OPTIONS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

export const MINUTE_OPTIONS = ['00', '15', '30', '45'];

export const PERIOD_OPTIONS: Array<'AM' | 'PM'> = ['AM', 'PM'];

export { to24Hour, from24Hour };
