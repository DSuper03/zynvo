import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getSafeErrorMessage } from '@/lib/safe-error';
import { deleteScheduleSession } from '@/lib/schedule-api';
import type { DeleteSessionPayload, ScheduleDay } from '@/types/schedule';

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteSessionPayload>({
    mutationFn: async (payload: DeleteSessionPayload) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please sign in to delete sessions');
      return deleteScheduleSession(payload.eventId, payload.sessionId, token);
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
