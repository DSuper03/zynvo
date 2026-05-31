import { useQuery } from '@tanstack/react-query';
import { fetchEventSchedule } from '@/lib/schedule-api';

export function useSchedule(eventId: string, token?: string | null, enabled = true) {
  return useQuery({
    queryKey: ['schedule', eventId],
    queryFn: () => fetchEventSchedule(eventId, token),
    enabled: !!eventId && enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export { normalizeSchedule } from '@/lib/schedule-normalize';
export { fetchEventSchedule as fetchSchedule } from '@/lib/schedule-api';
