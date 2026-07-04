/**
 * Participants hook — all requests go through the same-origin proxy.
 * Auth headers are injected server-side; no localStorage tokens are used.
 */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { getSafeErrorMessage } from '@/lib/safe-error';

const API_BASE = '/api';

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
  paymentProofUrl?: string;
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
  limit: number = 50
): Promise<ParticipantsResponse> {
  const response = await axios.get<ParticipantsResponse>(
    `${API_BASE}/v1/events/participants/${eventId}`,
    { params: { page, limit } }
  );
  return response.data;
}

export function useParticipants({
  eventId,
  page = 1,
  limit = 50,
  enabled = true,
}: UseParticipantsOptions) {
  return useQuery<ParticipantsResponse, Error>({
    queryKey: ['participants', eventId, page, limit],
    queryFn: () => fetchParticipants(eventId, page, limit),
    enabled: enabled && !!eventId,
    staleTime: 30000,
    retry: 2,
  });
}

export function parseCsv(
  csvText: string
): { joinedAt?: string; [k: string]: string | undefined }[] {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
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

export async function syncParticipantsCsv(
  eventId: string,
  lastSince: string | null,
  etag: string | null
): Promise<SyncCsvResult> {
  const params = new URLSearchParams({ format: 'csv' });
  if (lastSince) params.set('since', lastSince);
  const url = `${API_BASE}/v1/events/participants/${eventId}?${params}`;
  const headers: Record<string, string> = {};
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

  return { appended: appendedRows.length, etag: newEtag, lastSince: newestJoinedAt };
}

export async function downloadParticipantsCSV(eventId: string): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE}/v1/events/participants/${eventId}?format=csv`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `participants_${eventId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('CSV downloaded successfully!');
  } catch (error: any) {
    toast.error(
      getSafeErrorMessage(error, 'Unable to download CSV right now. Please try again.')
    );
    throw error;
  }
}
