import type { ScheduleDay, ScheduleSession } from '@/types/schedule';

function normalizeSession(session: ScheduleSession): ScheduleSession {
  return {
    id: session.id ?? '',
    time: session.time ?? '',
    title: session.title ?? 'Untitled session',
    description: session.description ?? '',
    location: session.location ?? '',
    speakers: Array.isArray(session.speakers) ? session.speakers : [],
  };
}

export function normalizeSchedule(days: ScheduleDay[] | undefined | null): ScheduleDay[] {
  if (!Array.isArray(days)) return [];

  return days.map((day) => ({
    id: day.id ?? String(day.day),
    day: day.day ?? 1,
    date: day.date ?? '',
    name: day.name ?? `Day ${day.day ?? 1}`,
    sessions: Array.isArray(day.sessions)
      ? day.sessions.map(normalizeSession)
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
