/**
 * Update judge hook — requests go through the same-origin proxy.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getSafeErrorMessage, readSafeErrorMessageFromResponse } from '@/lib/safe-error';

export type UpdateJudgePayload = {
  eventId: string;
  judgeId: string;
  name: string;
  description: string;
  achievement: string;
};

async function updateJudge(payload: UpdateJudgePayload) {
  const { eventId, judgeId, name, description, achievement } = payload;
  const res = await fetch(`/api/v1/events/${eventId}/judges/${judgeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, achievement }),
  });

  if (!res.ok) {
    const fallback =
      res.status >= 500
        ? 'Unable to update judge right now. Please try again.'
        : 'Failed to update judge';
    const message = await readSafeErrorMessageFromResponse(res, fallback);
    throw new Error(message);
  }

  return res.json();
}

export const useUpdateJudge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJudge,
    onSuccess: (data, variables) => {
      toast.success(data.msg || 'Judge updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['judges', variables.eventId] });
    },
    onError: (error: Error) => {
      logger.error('Error updating judge:', error);
      toast.error(
        getSafeErrorMessage(error, 'Unable to update judge right now. Please try again.')
      );
    },
  });
};
