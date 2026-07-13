'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, MapPin, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';
import { eventData } from '@/types/global-Interface';
import axios, { isAxiosError } from 'axios';
import CreateEventButton from './components/createEventButton';
import CreateEventModal from './components/EventCreationModel';
import EventCard from './components/EventCard';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import NoTokenModal from '@/components/modals/remindModal';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { buildAuthHref } from '@/lib/authReturnTo';
import { EmptyState, ErrorState } from '@/components/feedback';
import { cn } from '@/lib/utils';


interface apiRespEvents {
  msg: string;
  response: eventData[];
  totalPages: number;
}

/** Local calendar key YYYY-MM-DD (avoids UTC shift from toISOString). */
function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function dateKeyFromEventField(value: unknown): string | null {
  if (value == null || value === '') return null;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return null;
  return toLocalDateKey(parsed);
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
  const [fetchNonce, setFetchNonce] = useState(0);

  // Search-specific state
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<eventData[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();
  const pathname = usePathname();

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
            onClick: () =>
              router.push(buildAuthHref('/auth/signin', pathname)),
          },
        });
        setHasTokenForModal(true);
        setIsAuthModalOpen(true);
        return;
      }
    }
  }, [router, pathname]);

  // Fetch user data and attended events
  useEffect(() => {
    async function fetchUserData() {
      if (!token) return;
      
      try {
        const userResponse = await axios.get(
          `/api/v1/user/getUser`,
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
          `/api/v1/events/all?page=${currentPage}`,
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
        const message =
          isAxiosError(err) && err.response?.data
            ? (typeof (err.response.data as { msg?: string }).msg === 'string'
                ? (err.response.data as { msg: string }).msg
                : null)
            : null;
        setError(
          message ||
            'Could not load events. Check your connection and try again.'
        );
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
  }, [currentPage, fetchNonce]);

  // Backend-powered debounced search
  const runSearch = useCallback(async (term: string, page: number) => {
    if (!term.trim()) {
      setIsSearchMode(false);
      setSearchResults([]);
      setSearchTotal(0);
      setSearchPage(1);
      setSearchTotalPages(1);
      return;
    }
    setIsSearchMode(true);
    setIsSearchLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q: term.trim(), page: String(page), limit: '12' });
      const res = await axios.get<{ response: eventData[]; total: number; totalPages: number }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/search?${params}`,
        { timeout: 10000 }
      );
      setSearchResults(res.data.response ?? []);
      setSearchTotal(res.data.total ?? 0);
      setSearchTotalPages(res.data.totalPages ?? 1);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      setSearchTotal(0);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchTerm.trim()) {
      setIsSearchMode(false);
      setSearchResults([]);
      setSearchPage(1);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setSearchPage(1);
      runSearch(searchTerm, 1);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchTerm, runSearch]);

  // Re-run search when search page changes (only if in search mode)
  useEffect(() => {
    if (isSearchMode && searchTerm.trim()) {
      runSearch(searchTerm, searchPage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchPage]);

  // Helper function to check if user is attending an event
  const isUserAttendingEvent = (event: eventData): boolean => {
    if (!currentUser) return false;
    return userAttendedEventIds.includes(event.id);
  };

  // Helper function to get events for a specific date (local calendar day)
  const getEventsForDate = (date: Date): eventData[] => {
    if (!events) return [];
    const targetKey = toLocalDateKey(date);
    return events.filter((event) => {
      const startKey = dateKeyFromEventField(event.startDate);
      const endKey = dateKeyFromEventField(event.endDate);
      return startKey === targetKey || endKey === targetKey;
    });
  };

  /** Days that have at least one event (for calendar dots). */
  const eventCalendarKeys = new Set<string>();
  for (const ev of events ?? []) {
    const s = dateKeyFromEventField(ev.startDate);
    const e = dateKeyFromEventField(ev.endDate);
    if (s) eventCalendarKeys.add(s);
    if (e) eventCalendarKeys.add(e);
  }
  const hasEventsMatcher = (check: Date) => eventCalendarKeys.has(toLocalDateKey(check));

  // Displayed events depend on whether we are in search mode or normal browse mode
  const displayedEvents = isSearchMode ? searchResults : (events || []);
  const displayedTotalPages = isSearchMode ? searchTotalPages : totalPages;
  const displayedCurrentPage = isSearchMode ? searchPage : currentPage;
  const displayedIsLoading = isSearchMode ? isSearchLoading : isLoading;

  const handleRetry = () => {
    setError(null);
    setEvents(null);
    setFetchNonce((n) => n + 1);
  };

  const handlePageChange = (newPage: number) => {
    if (isSearchMode) {
      if (newPage >= 1 && newPage <= searchTotalPages && newPage !== searchPage) {
        setSearchPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
                type="button"
                onClick={() => setIsCalendarModalOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-yellow-500/35 bg-yellow-400/15 px-4 py-2.5 font-semibold text-yellow-50 shadow-[0_0_0_1px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-colors hover:bg-yellow-400/25 hover:border-yellow-400/55"
              >
                <Calendar className="size-4 text-yellow-300" aria-hidden />
                Event calendar
              </Button>
            </div>
          )}
        </div>

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Event calendar overlay */}
        {isCalendarModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overflow-x-hidden bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-4"
            role="presentation"
            onClick={() => setIsCalendarModalOpen(false)}
          >
            <div
              role="dialog"
              aria-labelledby="events-calendar-heading"
              aria-modal="true"
              className="mx-auto my-4 flex w-full max-w-5xl max-h-[min(88dvh,calc(100svh-2rem))] flex-col overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950 shadow-2xl shadow-black/50 ring-1 ring-white/[0.06] sm:mx-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative shrink-0 overflow-hidden border-b border-zinc-800 bg-gradient-to-r from-yellow-400/14 via-transparent to-transparent px-4 py-4 sm:px-8 sm:py-5">
                <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-yellow-400/10 blur-3xl" />
                <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <h2
                      id="events-calendar-heading"
                      className="flex min-w-0 flex-wrap items-center gap-2 text-lg font-bold tracking-tight text-white sm:text-2xl"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-yellow-500/35 bg-yellow-400/15 sm:size-11">
                        <Calendar className="size-5 text-yellow-300 sm:size-6" aria-hidden />
                      </span>
                      <span className="min-w-0 break-words">Browse by date</span>
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                      Tap a date to see events. Days with{' '}
                      <span className="font-medium text-yellow-200/95">●</span> have at least one listing on the
                      current page. Weeks start Monday.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCalendarModalOpen(false)}
                    className="shrink-0 rounded-full px-4 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    aria-label="Close calendar"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
                <div className="grid min-w-0 lg:[grid-template-columns:minmax(26rem,min(34rem,55%))_minmax(0,1fr)]">
                  {/* Calendar column — lg track minimum must include lg horizontal padding (~4rem), card padding (~1rem), and 7×3rem cells */}
                  <div className="min-w-0 max-w-full border-b border-zinc-800 p-4 sm:p-6 lg:min-w-0 lg:border-b-0 lg:border-r lg:p-8">
                    <div className="mx-auto max-w-full overflow-x-visible overflow-y-visible rounded-xl border border-yellow-500/15 bg-black/55 p-2 pb-3 ring-1 ring-inset ring-white/[0.04]">
                      <div
                        className={cn(
                          '[&_[data-slot=calendar]]:mx-auto [&_[data-slot=calendar]]:w-full [&_[data-slot=calendar]]:min-w-0 [&_[data-slot=calendar]]:max-w-full',
                          '[&_[data-slot=calendar]]:[--cell-size:2.45rem]',
                          'sm:[&_[data-slot=calendar]]:[--cell-size:2.75rem]',
                          'lg:[&_[data-slot=calendar]]:[--cell-size:3rem]',
                          '[&_[data-slot=calendar]_nav]:mx-auto [&_[data-slot=calendar]_nav]:mb-3 [&_[data-slot=calendar]_nav]:flex [&_[data-slot=calendar]_nav]:w-full [&_[data-slot=calendar]_nav]:max-w-full [&_[data-slot=calendar]_nav]:items-center [&_[data-slot=calendar]_nav]:justify-between [&_[data-slot=calendar]_nav]:gap-2 [&_[data-slot=calendar]_nav_button]:size-9 [&_[data-slot=calendar]_nav_button]:shrink-0 sm:[&_[data-slot=calendar]_nav_button]:size-11 [&_[data-slot=calendar]_nav_button]:rounded-xl [&_[data-slot=calendar]_nav_button]:border [&_[data-slot=calendar]_nav_button]:border-zinc-600 [&_[data-slot=calendar]_nav_button]:bg-zinc-900 [&_[data-slot=calendar]_nav_button]:text-zinc-100 [&_[data-slot=calendar]_nav_button]:hover:bg-zinc-800 [&_[data-slot=calendar]_nav_button]:transition-colors',
                          '[&_[data-slot=calendar]_month]:min-w-0 [&_[data-slot=calendar]_month]:gap-3',
                          '[&_[data-slot=calendar]_month_caption]:mb-2 [&_[data-slot=calendar]_caption_label]:px-1 [&_[data-slot=calendar]_caption_label]:text-center [&_[data-slot=calendar]_caption_label]:text-sm [&_[data-slot=calendar]_caption_label]:font-semibold [&_[data-slot=calendar]_caption_label]:text-white sm:[&_[data-slot=calendar]_caption_label]:text-base',
                          '[&_[data-slot=calendar]_weekdays]:w-full [&_[data-slot=calendar]_weekday]:min-w-0 [&_[data-slot=calendar]_weekday]:flex-1 [&_[data-slot=calendar]_weekday]:text-center [&_[data-slot=calendar]_weekday]:text-[10px] sm:[&_[data-slot=calendar]_weekday]:text-[11px] [&_[data-slot=calendar]_weekday]:font-semibold [&_[data-slot=calendar]_weekday]:uppercase [&_[data-slot=calendar]_weekday]:tracking-wide [&_[data-slot=calendar]_weekday]:text-zinc-500',
                          '[&_[data-slot=calendar]_week]:w-full [&_[data-slot=calendar]_day]:min-w-0 [&_[data-slot=calendar]_day]:p-px',
                          '[&_[data-slot=calendar]_day_button]:w-full [&_[data-slot=calendar]_day_button]:min-h-[var(--cell-size)] [&_[data-slot=calendar]_day_button]:max-h-[var(--cell-size)] [&_[data-slot=calendar]_day_button]:min-w-0 [&_[data-slot=calendar]_day_button]:max-w-full [&_[data-slot=calendar]_day_button]:rounded-lg sm:[&_[data-slot=calendar]_day_button]:rounded-xl [&_[data-slot=calendar]_day_button]:p-0 [&_[data-slot=calendar]_day_button]:text-[12px] sm:[&_[data-slot=calendar]_day_button]:text-[13px] [&_[data-slot=calendar]_day_button]:font-medium [&_[data-slot=calendar]_day_button]:tabular-nums [&_[data-slot=calendar]_day_button]:text-zinc-100 [&_[data-slot=calendar]_day_button]:transition-colors [&_[data-slot=calendar]_day_button]:hover:bg-zinc-800 [&_[data-slot=calendar]_day_button]:focus-visible:outline-none [&_[data-slot=calendar]_day_button]:focus-visible:ring-2 [&_[data-slot=calendar]_day_button]:focus-visible:ring-yellow-400/55',
                          '[&_[data-slot=calendar]_day_button[data-selected-single=true]]:!bg-yellow-400 [&_[data-slot=calendar]_day_button[data-selected-single=true]]:!text-zinc-900 [&_[data-slot=calendar]_day_button[data-selected-single=true]]:shadow-[0_10px_28px_-12px_rgba(250,204,21,0.55)]',
                          '[&_[data-slot=calendar]_outside]:opacity-[0.35]',
                        )}
                      >
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        weekStartsOn={1}
                        modifiers={{ has_events: hasEventsMatcher }}
                        modifiersClassNames={{
                          has_events:
                            'relative pb-1 [&_button]:max-w-full [&_button]:whitespace-normal [&_button]:tabular-nums [&_button]:font-semibold [&_button]:leading-none [&_button]:text-yellow-100 after:pointer-events-none after:absolute after:left-1/2 after:bottom-[2px] after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-amber-400 after:shadow-[0_0_10px_rgba(251,191,36,0.85)]',
                        }}
                        className="min-w-0 max-w-full rounded-lg border-0 bg-transparent !w-full [--cell-size:2.45rem] sm:[--cell-size:2.75rem]"
                        captionLayout="label"
                        showOutsideDays
                        fixedWeeks
                      />
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
                      <span className="inline-flex items-center gap-2">
                        <span className="size-3 shrink-0 rounded-md bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.35)] ring-2 ring-yellow-600/60" />{' '}
                        Selected date
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="relative size-7 rounded-lg border border-zinc-700 bg-zinc-900">
                          <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-amber-400 ring-4 ring-transparent" />{' '}
                          <span className="absolute inset-0 flex items-start justify-center pt-2 text-[10px] font-medium text-zinc-300">
                            12
                          </span>
                        </span>
                        Has event(s)
                      </span>
                    </div>
                  </div>
                  </div>

                  {/* Events list — same grid row as calendar on lg */}
                  <div className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-zinc-950/70 p-4 sm:p-6 lg:p-8">
                  {selectedDate ? (
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                      <div className="mb-4 min-w-0 shrink-0 sm:mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Selected day</p>
                        <p className="mt-2 break-words text-lg font-semibold text-white sm:text-2xl">
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {getEventsForDate(selectedDate).length === 1
                            ? '1 event on this date'
                            : `${getEventsForDate(selectedDate).length} events on this date`}
                        </p>
                      </div>

                      {(() => {
                        const eventsForDate = getEventsForDate(selectedDate);
                        return eventsForDate.length > 0 ? (
                          <ul className="min-h-0 max-w-full flex-1 space-y-3 overflow-x-hidden overflow-y-auto overscroll-contain pr-0.5 pb-1 scrollbar-overlay [-webkit-overflow-scrolling:touch]">
                            {eventsForDate.map((event) => (
                              <li key={event.id}>
                                <div className="group max-w-full rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-black/90 p-3 transition-colors hover:border-yellow-500/25 hover:bg-zinc-900/95 sm:p-4">
                                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                                    <div className="flex size-12 shrink-0 flex-col overflow-hidden rounded-lg border border-yellow-500/40 bg-yellow-400/25 text-yellow-950">
                                      <span className="flex h-8 items-center justify-center bg-yellow-400/90 text-xl font-black leading-none tabular-nums">
                                        {new Date(selectedDate).getDate()}
                                      </span>
                                      <span className="flex flex-1 items-center justify-center text-[11px] font-bold uppercase tracking-wider opacity-95">
                                        {selectedDate.toLocaleDateString('en-US', { month: 'short' })}
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="break-words font-semibold leading-snug text-white group-hover:text-yellow-50">
                                        {event.EventName}
                                      </h4>
                                      {event.description ? (
                                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                                          {event.description}
                                        </p>
                                      ) : null}
                                      <div className="mt-3 flex max-w-full flex-wrap gap-2">
                                        {event.endDate ? (
                                          <Badge
                                            variant="secondary"
                                            className="max-w-full shrink-0 border-yellow-400/35 bg-yellow-400/18 text-yellow-100"
                                          >
                                            <Clock className="mr-1 size-3" />
                                            {new Date(event.endDate).toLocaleTimeString([], {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                            })}
                                          </Badge>
                                        ) : null}
                                        {event.startDate ? (
                                          <Badge
                                            variant="secondary"
                                            className="border-zinc-600 bg-zinc-800/90 text-zinc-200"
                                          >
                                            Starts{' '}
                                            {new Date(event.startDate).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                            })}
                                          </Badge>
                                        ) : null}
                                        {event.university ? (
                                          <Badge
                                            variant="secondary"
                                            className="max-w-full shrink-0 border-emerald-500/30 bg-emerald-500/12 text-emerald-100"
                                          >
                                            <MapPin className="mr-1 size-3 shrink-0" />
                                            <span className="min-w-0 max-w-[min(100%,16rem)] truncate">{event.university}</span>
                                          </Badge>
                                        ) : null}
                                        {event.clubName ? (
                                          <Badge
                                            variant="outline"
                                            className="max-w-full shrink border-zinc-600 text-zinc-400"
                                          >
                                            <span className="min-w-0 truncate">{event.clubName}</span>
                                          </Badge>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="flex max-w-full flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/90 px-3 py-12 text-center sm:py-14">
                            <Calendar className="mx-auto mb-4 size-14 text-zinc-600 opacity-75" aria-hidden />
                            <p className="text-base font-medium text-zinc-300">Nothing on this day</p>
                            <p className="mt-1 max-w-sm px-2 text-sm text-zinc-500 sm:px-6">
                              Try another date, or dots on the calendar show days that match event start/end on this
                              page.
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center text-zinc-500">
                      <p className="max-w-[20ch] text-sm">Choose a date on the calendar</p>
                    </div>
                  )}

                  <div className="mt-auto flex shrink-0 flex-wrap justify-end gap-2 border-t border-zinc-800 pt-4 sm:pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCalendarModalOpen(false)}
                      className="rounded-xl border-zinc-600 bg-transparent text-white hover:bg-zinc-900"
                    >
                      Close
                    </Button>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        {isLoading ? (
          <SearchFilterSkeleton />
        ) : (
          <div className="flex flex-col space-y-3 mb-6 md:mb-8">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:gap-4">
              <div className="relative w-full md:w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${isSearchLoading ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  placeholder="Search by name, club, description…"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            {/* Search results count */}
            {isSearchMode && !isSearchLoading && (
              <p className="text-sm text-gray-400">
                {searchTotal === 0
                  ? `No results for "${searchTerm.trim()}"`
                  : `${searchTotal} result${searchTotal !== 1 ? 's' : ''} for "${searchTerm.trim()}"`}
              </p>
            )}
          </div>
        )}

        {/* Events Grid - Main Content */}
        <div className="min-h-[400px]">
          {displayedIsLoading ? (
            <EventsGridSkeleton />
          ) : error && !isSearchMode ? (
            <ErrorState
              title="Could not load events"
              message={error}
              onRetry={handleRetry}
              retryLabel="Try again"
            />
          ) : displayedEvents.length > 0 ? (
            <EventCard
              events={displayedEvents}
              isLoading={displayedIsLoading}
              error={error}
              searchTerm={searchTerm}
              isUserAttendingEvent={isUserAttendingEvent}
            />
          ) : (
            <EmptyState
              icon={Calendar}
              title={
                isSearchMode
                  ? 'No events match your search'
                  : 'No events to show yet'
              }
              description={
                isSearchMode
                  ? `Nothing matches "${searchTerm.trim()}". Try different keywords or clear the search.`
                  : 'New campus events will appear here when organizers publish them.'
              }
            >
              {isSearchMode ? (
                <Button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="min-h-11 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 font-medium"
                >
                  Clear search
                </Button>
              ) : null}
            </EmptyState>
          )}
        </div>

        {/* Pagination Controls */}
        {!displayedIsLoading && !error && displayedTotalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8 py-4">
            <Button
              onClick={() => handlePageChange(displayedCurrentPage - 1)}
              disabled={displayedCurrentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors ${
                displayedCurrentPage === 1
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Previous
            </Button>

            {/* Page numbers with smart truncation */}
            {Array.from({ length: Math.min(displayedTotalPages, 5) }, (_, idx) => {
              let pageNumber;
              if (displayedTotalPages <= 5) {
                pageNumber = idx + 1;
              } else if (displayedCurrentPage <= 3) {
                pageNumber = idx + 1;
              } else if (displayedCurrentPage >= displayedTotalPages - 2) {
                pageNumber = displayedTotalPages - 4 + idx;
              } else {
                pageNumber = displayedCurrentPage - 2 + idx;
              }

              return (
                <Button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    displayedCurrentPage === pageNumber
                      ? 'bg-yellow-500 text-black font-bold'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              onClick={() => handlePageChange(displayedCurrentPage + 1)}
              disabled={displayedCurrentPage === displayedTotalPages}
              className={`px-4 py-2 rounded-lg transition-colors ${
                displayedCurrentPage === displayedTotalPages
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
