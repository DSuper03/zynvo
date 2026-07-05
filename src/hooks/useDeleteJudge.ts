/**
 * Delete judge hook — requests go through the same-origin proxy.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getSafeErrorMessage, readSafeErrorMessageFromResponse } from '@/lib/safe-error';

export type DeleteJudgePayload = {
  eventId: string;
  judgeId: string;
};

async function deleteJudge(payload: DeleteJudgePayload) {
  const { eventId, judgeId } = payload;
  const res = await fetch(`/api/v1/events/${eventId}/judges/${judgeId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const fallback =
      res.status >= 500
        ? 'Unable to delete judge right now. Please try again.'
        : 'Failed to delete judge';
    const message = await readSafeErrorMessageFromResponse(res, fallback);
    throw new Error(message);
  }

  return res.json();
}

export const useDeleteJudge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJudge,
    onSuccess: (data, variables) => {
      toast.success(data.msg || 'Judge removed successfully!');
      queryClient.invalidateQueries({ queryKey: ['judges', variables.eventId] });
    },
    onError: (error: Error) => {
      logger.error('Error deleting judge:', error);
      toast.error(
        getSafeErrorMessage(error, 'Unable to delete judge right now. Please try again.')
      );
    },
  });
};
