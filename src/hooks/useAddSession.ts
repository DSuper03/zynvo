import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getSafeErrorMessage } from '@/lib/safe-error';
import { sendScheduleSession } from '@/lib/schedule-api';
import { normalizeSchedule } from '@/lib/schedule-normalize';
import type { AddSessionPayload, ScheduleDay, ScheduleSession } from '@/types/schedule';

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
      return sendScheduleSession({
        eventId: payload.eventId,
        day: payload.day,
        time: payload.time,
        title: payload.title,
        description: payload.description,
        location: payload.location,
        speakers: payload.speakers,
      });
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
      const is404 = /404|not found/i.test(error.message);
      const fallback = is404
        ? 'Schedule endpoint not found — check the backend service is running'
        : 'Unable to add session right now. Please try again.';
      toast.error(getSafeErrorMessage(error, fallback));
    },
  });
};
