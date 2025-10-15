export interface GetClubsResponse {
  resp?: { name: string; id: string; collegeName: string }[];
  clubs?: { name: string }[];
  count?: number;
  msg?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export async function fetchClubsByCollege(
  college: string,
  signal?: AbortSignal,
  token?: string
): Promise<string[]> {
  if (!college) return [];
  
  try {
    // Try the specific endpoint first
    const url = `${API_BASE_URL}/api/v1/clubs/getClubs/${encodeURIComponent(college)}`;
    console.log('Fetching clubs from:', url); // Debug log
    
    const res = await fetch(url, {
      signal,
      headers: token
        ? {
            authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    
    if (!res.ok) {
      console.error('Failed to fetch clubs:', res.status, res.statusText);
      
      // Fallback: Try to get all clubs and filter by college
      console.log('Trying fallback method: fetch all clubs and filter by college');
      return await fetchAllClubsAndFilter(college, signal, token);
    }
    
    const data = (await res.json()) as GetClubsResponse;
    console.log('API Response:', data); // Debug log
    
    // Try different response structures
    let clubs: string[] = [];
    
    if (Array.isArray(data?.resp)) {
      // Response structure: { resp: [{ name, id, collegeName }] }
      clubs = data.resp.map((c) => c.name);
    } else if (Array.isArray(data?.clubs)) {
      // Response structure: { clubs: [{ name }] }
      clubs = data.clubs.map((c) => c.name);
    } else if (Array.isArray(data)) {
      // Response structure: [{ name }] (direct array)
      clubs = data.map((c: any) => c.name || c);
    }
    
    console.log('Extracted club names:', clubs); // Debug log
    return clubs;
  } catch (error) {
    console.error('Error fetching clubs by college:', error);
    
    // Fallback: Try to get all clubs and filter by college
    console.log('Trying fallback method due to error');
    return await fetchAllClubsAndFilter(college, signal, token);
  }
}

// Fallback function to fetch all clubs and filter by college
async function fetchAllClubsAndFilter(
  college: string,
  signal?: AbortSignal,
  token?: string
): Promise<string[]> {
  try {
    const url = `${API_BASE_URL}/api/v1/clubs/getAll?page=1&limit=1000`;
    console.log('Fallback: Fetching all clubs from:', url);
    
    const res = await fetch(url, {
      signal,
      headers: token
        ? {
            authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    
    if (!res.ok) {
      console.error('Fallback also failed:', res.status, res.statusText);
      return [];
    }
    
    const data = (await res.json()) as any;
    console.log('Fallback API Response:', data);
    
    if (Array.isArray(data?.resp)) {
      // Filter clubs by college name
      const filteredClubs = data.resp
        .filter((club: any) => 
          club.collegeName && 
          club.collegeName.toLowerCase().includes(college.toLowerCase())
        )
        .map((club: any) => club.name);
      
      console.log('Filtered clubs by college:', filteredClubs);
      return filteredClubs;
    }
    
    return [];
  } catch (error) {
    console.error('Fallback method also failed:', error);
    return [];
  }
}