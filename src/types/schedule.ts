export interface ScheduleSession {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  speakers: string[];
}

export interface ScheduleDay {
  id: string;
  day: number;
  date: string;
  name: string;
  sessions: ScheduleSession[];
}

export interface ScheduleResponse {
  response: ScheduleDay[];
}

export type ScheduleListResponse = {
  response?: ScheduleDay[];
  msg?: string;
};

/** Matches backend getEventSchedule empty-state payload */
export const DEFAULT_SCHEDULE_DAYS: ScheduleDay[] = [
  {
    id: 'default-day-1',
    day: 1,
    date: 'Day 1',
    name: 'Day 1',
    sessions: [],
  },
];

export type AddSessionPayload = {
  eventId: string;
  day: number;
  time: string;
  title: string;
  description: string;
  location: string;
  speakers: string[];
};

export type DeleteSessionPayload = {
  eventId: string;
  sessionId: string;
};
