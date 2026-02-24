import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Event types
export interface Event {
  id: string;
  eventName: string;
  description: string;
  eventStartDate: string;
  eventEndDate: string;
  venue: string;
  image?: string;
  university: string;
  eventType: string;
  maxTeamSize?: number;
  contactEmail?: string;
  contactPhone?: string;
  prizes?: string;
}

export interface EventsResponse {
  events: Event[];
  totalPages: number;
  currentPage: number;
}

export interface CreateEventData {
  eventMode: string;
  eventName: string;
  university: string;
  tagline?: string;
  description: string;
  eventType: string;
  maxTeamSize: number;
  venue: string;
  collegeStudentsOnly: boolean;
  noParticipationFee: boolean;
  coreTeamOnly: boolean;
  eventWebsite?: string;
  eventStartDate: string;
  eventEndDate: string;
  applicationStartDate?: string;
  applicationEndDate?: string;
  prizes?: string;
  contactEmail: string;
  contactPhone: string;
  image?: string;
}

export interface RegistrationData {
  teamName?: string;
  memberEmails?: string[];
  additionalInfo?: string;
}

export interface CreateEventResponse {
  msg: string;
  id: string;
}

export interface RegistrationResponse {
  message: string;
  registrationId: string;
}

export interface EventResponse {
  event: Event;
}

// Fetch events with pagination
export const useEvents = (page: number = 1, limit: number = 10) => {
  return useQuery<EventsResponse, Error>({
    queryKey: ['events', page, limit],
    queryFn: async (): Promise<EventsResponse> => {
      try {
        const response = await axios.get<EventsResponse>(
          `${API_BASE_URL}/api/v1/events/events?page=${page}&limit=${limit}`
        );
        return response.data;
      } catch (error) {
        logger.error('Error fetching events:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in v5)
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Fetch single event
export const useEvent = (eventId: string) => {
  return useQuery<Event, Error>({
    queryKey: ['event', eventId],
    queryFn: async (): Promise<Event> => {
      try {
        const response = await axios.get<EventResponse>(
          `${API_BASE_URL}/api/v1/events/event/${eventId}`
        );
        return response.data.event;
      } catch (error) {
        logger.error('Error fetching event:', error);
        throw error;
      }
    },
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Create event mutation
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEventResponse, Error, CreateEventData>({
    mutationFn: async (eventData: CreateEventData): Promise<CreateEventResponse> => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post<CreateEventResponse>(
        `${API_BASE_URL}/api/v1/events/event`,
        eventData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Event created successfully!');
      // Invalidate and refetch events
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: Error) => {
      logger.error('Error creating event:', error);
      const axiosError = error as any;
      toast.error(axiosError.response?.data?.message || 'Failed to create event');
    },
  });
};

// Register for event mutation
export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RegistrationResponse,
    Error,
    { eventId: string; registrationData: RegistrationData }
  >({
    mutationFn: async ({ 
      eventId, 
      registrationData 
    }: { 
      eventId: string; 
      registrationData: RegistrationData 
    }): Promise<RegistrationResponse> => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post<RegistrationResponse>(
        `${API_BASE_URL}/api/v1/events/register/${eventId}`,
        registrationData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Successfully registered for event!');
      // Invalidate specific event to update registration status
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    },
    onError: (error: Error) => {
      logger.error('Error registering for event:', error);
      const axiosError = error as any;
      if (axiosError?.response?.status === 403) {
        toast.error('Only students from organizer college can register.');
        return;
      }
      toast.error(
        axiosError.response?.data?.message || 'Failed to register for event'
      );
    },
  });
};
