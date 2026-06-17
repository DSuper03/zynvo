import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getSafeErrorMessage, readSafeErrorMessageFromResponse } from '@/lib/safe-error';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

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

async function addJudge(
  payload: AddJudgePayload,
  token: string
): Promise<AddJudgeResponse> {
  const { eventId, name, description, achievement } = payload;
  const res = await fetch(`${API_BASE_URL}/api/v1/events/${eventId}/judges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
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
    mutationFn: async (payload: AddJudgePayload): Promise<AddJudgeResponse> => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      return addJudge(payload, token);
    },
    onSuccess: (data, variables) => {
      toast.success(data.msg || 'Judge added successfully!');
      // Invalidate judges query to refetch the list
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
