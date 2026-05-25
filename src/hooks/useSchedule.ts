import { useQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import type { ScheduleDay } from '@/types/schedule';
import { SCHEDULE_API } from '@/lib/schedule-api';
import { normalizeSchedule } from '@/lib/schedule-normalize';
import { logger } from '@/lib/logger';

export async function fetchSchedule(
  eventId: string,
  token?: string | null
): Promise<ScheduleDay[]> {
  try {
    const headers = token ? { authorization: `Bearer ${token}` } : undefined;
    const res = await axios.get<{ response?: ScheduleDay[] }>(SCHEDULE_API.list(eventId), {
      headers,
    });
    return normalizeSchedule(res.data?.response);
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404 || status === 401 || status === 403) {
        return [];
      }
    }

    logger.error('Error fetching schedule:', error);
    return [];
  }
}

export function useSchedule(eventId: string, token?: string | null, enabled = true) {
  return useQuery({
    queryKey: ['schedule', eventId],
    queryFn: () => fetchSchedule(eventId, token),
    enabled: !!eventId && enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export { normalizeSchedule } from '@/lib/schedule-normalize';
