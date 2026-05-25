export const SCHEDULE_API = {
  list: (eventId: string) => `/schedule-api/${eventId}`,
  addSession: (eventId: string) => `/schedule-api/${eventId}/session`,
  deleteSession: (eventId: string, sessionId: string) =>
    `/schedule-api/${eventId}/session/${sessionId}`,
} as const;
