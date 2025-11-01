/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  Plus,
  Users,
  Grid3X3,
  List,
  Share2,
  User,
  Eye,
  ArrowRight,
} from 'lucide-react';
import {
  IconCpu,
  IconMasksTheater,
  IconUsersGroup,
  IconBook2,
  IconPalette,
  IconChartBar,
} from '@tabler/icons-react';

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
import { useRouter } from 'next/navigation';
import { ShimmerButton } from '@/components/ui/shimmer-button';

dotenv.config();

const getTypeClasses = (rawType: string) => {
  const type = String(rawType || '').toLowerCase();
  switch (type) {
    case 'tech':
    case 'technology':
      return 'bg-blue-900/30 text-blue-300 border border-blue-500/20';
    case 'cultural':
      return 'bg-purple-900/30 text-purple-300 border border-purple-500/20';
    case 'business':
      return 'bg-green-900/30 text-green-300 border border-green-500/20';
    case 'social':
      return 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/20';
    case 'literature':
    case 'literary':    
      return 'bg-amber-900/30 text-amber-300 border border-amber-500/20';
    case 'design':
      return 'bg-pink-900/30 text-pink-300 border border-pink-500/20';
    case 'general':
    default:  
      return 'bg-gray-900/30 text-gray-300 border border-gray-500/20';
  }
};

const getFounderOrFirstMember = (club: any): { label: string; value: string } | null => {
  const firstMember = club?.members?.[0];
  const memberName = firstMember?.name || firstMember?.fullName || firstMember?.username || firstMember?.email;
  if (memberName) return { label: 'Member', value: String(memberName) };
  if (club?.founderEmail) return { label: 'Founder', value: String(club.founderEmail) };
  return null;
};

const getMemberCount = (club: any): number => {
  if (typeof club?.members === 'number') return club.members as number;
  if (Array.isArray(club?.members)) return club.members.length as number;
  if (typeof club?.memberCount === 'number') return club.memberCount as number;
  if (typeof club?.membersCount === 'number') return club.membersCount as number;
  return 0;
};


const categories = [
  { id: 'all', name: 'All Clubs', icon: null },
  { id: 'tech', name: 'Technology', icon: <IconCpu size={16} /> },
  { id: 'cultural', name: 'Cultural', icon: <IconMasksTheater size={16} /> },
  { id: 'business', name: 'Business', icon: <IconChartBar size={16} /> },
  { id: 'social', name: 'Social', icon: <IconUsersGroup size={16} /> },
  { id: 'literary', name: 'Literature', icon: <IconBook2 size={16} /> },
  { id: 'design', name: 'Design', icon: <IconPalette size={16} /> },
];
const ClubsPage = () => {
  const [activetype, setActivetype] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<{
    name: string;
    image: string;
    id: string;
    requirements?: string;
  } | null>(null);
  const [clubData, setData] = useState<response['resp']>();
  const [allClubs, setAllClubs] = useState<response['resp']>([]); // Store all clubs for search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [userJoinedClubIds, setUserJoinedClubIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const categoriesRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  
  const router = useRouter()
  const handleShareClub = async (club: { id: string; name: string; description?: string }) => {
    try {
      const url = typeof window !== 'undefined' ? `${window.location.origin}/clubs/${club.id}` : `https://zynvo.com/clubs/${club.id}`;
      const text = `Check out ${club.name}${club.description ? ` - ${club.description}` : ''}. Club ID: ${club.id}`;

      if (navigator.share) {
        await navigator.share({
          title: club.name,
          text,
          url,
        });
        toast.success('Shared successfully');
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (error) {
      try {
        await navigator.clipboard.writeText(`${club.id}`);
        toast.success('Club ID copied to clipboard');
      } catch {
        toast.error('Unable to share. Please try manually.');
      }
    }
  };

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
         toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => router.push('/auth/signin'),
          },
        });
        setIsOpen(true);
        return;
      }
    }
  }, []);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Reset to page 1 when search query changes
      setCurrentPage(1);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch clubs - either all pages (for search) or paginated
  useEffect(() => {
    async function call() {
      if (!token) {
        return;
      }

      // If there's a search query, fetch all pages
      if (debouncedSearchQuery.trim()) {
        setIsLoadingAll(true);
        try {
          // First, get the total pages by fetching page 1
          const firstPageResponse = await axios.get<response>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/getAll?page=1`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );

          const totalPagesCount = firstPageResponse.data.totalPages || 1;
          setTotalPages(totalPagesCount);

          // Fetch all pages in parallel
          const pagePromises = Array.from({ length: totalPagesCount }, (_, i) =>
            axios.get<response>(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/getAll?page=${i + 1}`,
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              }
            )
          );

          const allResponses = await Promise.all(pagePromises);
          
          // Combine all clubs from all pages
          const allClubsCombined = allResponses.flatMap((response) => response.data.resp || []);
          
          setAllClubs(allClubsCombined);
          setData(allClubsCombined); // Set data for filtering
        } catch (error) {
          console.error('Error fetching all clubs for search:', error);
          toast.error('Failed to load all clubs for search');
        } finally {
          setIsLoadingAll(false);
        }
      } else {
        // No search query - use normal pagination
        setAllClubs([]); // Clear all clubs when not searching
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
    }

    call();
  }, [currentPage, token, debouncedSearchQuery]);

  // Categories scroll controls visibility
  useEffect(() => {
    const el = categoriesRef.current;
    if (!el) return;

    const updateShadows = () => {
      const canScroll = el.scrollWidth > el.clientWidth + 2; // tolerance
      const atStart = el.scrollLeft <= 1;
      const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 1;
      setShowLeft(canScroll && !atStart);
      setShowRight(canScroll && !atEnd);
    };

    updateShadows();
    el.addEventListener('scroll', updateShadows, { passive: true });
    window.addEventListener('resize', updateShadows);
    const id = window.setInterval(updateShadows, 500); // handle font/icon async layout
    return () => {
      el.removeEventListener('scroll', updateShadows);
      window.removeEventListener('resize', updateShadows);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      if (!token) return;
      
      try {
        // Get current user data
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (userResponse.data && (userResponse.data as any).user) {
          setCurrentUser((userResponse.data as any).user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleJoinClub = (club: response['resp'][0]) => {
    setSelectedClub({
      name: club.name,
      image: club.profilePicUrl || 'https://via.placeholder.com/150',
      id: club.id,
      requirements: club.requirements || undefined,
    });
    setIsJoinModalOpen(true);
  };

  const filteredClubs =
    clubData?.filter((club) => {
      const matchesSearch =
        !debouncedSearchQuery.trim() ||
        club.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        club.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesCategory =
        activetype === 'all' || String(club.type).toLowerCase() === activetype;
      return matchesSearch && matchesCategory;
    }) || [];

  const isUserMemberOfClub = (club: any): boolean => {
    if (!currentUser) return false;
    
    // Check by club ID (most reliable)
    if (userJoinedClubIds.includes(club.id)) return true;
    
    // Fallback: Check if user's clubName matches this club's name
    if (currentUser.clubName === club.name) return true;
    
    // Fallback: Check if user is in the club's members array
    if (Array.isArray(club.members)) {
      return club.members.some((member: { email: any; id: any; }) => 
        member.email === currentUser.email || 
        member.id === currentUser.id
      );
    }
    
    return false;
  };

  return (
    <div className="flex flex-col h-screen mt-11">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-black border-b border-gray-800 shadow-lg">
        {/* Search and Create Club Row */}
        <div className="p-3 md:p-4">
          <div className="max-w-none">
            <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4">
              {/* Enhanced Search Input */}
              <div className="relative flex-grow min-w-0">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-800/90 backdrop-blur-sm text-white w-full py-2.5 sm:py-3 md:py-3.5 pl-10 sm:pl-12 md:pl-14 pr-8 sm:pr-10 md:pr-4 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 placeholder:text-gray-500 shadow-lg hover:shadow-xl hover:border-gray-600/50"
                  placeholder="Search clubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center z-10 text-gray-400 hover:text-white transition-colors touch-manipulation bg-transparent border-none outline-none focus:outline-none"
                    aria-label="Clear search"
                  >
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Create Club Button - Right Side */}
              <div className="flex-shrink-0">
                <ShimmerButton
                  onClick={() => setIsCreateModalOpen(true)}
                  title="Create New Club"
                  shimmerDuration="2.5s"
                  borderRadius="9999px"
                  className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3.5 text-yellow-400 hover:text-yellow-300 font-semibold text-xs sm:text-sm md:text-base lg:text-lg rounded-full shadow-[0_8px_30px_rgb(250,204,21,0.15)] hover:shadow-[0_10px_40px_rgb(250,204,21,0.25)] inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap border border-yellow-400/20 bg-gradient-to-r from-yellow-500/10 to-yellow-400/5 hover:from-yellow-500/20 hover:to-yellow-400/10 transition-all duration-300 touch-manipulation"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                  <span className="sm:hidden">Create</span>
                  <span className="hidden sm:inline md:hidden">Create Club</span>
                  <span className="hidden md:inline">Create Your Club</span>
                </ShimmerButton>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="px-3 md:px-4 pb-3 md:pb-4">
          <div className="relative">
            {/* Left scroll button */}
            <button
              type="button"
              aria-hidden={!showLeft}
              tabIndex={showLeft ? 0 : -1}
              onClick={() => categoriesRef.current?.scrollBy({ left: -240, behavior: 'smooth' })}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/60 ring-1 ring-white/10 text-white grid place-items-center hover:bg-black/70 transition ${showLeft ? '' : 'opacity-0 pointer-events-none'}`}
            >
              ‹
            </button>

            {/* Scrollable categories */}
            <div
              ref={categoriesRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-1"
            >
            {categories.map((type) => (
              <Button
                key={type.id}
                onClick={() => setActivetype(type.id)}
                className={`snap-start whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors flex items-center gap-2 ${
                  activetype === type.id
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {type.icon && <span className="inline-flex items-center">{type.icon}</span>}
                <span>{type.name}</span>
              </Button>
            ))}
            </div>

            {/* Right scroll button */}
            <button
              type="button"
              aria-hidden={!showRight}
              tabIndex={showRight ? 0 : -1}
              onClick={() => categoriesRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/60 ring-1 ring-white/10 text-white grid place-items-center hover:bg-black/70 transition ${showRight ? '' : 'opacity-0 pointer-events-none'}`}
            >
              ›
            </button>
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

        {/* Pagination Controls - Mobile View (Top) */}
        {!debouncedSearchQuery.trim() && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-6 md:hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-2">
              {Array.from({ length: totalPages }, (_, idx) => (
                <Button
                  key={idx + 1}
                  onClick={() => {
                    setCurrentPage(idx + 1);
                    // Smooth scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`min-w-[40px] h-10 w-10 rounded-full transition-all duration-300 ease-in-out ${
                    currentPage === idx + 1
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/30 scale-110'
                      : 'bg-gray-700/50 text-white hover:bg-gray-600/50 hover:scale-105'
                  }`}
                  variant={currentPage === idx + 1 ? 'default' : 'ghost'}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Clubs Grid/List */}
        {isLoadingAll && debouncedSearchQuery.trim() ? (
          <div className="text-center py-12">
            <div className="text-yellow-400 text-lg mb-2">Loading all clubs for search...</div>
            <div className="text-gray-400 text-sm">Please wait while we fetch all available clubs</div>
          </div>
        ) : clubData ? (
          filteredClubs.length > 0 ? (
            isGridView ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 responsive-grid gap-4">
                {filteredClubs.map((club: any) => (
                  <div
                    key={club.id}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group flex flex-col hover:shadow-xl hover:shadow-yellow-500/10 hover:scale-[1.02] club-card w-full"
                  >
                    <Link href={`/clubs/${club.id}`} className="flex-1 cursor-pointer">
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
                          <span>{getMemberCount(club) || 0}</span>
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

                          <p className="text-gray-300 text-xs line-clamp-2 mb-2 leading-relaxed">
                            {club.description}
                          </p>
                          {getFounderOrFirstMember(club) && (
                            <div className="flex items-center text-[11px] text-gray-400 mb-2">
                              <User className="h-3 w-3 mr-1.5" />
                              <span className="truncate">
                                {getFounderOrFirstMember(club)?.label}: {getFounderOrFirstMember(club)?.value}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <span
                            className={`text-[10px] px-2 py-1 rounded-md font-semibold ${getTypeClasses(club.type)}`}
                          >
                            {(String(club.type || '')
                              .charAt(0)
                              .toUpperCase() + String(club.type || '').slice(1)) || 'General'}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="p-3 pt-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <Button
                          asChild
                          className="flex-1 min-w-0 text-xs font-medium h-9 sm:h-10 px-2 sm:px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 bg-blue-600 hover:bg-blue-500 text-white focus-visible:ring-blue-400"
                        >
                          <Link href={`/clubs/${club.id}`} className="flex items-center justify-center gap-1">
                            <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="truncate">Check Club</span>
                          </Link>
                        </Button>
                        <Button
                          className={`flex-1 min-w-0 text-xs font-medium h-9 sm:h-10 px-2 sm:px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${
                            isUserMemberOfClub(club)
                              ? 'bg-green-600 hover:bg-green-500 text-white focus-visible:ring-green-400'
                              : 'bg-yellow-500 hover:bg-yellow-400 text-black focus-visible:ring-yellow-400'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (isUserMemberOfClub(club)) {
                              // User is already a member - could show a modal or do nothing
                              toast.success('You are already a member of this club!');
                            } else {
                              handleJoinClub(club);
                            }
                          }}
                        >
                          <span className="truncate">{isUserMemberOfClub(club) ? 'Joined' : 'Join Club'}</span>
                        </Button>
                      </div>
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
                        className="flex flex-col xs:flex-row flex-1 cursor-pointer"
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
                            <span>{getMemberCount(club) || 0}</span>
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
                              <span>{getMemberCount(club) || 0}</span>
                            </div>
                          </div>

                          <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 mb-2 leading-relaxed">
                            {club.description}
                          </p>
                          {getFounderOrFirstMember(club) && (
                            <div className="flex items-center text-[11px] sm:text-xs text-gray-400 mb-2">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                              <span className="truncate">
                                {getFounderOrFirstMember(club)?.label}: {getFounderOrFirstMember(club)?.value}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] px-2 py-1 rounded-md font-semibold ${getTypeClasses(club.type)}`}
                          >
                            {(String(club.type || '')
                              .charAt(0)
                              .toUpperCase() + String(club.type || '').slice(1)) || 'General'}
                          </span>
                          </div>
                        </div>
                      </Link>

                      <div className="p-3 sm:p-4 pt-0 xs:pt-3 sm:pt-4 flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                        <Button
                          asChild
                          className="flex-1 min-w-0 text-xs font-medium h-9 sm:h-10 px-2 sm:px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 bg-blue-600 hover:bg-blue-500 text-white focus-visible:ring-blue-400"
                        >
                          <Link href={`/clubs/${club.id}`} className="flex items-center justify-center gap-1 sm:gap-1.5">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">Check Club</span>
                          </Link>
                        </Button>
                        <Button
                          className={`flex-1 min-w-0 text-xs font-medium h-9 sm:h-10 px-2 sm:px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${
                            isUserMemberOfClub(club)
                              ? 'bg-green-600 hover:bg-green-500 text-white focus-visible:ring-green-400'
                              : 'bg-yellow-500 hover:bg-yellow-400 text-black focus-visible:ring-yellow-400'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (isUserMemberOfClub(club)) {
                              // User is already a member - could show a modal or do nothing
                              toast.success('You are already a member of this club!');
                            } else {
                              handleJoinClub(club);
                            }
                          }}
                        >
                          <span className="truncate">{isUserMemberOfClub(club) ? 'Joined' : 'Join Club'}</span>
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

        {/* Pagination Controls - Desktop View (Bottom) */}
        {!debouncedSearchQuery.trim() && totalPages > 1 && (
          <div className="hidden md:flex justify-center items-center gap-2 mt-8">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, idx) => (
                <Button
                  key={idx + 1}
                  onClick={() => {
                    setCurrentPage(idx + 1);
                    // Smooth scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`min-w-[44px] h-11 w-11 rounded-full transition-all duration-300 ease-in-out ${
                    currentPage === idx + 1
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/30 scale-110'
                      : 'bg-gray-700/50 text-white hover:bg-gray-600/50 hover:scale-105'
                  }`}
                  variant={currentPage === idx + 1 ? 'default' : 'ghost'}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
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
          requirements={selectedClub.requirements}
        />
      )}
    </div>
  );
};

export default ClubsPage;