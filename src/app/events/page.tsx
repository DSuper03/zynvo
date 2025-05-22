'use client';

import { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Filter,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { events } from '@/constants/events';
import Image from 'next/image';
export default function ZynvoEventsPage() {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample events data

  // Toggle mobile menu
  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  // Filter events based on active filter
  const filteredEvents =
    activeFilter === 'all'
      ? events
      : activeFilter === 'registered'
        ? events.filter((events) => events.isRegistered)
        : events.filter((events) => !events.isRegistered);

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Upcoming Events
          </h1>
          <p className="text-gray-400">
            Discover and register for the event you would like to go
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-900 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Search events..."
            />
          </div>

          <div className="flex space-x-4">
            <div className="relative">
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="flex bg-gray-900 rounded-lg">
              <button
                className={`px-4 py-2 rounded-l-lg ${activeFilter === 'all' ? 'bg-yellow-400 text-gray-900' : 'text-white'}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 ${activeFilter === 'registered' ? 'bg-yellow-400 text-gray-900' : 'text-white'}`}
                onClick={() => setActiveFilter('registered')}
              >
                Registered
              </button>
              <button
                className={`px-4 py-2 rounded-r-lg ${activeFilter === 'upcoming' ? 'bg-yellow-400 text-gray-900' : 'text-white'}`}
                onClick={() => setActiveFilter('upcoming')}
              >
                Not Registered
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={600}
                  height={300}
                  className="w-full h-40 object-cover"
                />
                {event.isRegistered && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 text-xs font-bold rounded">
                    Registered
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-xl mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">
                    {event.attending} attending
                  </span>
                  <button
                    className={`px-4 py-2 rounded-md font-medium ${
                      event.isRegistered
                        ? 'bg-gray-800 text-gray-300'
                        : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                    }`}
                  >
                    {event.isRegistered ? 'Registered' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
              Previous
            </button>
            <button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md">
              1
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
              2
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
              3
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
