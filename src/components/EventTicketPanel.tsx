'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import EventBadgeCard from '@/components/ticket';
import { ticketLock } from '@/lib/ticketAccess';

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
  /**
   * When an organiser scanned this pass. null = not scanned yet,
   * undefined = the server didn't say (show no check-in state).
   */
  checkedInAt?: string | null;
  /** Registration approval ("pending" | "approved" | "rejected"); undefined = not sent. */
  approvalStatus?: string | null;
  /** Payment state of a paid event ("PENDING" | "CONFIRMED" | "REJECTED"). */
  paymentStatus?: string | null;
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
  checkedInAt,
  approvalStatus,
  paymentStatus,
}: EventTicketPanelProps) {
  // No QR until the club head/core team approves (and payment clears).
  const lock = ticketLock(approvalStatus, paymentStatus);
  const isLocked = lock !== null;
  const checkInState: 'awaiting' | 'checked_in' | undefined = checkedInAt
    ? 'checked_in'
    : checkedInAt === null
      ? 'awaiting'
      : undefined;
  const checkedInTime = checkedInAt ? new Date(checkedInAt) : null;
  const badgeRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isQrGenerating, setIsQrGenerating] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (isLocked) {
      setQrCodeDataUrl(null);
      setIsQrGenerating(false);
      return;
    }
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
  }, [passId, isLocked]);

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

  if (lock) {
    return (
      <section
        aria-labelledby="event-ticket-title"
        className="mt-4 rounded-xl border border-gray-800 bg-gray-900/80 p-4"
      >
        <h3
          id="event-ticket-title"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"
        >
          <Ticket className="h-4 w-4 text-yellow-400" aria-hidden />
          Your ticket
        </h3>
        <p
          aria-live="polite"
          className={`text-sm font-semibold ${lock.tone === 'rejected' ? 'text-red-400' : 'text-yellow-300'}`}
        >
          {lock.title}
        </p>
        <p className="mt-1 text-xs text-gray-400">{lock.message}</p>
      </section>
    );
  }

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
      <p
        aria-live="polite"
        className={`mb-3 text-xs ${checkInState === 'checked_in' ? 'text-emerald-300' : 'text-gray-400'}`}
      >
        {checkInState === 'checked_in'
          ? `You're checked in${
              checkedInTime && !Number.isNaN(checkedInTime.getTime())
                ? ` (${checkedInTime.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })})`
                : ''
            }. Enjoy the event!`
          : 'Show this QR code at the venue to check in.'}
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
          checkInState={checkInState}
        />
      </div>
    </section>
  );
}
