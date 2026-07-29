import axios from 'axios';

export interface ClubRoleResult {
  msg : string,
  founder : string | boolean
}

export async function checkClubRole(token?: string): Promise<any> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers.authorization = `Bearer ${token}`;
    const res = await axios.get<ClubRoleResult>(
      `/api/v1/user/isClubAdmin`,
      { headers },
    );
    const clubRoleData = res.data;
    if (clubRoleData.founder == "true" || clubRoleData.founder === true) {
      return { msg: 'User is the founder of the club', authorized: true };
    } else if (clubRoleData.founder == "false" || clubRoleData.founder === false) {
      return { msg: 'User is not the founder of the club', authorized: false };
    } else {
      return { msg: 'Unexpected response from server', authorized: false };
    }
  } catch {
    return { msg: 'Error occurred while checking club role', authorized : false };
  }
}
