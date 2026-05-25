import fs from 'fs/promises';
import path from 'path';
import { eachDayOfInterval, format, isValid, parseISO } from 'date-fns';
import type { ScheduleDay, ScheduleSession } from '@/types/schedule';
import { normalizeSchedule } from '@/lib/schedule-normalize';

const DATA_DIR = path.join(process.cwd(), 'data', 'event-schedules');

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://zynvosocial-be-274792984950.asia-south1.run.app'
).replace(/\/$/, '');

function scheduleFilePath(eventId: string) {
  return path.join(DATA_DIR, `${eventId}.json`);
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export function buildDaysFromEventDates(startDate: string, endDate: string): ScheduleDay[] {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (!isValid(start) || !isValid(end) || start > end) {
    return [
      {
        id: 'day-1',
        day: 1,
        date: startDate,
        name: 'Day 1',
        sessions: [],
      },
    ];
  }

  return eachDayOfInterval({ start, end }).map((date, index) => ({
    id: `day-${index + 1}`,
    day: index + 1,
    date: format(date, 'MMM d, yyyy'),
    name: `Day ${index + 1}`,
    sessions: [],
  }));
}

async function fetchEventDates(eventId: string): Promise<{ startDate?: string; endDate?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/event/${eventId}`, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return {};
    const data = (await res.json()) as {
      response?: { startDate?: string; endDate?: string };
    };
    return {
      startDate: data.response?.startDate,
      endDate: data.response?.endDate,
    };
  } catch {
    return {};
  }
}

export async function ensureScheduleDays(
  eventId: string,
  days: ScheduleDay[]
): Promise<ScheduleDay[]> {
  if (days.length > 0) return days;

  const { startDate, endDate } = await fetchEventDates(eventId);
  if (startDate && endDate) {
    return buildDaysFromEventDates(startDate, endDate);
  }

  return [
    {
      id: 'day-1',
      day: 1,
      date: '',
      name: 'Day 1',
      sessions: [],
    },
  ];
}

export async function readStoredSchedule(eventId: string): Promise<ScheduleDay[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(scheduleFilePath(eventId), 'utf-8');
    const parsed = JSON.parse(raw) as { days?: ScheduleDay[] };
    return normalizeSchedule(parsed.days);
  } catch {
    return [];
  }
}

export async function writeStoredSchedule(eventId: string, days: ScheduleDay[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(
    scheduleFilePath(eventId),
    JSON.stringify({ days }, null, 2),
    'utf-8'
  );
}

export async function getScheduleForEvent(eventId: string): Promise<ScheduleDay[]> {
  const stored = await readStoredSchedule(eventId);
  if (stored.length > 0) return stored;
  return ensureScheduleDays(eventId, []);
}

export type AddSessionInput = {
  day: number;
  time: string;
  title: string;
  description: string;
  location: string;
  speakers: string[];
};

export async function addSessionToSchedule(
  eventId: string,
  input: AddSessionInput
): Promise<{ schedule: ScheduleDay[]; session: ScheduleSession }> {
  let schedule = await readStoredSchedule(eventId);
  schedule = await ensureScheduleDays(eventId, schedule);

  let dayIndex = schedule.findIndex((d) => d.day === input.day);
  if (dayIndex === -1) {
    schedule.push({
      id: `day-${input.day}`,
      day: input.day,
      date: '',
      name: `Day ${input.day}`,
      sessions: [],
    });
    dayIndex = schedule.length - 1;
  }

  const session: ScheduleSession = {
    id: crypto.randomUUID(),
    time: input.time,
    title: input.title,
    description: input.description,
    location: input.location,
    speakers: input.speakers,
  };

  schedule = schedule.map((day, index) =>
    index === dayIndex ? { ...day, sessions: [...day.sessions, session] } : day
  );

  await writeStoredSchedule(eventId, schedule);
  return { schedule, session };
}

export async function deleteSessionFromSchedule(
  eventId: string,
  sessionId: string
): Promise<ScheduleDay[]> {
  const schedule = await readStoredSchedule(eventId);
  const updated = schedule.map((day) => ({
    ...day,
    sessions: day.sessions.filter((session) => session.id !== sessionId),
  }));
  await writeStoredSchedule(eventId, updated);
  return updated;
}

export async function verifyScheduleFounder(
  eventId: string,
  token: string | null | undefined
): Promise<boolean> {
  if (!token) return false;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/user/isFounder?id=${eventId}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { msg?: string };
    return data.msg === 'identified';
  } catch {
    return false;
  }
}

export function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}
