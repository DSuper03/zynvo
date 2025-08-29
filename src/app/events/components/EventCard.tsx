'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Filter,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { Modal, ModalTrigger } from '@/components/ui/animated-modal';
import { eventData } from '@/types/global-Interface';
import Image from 'next/legacy/image';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
interface apiRespEvents {
  msg: string;
  response: eventData[];
}

export default function EventCard() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [events, setEvents] = useState<eventData[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<apiRespEvents>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/all`
        );
        setEvents(response.data.response);
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Filter events based on active filter and search term
  const filteredEvents = events?.filter((event) => {
    const matchesSearch =
      event.EventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'registered') {
      // Add logic to check if user is registered for this event
      return matchesSearch; // Placeholder - implement actual logic
    }
    if (activeFilter === 'upcoming') {
      // Add logic to check if user is NOT registered for this event
      return matchesSearch; // Placeholder - implement actual logic
    }

    return matchesSearch;
  });

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md"
            >
              <Skeleton className="w-full h-48 sm:h-40 rounded-none bg-gray-700" />
              <div className="p-4 md:p-5 space-y-3">
                <Skeleton className="h-6 w-3/4 rounded-md bg-gray-700" />
                <Skeleton className="h-4 w-full rounded-md bg-gray-700" />
                <Skeleton className="h-4 w-5/6 rounded-md bg-gray-700" />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 rounded-full mr-2 bg-gray-700" />
                    <Skeleton className="h-4 w-32 rounded-md bg-gray-700" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 rounded-full mr-2 bg-gray-700" />
                    <Skeleton className="h-4 w-40 rounded-md bg-gray-700" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-20 rounded-md bg-gray-700" />
                  <Skeleton className="h-8 w-24 rounded-md bg-gray-700" />
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-10">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <Image
                  src="/logozynvo.jpg"
                  alt={event.description || event.EventName}
                  width={600}
                  height={300}
                  className="w-full h-48 sm:h-40 object-cover"
                  priority={false}
                />
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {event.EventName}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {event.description || 'No description available'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
                    <span className="truncate">
                      Deadline: {event.endDate ? formatDate(event.endDate) : ''}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
                    <span className="truncate">
                      {event.clubName
                        ? `${event.clubName}'s College`
                        : 'Location TBD'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs md:text-sm">
                    {event.attendees?.length || 0} attending
                  </span>
                  <Button className="px-3 md:px-2 py-2 text-sm rounded-md font-medium bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors">
                    Register
                  </Button>
                  <Button
                    className="bg-black text-white font-bold  rounded-2xl"
                    onClick={() => {
                      router.push(`events/${event.id}`);
                    }}
                  >
                    Check
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-400 text-lg">
              {searchTerm
                ? 'No events found matching your search'
                : 'No events found'}
            </p>
            {searchTerm && (
              <button
                className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
