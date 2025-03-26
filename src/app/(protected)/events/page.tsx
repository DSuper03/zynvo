'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EventModelShow } from '@/app/models/EventModel';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

const EventCard = ({ event }: { event: EventModelShow }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={event.img} 
          alt={event.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" 
          width={400}
          height={200}
          priority
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">{event.description}</p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={16} className="mr-2" />
          <span>{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          {event.location && (
            <div className="flex items-center ml-4">
              <MapPin size={16} className="mr-2" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
        <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

const EventSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow animate-pulse">
    <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-5">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
    </div>
  </div>
);

const Events = () => {
  const [eventsList, setEvents] = useState<EventModelShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Events</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsList.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;