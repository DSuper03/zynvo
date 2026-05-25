import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getSafeErrorMessage } from '@/lib/safe-error';
import { SCHEDULE_API } from '@/lib/schedule-api';
import type { DeleteSessionPayload, ScheduleDay } from '@/types/schedule';

async function deleteSession(payload: DeleteSessionPayload, token: string): Promise<void> {
  await axios.delete(SCHEDULE_API.deleteSession(payload.eventId, payload.sessionId), {
    headers: { authorization: `Bearer ${token}` },
  });
}

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteSessionPayload>({
    mutationFn: async (payload: DeleteSessionPayload) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please sign in to delete sessions');
      return deleteSession(payload, token);
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<ScheduleDay[]>(
        ['schedule', variables.eventId],
        (current) =>
          (current ?? []).map((day) => ({
            ...day,
            sessions: day.sessions.filter((session) => session.id !== variables.sessionId),
          }))
      );
      toast.success('Session deleted');
      queryClient.invalidateQueries({ queryKey: ['schedule', variables.eventId] });
    },
    onError: (error: Error) => {
      logger.error('Error deleting session:', error);
      toast.error(getSafeErrorMessage(error, 'Unable to delete session right now. Please try again.'));
    },
  });
};
