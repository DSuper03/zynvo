'use client';

import { useEffect, useState } from 'react';
import { MapPin, Calendar, Share2, Club, ClubIcon, Castle, House, HouseIcon } from 'lucide-react';
import { Modal, ModalTrigger } from '@/components/ui/animated-modal';
import { eventData } from '@/types/global-Interface';
import Image from 'next/legacy/image';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface apiRespEvents {
  msg: string;
  response: eventData[];
}

interface EventCardProps {
  events?: eventData[] | null;
  isLoading?: boolean;
  error?: string | null;
  searchTerm?: string;
  isUserAttendingEvent?: (event: eventData) => boolean;
}

export default function EventCard({ 
  events = null, 
  isLoading = true, 
  error = null, 
  searchTerm = '',
  isUserAttendingEvent
}: EventCardProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const handleShare = async (eventId: string, eventName?: string) => {
    try {
      const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/events/${eventId}`
        : `/events/${eventId}`;

      if (navigator.share) {
        await navigator.share({
          title: eventName || 'Check out this event',
          text: `Join me at ${eventName || 'this event'}! ID: ${eventId}`,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert('Event link copied to clipboard');
    } catch (err) {
      try {
        await navigator.clipboard.writeText(`${eventName || 'Event'} - ID: ${eventId}`);
        alert('Event ID copied to clipboard');
      } catch (copyErr) {
        console.error(copyErr);
        alert('Unable to share. Please copy the URL from the address bar.');
      }
    }
  };

  // Events are now passed as props, no need to fetch them here

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

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 260, damping: 22 },
    },
    exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.15 } },
  };

  return (
    <div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        layout
      >
        {isLoading ? (
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-black border rounded-lg overflow-hidden shadow-md"
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
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.article
                key={event.id}
                exit="exit"
                layout
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-black border border-gray-700 rounded-lg overflow-hidden shadow-md transition-shadow"
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <Image
                    src={ event.posterUrl || '/logozynvo.jpg' }
                    alt={event.description || event.EventName}
                    width={600}
                    height={300}
                    className="w-full h-48 sm:h-40 object-cover"
                    priority={false}
                  />
                  {/* subtle glow on hover */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-md"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      boxShadow: 'inset 0 0 0 1px rgba(250, 204, 21, 0.25)',
                    }}
                  />
                </motion.div>
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
                        Deadline:{' '}
                        {event.endDate ? formatDate(event.endDate) : ''}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <HouseIcon className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
                      <span className="truncate">
                        {event.univerisity
                          ? event.univerisity
                          : `${event.clubName} Club`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs md:text-sm">
                      {event.attendees?.length || 0} attending
                    </span>
                    <div className="flex items-center gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className="bg-black text-white font-bold rounded-2xl border border-yellow-400 flex items-center gap-2"
                          onClick={() => handleShare(event.id, event.EventName)}
                          aria-label="Share event"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          className="bg-black text-white font-bold rounded-2xl border border-yellow-400"
                          onClick={() => router.push(`events/${event.id}`)}
                        >
                          Check
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Show attendance status above buttons */}
                  {isUserAttendingEvent && isUserAttendingEvent(event) && (
                    <div className="mt-2 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-white">
                        ✓ You are attending
                      </span>
                    </div>
                  )}
                </div>
                {/* highlight ring */}
                <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-yellow-400/0 group-hover:ring-yellow-400/25 transition" />
              </motion.article>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-400 text-lg">
              {searchTerm
                ? 'No events found matching your search'
                : 'No events found'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
