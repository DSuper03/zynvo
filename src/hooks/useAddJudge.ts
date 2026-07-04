/**
 * Add judge hook — requests go through the same-origin proxy.
 * Auth is handled server-side; no localStorage token needed.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getSafeErrorMessage, readSafeErrorMessageFromResponse } from '@/lib/safe-error';

export type AddJudgePayload = {
  eventId: string;
  name: string;
  description: string;
  achievement: string;
};

export type AddJudgeResponse = {
  msg: string;
  data: {
    id: string;
    name: string;
    description: string;
    achievement: string;
    eventId: string;
  };
};

async function addJudge(payload: AddJudgePayload): Promise<AddJudgeResponse> {
  const { eventId, name, description, achievement } = payload;
  const res = await fetch(`/api/v1/events/${eventId}/judges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, achievement }),
  });

  if (!res.ok) {
    const fallback =
      res.status >= 500
        ? 'Unable to add judge right now. Please try again.'
        : 'Failed to add judge';
    const message = await readSafeErrorMessageFromResponse(res, fallback);
    throw new Error(message);
  }

  return res.json() as Promise<AddJudgeResponse>;
}

export const useAddJudge = () => {
  const queryClient = useQueryClient();

  return useMutation<AddJudgeResponse, Error, AddJudgePayload>({
    mutationFn: addJudge,
    onSuccess: (data, variables) => {
      toast.success(data.msg || 'Judge added successfully!');
      queryClient.invalidateQueries({ queryKey: ['judges', variables.eventId] });
    },
    onError: (error: Error) => {
      logger.error('Error adding judge:', error);
      toast.error(
        getSafeErrorMessage(error, 'Unable to add judge right now. Please try again.')
      );
    },
  });
};
