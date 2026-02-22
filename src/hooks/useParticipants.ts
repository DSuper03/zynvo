import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://zynvo.social';

export interface ParticipantUser {
  id: string;
  name: string | null;
  email: string;
  profileAvatar: string | null;
  collegeName: string | null;
  course: string | null;
  year: string | null;
  tags: string[] | null;
}

export interface Participant {
  joinedAt: string;
  passId: string | null;
  user: ParticipantUser;
  paymentProofUrl?: string; // For paid events - payment screenshot URL
}

export interface ParticipantsResponse {
  msg: string;
  data: Participant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UseParticipantsOptions {
  eventId: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

async function fetchParticipants(
  eventId: string,
  page: number = 1,
  limit: number = 50,
  token?: string | null
): Promise<ParticipantsResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.get<ParticipantsResponse>(
    `${BASE_URL}/api/v1/events/participants/${eventId}`,
    {
      params: {
        page,
        limit,
      },
      headers,
    }
  );

  return response.data;
}

export function useParticipants({
  eventId,
  page = 1,
  limit = 50,
  enabled = true,
}: UseParticipantsOptions) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return useQuery<ParticipantsResponse, Error>({
    queryKey: ['participants', eventId, page, limit],
    queryFn: () => fetchParticipants(eventId, page, limit, token),
    enabled: enabled && !!eventId,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
}

const PARTICIPANTS_CSV_PATH = (eventId: string) =>
  `${BASE_URL}/api/v1/events/participants/${eventId}`;

/**
 * Parse CSV text into rows of objects (header row determines keys).
 * Handles quoted fields and returns the last row's joinedAt for incremental sync.
 */
export function parseCsv(csvText: string): { joinedAt?: string; [k: string]: string | undefined }[] {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const header = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim());
  const rows: { joinedAt?: string; [k: string]: string | undefined }[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: { joinedAt?: string; [k: string]: string | undefined } = {};
    header.forEach((key, j) => {
      row[key] = values[j];
      if (key.toLowerCase() === 'joinedat') row.joinedAt = values[j];
    });
    rows.push(row);
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let val = '';
      i++;
      while (i < line.length) {
        if (line[i] === '"') {
          i++;
          if (line[i] === '"') {
            val += '"';
            i++;
          } else break;
        } else {
          val += line[i];
          i++;
        }
      }
      out.push(val);
      if (line[i] === ',') i++;
    } else {
      const comma = line.indexOf(',', i);
      if (comma === -1) {
        out.push(line.slice(i).trim());
        break;
      }
      out.push(line.slice(i, comma).trim());
      i = comma + 1;
    }
  }
  return out;
}

export interface SyncCsvResult {
  appended: number;
  etag: string | null;
  lastSince: string | null;
}

export class InvalidSinceError extends Error {
  constructor() {
    super('Invalid since');
    this.name = 'InvalidSinceError';
  }
}

/**
 * Sync participants CSV: initial fetch (no since/etag) or incremental (since + If-None-Match).
 * On 304 returns unchanged. On 200 parses new rows and returns newest joinedAt and etag.
 * On 400 Invalid since, throws InvalidSinceError so caller can reset lastSince and refetch full.
 */
export async function syncParticipantsCsv(
  eventId: string,
  lastSince: string | null,
  etag: string | null,
  token?: string | null
): Promise<SyncCsvResult> {
  const params = new URLSearchParams({ format: 'csv' });
  if (lastSince) params.set('since', lastSince);
  const url = `${PARTICIPANTS_CSV_PATH(eventId)}?${params}`;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (etag) headers['If-None-Match'] = etag;

  const res = await fetch(url, { method: 'GET', headers });

  if (res.status === 304) {
    return { appended: 0, etag, lastSince };
  }

  if (res.status === 400) {
    const text = await res.text().catch(() => '');
    if (/invalid|since/i.test(text)) throw new InvalidSinceError();
    throw new Error(`Failed ${res.status}: ${text || res.statusText}`);
  }

  if (res.status >= 500) {
    throw new Error(`Server error ${res.status}`);
  }

  if (!res.ok) {
    throw new Error(`Failed ${res.status}: ${res.statusText}`);
  }

  const newCsv = await res.text();
  const newEtag = res.headers.get('etag') ?? etag;
  const appendedRows = parseCsv(newCsv);
  const newestJoinedAt = appendedRows.length
    ? (appendedRows.at(-1)?.joinedAt ?? lastSince)
    : lastSince;

  return {
    appended: appendedRows.length,
    etag: newEtag,
    lastSince: newestJoinedAt,
  };
}

/**
 * Downloads participants data as CSV
 */
export async function downloadParticipantsCSV(
  eventId: string,
  token?: string | null
): Promise<void> {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${PARTICIPANTS_CSV_PATH(eventId)}?format=csv`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.status}`);
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `participants_${eventId}.csv`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('CSV downloaded successfully!');
  } catch (error: any) {
    console.error('Error downloading CSV:', error);
    toast.error(error.message || 'Failed to download CSV');
    throw error;
  }
}
