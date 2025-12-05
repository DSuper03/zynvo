'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';
import { eventData } from '@/types/global-Interface';
import axios from 'axios';
import CreateEventButton from './components/createEventButton';
import CreateEventModal from './components/EventCreationModel';
import EventCard from './components/EventCard';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import NoTokenModal from '@/components/modals/remindModal';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


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
  const [userAttendedEventIds, setUserAttendedEventIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasTokenForModal, setHasTokenForModal] = useState(false);
  
  const router = useRouter();

  // Fetch token on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const session = sessionStorage.getItem('activeSession');
      
      if (storedToken) {
        setToken(storedToken);
        setHasTokenForModal(true);
      } else {
        // No token - user needs to sign up
        setHasTokenForModal(false);
        setIsAuthModalOpen(true);
        return;
      }
      
      if (session !== 'true') {
        // Has token but no session - user needs to sign in
        toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => router.push('/auth/signin'),
          },
        });
        setHasTokenForModal(true);
        setIsAuthModalOpen(true);
        return;
      }
    }
  }, [router]);

  // Fetch user data and attended events
  useEffect(() => {
    async function fetchUserData() {
      if (!token) return;
      
      try {
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (userResponse.data && (userResponse.data as any).user) {
          const userData = (userResponse.data as any).user;
          setCurrentUser(userData);
          
          // Extract attended event IDs from user data
          if (userData.eventAttended && Array.isArray(userData.eventAttended)) {
            const attendedIds = userData.eventAttended.map((attendance: any) => attendance.event.id);
            setUserAttendedEventIds(attendedIds);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    
    if (token) {
      fetchUserData();
    }
  }, [token]);

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

  // Helper function to check if user is attending an event
  const isUserAttendingEvent = (event: eventData): boolean => {
    if (!currentUser) return false;
    return userAttendedEventIds.includes(event.id);
  };

  // Helper function to get events for a specific date
  const getEventsForDate = (date: Date): eventData[] => {
    if (!events) return [];
    
    const targetDate = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    
    return events.filter(event => {
      if (!event.endDate) return false;
      const eventDate = new Date(event.endDate).toISOString().split('T')[0];
      return eventDate === targetDate;
    });
  };

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

        {/* Create Event Button and Check Event Dates Button */}
        <div className="flex justify-between items-center mb-8">
          {isLoading ? (
            <div className="flex gap-4">
              <div className="h-10 w-32 bg-gray-800 rounded animate-pulse" />
              <div className="h-10 w-40 bg-gray-800 rounded animate-pulse" />
            </div>
          ) : (
            <div className="flex gap-4">
              <CreateEventButton onClick={() => setIsModalOpen(true)} />
              <Button
                onClick={() => setIsCalendarModalOpen(true)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Check Event Dates
              </Button>
            </div>
          )}
        </div>

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Calendar Modal */}
        {isCalendarModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Event Calendar
                </h2>
                <Button
                  onClick={() => setIsCalendarModalOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg"
                >
                  ✕
                </Button>
              </div>
              
              <div className="mb-6">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-0 bg-transparent"
                  classNames={{
                    day: "text-white hover:bg-gray-700",
                    day_selected: "bg-yellow-500 text-black hover:bg-yellow-400",
                    day_today: "bg-gray-700 text-white",
                    day_outside: "text-gray-500",
                    day_disabled: "text-gray-600",
                    day_range_middle: "bg-gray-600 text-white",
                    day_range_start: "bg-yellow-500 text-black",
                    day_range_end: "bg-yellow-500 text-black",
                    caption: "text-white",
                    caption_label: "text-white",
                    nav_button: "text-white hover:bg-gray-700",
                    nav_button_previous: "text-white hover:bg-gray-700",
                    nav_button_next: "text-white hover:bg-gray-700",
                    table: "text-white",
                    head_row: "text-white",
                    head_cell: "text-gray-300",
                    row: "text-white",
                    cell: "text-white",
                    button: "text-white hover:bg-gray-700",
                  }}
                />
              </div>

              {/* Events for Selected Date */}
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-3">
                    Events on {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  
                  {(() => {
                    const eventsForDate = getEventsForDate(selectedDate);
                    return eventsForDate.length > 0 ? (
                      <div className="space-y-3">
                        {eventsForDate.map((event) => (
                          <div key={event.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-white font-medium mb-2">{event.EventName}</h4>
                                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                                  {event.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {event.endDate && (
                                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-500/30">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {new Date(event.endDate).toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </Badge>
                                  )}
                                  {event.univerisity && (
                                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-500/30">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {event.univerisity}
                                    </Badge>
                                  )}
                                  {event.clubName && (
                                    <Badge variant="outline" className="border-gray-500 text-gray-300">
                                      {event.clubName}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No events scheduled for this date</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setIsCalendarModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

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
            <EventCard 
              events={filteredEvents}
              isLoading={isLoading}
              error={error}
              searchTerm={searchTerm}
              isUserAttendingEvent={isUserAttendingEvent}
            />
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
      
      <NoTokenModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} hasToken={hasTokenForModal} />
    </div>
  );
}
