'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import {
  CalendarDays,
  Users,
  MapPin,
  Globe,
  Share2,
  Clock,
  Flag,
  Mail,
  Phone,
  Star,
  Heart,
  Zap,
  Award,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  UserPlus,
  MessageCircle,
  BookOpen,
  Target,
  TrendingUp,
  Crown,
  Shield,
  Building,
  ArrowLeft,
  Calendar,
  UserCheck,
  Settings,
  MoreVertical,
  Bookmark,
  Share,
  Bell,
  Activity,
  Briefcase,
  GraduationCap,
  Search,
  Filter,
  Plus,
  Eye,
  ThumbsUp,
} from 'lucide-react';
import JoinClubModal from '../joinclub';
import CreateEventModal from '../../events/components/EventCreationModel';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  ClubPageProps,
  ClubTypeProps,
  EventResponse,
  EventType,
} from '@/types/global-Interface';

interface ClubApiResponse {
  msg: string;
  club: {
    id: string;
    name: string;
    collegeName: string;
    description: string;
    type: string;
    founderEmail: string;
    clubContact: string;
    requirements: string;
    facultyEmail: string;
    profilePicUrl: string;
    wings: string;
    members: {
      id: string;
      name: string;
      email: string;
      profileAvatar: string;
      course: string;
      year: string;
    }[];
  };
}

interface UserApiResponse {
  user: {
    email: string;
    name?: string;
    id?: string;
  };
}
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ZynvoClubAnnouncement from '@/components/ZynvoClubAnnouncement';

// All dynamic content is driven by backend data; no hardcoded demo content

export default function ClubPage({}: ClubPageProps) {
  const param = useParams();
  const id = param.id as string;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'announcements' | 'events' | 'members'>('announcements');
  const [isJoined, setIsJoined] = useState(false);
  const [club, setClub] = useState<ClubTypeProps>({
    id: '',
    name: '',
    collegeName: '',
    description: '',
    members: [],
    image: '/default-club-image.jpg',
    category: 'tech',
    profileAvatar: '',
    founderEmail: '',
    facultyEmail: '',
    type: 'tech',
    profilePicUrl: '',
    clubContact: '',
    requirements: '',
    wings: '',
  });
  const [event, setEvent] = useState<EventType[]>([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');

  // Function to check if current user is a member of the club
  const checkUserMembership = (clubMembers: any[], userEmail?: string): boolean => {
    if (!userEmail || !Array.isArray(clubMembers)) return false;
    return clubMembers.some(member => 
      member.email === userEmail || 
      member.userEmail === userEmail ||
      member.id === userEmail
    );
  };

  const getMemberCount = (c: { members?: unknown; memberCount?: number; membersCount?: number }): number => {
    if (typeof c?.members === 'number') return c.members as number;
    if (Array.isArray(c?.members)) return c.members.length;
    if (typeof c?.memberCount === 'number') return c.memberCount;
    if (typeof c?.membersCount === 'number') return c.membersCount;
    return 0;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (tok) setToken(tok);
      else {
        return;
      }
      if (sessionStorage.getItem('activeSession') != 'true') {
         toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => router.push('/auth/signin'),
          },
        });
        return;
      }
    }
  }, []);

  useEffect(() => {
    async function call() {
      if (!token) {
         toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => router.push('/auth/signin'),
          },
        });
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch club data
        const response = await axios.get<ClubApiResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log('Club data:', response.data.club);
        
        // Set club data
        const clubData = response.data.club;
        setClub({
          id: clubData.id,
          name: clubData.name,
          collegeName: clubData.collegeName,
          description: clubData.description,
          members: clubData.members || [],
          profileAvatar: clubData.members?.[0]?.profileAvatar,
          founderEmail: clubData.founderEmail,
          facultyEmail: clubData.facultyEmail,
          image: clubData.profilePicUrl || '/logozynvo.jpg',
          category: clubData.type || 'tech',
        });

        // Get current user email and check membership
        try {
          const userResponse = await axios.get<UserApiResponse>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/profile`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          
          const userEmail = (userResponse.data as UserApiResponse).user?.email;
          if (userEmail) {
            setCurrentUserEmail(userEmail);
            const isUserMember = checkUserMembership(clubData.members || [], userEmail);
            setIsJoined(isUserMember);
          }
        } catch (userError) {
          console.error('Error fetching user profile:', userError);
          // If we can't get user profile, assume not joined
          setIsJoined(false);
        }

        // Fetch events data - Fixed the API endpoint
        try {
          const response2 = await axios.get<EventResponse>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/eventByClub/${id}`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );

          const events = response2.data.event;

          const filteredEvents = events.map((e) => ({
            id: e.id,
            EventName: e.EventName,
            description: e.description,
            clubName: e.clubName,
            createdAt: new Date(e.createdAt), // Convert string to Date
            image: e.eventHeaderImage || '/default-event-image.jpg',
            title: e.EventName,
          }));

          setEvent(filteredEvents);
        } catch (eventError) {
          console.error('Error fetching events:', eventError);
          // Set empty events array if events fetch fails
          setEvent([]);
        }
        
      } catch (error: any) {
        console.error('Error fetching club data:', error);
        if (error.response?.status === 404) {
          toast('Club not found');
        } else {
          toast('Failed to load club data');
        }
      } finally {
        setLoading(false);
      }
    }

    if (token && id) {
      call();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!club || !club.id) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Club not found</h1>
          <p className="text-gray-400">The club you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const handleJoinClick = () => {
    if (!isJoined) {
      setIsJoinModalOpen(true);
    }
    // If already joined, do nothing (button is now disabled)
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmail(type);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${club.name} - ${club.collegeName}`,
      text: `Check out this amazing club: ${club.name} at ${club.collegeName}. ${club.description}`,
      url: window.location.href,
    };

    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success('Club shared successfully!');
      } catch (err) {
        // User cancelled sharing or error occurred
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          toast.error('Failed to share club');
        }
      }
    } else {
      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Club link copied to clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        toast.error('Failed to copy link to clipboard');
      }
    }
  };

  const getTypeColor = (type: string) => {
    const typeLower = type.toLowerCase();
    switch (typeLower) {
      case 'tech':
      case 'technology':
        return 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-400/30';
      case 'cultural':
        return 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30';
      case 'business':
        return 'from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-400/30';
      case 'social':
        return 'from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-400/30';
      case 'literature':
      case 'literary':
        return 'from-orange-500/20 to-red-500/20 text-orange-300 border-orange-400/30';
      case 'design':
        return 'from-pink-500/20 to-rose-500/20 text-pink-300 border-pink-400/30';
      case 'sports':
        return 'from-red-500/20 to-orange-500/20 text-red-300 border-red-400/30';
      case 'music':
        return 'from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-400/30';
      default:
        return 'from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation Header */}
      

      {/* Hero Section */}
      {/* Club Header Section with Hero Image */}
      <div className="relative h-72 md:h-96 w-full pb-6">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src={club.image || '/banners/profilebanner.jpg'}
              alt={club.name}
              width={1600}
              height={600}
              className="object-cover w-full h-full"
              priority
            />
            <div className="absolute"></div>
          </div>
        </div>

        {/* Centered Club Image */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative h-40 w-40 md:h-56 md:w-56 rounded-xl overflow-hidden border-4 border-yellow-500 shadow-2xl shadow-black/60 bg-gray-900/60">
            <Image
              src={club.image || '/logozynvo.jpg'}
              alt={club.name}
              width={224}
              height={224}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* College Name */}
        <div className="absolute top-8 left-4 md:left-8 z-10">
          <div className="flex items-center">
            <MapPin size={16} className="text-yellow-400 mr-2" />
            <span className="text-white text-sm font-medium">
              {club.collegeName}
            </span>
          </div>
        </div>
      </div>

      {/* Club Details */}
      <div className="max-w-7xl mx-auto px-4 pt-20">
        {/* Club Name and Basic Info */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {club.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="flex items-center text-gray-300">
              <Users size={16} className="mr-1" />
              <span className="text-sm sm:text-base">{getMemberCount(club)} members</span>
            </div>

            <span className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-700">
              {String(club.category || club.type || 'general').toString()}
            </span>

            {club.isPopular && (
              <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm border border-yellow-400/30">
                Popular
              </span>
            )}

            {club.isNew && (
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                New
              </span>
            )}
          </div>

          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            {club.description}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <button
              onClick={handleJoinClick}
              className={`px-6 py-2 rounded-lg font-medium ${
                isJoined
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-yellow-500 text-black hover:bg-yellow-400'
              } transition-colors`}
            >
              {isJoined ? 'Leave Club' : 'Join Club'}
            </button>

            <button 
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              title="Share this club"
            >
              <Share2 size={20} />
            </button>

            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
              <Flag size={20} />
            </button>
          </div>
        </div>

       {/* Navigation Tabs - Responsive Design */}
       <div className="sticky top-0 z-40 backdrop-blur-xl mt-6 sm:mt-8">
         <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8">
           {/* Mobile: Horizontal scroll tabs */}
           <div className="block sm:hidden py-4">
             <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
               <Button
                 onClick={() => setActiveTab('announcements')}
                 className={`flex-shrink-0 px-4 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                   activeTab === 'announcements'
                     ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg'
                     : 'text-gray-400 bg-gray-800/50 hover:text-white hover:bg-gray-700/50'
                 }`}
               >
                 <Bell className="w-4 h-4" />
                 <span className="text-sm">Announcements</span>
               </Button>
               <Button
                 onClick={() => setActiveTab('events')}
                 className={`flex-shrink-0 px-4 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                   activeTab === 'events'
                     ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg'
                     : 'text-gray-400 bg-gray-800/50 hover:text-white hover:bg-gray-700/50'
                 }`}
               >
                 <Calendar className="w-4 h-4" />
                 <span className="text-sm">Events</span>
                 <span className="px-1.5 py-0.5 bg-gray-600/50 text-xs rounded-full">{event.length}</span>
               </Button>
               <Button
                 onClick={() => setActiveTab('members')}
                 className={`flex-shrink-0 px-4 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                   activeTab === 'members'
                     ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg'
                     : 'text-gray-400 bg-gray-800/50 hover:text-white hover:bg-gray-700/50'
                 }`}
               >
                 <Users className="w-4 h-4" />
                 <span className="text-sm">Members</span>
                 <span className="px-1.5 py-0.5 bg-gray-600/50 text-xs rounded-full">{getMemberCount(club)}</span>
               </Button>
             </div>
           </div>

           {/* Desktop: Centered tabs */}
           <div className="hidden sm:flex justify-center py-6">
             <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-2 shadow-2xl">
               <div className="flex items-center gap-2">
                 <Button
                   onClick={() => setActiveTab('announcements')}
                   className={`px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 lg:gap-3 ${
                     activeTab === 'announcements'
                       ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-500/25 transform scale-105'
                       : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-105'
                   }`}
                 >
                   <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                   <span className="text-sm lg:text-base">Announcements</span>
                 </Button>
                 <Button
                   onClick={() => setActiveTab('events')}
                   className={`px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 lg:gap-3 ${
                     activeTab === 'events'
                       ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-500/25 transform scale-105'
                       : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-105'
                   }`}
                 >
                   <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
                   <span className="text-sm lg:text-base">Events</span>
                   <span className="px-2 py-1 bg-gray-600/50 text-xs rounded-full">{event.length}</span>
                 </Button>
                 <Button
                   onClick={() => setActiveTab('members')}
                   className={`px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 lg:gap-3 ${
                     activeTab === 'members'
                       ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-500/25 transform scale-105'
                       : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-105'
                   }`}
                 >
                   <Users className="w-4 h-4 lg:w-5 lg:h-5" />
                   <span className="text-sm lg:text-base">Members</span>
                   <span className="px-2 py-1 bg-gray-600/50 text-xs rounded-full">{getMemberCount(club)}</span>
                 </Button>
               </div>
             </div>
           </div>
         </div>
       </div>

      {/* Main Content - Responsive Design */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Tab Content */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Show announcement component for everyone */}
              <ZynvoClubAnnouncement club={club} />
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Events Header - Responsive Design */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Club Events</h2>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      className="bg-gray-800/50 rounded-lg sm:rounded-lg md:rounded-xl px-4 py-2 pl-10 text-white text-sm w-full sm:w-48 lg:w-64"
                    />
                  </div>
                  <button className="p-2 bg-gray-800/50 rounded-lg sm:rounded-lg md:rounded-xl text-gray-400 hover:text-white transition-colors touch-manipulation">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {event.length === 0 ? (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-8 sm:p-12 md:p-16 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    <CalendarDays className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Events Yet</h3>
                  <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">This club hasn't posted any events yet. Be the first to create one!</p>
                  <Button onClick={() => setIsCreateEventModalOpen(true)} className="px-4 py-2 sm:px-6 sm:py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg sm:rounded-xl font-semibold transition-colors text-sm sm:text-base touch-manipulation">
                    Create First Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {event.map((eventItem: EventType) => (
                    <div
                      key={eventItem.id}
                      className="group bg-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Event Image - Mobile Optimized */}
                        <div className="relative w-full md:w-80 h-40 sm:h-48 md:h-auto overflow-hidden">
                          <Image
                            src={eventItem.image || '/pic1.jpg'}
                            alt={eventItem.title || 'Event Image'}
                            width={320}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-yellow-500/90 text-black text-xs font-semibold rounded-full">
                              {eventItem.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Event Content - Mobile Optimized */}
                        <div className="flex-1 p-4 sm:p-6">
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2 sm:mb-3">
                                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors leading-tight">
                                  {eventItem.EventName}
                                </h3>
                                <button className="p-1.5 sm:p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all touch-manipulation">
                                  <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                              
                              <p className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base line-clamp-2">
                                {eventItem.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-400">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="truncate">{club.collegeName}</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="hidden sm:inline">Posted {eventItem.createdAt.toLocaleDateString()}</span>
                                  <span className="sm:hidden">{eventItem.createdAt.toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span>0 attending</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span>24 views</span>
                                </div>
                              </div>
                            </div>

                            {/* Event Actions - Mobile Optimized */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 pt-3 sm:pt-4">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <button className="px-4 py-2 sm:px-6 sm:py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation">
                                  <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                                  RSVP
                                </button>
                                <button 
                                  onClick={handleShare}
                                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all touch-manipulation"
                                  title="Share this event"
                                >
                                  <Share className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                                  <span className="hidden sm:inline">Share</span>
                                </button>
                                <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-red-400 transition-all touch-manipulation">
                                  <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                              <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all touch-manipulation self-end sm:self-auto">
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Members Header - Responsive Design */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Club Members</h2>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="bg-gray-800/50 rounded-lg sm:rounded-xl px-4 py-2 pl-10 text-white text-sm w-full sm:w-48 lg:w-64"
                    />
                  </div>
                  <select className="bg-gray-800/50 rounded-lg sm:rounded-xl px-3 py-2 text-white text-sm">
                    <option>All</option>
                    <option>Admins</option>
                    <option>Recent</option>
                  </select>
                </div>
              </div>

              {Array.isArray(club.members) && club.members.length > 0 ? (
                <div className="space-y-4">
                  {/* Member List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {club.members.slice(0, 20).map((member: any, index: number) => (
                      <div
                        key={member.id || index}
                        className="group bg-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Avatar - Mobile Optimized */}
                          <div className="relative">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden transition-colors">
                              <Image
                                src={member.profileAvatar || '/default-avatar.jpg'}
                                alt={member.name || 'Member'}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
                          </div>

                          {/* Member Info - Mobile Optimized */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold truncate text-sm sm:text-base">
                              {member.name || member.fullName || member.username || 'Member'}
                            </h4>
                            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400">
                              {member.course && (
                                <span className="truncate">{member.course}</span>
                              )}
                              {member.course && member.year && <span>•</span>}
                              {member.year && (
                                <span>{member.year} Year</span>
                              )}
                            </div>
                            {member.email && (
                              <p className="text-xs text-gray-500 truncate">{member.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More */}
                  {club.members.length > 20 && (
                    <div className="text-center">
                      <button className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl font-medium transition-all">
                        Load More Members ({club.members.length - 20} remaining)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-16 text-center">
                  <div className="w-24 h-24 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Members Yet</h3>
                  <p className="text-gray-400 mb-6">Be the first to join this amazing club!</p>
                  {isJoined ? (
                    <div className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold flex items-center justify-center">
                      <UserCheck className="w-5 h-5 mr-2" />
                      You are already joined
                    </div>
                  ) : (
                    <button
                      onClick={handleJoinClick}
                      className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-semibold transition-colors"
                    >
                      Join Now
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-black/50 mt-8 sm:mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm sm:text-base">Z</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-white">Zynvo</span>
              <span className="text-gray-500 text-xs sm:text-sm hidden sm:inline">• Campus Communities</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors touch-manipulation">
                  <Globe className="w-4 h-4" />
                </a>
                <button 
                  onClick={handleShare}
                  className="text-gray-400 hover:text-yellow-400 transition-colors touch-manipulation"
                  title="Share this club"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
                © 2024 Zynvo. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Join Club Modal */}
      {club && (
        <JoinClubModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          clubName={club.name}
          clubImage={club.image || '/logozynvo.jpg'}
          clubId={id}
        />
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
      />
    </div>
    </div>
  );
}