/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Users,
  Star,
  TrendingUp,
  Calendar,
  Grid3X3,
  List,
} from 'lucide-react';

import Link from 'next/link';
import CreateClubModal from './createclub';
import JoinClubModal from './joinclub';
import axios from 'axios';
import Image from 'next/legacy/image';
import { response } from '@/types/global-Interface';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import dotenv from 'dotenv';
import './responsive.css';
import NoTokenModal from '@/components/modals/remindModal';

dotenv.config();

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
  const [token, setToken] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const session = sessionStorage.getItem('activeSession');
      if (token) setToken(token);
      else {
      
        setIsOpen(true);
        return;
      }
      if (session !== 'true') {
        toast('login please');
        setIsOpen(true);
        return;
      }
    }
  }, []);

  useEffect(() => {
    async function call() {
      if (!token) {
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
  }, [currentPage, token]);

  const handleJoinClub = (club: response['resp'][0]) => {
    setSelectedClub({
      name: club.name,
      image: club.profilePicUrl || 'https://via.placeholder.com/150',
      id: club.id,
    });
    setIsJoinModalOpen(true);
  };

  const filteredClubs =
    clubData?.filter((club) => {
      const matchesSearch =
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activetype === 'all' || String(club.type).toLowerCase() === activetype;
      return matchesSearch && matchesCategory;
    }) || [];

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-black border-b border-gray-800 shadow-lg">
        {/* Search, Sort, View Toggle */}
        <div className="p-3 md:p-4">
          <div className="max-w-none">
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:gap-4">
              {/* Search Input */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-800 text-white w-full py-2.5 md:py-3 pl-10 md:pl-11 pr-4 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
                  placeholder="Search clubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sort Buttons */}
              <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <Button
                  onClick={() => setSortBy('popular')}
                  className={`flex items-center px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm whitespace-nowrap transition-all duration-200 ${
                    sortBy === 'popular'
                      ? 'bg-yellow-500 text-black shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Star className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
                  <span>Popular</span>
                </Button>

                <Button
                  onClick={() => setSortBy('new')}
                  className={`flex items-center px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm whitespace-nowrap transition-all duration-200 ${
                    sortBy === 'new'
                      ? 'bg-yellow-500 text-black shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
                  <span>New</span>
                </Button>

                <Button
                  onClick={() => setSortBy('trending')}
                  className={`flex items-center px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm whitespace-nowrap transition-all duration-200 ${
                    sortBy === 'trending'
                      ? 'bg-yellow-500 text-black shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
                  <span>Trending</span>
                </Button>
              </div>

              {/* View Toggle Button */}
              <Button
                onClick={() => setIsGridView(!isGridView)}
                className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                title={
                  isGridView ? 'Switch to List View' : 'Switch to Grid View'
                }
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

        {/* Create Club Button */}
        <div className="px-3 md:px-4 pb-2">
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
        <div className="px-3 md:px-4 pb-3 md:pb-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
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

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 pb-4">
        {/* Section Header */}
        <div className="flex justify-between items-center py-4 sticky top-0 bg-black z-10 border-b border-gray-800 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {activetype === 'all'
              ? 'All Clubs'
              : categories.find((c) => c.id === activetype)?.name}
          </h2>
          <span className="text-gray-400 text-sm">
            {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}{' '}
            found
          </span>
        </div>

        {/* Clubs Grid/List */}
        {clubData ? (
          filteredClubs.length > 0 ? (
            isGridView ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 responsive-grid gap-4">
                {filteredClubs.map((club: any) => (
                  <div
                    key={club.id}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group flex flex-col hover:shadow-xl hover:shadow-yellow-500/10 hover:scale-[1.02] club-card w-full"
                  >
                    <Link href={`/clubs/${club.id}`} className="flex-1">
                      <div className="h-32 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 group-hover:from-black/30 transition-all duration-300"></div>
                        <Image
                          src={club.profilePicUrl}
                          alt={club.name}
                          layout="fill"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={false}
                        />
                        {/* Member count overlay */}
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center z-20">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{club.members || 100}</span>
                        </div>
                      </div>

                      <div className="p-3 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-sm line-clamp-2 mb-1 group-hover:text-yellow-400 transition-colors">
                            {club.name}
                          </h3>
                          <p className="text-gray-400 text-xs mb-2 line-clamp-1">
                            {club.collegeName || club.college}
                          </p>

                          <p className="text-gray-300 text-xs line-clamp-2 mb-3 leading-relaxed">
                            {club.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <span
                            className={`text-xs px-2 py-1 rounded-md font-medium
                            ${club.type === 'Technology' || club.type === 'tech' ? 'bg-blue-900/30 text-blue-300 border border-blue-500/20' : ''}
                            ${club.type === 'Cultural' || club.type === 'cultural' ? 'bg-purple-900/30 text-purple-300 border border-purple-500/20' : ''}
                            ${club.type === 'Business' || club.type === 'business' ? 'bg-green-900/30 text-green-300 border border-green-500/20' : ''}
                            ${club.type === 'Social' || club.type === 'social' ? 'bg-amber-900/30 text-amber-300 border border-amber-500/20' : ''}
                            ${club.type === 'Literature' || club.type === 'literary' ? 'bg-red-900/30 text-red-300 border border-red-500/20' : ''}
                            ${club.type === 'Design' || club.type === 'design' ? 'bg-pink-900/30 text-pink-300 border border-pink-500/20' : ''}`}
                          >
                            {club.type.charAt(0).toUpperCase() +
                              club.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="p-3 pt-0">
                      <Button
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
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
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group hover:shadow-xl hover:shadow-yellow-500/10"
                  >
                    <div className="flex flex-col xs:flex-row">
                      <Link
                        href={`/clubs/${club.id}`}
                        className="flex flex-col xs:flex-row flex-1"
                      >
                        <div className="w-full xs:w-24 sm:w-32 md:w-40 h-32 xs:h-24 sm:h-32 md:h-32 overflow-hidden relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-t xs:bg-gradient-to-r from-black/50 to-transparent z-10 group-hover:from-black/30 transition-all duration-300"></div>
                          <Image
                            src={
                              club.profilePicUrl ||
                              'https://via.placeholder.com/150'
                            }
                            alt={club.name}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Member count overlay for mobile */}
                          <div className="absolute top-2 right-2 xs:hidden bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center z-20">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{club.members || 100}</span>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-bold text-base md:text-lg line-clamp-2 group-hover:text-yellow-400 transition-colors">
                                {club.name}
                              </h3>
                              <p className="text-gray-400 text-xs sm:text-sm line-clamp-1">
                                {club.collegeName || club.college}
                              </p>
                            </div>
                            {/* Member count for larger screens */}
                            <div className="hidden xs:flex items-center text-gray-400 text-xs sm:text-sm ml-2">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span>{club.members || 100}</span>
                            </div>
                          </div>

                          <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 mb-3 leading-relaxed">
                            {club.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs px-2 py-1 rounded-md font-medium
                              ${club.type === 'Technology' || club.type === 'tech' ? 'bg-blue-900/30 text-blue-300 border border-blue-500/20' : ''}
                              ${club.type === 'Cultural' || club.type === 'cultural' ? 'bg-purple-900/30 text-purple-300 border border-purple-500/20' : ''}
                              ${club.type === 'Business' || club.type === 'business' ? 'bg-green-900/30 text-green-300 border border-green-500/20' : ''}
                              ${club.type === 'Social' || club.type === 'social' ? 'bg-amber-900/30 text-amber-300 border border-amber-500/20' : ''}
                              ${club.type === 'Literature' || club.type === 'literary' ? 'bg-red-900/30 text-red-300 border border-red-500/20' : ''}
                              ${club.type === 'Design' || club.type === 'design' ? 'bg-pink-900/30 text-pink-300 border border-pink-500/20' : ''}`}
                            >
                              {club.type.charAt(0).toUpperCase() +
                                club.type.slice(1)}
                            </span>
                          </div>
                        </div>
                      </Link>

                      <div className="p-3 sm:p-4 pt-0 xs:pt-3 sm:pt-4 flex xs:items-center">
                        <Button
                          className="w-full xs:w-auto bg-yellow-500 hover:bg-yellow-400 text-black text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 whitespace-nowrap hover:scale-[1.02] hover:shadow-lg"
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
          <div className="grid grid-cols-1 xs:grid-cols-2 responsive-grid gap-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 club-card w-full"
              >
                <Skeleton className="h-32 w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-full rounded-lg mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, idx) => (
              <Button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? 'bg-yellow-500 text-black font-bold'
                    : 'bg-gray-700 text-white'
                }`}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        )}
      </div>

      <NoTokenModal isOpen={isOpen} onOpenChange={setIsOpen} />

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
