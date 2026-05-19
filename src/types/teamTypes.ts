// ─── Team System Types ────────────────────────────────────────────────────────

export interface TeamMemberUser {
  id: string;
  name: string | null;
  email: string;
  profileAvatar: string | null;
  collegeName?: string | null;
}

export interface TeamMember {
  id: string;
  role: 'leader' | 'member';
  joinedAt?: string;
  user: TeamMemberUser;
}

export interface TeamEvent {
  EventName: string;
  TeamSize: number;
}

export interface TeamData {
  id: string;
  teamName: string;
  teamCode: string;
  eventId: string;
  createdById: string;
  createdAt: string;
  myRole?: 'leader' | 'member';
  maxMembers: number;
  currentMembers: number;
  members: TeamMember[];
  event?: TeamEvent;
}

export interface TeamApiResponse {
  msg: string;
  team: TeamData | null;
}

export interface CreateTeamPayload {
  eventId: string;
  teamName: string;
}

export interface JoinTeamPayload {
  eventId: string;
  teamCode: string;
}
