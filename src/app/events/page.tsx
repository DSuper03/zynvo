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
import { eventData } from '@/types/global-Interface';
import Image from 'next/image';
import axios from 'axios';


interface apiRespEvents {
  msg : string,
  response : eventData[]
} 


export default function ZynvoEventsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [Events, setEvents] = useState<eventData[]>([])
  // Sample events data

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(()=> {
    async function call() {
      const response = await axios.get<apiRespEvents>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/all`)
      // if(!response) alert("fail")
      //   else alert(response.data.msg)

      setEvents(response.data.response);
    }

    call()
  }, [])

  // Filter events based on active filter
 // data = [{[]}, { }]
        

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}

      {/* Main Content */}
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

        {/* Search and Filter Bar */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:gap-4 mb-6 md:mb-8">
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

          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4">
            <div className="relative">
              <button className="w-full md:w-auto bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 mr-2" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="flex bg-gray-900 rounded-lg w-full md:w-auto">
              <button
                className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-sm md:text-base rounded-l-lg ${activeFilter === 'all' ? 'bg-yellow-400 text-gray-900' : 'text-white'}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-sm md:text-base ${activeFilter === 'registered' ? 'bg-yellow-400 text-gray-900' : 'text-white'}`}
                onClick={() => setActiveFilter('registered')}
              >
                Registered
              </button>
              <button
                className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-sm md:text-base rounded-r-lg ${activeFilter === 'upcoming' ? 'bg-yellow-400 text-gray-900' : 'text-white'}`}
                onClick={() => setActiveFilter('upcoming')}
              >
                Not Registered
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative">
                <Image
                  src={"/consultclub.png"}
                  alt={event.description}
                  width={600}
                  height={300}
                  className="w-full h-48 sm:h-40 object-cover"
                />
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {event.EventName}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar className="size-4 mr-2 text-yellow-400" />
                    <span className="truncate">deadline : {event.endDate?.toDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
                    <span className="truncate">{event.clubName}'s College</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs md:text-sm">
                    {event.attendees.length} attending
                  </span>
                  <button className="px-3 md:px-4 py-2 text-sm rounded-md font-medium bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 md:mt-10">
          <div className="flex space-x-1 md:space-x-2">
            <button className="px-3 md:px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800">
              Previous
            </button>
            <button className="px-3 md:px-4 py-2 text-sm bg-yellow-400 text-gray-900 rounded-md">
              1
            </button>
            <button className="px-3 md:px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800">
              2
            </button>
            <button className="px-3 md:px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800">
              3
            </button>
            <button className="px-3 md:px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
