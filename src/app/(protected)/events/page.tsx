'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EventModelShow } from '@/app/models/EventModel';
import Image from 'next/image';




const Events = () => {
  const [eventsList, setEvents] = useState<EventModelShow[]>([]);

  useEffect(() => {
    // Fetch events data from the API
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {eventsList.map((event) => (
          <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Image src={event.img} alt={event.title} className="w-full h-48 "
            width={100}
            height={100} />
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
            <p className="text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;