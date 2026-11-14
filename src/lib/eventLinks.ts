const SITE_URL = 'https://zynvosocial.com';

/**
 * Public link for sharing an event: just /events/<id>.
 * The event page works logged out (signing in to register returns the user
 * to it), and a plain URL gets the event's own link preview instead of the
 * signup page's.
 */
export function eventShareUrl(eventId: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  return `${origin}/events/${encodeURIComponent(eventId)}`;
}
