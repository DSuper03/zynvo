/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, Users, Star, TrendingUp, Calendar } from 'lucide-react';

import Link from 'next/link';
import CreateClubModal from './createclub';
import JoinClubModal from './joinclub';
import axios from 'axios';
import Image from 'next/image';
import { response } from '@/types/global-Interface';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
  { id: 'all', name: 'All Clubs' },
  { id: 'tech', name: '💻 Technology' },
  { id: 'cultural', name: '🎭 Cultural' },
  { id: 'business', name: '📈 Business' },
  { id: 'social', name: '🌱 Social' },
  { id: 'literary', name: '🧠 Literature' },
  { id: 'design', name: '🎨 Design' },
];

const ClubsPage = () => {
  const [activetype, setActivetype] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'new', 'trending'
  const [isGridView, setIsGridView] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<{
    name: string;
    image: string;
  } | null>(null);
  const [clubData, setData] = useState<response['resp']>();

  useEffect(() => {
    async function call() {
      const token = localStorage.getItem('token');
      const response = await axios.get<response>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/getAll`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(token);
      console.log(response);
      setData(response.data.resp);
    }

    call();
  }, []);

  // Filter clubs based on active type and search query
  // const filteredClubs = clubData.filter((club : any) => {
  //   const matchestype = activetype === 'all' || club.type === activetype;
  //   const matchesSearch =
  //     club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     club.college.toLowerCase().includes(searchQuery.toLowerCase());
  //   return matchestype && matchesSearch;
  // });

  // Sort clubs based on sortBy state
  // const sortedClubs = [...filteredClubs].sort((a, b) => {
  //   if (sortBy === 'new') {
  //     return a.isNew ? -1 : b.isNew ? 1 : 0;
  //   } else if (sortBy === 'trending') {

  //     return a.isPopular ? -1 : b.isPopular ? 1 : 0;
  //   } else {
  //     return b.members - a.members;
  //   }
  // });
  console.log(clubData);

  const handleJoinClub = (club: response['resp'][0]) => {
    setSelectedClub({
      name: club.name,
      image: club.profilePicUrl || 'https://via.placeholder.com/150', // Fallback image if profilePicUrl is null
    });
    setIsJoinModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-red">
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-3 md:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-800 text-white w-full py-2 pl-9 md:pl-10 pr-4 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Search clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Buttons */}
            <div className="flex space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              <button
                onClick={() => setSortBy('popular')}
                className={`flex items-center px-3 md:px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  sortBy === 'popular'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                <Star className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>Popular</span>
              </button>

              <button
                onClick={() => setSortBy('new')}
                className={`flex items-center px-3 md:px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  sortBy === 'new'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>New</span>
              </button>

              <button
                onClick={() => setSortBy('trending')}
                className={`flex items-center px-3 md:px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  sortBy === 'trending'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>Trending</span>
              </button>
            </div>

            {/* View Toggle Button */}
            <button
              onClick={() => setIsGridView(!isGridView)}
              className="hidden md:block bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isGridView ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-black py-3 md:py-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <div className="flex space-x-2 pb-1 md:pb-0 scrollbar-hide">
            {categories.map((type) => (
              <button
                key={type.id}
                onClick={() => setActivetype(type.id)}
                className={`whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium ${
                  activetype === type.id
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clubs Grid/List */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
          {activetype === 'all'
            ? 'All Clubs'
            : categories.find((c) => c.id === activetype)?.name}
        </h2>

        {isGridView ? (
          <div className="min-h-screen h-full min-w-full">
            {clubData ? (
              clubData.map((club: any) => (
                <div
                  key={club.id}
                  className="block transition-transform hover:scale-[1.02] duration-200"
                >
                  <Link href={`/clubs/${club.id}`} className="block">
                    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group">
                      <div className="h-32 md:h-40 overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/20 transition-all"></div>
                        <Image
                          src={club.image}
                          alt={club.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-3 md:p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-bold text-base md:text-lg">
                              {club.name}
                            </h3>
                            <p className="text-gray-400 text-xs md:text-sm">
                              {club.college}
                            </p>
                          </div>
                          <div className="flex items-center text-gray-400 text-xs md:text-sm">
                            <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span>{club.members}</span>
                          </div>
                        </div>

                        <p className="text-gray-300 text-xs md:text-sm mt-2 line-clamp-2">
                          {club.description}
                        </p>

                        <div className="flex items-center justify-between mt-3 md:mt-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-md 
                            ${club.type === 'tech' ? 'bg-blue-900/30 text-blue-300' : ''}
                            ${club.type === 'cultural' ? 'bg-purple-900/30 text-purple-300' : ''}
                            ${club.type === 'business' ? 'bg-green-900/30 text-green-300' : ''}
                            ${club.type === 'social' ? 'bg-amber-900/30 text-amber-300' : ''}
                            ${club.type === 'literary' ? 'bg-red-900/30 text-red-300' : ''}
                            ${club.type === 'design' ? 'bg-pink-900/30 text-pink-300' : ''}`}
                          >
                            {club.type.charAt(0).toUpperCase() +
                              club.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black text-xs md:text-sm font-medium py-1.5 md:py-2 px-4 rounded-lg mt-2 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      handleJoinClub(club);
                    }}
                  >
                    Join Club
                  </button>
                </div>
              ))) : (  <div className="grid gris-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full ">
       {[...Array(8)].map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-32 md:h-40 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>)
              }
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {clubData &&
              clubData.map((club: any) => (
                <div
                  key={club.id}
                  className="block transition-transform hover:scale-[1.01] duration-200"
                >
                  <Link href={`/clubs/${club.id}`} className="block">
                    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group flex">
                      <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/20 transition-all"></div>
                        <Image
                          src={club.image}
                          alt={club.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-3 md:p-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-bold text-base md:text-lg">
                              {club.name}
                            </h3>
                            <p className="text-gray-400 text-xs md:text-sm">
                              {club.collegeName}
                            </p>
                          </div>
                          <div className="flex items-center text-gray-400 text-xs md:text-sm">
                            <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span>{100}</span>
                          </div>
                        </div>

                        <p className="text-gray-300 text-xs md:text-sm mt-2">
                          {club.description}
                        </p>

                        <div className="flex items-center justify-between mt-3 md:mt-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-md 
                            ${club.type === 'Technology' ? 'bg-blue-900/30 text-blue-300' : ''}
                            ${club.type === 'Cultural' ? 'bg-purple-900/30 text-purple-300' : ''}
                            ${club.type === 'Business' ? 'bg-green-900/30 text-green-300' : ''}
                            ${club.type === 'Social' ? 'bg-amber-900/30 text-amber-300' : ''}
                            ${club.type === 'Literature' ? 'bg-red-900/30 text-red-300' : ''}
                            ${club.type === 'Design' ? 'bg-pink-900/30 text-pink-300' : ''}`}
                          >
                            {club.type.charAt(0).toUpperCase() +
                              club.type.slice(1)}
                          </span>

                          <button
                            className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs md:text-sm font-medium py-1 px-3 md:px-4 rounded-lg transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              handleJoinClub(club);
                            }}
                          >
                            Join Club
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Floating Create Button */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6">
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-black w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} className="md:size-24" />
        </button>
      </div>

      {/* Create Club Modal */}
      <CreateClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Join Club Modal */}
      {selectedClub && (
        <JoinClubModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          clubName={selectedClub.name}
          clubImage={selectedClub.image}
        />
      )}
    </div>
  );
};

export default ClubsPage;
