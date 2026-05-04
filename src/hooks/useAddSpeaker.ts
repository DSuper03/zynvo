import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

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

async function addSpeaker(
  payload: AddSpeakerPayload,
  token: string
): Promise<AddSpeakerResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/events/addSpeakers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to add speaker: ${res.status} ${errText}`);
  }

  return res.json() as Promise<AddSpeakerResponse>;
}

export const useAddSpeaker = () => {
  const queryClient = useQueryClient();

  return useMutation<AddSpeakerResponse, Error, AddSpeakerPayload>({
    mutationFn: async (payload: AddSpeakerPayload): Promise<AddSpeakerResponse> => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      return addSpeaker(payload, token);
    },
    onSuccess: (data, variables) => {
      toast.success(data.msg || 'Speaker added successfully!');
      // Invalidate speakers query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['speakers', variables.eventId] });
    },
    onError: (error: Error) => {
      logger.error('Error adding speaker:', error);
      toast.error(error.message || 'Failed to add speaker');
    },
  });
};

