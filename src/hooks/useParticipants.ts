/**
 * Participants hook — all requests go through the same-origin proxy.
 *
 * Auth: the proxy prefers a server-side Clerk session token and falls back to
 * the caller's Authorization header (see lib/server/proxy.ts). The event page
 * still authenticates with the legacy JWT in localStorage, and the dev proxy
 * bypasses Clerk entirely, so callers MUST forward that token when they have
 * one — otherwise these endpoints return 401.
 */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
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
  checkedInAt?: string | null;
  user: ParticipantUser;
  customAnswers?: { label: string; answer: string }[];
  /** Paid events only. */
  paymentStatus?: string | null;
  /** Paid events only. */
  paymentScreenshotUrl?: string | null;
  paymentProofUrl?: string;
}

export interface ParticipantsResponse {
  msg: string;
  data: Participant[];
  /** Whether the event is paid; payment fields are only sent when true. */
  isPaid?: boolean;
  /** Custom registration question labels, in their configured order. */
  questions?: string[];
  pagination: {
    page: number;
    limit: number;
    /** Matching attendees (after `search`). */
    total: number;
    totalPages: number;
    /** All attendees of the event, ignoring `search`. */
    totalAll?: number;
  };
}

export interface UseParticipantsOptions {
  eventId: string;
  page?: number;
  limit?: number;
  /** Searches every attendee server-side (name, email, college, answers…). */
  search?: string;
  enabled?: boolean;
  /** Legacy backend JWT. Forwarded as a bearer token when present. */
  token?: string | null;
}

/** Bearer header for the legacy backend JWT, omitted when there is no token. */
function authHeaders(token?: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchParticipants(
  eventId: string,
  page: number = 1,
  limit: number = 50,
  token?: string | null,
  search: string = ''
): Promise<ParticipantsResponse> {
  const q = search.trim();
  const response = await axios.get<ParticipantsResponse>(
    `${API_BASE}/v1/events/participants/${eventId}`,
    { params: { page, limit, ...(q ? { q } : {}) }, headers: authHeaders(token) }
  );
  return response.data;
}

export function useParticipants({
  eventId,
  page = 1,
  limit = 50,
  search = '',
  enabled = true,
  token,
}: UseParticipantsOptions) {
  const q = search.trim();
  return useQuery<ParticipantsResponse, Error>({
    // Prefix ['participants', eventId] is what CSV sync invalidates.
    queryKey: ['participants', eventId, page, limit, q],
    queryFn: () => fetchParticipants(eventId, page, limit, token, q),
    enabled: enabled && !!eventId,
    staleTime: 30000,
    retry: 2,
    // Keep the current rows on screen while the next page / search loads.
    placeholderData: keepPreviousData,
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
  /**
   * True when the request carried no `since`, so the response is the full
   * participant list rather than an incremental delta. Callers should not
   * report these rows as newly arrived.
   */
  isBaseline: boolean;
}

export class InvalidSinceError extends Error {
  constructor() {
    super('Invalid since');
    this.name = 'InvalidSinceError';
  }
}

/**
 * Newest parseable `joinedAt` across the rows, or `fallback` when none parse.
 * Computed as a max rather than taking the last row — the backend's sort order
 * is not guaranteed ascending, and reading it wrong would walk `since`
 * backwards and re-fetch the same rows on every poll.
 */
function newestJoinedAt(
  rows: { joinedAt?: string }[],
  fallback: string | null
): string | null {
  let bestValue: string | null = null;
  let bestTime = -Infinity;

  for (const row of rows) {
    if (!row.joinedAt) continue;
    const time = new Date(row.joinedAt).getTime();
    if (Number.isNaN(time) || time <= bestTime) continue;
    bestTime = time;
    bestValue = row.joinedAt;
  }

  return bestValue ?? fallback;
}

export async function syncParticipantsCsv(
  eventId: string,
  lastSince: string | null,
  etag: string | null,
  token?: string | null
): Promise<SyncCsvResult> {
  const isBaseline = !lastSince;
  const params = new URLSearchParams({ format: 'csv' });
  if (lastSince) params.set('since', lastSince);
  const url = `${API_BASE}/v1/events/participants/${eventId}?${params}`;
  const headers: Record<string, string> = authHeaders(token);
  if (etag) headers['If-None-Match'] = etag;

  const res = await fetch(url, { method: 'GET', headers });

  if (res.status === 304) {
    return { appended: 0, etag, lastSince, isBaseline };
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

  return {
    appended: appendedRows.length,
    etag: newEtag,
    lastSince: newestJoinedAt(appendedRows, lastSince),
    isBaseline,
  };
}

export async function downloadParticipantsCSV(
  eventId: string,
  token?: string | null
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE}/v1/events/participants/${eventId}?format=csv`,
      { method: 'GET', headers: authHeaders(token) }
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
