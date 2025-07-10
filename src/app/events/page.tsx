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
import Image from 'next/image';
import axios from 'axios';
import CreateEventButton from './components/createEventButton';
import CreateEventModal from './components/modals';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

interface apiRespEvents {
  msg: string;
  response: eventData[];
}

export default function ZynvoEventsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [events, setEvents] = useState<eventData[] | null >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter()

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
  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.EventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto py-4 md:py-8 px-4">
        {/* Page Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Upcoming Events
          </h1>
          <p className="text-sm md:text-base text-gray-400">
            Discover and register for the event you would like to go
          </p>
        </div>

        {/* Create Event Button */}
        <div className="flex justify-between items-center mb-8">
          <CreateEventButton onClick={() => setIsModalOpen(true)} />
        </div>

        {/* Create Event Modal */}
        {isModalOpen && (
          <CreateEventModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}

        {/* Search and Filter Bar */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:gap-4 mb-6 md:mb-8">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Search events..."
            />
          </div>

          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4">
            <div className="relative">
              <button className="w-full md:w-auto bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="flex bg-gray-800 border border-gray-700 rounded-lg w-full md:w-auto">
              <button
                className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-sm md:text-base rounded-l-lg transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-sm md:text-base border-x border-gray-700 transition-colors ${
                  activeFilter === 'registered' 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('registered')}
              >
                Registered
              </button>
              <button
                className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-sm md:text-base rounded-r-lg transition-colors ${
                  activeFilter === 'upcoming' 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('upcoming')}
              >
                Not Registered
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {isLoading ? (
          
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md">
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
                        Deadline: {
                        event.endDate ? formatDate(event.endDate) : ""
                        }
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
                      <span className="truncate">
                        {event.clubName ? `${event.clubName}'s College` : 'Location TBD'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs md:text-sm">
                      {event.attendees?.length || 0} attending
                    </span>
                    <button className="px-3 md:px-4 py-2 text-sm rounded-md font-medium bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors">
                      Register
                    </button>
                    <button className='bg-black text-white font-bold p-2 m-1 rounded-2xl'
                    onClick={()=> {
                      router.push(`events/${event.id}`)
                    }}
                    >
                        Check
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400 text-lg">
                {searchTerm ? 'No events found matching your search' : 'No events found'}
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

        {/* Pagination */}
        {filteredEvents && filteredEvents.length > 0 && (
          <div className="flex justify-center mt-6 md:mt-10">
            <div className="flex space-x-1 md:space-x-2">
              <button className="px-3 md:px-4 py-2 text-sm bg-gray-800 border border-gray-700 text-white rounded-md hover:bg-gray-700 transition-colors">
                Previous
              </button>
              <button className="px-3 md:px-4 py-2 text-sm bg-yellow-400 text-gray-900 rounded-md">
                1
              </button>
              <button className="px-3 md:px-4 py-2 text-sm bg-gray-800 border border-gray-700 text-white rounded-md hover:bg-gray-700 transition-colors">
                2
              </button>
              <button className="px-3 md:px-4 py-2 text-sm bg-gray-800 border border-gray-700 text-white rounded-md hover:bg-gray-700 transition-colors">
                3
              </button>
              <button className="px-3 md:px-4 py-2 text-sm bg-gray-800 border border-gray-700 text-white rounded-md hover:bg-gray-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
