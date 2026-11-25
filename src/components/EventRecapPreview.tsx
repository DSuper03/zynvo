'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import CampusPreviewPlayLink from '@/components/CampusPreviewPlayLink';

type GalleryItem = { id: string; imageUrl: string; caption?: string | null };

export default function EventRecapPreview({ eventId }: { eventId: string }) {
  const eventPath = `/events/${encodeURIComponent(eventId)}`;
  const { data } = useQuery({
    queryKey: ['event-recap', eventId],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/v1${eventPath}/gallery`, { signal });
      if (!response.ok) throw new Error('Could not load the event gallery');
      const result: { data?: GalleryItem[] } = await response.json();
      return Array.isArray(result.data)
        ? result.data.filter((item) => item.imageUrl?.startsWith('https://')).slice(0, 3)
        : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (!data?.length) return null;

  return (
    <aside className="mb-6 space-y-3 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
      <h3 className="font-semibold text-white">See what happened</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {data.map((item) => (
          <figure key={item.id}>
            {/* Gallery uploads can use external hosts supported by the gallery page. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.caption || 'Event gallery photo'} loading="lazy" referrerPolicy="no-referrer" className="aspect-video w-full rounded-lg object-cover" />
            {item.caption && <figcaption className="mt-1 line-clamp-2 text-xs text-gray-300">{item.caption}</figcaption>}
          </figure>
        ))}
      </div>
      <p className="text-sm text-gray-300">Browse the gallery or explore more campus events on Zynvo for Android.</p>
      <div className="flex flex-wrap items-center gap-4">
        <Link href={`${eventPath}/gallery`} className="text-sm font-semibold text-yellow-300 underline">View full gallery</Link>
        <CampusPreviewPlayLink placement="event_recap" />
      </div>
    </aside>
  );
}
