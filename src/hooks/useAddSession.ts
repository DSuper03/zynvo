import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getSafeErrorMessage } from '@/lib/safe-error';
import { SCHEDULE_API } from '@/lib/schedule-api';
import { normalizeSchedule, parseSessionFromResponse } from '@/lib/schedule-normalize';
import type { AddSessionPayload, ScheduleDay, ScheduleSession } from '@/types/schedule';

async function addSession(payload: AddSessionPayload, token: string): Promise<ScheduleSession> {
  const { eventId, ...sessionData } = payload;
  const res = await axios.post(
    SCHEDULE_API.addSession(eventId),
    sessionData,
    { headers: { authorization: `Bearer ${token}` } }
  );

  const parsed = parseSessionFromResponse(res.data);
  if (parsed) return parsed;

  return {
    id: crypto.randomUUID(),
    time: sessionData.time,
    title: sessionData.title,
    description: sessionData.description,
    location: sessionData.location,
    speakers: sessionData.speakers,
  };
}

function upsertSessionInCache(
  schedule: ScheduleDay[],
  variables: AddSessionPayload,
  session: ScheduleSession
): ScheduleDay[] {
  const normalized = normalizeSchedule(schedule);
  const dayIndex = normalized.findIndex((day) => day.day === variables.day);

  if (dayIndex >= 0) {
    return normalized.map((day, index) =>
      index === dayIndex ? { ...day, sessions: [...day.sessions, session] } : day
    );
  }

  return [
    ...normalized,
    {
      id: `day-${variables.day}`,
      day: variables.day,
      date: '',
      name: `Day ${variables.day}`,
      sessions: [session],
    },
  ];
}

export const useAddSession = () => {
  const queryClient = useQueryClient();

  return useMutation<ScheduleSession, Error, AddSessionPayload>({
    mutationFn: async (payload: AddSessionPayload) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please sign in to add sessions');
      return addSession(payload, token);
    },
    onSuccess: (session, variables) => {
      queryClient.setQueryData<ScheduleDay[]>(['schedule', variables.eventId], (current) =>
        upsertSessionInCache(current ?? [], variables, session)
      );
      toast.success('Session added successfully');
      queryClient.invalidateQueries({ queryKey: ['schedule', variables.eventId] });
    },
    onError: (error: Error) => {
      logger.error('Error adding session:', error);
      const fallback = isAxiosError(error) && error.response?.status === 403
        ? 'Only the event founder can add sessions'
        : 'Unable to add session right now. Please try again.';
      toast.error(getSafeErrorMessage(error, fallback));
    },
  });
};
