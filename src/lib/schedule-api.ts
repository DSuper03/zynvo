import {
  DEFAULT_SCHEDULE_DAYS,
  type ScheduleDay,
  type ScheduleListResponse,
  type ScheduleSession,
} from '@/types/schedule';
import { normalizeSchedule, parseSessionFromResponse } from '@/lib/schedule-normalize';
import { logger } from '@/lib/logger';

/** Backend base URL from NEXT_PUBLIC_BACKEND_URL */
export function getScheduleApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
  ).replace(/\/$/, '');
}

export const scheduleEndpoints = {
  list: (eventId: string) =>
    `${getScheduleApiBase()}/api/v1/events/schedule/${eventId}`,
  addSession: (eventId: string) =>
    `${getScheduleApiBase()}/api/v1/events/schedule/${eventId}/session`,
  deleteSession: (eventId: string, sessionId: string) =>
    `${getScheduleApiBase()}/api/v1/events/schedule/${eventId}/session/${sessionId}`,
} as const;

export type SendScheduleSessionInput = {
  eventId: string;
  token: string;
  day: number;
  time: string;
  title: string;
  description?: string;
  location: string;
  speakers?: string[];
};

/**
 * POST /api/v1/events/schedule/:eventId/session
 * Body: { day, time, title, description, location, speakers }
 */
export async function sendScheduleSession({
  eventId,
  token,
  day,
  time,
  title,
  description,
  location,
  speakers,
}: SendScheduleSessionInput): Promise<ScheduleSession> {
  const url = scheduleEndpoints.addSession(eventId);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      day,
      time,
      title,
      description: description ?? '',
      location,
      speakers: speakers ?? [],
    }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Failed to add session (${res.status})`);
  }

  const data: unknown = await res.json();
  const parsed = parseSessionFromResponse(data);
  if (parsed) return parsed;

  return {
    id: crypto.randomUUID(),
    time,
    title,
    description: description ?? '',
    location,
    speakers: speakers ?? [],
  };
}

export async function fetchEventSchedule(
  eventId: string,
  token?: string | null
): Promise<ScheduleDay[]> {
  const url = scheduleEndpoints.list(eventId);

  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) {
      logger.error(`Schedule GET failed (${res.status}) ${url}`);
      return DEFAULT_SCHEDULE_DAYS;
    }

    const data = (await res.json()) as ScheduleListResponse;
    const days = normalizeSchedule(data?.response);
    return days.length > 0 ? days : DEFAULT_SCHEDULE_DAYS;
  } catch (error) {
    logger.error(`Schedule GET failed ${url}`, error);
    return DEFAULT_SCHEDULE_DAYS;
  }
}

export async function deleteScheduleSession(
  eventId: string,
  sessionId: string,
  token: string
): Promise<void> {
  const url = scheduleEndpoints.deleteSession(eventId, sessionId);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Failed to delete session (${res.status})`);
  }
}
