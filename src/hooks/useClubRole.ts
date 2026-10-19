import axios from 'axios';

export interface ClubRoleResult {
  msg : string,
  founder : string | boolean
}

export async function checkClubRole(token?: string, clubId?: string): Promise<any> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers.authorization = `Bearer ${token}`;

    if (!clubId) {
      return { msg: 'Club ID is required', authorized: false };
    }

    const res = await axios.get<ClubRoleResult>(
      `/api/v1/user/isClubAdmin/${clubId}`,
      { headers },
    );
    const clubRoleData = res.data;
    if (clubRoleData.founder == "true" || clubRoleData.founder === true) {
      return { msg: 'User is the founder of the club', authorized: true };
    } else if (clubRoleData.founder !== "true" || !clubRoleData.founder) {
      return { msg: 'User is not the founder of the club', authorized: false };
    } else {
      return { msg: 'Unexpected response from server', authorized: false };
    }
  } catch (error: any) {
    const errorMsg = error?.response?.data?.msg || 'Error checking club role';
    if (errorMsg.includes('not a member of this club') || error?.response?.status === 403) {
      return { msg: 'You are not a member of this club', authorized: false };
    }
    return { msg: errorMsg, authorized: false };
  }
}
