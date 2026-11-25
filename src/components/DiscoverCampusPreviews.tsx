'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import CampusPreviewPlayLink from '@/components/CampusPreviewPlayLink';

type CampusEvent = {
  id: string;
  EventName: string;
  startDate: string;
  Venue?: string | null;
  applicationStatus?: string | null;
};

const campusDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Kolkata' });

function eventDay(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  return Number.isFinite(date.valueOf()) ? campusDate.format(date) : null;
}

function TodayEvents() {
  const today = campusDate.format(new Date());
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['discover-events-today', today],
    queryFn: async ({ signal }) => {
      const response = await fetch('/api/v1/events/search?upcoming=true&limit=50', { signal });
      if (!response.ok) throw new Error('Could not load events');
      const result: { response?: CampusEvent[] } = await response.json();
      if (!Array.isArray(result.response)) throw new Error('Invalid events response');
      return result.response.filter((event) =>
        eventDay(event.startDate) === today &&
        !['draft', 'canceled', 'cancelled'].includes(event.applicationStatus?.trim().toLowerCase() ?? '')
      ).slice(0, 3);
    },
    staleTime: 60_000,
  });

  if (isPending) return <p role="status" className="text-sm text-gray-300">Looking for events today?</p>;
  if (isError) {
    return <button type="button" onClick={() => refetch()} className="text-sm text-yellow-300 underline">Could not load events. Try again</button>;
  }
  if (!data.length) {
    return <Link href="/events" className="text-sm text-yellow-300 underline">No matches in the latest listings. Browse all events</Link>;
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2 text-sm">
        {data.map((event) => (
          <li key={event.id}>
            <Link href={`/events/${encodeURIComponent(event.id)}`} className="font-semibold text-yellow-300 hover:underline">{event.EventName}</Link>
            {event.Venue && <p className="text-gray-300">{event.Venue}</p>}
          </li>
        ))}
      </ul>
      <CampusPreviewPlayLink placement="discover_today" />
    </div>
  );
}

const sampleAnswers = ['Grab chai with a friend', 'Try a club meetup', 'Find a quiet corner'];

export default function DiscoverCampusPreviews() {
  const [showToday, setShowToday] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <section aria-label="Campus ideas" className="mb-5 grid gap-3 sm:grid-cols-2">
      <div className="space-y-3 rounded-xl border border-yellow-400/20 bg-neutral-950 p-4">
        <h2 className="font-semibold text-white">Free between classes?</h2>
        <button
          type="button"
          aria-expanded={showToday}
          onClick={() => setShowToday((shown) => !shown)}
          className="text-sm font-semibold text-yellow-300 underline underline-offset-4"
        >
          {showToday ? 'Hide events' : 'See what starts today'}
        </button>
        {showToday && <TodayEvents />}
      </div>
      <div className="space-y-3 rounded-xl border border-yellow-400/20 bg-neutral-950 p-4">
        <p className="text-xs font-semibold text-yellow-300">Campus Drop sample</p>
        <h2 className="font-semibold text-white">A class gets cancelled. What do you do?</h2>
        <div role="group" aria-label="Sample answers" className="flex flex-wrap gap-2">
          {sampleAnswers.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={answer === option}
              onClick={() => setAnswer(option)}
              className="rounded-full border border-white/25 px-3 py-1.5 text-xs text-white hover:bg-white/10 aria-pressed:border-yellow-400 aria-pressed:text-yellow-300"
            >
              {option}
            </button>
          ))}
        </div>
        {answer && (
          <div className="space-y-2">
            <p role="status" className="text-sm text-gray-300">Your pick: {answer}. In a live Drop, you can compare your answer with your campus.</p>
            <CampusPreviewPlayLink placement="discover_drop_sample" />
          </div>
        )}
      </div>
    </section>
  );
}
