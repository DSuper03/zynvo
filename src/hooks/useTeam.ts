import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import type { TeamApiResponse, CreateTeamPayload, JoinTeamPayload } from '@/types/teamTypes';

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Custom hook for all team-related operations.
 *
 * Fetches the user's current team (if any) for a given event and provides
 * mutation helpers for create / join / leave.
 */
export function useTeam(eventId: string, token: string | null, enabled = true) {
  const queryClient = useQueryClient();
  const queryKey = ['my-team', eventId, token];

  const headers = token ? { authorization: `Bearer ${token}` } : undefined;

  // ── Fetch current team ─────────────────────────────────────────────────────
  const {
    data: myTeamData,
    isLoading,
    refetch,
  } = useQuery<TeamApiResponse>({
    queryKey,
    queryFn: async () => {
      const res = await axios.get<TeamApiResponse>(
        `${API}/api/v1/teams/my-team/${eventId}`,
        { headers }
      );
      return res.data;
    },
    enabled: !!eventId && !!token && enabled,
    staleTime: 30_000,
  });

  const myTeam = myTeamData?.team ?? null;

  // ── Create team ────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (payload: CreateTeamPayload) => {
      const res = await axios.post<TeamApiResponse>(
        `${API}/api/v1/teams/create`,
        payload,
        { headers }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        'Failed to create team';
      toast.error(msg);
    },
  });

  // ── Join team ──────────────────────────────────────────────────────────────
  const joinMutation = useMutation({
    mutationFn: async (payload: JoinTeamPayload) => {
      const res = await axios.post<TeamApiResponse>(
        `${API}/api/v1/teams/join`,
        payload,
        { headers }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        'Failed to join team';
      toast.error(msg);
    },
  });

  // ── Leave team ─────────────────────────────────────────────────────────────
  const leaveMutation = useMutation({
    mutationFn: async (teamId: string) => {
      const res = await axios.delete(`${API}/api/v1/teams/leave/${teamId}`, {
        headers,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('You have left the team');
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        'Failed to leave team';
      toast.error(msg);
    },
  });

  return {
    myTeam,
    isLoading,
    refetch,
    createTeam: createMutation.mutateAsync,
    joinTeam: joinMutation.mutateAsync,
    leaveTeam: leaveMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
  };
}
