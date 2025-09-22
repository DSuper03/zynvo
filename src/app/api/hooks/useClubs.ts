export interface GetClubsResponse {
  resp: { name: string }[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export async function fetchClubsByCollege(college: string, signal?: AbortSignal): Promise<string[]> {
  if (!college) return [];
  const url = `${API_BASE_URL}/api/v1/clubs/getClubs/${encodeURIComponent(college)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as GetClubsResponse;
  const list = Array.isArray(data?.resp) ? data.resp.map((c) => c.name) : [];
  return list;
}