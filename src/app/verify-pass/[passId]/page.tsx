'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { AlertCircle, Loader2 } from 'lucide-react';

type PassUser = {
  name: string | null;
  email: string;
};

type PassDetails = {
  passId: string;
  eventName: string;
  user: PassUser;
};

const USER_DETAILS_PATH = '/api/v1/events/user-details';

export default function VerifyPassPage() {
  const params = useParams();
  const rawId = (params as Record<string, string | string[]>).passId;
  const passId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [data, setData] = useState<PassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!passId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const base = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
        const url = base
          ? `${base}${USER_DETAILS_PATH}?id=${encodeURIComponent(passId)}`
          : `${USER_DETAILS_PATH}?id=${encodeURIComponent(passId)}`;

        const resp = await axios.get<{ data: PassDetails }>(url);
        if (resp?.data?.data) {
          setData(resp.data.data);
        } else {
          setError('No details found for this pass.');
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Unable to fetch pass details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [passId]);

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-yellow-500/20 rounded-2xl shadow-xl p-6">
        <h1 className="text-lg font-semibold text-white mb-1">Pass Verification</h1>
        <p className="text-xs text-gray-400 mb-6">
          Scan result for <span className="font-mono text-gray-200">{passId}</span>
        </p>

        {loading && (
          <div className="flex items-center gap-3 text-yellow-200">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Fetching details...</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 text-red-300 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-4">
            <div className="bg-black/40 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wide text-yellow-200">Event</div>
              <div className="text-base font-semibold text-white">{data.eventName || '—'}</div>
            </div>

            <div className="bg-black/40 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wide text-yellow-200">User</div>
              <div className="text-sm text-gray-200">{data.user?.name || '—'}</div>
              <div className="text-sm text-gray-400">{data.user?.email || '—'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
