import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Event types
interface Event {
  id: string;
  eventName: string;
  description: string;
  eventStartDate: string;
  eventEndDate: string;
  venue: string;
  image?: string;
  university: string;
  eventType: string;
}

interface EventsResponse {
  events: Event[];
  totalPages: number;
  currentPage: number;
}

// Temporary hook without React Query
export const useEvents = (page: number = 1, limit: number = 10) => {
  const [data, setData] = useState<EventsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsError(false);

        const response = await axios.get(
          `${API_BASE_URL}/api/v1/events/events?page=${page}&limit=${limit}`
        );
        
        setData(response.data as EventsResponse);
      } catch (err) {
        logger.error('Error fetching events:', err);
        setError(err as Error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [page, limit]);

  return { data, isLoading, error, isError };
};

// Temporary hook for single event
export const useEvent = (eventId: string) => {
  const [data, setData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsError(false);

        const response = await axios.get(
          `${API_BASE_URL}/api/v1/events/event/${eventId}`
        );
        
        setData((response.data as any).event);
      } catch (err) {
        logger.error('Error fetching event:', err);
        setError(err as Error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { data, isLoading, error, isError };
};

// Temporary create event function
export const useCreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (eventData: any) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/events/event`,
        eventData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Event created successfully!');
      return response.data;
    } catch (error: any) {
      logger.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
};

// Temporary register for event function
export const useRegisterForEvent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async ({ eventId, registrationData }: { eventId: string; registrationData: any }) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/events/register/${eventId}`,
        registrationData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Successfully registered for event!');
      return response.data;
    } catch (error: any) {
      logger.error('Error registering for event:', error);
      toast.error(error.response?.data?.message || 'Failed to register for event');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
};