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
import Image from "next/legacy/image";
import axios from 'axios';
import CreateEventButton from './components/createEventButton';
import CreateEventModal from './components/modals';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import EventCard from './components/EventCard';

interface apiRespEvents {
  msg: string;
  response: eventData[];
  totalPages : number
}

export default function ZynvoEventsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [events, setEvents] = useState<eventData[] | null >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter()

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<apiRespEvents>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/all?page=${currentPage}`
        );
        setEvents(response.data.response);
        setTotalPages(response.data.totalPages || 1); 
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
      
<EventCard/>
        {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? 'bg-yellow-500 text-black font-bold'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
      </main>
    </div>
  );
}
