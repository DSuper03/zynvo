/**
 * Event hooks — all requests go to same-origin Next.js proxy routes (/api/v1/*).
 * The actual backend URL and auth secrets are managed server-side.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getSafeErrorMessage } from '@/lib/safe-error';

// All calls go through the same-origin proxy — no NEXT_PUBLIC_BACKEND_URL needed.
const API_BASE = '/api';

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

/** Fetch paginated events list. Public endpoint — no auth required. */
export const useEvents = (page: number = 1, limit: number = 10) => {
  return useQuery<EventsResponse, Error>({
    queryKey: ['events', page, limit],
    queryFn: async (): Promise<EventsResponse> => {
      try {
        const response = await axios.get<EventsResponse>(
          `${API_BASE}/v1/events/events?page=${page}&limit=${limit}`
        );
        return response.data;
      } catch (error) {
        logger.error('Error fetching events:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/** Fetch a single event by ID. Public endpoint. */
export const useEvent = (eventId: string) => {
  return useQuery<Event, Error>({
    queryKey: ['event', eventId],
    queryFn: async (): Promise<Event> => {
      try {
        const response = await axios.get<EventResponse>(
          `${API_BASE}/v1/events/event/${eventId}`
        );
        return response.data.event;
      } catch (error) {
        logger.error('Error fetching event:', error);
        throw error;
      }
    },
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Create event mutation.
 * Auth is handled server-side by the proxy — no token needed in the request.
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEventResponse, Error, CreateEventData>({
    mutationFn: async (eventData: CreateEventData): Promise<CreateEventResponse> => {
      const response = await axios.post<CreateEventResponse>(
        `${API_BASE}/v1/events/event`,
        eventData
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Event created successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: Error) => {
      logger.error('Error creating event:', error);
      toast.error(getSafeErrorMessage(error, 'Failed to create event'));
    },
  });
};

/**
 * Register for event mutation.
 * Auth is handled server-side by the proxy.
 */
export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RegistrationResponse,
    Error,
    { eventId: string; registrationData: RegistrationData }
  >({
    mutationFn: async ({
      eventId,
      registrationData,
    }: {
      eventId: string;
      registrationData: RegistrationData;
    }): Promise<RegistrationResponse> => {
      const response = await axios.post<RegistrationResponse>(
        `${API_BASE}/v1/events/register/${eventId}`,
        registrationData
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Successfully registered for event!');
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    },
    onError: (error: Error) => {
      logger.error('Error registering for event:', error);
      const axiosError = error as any;
      if (axiosError?.response?.status === 403) {
        toast.error('Only students from organizer college can register.');
        return;
      }
      toast.error(getSafeErrorMessage(error, 'Failed to register for event'));
    },
  });
};
