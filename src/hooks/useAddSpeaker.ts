/**
 * Add speaker hook — requests go through the same-origin proxy.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getSafeErrorMessage, readSafeErrorMessageFromResponse } from '@/lib/safe-error';

export type AddSpeakerPayload = {
  eventId: string;
  name: string;
  email: string;
  about: string;
  profilePic?: string;
};

export type AddSpeakerResponse = {
  msg: string;
  id: number;
};

async function addSpeaker(payload: AddSpeakerPayload): Promise<AddSpeakerResponse> {
  const res = await fetch(`/api/v1/events/addSpeakers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const fallback =
      res.status >= 500
        ? 'Unable to add speaker right now. Please try again.'
        : 'Failed to add speaker';
    const message = await readSafeErrorMessageFromResponse(res, fallback);
    throw new Error(message);
  }

  return res.json() as Promise<AddSpeakerResponse>;
}

export const useAddSpeaker = () => {
  const queryClient = useQueryClient();

  return useMutation<AddSpeakerResponse, Error, AddSpeakerPayload>({
    mutationFn: addSpeaker,
    onSuccess: (data, variables) => {
      toast.success(data.msg || 'Speaker added successfully!');
      queryClient.invalidateQueries({ queryKey: ['speakers', variables.eventId] });
    },
    onError: (error: Error) => {
      logger.error('Error adding speaker:', error);
      toast.error(
        getSafeErrorMessage(error, 'Unable to add speaker right now. Please try again.')
      );
    },
  });
};
