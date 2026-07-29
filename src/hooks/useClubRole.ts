import axios from 'axios';

export interface ClubRoleResult {
  authorized: boolean;
  role: 'founder' | 'admin' | 'member' | null;
}

export async function checkClubRole(clubName: string): Promise<ClubRoleResult> {
  try {
    const res = await axios.get<ClubRoleResult>(
      `/api/v1/clubs/check-role?clubName=${encodeURIComponent(clubName)}`,
    );
    return res.data;
  } catch {
    return { authorized: true, role: null };
  }
}
