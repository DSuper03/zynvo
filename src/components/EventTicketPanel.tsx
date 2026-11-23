'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import EventBadgeCard from '@/components/ticket';

interface EventTicketPanelProps {
  eventName: string;
  /** ISO date string of the event start. */
  startDate?: string;
  /** ISO date string of the event end (used for the Upcoming/Active/Past tag). */
  endDate?: string;
  clubName?: string;
  collegeName?: string;
  /** The registered student's unique pass id (what the QR code encodes). */
  passId: string;
  attendeeName?: string;
  attendeeCollege?: string;
  attendeeAvatar?: string;
}

/**
 * The same pass the student sees on their profile/dashboard, shown on the
 * event page. Render only for a signed-in student who is registered for the
 * event and has a pass id.
 */
export default function EventTicketPanel({
  eventName,
  startDate,
  endDate,
  clubName,
  collegeName,
  passId,
  attendeeName,
  attendeeCollege,
  attendeeAvatar,
}: EventTicketPanelProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isQrGenerating, setIsQrGenerating] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsQrGenerating(true);
    (async () => {
      try {
        const QRCode = await import('qrcode');
        const toDataURL =
          (QRCode as any).toDataURL || (QRCode as any).default?.toDataURL;
        if (!toDataURL) throw new Error('QR toDataURL not available');
        const value = `${window.location.origin}/verify-pass/${encodeURIComponent(passId)}`;
        const dataUrl = await toDataURL(value, { margin: 1, width: 160 });
        if (!cancelled) setQrCodeDataUrl(dataUrl);
      } catch {
        if (!cancelled) setQrCodeDataUrl(null);
      } finally {
        if (!cancelled) setIsQrGenerating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [passId]);

  const status = useMemo<'upcoming' | 'active' | 'past'>(() => {
    const now = Date.now();
    const start = startDate ? new Date(startDate).getTime() : NaN;
    // Treat the whole end day as active, like the event page does.
    const endDay = endDate ? String(endDate).slice(0, 10) : '';
    const end = endDay ? new Date(`${endDay}T23:59:59.999`).getTime() : NaN;
    if (!Number.isNaN(end) && now > end) return 'past';
    if (!Number.isNaN(start) && now < start) return 'upcoming';
    return Number.isNaN(start) && Number.isNaN(end) ? 'upcoming' : 'active';
  }, [startDate, endDate]);

  const timings = useMemo(() => {
    if (!startDate) return '';
    const d = new Date(startDate);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
  }, [startDate]);

  const handleDownload = async () => {
    if (!badgeRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const htmlToImage = await import('html-to-image');
      const dataUrl = await htmlToImage.toPng(badgeRef.current, {
        cacheBust: true,
        skipFonts: false,
      });
      const link = document.createElement('a');
      link.download = `${eventName || 'event-ticket'}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error('Could not download the ticket. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section
      aria-labelledby="event-ticket-title"
      className="mt-4 rounded-xl border border-gray-800 bg-gray-900/80 p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3
          id="event-ticket-title"
          className="flex items-center gap-2 text-sm font-semibold text-white"
        >
          <Ticket className="h-4 w-4 text-yellow-400" aria-hidden />
          Your ticket
        </h3>
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading || isQrGenerating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-yellow-500 disabled:opacity-60"
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          {isDownloading ? 'Saving…' : 'Download'}
        </button>
      </div>
      <p className="mb-3 text-xs text-gray-400">
        Show this QR code at the venue to check in.
      </p>
      <div ref={badgeRef}>
        <EventBadgeCard
          eventName={eventName || 'Event'}
          eventTimings={timings}
          collegeName={collegeName || ''}
          clubName={clubName || ''}
          profileImage={attendeeAvatar || ''}
          qrCodeImage={qrCodeDataUrl || undefined}
          isQrLoading={isQrGenerating}
          status={status}
          attendeeName={attendeeName}
          attendeeCollege={attendeeCollege}
        />
      </div>
    </section>
  );
}
