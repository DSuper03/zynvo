'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';
import { eventData } from '@/types/global-Interface';
import axios from 'axios';
import CreateEventButton from './components/createEventButton';
import CreateEventModal from './components/modals';
import EventCard from './components/EventCard';
import { Button } from '@/components/ui/button';

interface apiRespEvents {
  msg: string;
  response: eventData[];
  totalPages: number;
}

const EventCardSkeleton = () => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-200">
      <div className="relative h-48 bg-gray-800">
        <div className="absolute top-3 right-3">
          <div className="w-16 h-6 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-800 rounded animate-pulse" />
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-600" />
          <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <div className="h-4 w-28 bg-gray-800 rounded animate-pulse" />
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="h-8 w-20 bg-gray-800 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const EventsGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }, (_, index) => (
        <EventCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
};

const SearchFilterSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:gap-4 mb-6 md:mb-8">
      <div className="relative w-full md:w-1/2">
        <div className="h-10 w-full bg-gray-800 rounded-lg animate-pulse" />
      </div>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4">
        <div className="h-10 w-full md:w-64 bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </div>
  );
};

export default function ZynvoEventsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [events, setEvents] = useState<eventData[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get<apiRespEvents>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/all?page=${currentPage}`,
          {
            timeout: 10000, // 10 second timeout
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!isMounted) return; // Prevent state update if component is unmounted

        if (response.data && Array.isArray(response.data.response)) {
          setEvents(response.data.response);
          setTotalPages(response.data.totalPages || 1);
        } else {
          console.warn('Unexpected API response structure:', response.data);
          setEvents([]);
          setTotalPages(1);
        }
      } catch (err) {
        if (!isMounted) return;

        console.error('Error fetching events:', err);

        setEvents([]);
      } finally {
        if (isMounted) {
          // Add minimum loading time for better UX
          setTimeout(() => {
            if (isMounted) setIsLoading(false);
          }, 500);
        }
      }
    }

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  // Replace the filteredEvents computation with name-only search
  const filteredEvents = (events || []).filter((event) => {
    if (!event?.EventName) return false;
    const name = String(event.EventName).toLowerCase();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return name.includes(query);
  });

  const handleRetry = () => {
    setError(null);
    setEvents(null);
    setIsLoading(true);

    setCurrentPage((prev) => (prev === 1 ? 1 : prev));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen  text-white">
      <main className="max-w-7xl mx-auto py-4 md:py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header with Banner */}
        <div className="mb-4 md:mb-8">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 md:h-10 w-64 bg-gray-800 mb-2 rounded animate-pulse" />
              <div className="h-4 md:h-5 w-96 max-w-full bg-gray-800 rounded animate-pulse" />
            </div>
          ) : (
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-[22rem] rounded-xl overflow-hidden">
              <Image
                src="/banners/bannerdesign1.png"
                alt="Events banner"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  Upcoming Events
                </h1>
                <p className="text-sm md:text-base text-gray-200">
                  Discover and register for the events you would like to attend
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Create Event Button */}
        <div className="flex justify-between items-center mb-8">
          {isLoading ? (
            <div className="h-10 w-32 bg-gray-800 rounded animate-pulse" />
          ) : (
            <CreateEventButton onClick={() => setIsModalOpen(true)} />
          )}
        </div>

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Search and Filter Bar */}
        {isLoading ? (
          <SearchFilterSkeleton />
        ) : (
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:gap-4 mb-6 md:mb-8">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                placeholder="Search events..."
              />
            </div>
            <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4">
              {/* keep empty if no extra filters */}
            </div>
          </div>
        )}

        {/* Decorative banner strip above the events grid */}

        {/* Events Grid - Main Content */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <EventsGridSkeleton />
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Error Loading Events
              </h3>
              <p className="text-gray-400 mb-4 max-w-md mx-auto">{error}</p>
              <Button
                onClick={handleRetry}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </Button>
            </div>
          ) : filteredEvents.length > 0 ? (
            // Pass the filtered events to EventCard
            <EventCard />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No Events Found
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {searchTerm
                  ? `No events match your search "${searchTerm}". Try different keywords.`
                  : 'No events available at the moment. Check back later!'}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Pagination Controls */}

        {!isLoading && !error && totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8 py-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Previous
            </Button>

            {/* Page numbers with smart truncation */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = idx + 1;
              } else if (currentPage <= 3) {
                pageNumber = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + idx;
              } else {
                pageNumber = currentPage - 2 + idx;
              }

              return (
                <Button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-yellow-500 text-black font-bold'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
