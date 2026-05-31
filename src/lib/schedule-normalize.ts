import type { ScheduleDay, ScheduleSession } from '@/types/schedule';

function normalizeSpeakers(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map(String).filter(Boolean);
      }
    } catch {
      return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function normalizeSession(session: ScheduleSession): ScheduleSession {
  return {
    id: session.id ?? '',
    time: session.time ?? '',
    title: session.title ?? 'Untitled session',
    description: session.description ?? '',
    location: session.location ?? '',
    speakers: normalizeSpeakers(session.speakers),
  };
}

export function normalizeSchedule(days: ScheduleDay[] | undefined | null): ScheduleDay[] {
  if (!Array.isArray(days) || days.length === 0) return [];

  return days.map((day) => ({
    id: day.id ?? String(day.day),
    day: day.day ?? 1,
    date: day.date ?? '',
    name: day.name ?? `Day ${day.day ?? 1}`,
    sessions: Array.isArray(day.sessions)
      ? day.sessions.map((session) => normalizeSession(session as ScheduleSession))
      : [],
  }));
}

export function parseSessionFromResponse(data: unknown): ScheduleSession | null {
  if (!data || typeof data !== 'object') return null;
  const obj = data as Record<string, unknown>;
  const candidate = obj.response ?? obj.data ?? obj.session ?? obj;
  if (!candidate || typeof candidate !== 'object') return null;
  return normalizeSession(candidate as ScheduleSession);
}
