/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, Users, Star, TrendingUp, Calendar, Grid3X3, List } from 'lucide-react';

import Link from 'next/link';
import CreateClubModal from './createclub';
import JoinClubModal from './joinclub';
import axios from 'axios';
import Image from 'next/image';
import { response } from '@/types/global-Interface';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import dotenv from "dotenv"

dotenv.config()

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
    id: string;
  } | null>(null);
  const [clubData, setData] = useState<response['resp']>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState("")

  useEffect(()=> {
     if (typeof window !== 'undefined') {
     const tok = localStorage.getItem("token")
     if(tok) setToken(tok)
      else {
       toast("login please")
       return;
      }
    }
  }, [])


  useEffect(() => {
    async function call() {
      if(!token) {
        toast("login please");
        return;
      }
      const response = await axios.get<response>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/getAll?page=${currentPage}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.resp);
      setTotalPages(response.data.totalPages || 1); 
    }

    call();
  }, [currentPage]); 

  const handleJoinClub = (club: response['resp'][0]) => {
    setSelectedClub({
      name: club.name,
      image: club.profilePicUrl || 'https://via.placeholder.com/150',
      id: club.id,
    });
    setIsJoinModalOpen(true);
  };

  // Filter and sort clubs based on search and filters
  const filteredClubs = clubData?.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activetype === 'all' || (String(club.type)).toLowerCase() === activetype;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-10 bg-black p-3 md:p-4 -mx-4 md:-mx-6 mb-4">
        <div className="max-w-none px-4 md:px-6">
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <Search  size={4} className=" md:h-5 md:w-5 text-gray-400" />
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
              <Button
                onClick={() => setSortBy('popular')}
                className={`flex items-center px-3 md:px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  sortBy === 'popular'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Star size={4} className=" md:h-4 md:w-4 mr-1" />
                <span>Popular</span>
              </Button>

              <Button
                onClick={() => setSortBy('new')}
                className={`flex items-center px-3 md:px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  sortBy === 'new'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Calendar size={4} className=" md:h-4 md:w-4 mr-1" />
                <span>New</span>
              </Button>

              <Button
                onClick={() => setSortBy('trending')}
                className={`flex items-center px-3 md:px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  sortBy === 'trending'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <TrendingUp size={4} className=" md:h-4 md:w-4 mr-1" />
                <span>Trending</span>
              </Button>
            </div>

            {/* View Toggle Button */}
            <Button
              onClick={() => setIsGridView(!isGridView)}
              className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              title={isGridView ? 'Switch to List View' : 'Switch to Grid View'}
            >
              {isGridView ? (
                <List className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <Grid3X3 className="h-4 w-4 md:h-5 md:w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Create Club Button - Responsive, above categories */}
      <div className="w-full flex justify-start px-3 md:px-2 mb-2">
        <Button
          className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg transition-colors px-6 py-3 font-bold text-lg"
          onClick={() => setIsCreateModalOpen(true)}
          title="Create New Club"
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6 mr-2" />
          Create Your Club
        </Button>
      </div>

      {/* Categories */}
      <div className="py-3 md:py-4 overflow-x-auto -mx-4 md:-mx-6 px-4 md:px-6 mb-4">
        <div className="max-w-none">
          <div className="flex space-x-2 pb-1 md:pb-0 scrollbar-hide">
            {categories.map((type) => (
              <Button
                key={type.id}
                onClick={() => setActivetype(type.id)}
                className={`whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors ${
                  activetype === type.id
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {type.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Clubs Grid/List */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {activetype === 'all'
              ? 'All Clubs'
              : categories.find((c) => c.id === activetype)?.name}
          </h2>
          <span className="text-gray-400 text-sm">
            {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {clubData ? (
          filteredClubs.length > 0 ? (
            isGridView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredClubs.map((club: any) => (
                  <div
                    key={club.id}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group flex flex-col"
                  >
                    <Link href={`/clubs/${club.id}`} className="flex-1">
                      <div className="h-32 md:h-40 overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/20 transition-all"></div>
                        <Image
                          src={club.image || 'https://via.placeholder.com/300x200'}
                          alt={club.name}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-3 md:p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-base md:text-lg truncate">
                              {club.name}
                            </h3>
                            <p className="text-gray-400 text-xs md:text-sm truncate">
                              {club.collegeName || club.college}
                            </p>
                          </div>
                          <div className="flex items-center text-gray-400 text-xs md:text-sm ml-2">
                            <Users  size={3} className=" md:h-4 md:w-4 mr-1" />
                            <span>{club.members || 100}</span>
                          </div>
                        </div>

                        <p className="text-gray-300 text-xs md:text-sm line-clamp-2 mb-3">
                          {club.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-1 rounded-md 
                            ${club.type === 'Technology' || club.type === 'tech' ? 'bg-blue-900/30 text-blue-300' : ''}
                            ${club.type === 'Cultural' || club.type === 'cultural' ? 'bg-purple-900/30 text-purple-300' : ''}
                            ${club.type === 'Business' || club.type === 'business' ? 'bg-green-900/30 text-green-300' : ''}
                            ${club.type === 'Social' || club.type === 'social' ? 'bg-amber-900/30 text-amber-300' : ''}
                            ${club.type === 'Literature' || club.type === 'literary' ? 'bg-red-900/30 text-red-300' : ''}
                            ${club.type === 'Design' || club.type === 'design' ? 'bg-pink-900/30 text-pink-300' : ''}`}
                          >
                            {club.type.charAt(0).toUpperCase() + club.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-3 md:p-4 pt-0">
                      <Button
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black text-xs md:text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          handleJoinClub(club);
                        }}
                      >
                        Join Club
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {filteredClubs.map((club: any) => (
                  <div
                    key={club.id}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group"
                  >
                    <div className="flex">
                      <Link href={`/clubs/${club.id}`} className="flex flex-1">
                        <div className="size-24 md:w-32 md:h-32 overflow-hidden relative flex-shrink-0">
                          <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/20 transition-all"></div>
                          <Image
                            src={club.image || 'https://via.placeholder.com/150'}
                            alt={club.name}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <div className="p-3 md:p-4 flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-bold text-base md:text-lg truncate">
                                {club.name}
                              </h3>
                              <p className="text-gray-400 text-xs md:text-sm truncate">
                                {club.collegeName || club.college}
                              </p>
                            </div>
                            <div className="flex items-center text-gray-400 text-xs md:text-sm ml-2">
                              <Users size={4} className=" md:h-4 md:w-4 mr-1" />
                              <span>{club.members || 100}</span>
                            </div>
                          </div>

                          <p className="text-gray-300 text-xs md:text-sm line-clamp-2 mb-3">
                            {club.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs px-2 py-1 rounded-md 
                              ${club.type === 'Technology' || club.type === 'tech' ? 'bg-blue-900/30 text-blue-300' : ''}
                              ${club.type === 'Cultural' || club.type === 'cultural' ? 'bg-purple-900/30 text-purple-300' : ''}
                              ${club.type === 'Business' || club.type === 'business' ? 'bg-green-900/30 text-green-300' : ''}
                              ${club.type === 'Social' || club.type === 'social' ? 'bg-amber-900/30 text-amber-300' : ''}
                              ${club.type === 'Literature' || club.type === 'literary' ? 'bg-red-900/30 text-red-300' : ''}
                              ${club.type === 'Design' || club.type === 'design' ? 'bg-pink-900/30 text-pink-300' : ''}`}
                            >
                              {club.type.charAt(0).toUpperCase() + club.type.slice(1)}
                            </span>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="p-3 md:p-4 flex items-center">
                        <Button
                          className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs md:text-sm font-medium py-2 px-3 md:px-4 rounded-lg transition-colors whitespace-nowrap"
                          onClick={(e) => {
                            e.preventDefault();
                            handleJoinClub(club);
                          }}
                        >
                          Join Club
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No clubs found</div>
              <div className="text-gray-500 text-sm">
                Try adjusting your search or filter criteria
              </div>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                <Skeleton className="h-32 md:h-40 w-full" />
                <div className="p-3 md:p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-8 w-full rounded-lg mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
          clubId={selectedClub.id}
        />
      )}
    </div>
  );
};

export default ClubsPage;