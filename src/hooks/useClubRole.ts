import axios from 'axios';

export interface ClubRoleResult {
  msg : string,
  founder : string | boolean
}

export async function checkClubRole(): Promise<any> {
  try {
    const res = await axios.get<ClubRoleResult>(
      `/api/v1/user/isClubAdmin`,
    );
    const clubRoleData = res.data;
    if (clubRoleData.founder == "true" || clubRoleData.founder === true) {
      return { msg: 'User is the founder of the club', authorized: true };
    } else if (clubRoleData.founder !== "true" || !clubRoleData.founder) {
      return { msg: 'User is not the founder of the club', authorized: false };
    } else {
      return { msg: 'Unexpected response from server', authorized: false };
    }
  } catch {
    return { msg: 'Error occurred while checking club role', authorized : false };
  }
}
