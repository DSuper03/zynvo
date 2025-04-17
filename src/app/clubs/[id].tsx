'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FiUsers, FiCalendar, FiMapPin, FiTag, FiClock, FiShare2 } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { clubsData } from '@/utils/constants/clubsData';

export default function ClubPage() {
  const params = useParams();
  const clubId = params.id as string;
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchClub = () => {
      setLoading(true);
      // Find club with matching ID
      const foundClub = clubsData.find(c => c.id === clubId);
      
      // In a real app, handle the case when club is not found
      setTimeout(() => {
        setClub(foundClub || {
          id: clubId,
          name: 'Unknown Club',
          description: 'Details not available',
          members: 0,
          established: 'N/A',
          category: 'Miscellaneous',
          meetingSchedule: 'Not specified',
          location: 'Not specified',
          bannerImage: 'https://images.unsplash.com/photo-1560732488-6b0df240254a',
          logoImage: 'https://images.unsplash.com/photo-1560732488-6b0df240254a',
          tags: [],
          upcomingEvents: []
        });
        setLoading(false);
      }, 500); // Simulate network delay
    };

    fetchClub();
  }, [clubId]);

  const handleJoinClub = () => {
    setIsJoined(!isJoined);
    // In a real app, make an API call to join/leave the club
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden mb-8">
        <Image 
          src={club.bannerImage}
          alt={`${club.name} banner`}
          fill
          style={{ objectFit: "cover" }}
          priority
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{club.name}</h1>
          <div className="flex items-center space-x-4 text-sm text-white/90">
            <span className="flex items-center">
              <FiUsers className="mr-1" /> {club.members} members
            </span>
            <span className="flex items-center">
              <FiCalendar className="mr-1" /> Est. {club.established}
            </span>
          </div>
        </div>
        
        <div className="absolute top-6 right-6 flex space-x-3">
          <button
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full p-2"
          >
            <FiShare2 className="text-white h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-700 dark:text-gray-300">{club.description}</p>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FiMapPin className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">{club.location}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">{club.meetingSchedule}</span>
              </div>
              <div className="flex items-center">
                <FiTag className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">{club.category}</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {club.tags && club.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            
            {club.upcomingEvents && club.upcomingEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No upcoming events scheduled.</p>
            ) : (
              <div className="space-y-4">
                {club.upcomingEvents && club.upcomingEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <h3 className="font-medium">{event.name}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiCalendar className="mr-1" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="mx-2">·</span>
                      <FiClock className="mr-1" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <Button
              onClick={handleJoinClub}
              className={`w-full ${
                isJoined 
                  ? "bg-white dark:bg-gray-800 text-primary-600 border border-primary-600" 
                  : "bg-primary-600"
              }`}
              size="lg"
            >
              {isJoined ? "Leave Club" : "Join Club"}
            </Button>
            
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Club Leaders</h3>
              <div className="flex space-x-2">
                {/* Placeholder for club leaders */}
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="font-medium mb-4">Similar Clubs</h3>
            <div className="space-y-4">
              {/* Placeholder for similar clubs */}
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div>
                    <p className="font-medium">Club Name</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">XX members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}