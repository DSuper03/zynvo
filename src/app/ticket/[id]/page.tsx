'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import EventBadgeCard from '@/components/ticket';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Download, Eye, Loader2, Share2 } from 'lucide-react';

type EventData = {
  eventName: string;
  clubName: string;
  collegeName: string;
  startDate: Date;
  profilePic: string;
  status?: 'upcoming' | 'active' | 'past';
};

export default function Page() {
  const params = useParams();
  const rawId = (params as Record<string, string | string[]>).id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [data, setData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'active' | 'past'>('all');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    async function call() {
      try {
        const res = await axios.get<{ data: EventData }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/event-details?id=${id}`
        );
        if (res.data?.data) {
          const eventData = res.data.data;
          const start = new Date(eventData.startDate);
          const status: EventData['status'] =
            start.getTime() > Date.now()
              ? 'upcoming'
              : Math.abs(start.getTime() - Date.now()) < 1000 * 60 * 60 * 12
              ? 'active'
              : 'past';
          setData({ ...eventData, startDate: start, status });
        }
      } catch (err) {
        setError('Unable to load ticket. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    call();
  }, [id]);

  const handleDownload = async () => {
    if (badgeRef.current) {
      const htmlToImage = await import('html-to-image');
      const dataUrl = await htmlToImage.toPng(badgeRef.current, {
        cacheBust: true,
        skipFonts: false,
      });
      const link = document.createElement('a');
      link.download = `${data?.eventName || 'event-badge'}.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    }
  };

  const handleShare = () => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.href : ''}`;
    if (navigator.share) {
      navigator
        .share({
          title: data?.eventName || 'Zynvo Ticket',
          text: 'Your ticket is ready. Scan the QR to check in.',
          url: shareUrl,
        })
        .catch(() => null);
    } else {
      navigator.clipboard?.writeText(shareUrl).catch(() => null);
    }
  };

  const filteredVisible = useMemo(() => {
    if (!data) return null;
    const matchesSearch =
      !search ||
      data.eventName.toLowerCase().includes(search.toLowerCase()) ||
      data.clubName.toLowerCase().includes(search.toLowerCase()) ||
      data.collegeName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || data.status === statusFilter;
    return matchesSearch && matchesStatus ? data : null;
  }, [data, search, statusFilter]);

  const renderStatusPill = (status?: EventData['status']) => {
    if (!status) return null;
    const map = {
      upcoming: 'bg-yellow-400 text-black',
      active: 'bg-green-400 text-black',
      past: 'bg-gray-300 text-black',
    };
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>{label}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#050505] text-white">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-black/70 border-b border-yellow-500/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-400 text-black font-extrabold flex items-center justify-center shadow-lg">
              Z
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-yellow-200">Ticket Center</p>
              <h1 className="text-lg font-semibold text-white">Your Zynvo Ticket</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {renderStatusPill(data?.status)}
            <Button
              variant="outline"
              className="border-yellow-400/60 text-yellow-200 hover:bg-yellow-500 hover:text-black"
              onClick={() => setPreviewOpen((p) => !p)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick preview
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="text-xs uppercase tracking-wide text-yellow-200">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event, club, or college"
              className="mt-2 w-full rounded-xl border border-yellow-500/30 bg-black/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-yellow-200">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="mt-2 w-full rounded-xl border border-yellow-500/30 bg-black/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-black/50 border border-yellow-500/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-yellow-200">Ticket</p>
                <h2 className="text-xl font-semibold text-white">Preview & Download</h2>
              </div>
              {downloaded ? (
                <span className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" /> Saved
                </span>
              ) : null}
            </div>

            <div
              className="bg-gradient-to-br from-[#111] to-black rounded-2xl border border-yellow-500/10 p-6"
              aria-live="polite"
              aria-busy={loading}
            >
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-yellow-200">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-sm">Loading your ticket…</p>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-3 text-red-300 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              {!loading && !error && filteredVisible && (
                <div ref={badgeRef} className="flex justify-center">
                  <EventBadgeCard
                    eventName={filteredVisible.eventName || 'Tech Fest'}
                    eventTimings={
                      filteredVisible.startDate
                        ? new Date(filteredVisible.startDate).toLocaleString()
                        : 'Date to be announced'
                    }
                    collegeName={filteredVisible.collegeName || 'Campus'}
                    clubName={filteredVisible.clubName || 'Club'}
                    profileImage={filteredVisible.profilePic || 'https://i.pravatar.cc/300'}
                    qrCodeImage={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://zynvo.social/verify-event/${id}`}
                    status={filteredVisible.status}
                  />
                </div>
              )}
              {!loading && !error && !filteredVisible && (
                <div className="text-sm text-yellow-200/80 py-6">No ticket matches your search/filter.</div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold flex items-center justify-center gap-2 py-3 text-sm"
                onClick={handleDownload}
                disabled={!filteredVisible || loading}
              >
                <Download className="h-4 w-4" />
                One-click download
              </Button>
              <Button
                variant="outline"
                className="border-yellow-400/60 text-yellow-200 hover:bg-yellow-500 hover:text-black flex items-center justify-center gap-2 py-3 text-sm"
                onClick={handleShare}
                disabled={!filteredVisible || loading}
              >
                <Share2 className="h-4 w-4" />
                Share ticket
              </Button>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Tip: QR is optimized for mobile entry. Keep brightness high at check-in.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#0c0c0c] border border-yellow-500/15 rounded-2xl p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-white">Ticket details</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-200">
                <li className="flex items-start justify-between gap-3">
                  <span className="text-gray-400">Event</span>
                  <span className="font-semibold text-white text-right">{data?.eventName || 'Loading…'}</span>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="text-gray-400">Date & time</span>
                  <span className="font-semibold text-white text-right">
                    {data?.startDate ? new Date(data.startDate).toLocaleString() : '—'}
                  </span>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="text-gray-400">College</span>
                  <span className="font-semibold text-white text-right">{data?.collegeName || '—'}</span>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="text-gray-400">Club</span>
                  <span className="font-semibold text-white text-right">{data?.clubName || '—'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0c0c0c] border border-yellow-500/15 rounded-2xl p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-white">Fast actions</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <button
                  className="rounded-xl border border-yellow-500/30 bg-black/40 px-4 py-3 text-yellow-200 hover:bg-yellow-500 hover:text-black transition"
                  onClick={() => setPreviewOpen(true)}
                >
                  Quick view
                </button>
                <button
                  className="rounded-xl border border-yellow-500/30 bg-black/40 px-4 py-3 text-yellow-200 hover:bg-yellow-500 hover:text-black transition"
                  onClick={handleShare}
                >
                  Share link
                </button>
                <button
                  className="rounded-xl border border-yellow-500/30 bg-black/40 px-4 py-3 text-yellow-200 hover:bg-yellow-500 hover:text-black transition"
                  onClick={handleDownload}
                  disabled={!filteredVisible || loading}
                >
                  Save to device
                </button>
                <button
                  className="rounded-xl border border-yellow-500/30 bg-black/40 px-4 py-3 text-yellow-200 hover:bg-yellow-500 hover:text-black transition"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Works great on mobile — buttons are sized for thumb taps (44px+).
              </p>
            </div>
          </div>
        </div>
      </main>

      {previewOpen && filteredVisible && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative bg-[#0b0b0b] border border-yellow-500/30 rounded-3xl p-6 w-full max-w-xl shadow-2xl">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-3 right-3 text-gray-300 hover:text-white"
              aria-label="Close preview"
            >
              ✕
            </button>
            <div className="flex flex-col items-center gap-4">
              <EventBadgeCard
                eventName={filteredVisible.eventName}
                eventTimings={
                  filteredVisible.startDate
                    ? new Date(filteredVisible.startDate).toLocaleString()
                    : 'Date to be announced'
                }
                collegeName={filteredVisible.collegeName}
                clubName={filteredVisible.clubName}
                profileImage={filteredVisible.profilePic}
                qrCodeImage={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://zynvo.social/verify-event/${id}`}
                status={filteredVisible.status}
              />
              <div className="flex flex-wrap gap-3 w-full">
                <Button
                  className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold flex items-center gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="border-yellow-400/60 text-yellow-200 hover:bg-yellow-500 hover:text-black flex items-center gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={() => setPreviewOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
