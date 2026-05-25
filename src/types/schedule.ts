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
