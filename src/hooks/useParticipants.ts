import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://zynvo.social';

export interface ParticipantUser {
  id: string;
  name: string | null;
  email: string;
  profileAvatar: string | null;
  collegeName: string | null;
  course: string | null;
  year: string | null;
  tags: string[] | null;
}

export interface Participant {
  joinedAt: string;
  passId: string | null;
  user: ParticipantUser;
}

export interface ParticipantsResponse {
  msg: string;
  data: Participant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UseParticipantsOptions {
  eventId: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

async function fetchParticipants(
  eventId: string,
  page: number = 1,
  limit: number = 50,
  token?: string | null
): Promise<ParticipantsResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.get<ParticipantsResponse>(
    `${BASE_URL}/api/v1/events/participants/${eventId}`,
    {
      params: {
        page,
        limit,
      },
      headers,
    }
  );

  return response.data;
}

export function useParticipants({
  eventId,
  page = 1,
  limit = 50,
  enabled = true,
}: UseParticipantsOptions) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return useQuery<ParticipantsResponse, Error>({
    queryKey: ['participants', eventId, page, limit],
    queryFn: () => fetchParticipants(eventId, page, limit, token),
    enabled: enabled && !!eventId,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
}

/**
 * Downloads participants data as CSV
 */
export async function downloadParticipantsCSV(
  eventId: string,
  token?: string | null
): Promise<void> {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/events/participants/${eventId}?format=csv`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.status}`);
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `participants_${eventId}.csv`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('CSV downloaded successfully!');
  } catch (error: any) {
    console.error('Error downloading CSV:', error);
    toast.error(error.message || 'Failed to download CSV');
    throw error;
  }
}
