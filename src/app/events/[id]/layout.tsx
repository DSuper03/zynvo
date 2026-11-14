import type { Metadata } from 'next';
import EventLayoutShell from './EventLayoutShell';

const SITE_URL = 'https://zynvosocial.com';
const DEFAULT_IMAGE = `${SITE_URL}/zynvo-new-logo.png`;

type EventPreview = {
  EventName?: string | null;
  tagline?: string | null;
  description?: string | null;
  clubName?: string | null;
  university?: string | null;
  Venue?: string | null;
  EventMode?: string | null;
  startDate?: string | null;
  posterUrl?: string | null;
};

const backendBase = () =>
  (process.env.BACKEND_BASE_URL || 'https://zynvo-backend-worker.anirbanghosh060.workers.dev').replace(/\/$/, '');

/** Public event fields for link previews; null if unavailable (never blocks the page for long). */
async function fetchEventPreview(id: string): Promise<EventPreview | null> {
  try {
    const res = await fetch(`${backendBase()}/api/v1/events/event/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.response as EventPreview) ?? null;
  } catch {
    return null;
  }
}

const usable = (v?: string | null) => (v && v.trim() && v.trim().toLowerCase() !== 'none' ? v.trim() : null);

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
}

/**
 * Server-rendered meta tags for /events/[id] so shared links show the event
 * (title, club, date, poster) in WhatsApp, Instagram, LinkedIn, X, etc.
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const url = `${SITE_URL}/events/${encodeURIComponent(id)}`;
  const event = await fetchEventPreview(id);

  if (!event || !usable(event.EventName)) {
    return {
      title: 'Event on Zynvo',
      description: 'Discover and register for college events on Zynvo.',
      alternates: { canonical: url },
      openGraph: { title: 'Event on Zynvo', url, siteName: 'Zynvo', type: 'website', images: [DEFAULT_IMAGE] },
    };
  }

  const name = usable(event.EventName)!;
  const host = usable(event.clubName) || usable(event.university);
  const title = host ? `${name} · ${host}` : name;

  const when = formatDate(event.startDate);
  const where = usable(event.Venue) || usable(event.EventMode);
  const summary = usable(event.tagline) || usable(event.description) || 'Register on Zynvo.';
  const description = clip([[when, where].filter(Boolean).join(' · '), summary].filter(Boolean).join(' — '), 200);

  const poster = usable(event.posterUrl);
  const image = poster && /^https:\/\//i.test(poster) ? poster : DEFAULT_IMAGE;

  return {
    title: `${title} | Zynvo`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Zynvo',
      type: 'website',
      images: [{ url: image, alt: name }],
    },
    twitter: {
      card: poster ? 'summary_large_image' : 'summary',
      title,
      description,
      images: [image],
    },
  };
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <EventLayoutShell>{children}</EventLayoutShell>;
}
