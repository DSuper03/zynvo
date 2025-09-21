'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { CreateEventModal } from '@/components/DynamicComponents';
import OptimizedImage from '@/components/OptimizedImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { logger } from '@/lib/logger';

// Loading component for events
const EventsLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="p-6 space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </Card>
    ))}
  </div>
);

// Event types
interface Event {
  id: string;
  eventName: string;
  description: string;
  eventStartDate: string;
  eventEndDate: string;
  venue: string;
  image?: string;
  university: string;
  eventType: string;
}

// Event card component
const EventCard = React.memo(({ event }: { event: Event }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ y: -5 }}
    className="group"
  >
    <Card className="overflow-hidden bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <OptimizedImage
          src={event.image || '/placeholder-event.webp'}
          alt={event.eventName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-4 right-4 bg-yellow-500 text-black">
          {event.eventType}
        </Badge>
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
          {event.eventName}
        </h3>
        
        <p className="text-gray-400 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-yellow-500" />
            <span>{new Date(event.eventStartDate).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-yellow-500" />
            <span>{event.venue}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-yellow-500" />
            <span>{event.university}</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
          onClick={() => logger.log('Event clicked:', event.id)}
        >
          View Details
        </Button>
      </div>
    </Card>
  </motion.div>
));

EventCard.displayName = 'EventCard';

const EventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Use optimized events hook
  const { data, isLoading, error, isError } = useEvents(currentPage, 12);
  
  const events = data?.events || [];
  const totalPages = data?.totalPages || 1;

  // Filter events based on search term
  const filteredEvents = events.filter((event: Event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-400 mb-6">
            We couldn't load the events. Please try again.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-yellow-500 hover:bg-yellow-400 text-black"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              Discover Amazing <span className="text-yellow-400">Events</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Connect with your campus community through exciting events, workshops, and competitions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
              >
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<EventsLoading />}>
            {isLoading ? (
              <EventsLoading />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                {filteredEvents.length === 0 && !isLoading && (
                  <div className="text-center py-20">
                    <h3 className="text-2xl font-bold text-gray-400 mb-4">
                      No events found
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? `No events match "${searchTerm}"`
                        : "No events available at the moment"
                      }
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                            ? "bg-yellow-500 text-black"
                            : "border-gray-700 text-gray-300 hover:bg-gray-800"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </Suspense>
        </div>
      </section>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EventsPage;