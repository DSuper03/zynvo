/**
 * Team hooks — all requests go through the same-origin proxy (/api/v1/teams/*).
 * Auth is managed server-side; no token is needed in the request headers.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import type { TeamApiResponse, CreateTeamPayload, JoinTeamPayload } from '@/types/teamTypes';
import { getSafeErrorMessage } from '@/lib/safe-error';

const API_BASE = '/api';

export function useTeam(eventId: string, _token: string | null, enabled = true) {
  const queryClient = useQueryClient();
  const queryKey = ['my-team', eventId];

  const {
    data: myTeamData,
    isLoading,
    refetch,
  } = useQuery<TeamApiResponse>({
    queryKey,
    queryFn: async () => {
      const res = await axios.get<TeamApiResponse>(
        `${API_BASE}/v1/teams/my-team/${eventId}`
      );
      return res.data;
    },
    enabled: !!eventId && enabled,
    staleTime: 30_000,
  });

  const myTeam = myTeamData?.team ?? null;

  const createMutation = useMutation({
    mutationFn: async (payload: CreateTeamPayload) => {
      const res = await axios.post<TeamApiResponse>(
        `${API_BASE}/v1/teams/create`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => {
      toast.error(getSafeErrorMessage(err, 'Failed to create team'));
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (payload: JoinTeamPayload) => {
      const res = await axios.post<TeamApiResponse>(
        `${API_BASE}/v1/teams/join`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => {
      toast.error(getSafeErrorMessage(err, 'Failed to join team'));
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async (teamId: string) => {
      const res = await axios.delete(`${API_BASE}/v1/teams/leave/${teamId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('You have left the team');
    },
    onError: (err: any) => {
      toast.error(getSafeErrorMessage(err, 'Failed to leave team'));
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
