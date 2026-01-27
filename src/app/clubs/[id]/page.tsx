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
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react';
import JoinClubModal from '../joinclub';
import CreateEventModal from '../../events/components/EventCreationModel';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
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
import NoTokenModal from '@/components/modals/remindModal';

// All dynamic content is driven by backend data; no hardcoded demo content

export default function ClubPage() {
  const param = useParams();
  const id = param.id as string;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'announcements' | 'events' | 'members' | 'social'>('events');
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
 const [usersClub,setUserClub]=useState<boolean>(false)
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<{ email?: string; id?: string; clubName?: string } | null>(null);
  const [userJoinedClubIds, setUserJoinedClubIds] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [socialLinks, setSocialLinks] = useState<{
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  }>({});
  const [openCriteriaModal, setOpenCriteriaModal] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasTokenForModal, setHasTokenForModal] = useState(false);


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
      const session = sessionStorage.getItem('activeSession');
      
      if (tok) {
        setToken(tok);
        setHasTokenForModal(true);
      } else {
        // No token - user needs to sign up
        setHasTokenForModal(false);
        setIsAuthModalOpen(true);
        return;
      }
      
      if (session !== 'true') {
        // Has token but no session - user needs to sign in
        toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => router.push('/auth/signin'),
          },
        });
        setHasTokenForModal(true);
        setIsAuthModalOpen(true);
        return;
      }
    }
  }, [router]);
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
          requirements: (clubData as any).requirements || '',
          clubContact: (clubData as any).clubContact || '',
          wings: (clubData as any).wings || '',
        });

        // Set social media links
        setSocialLinks({
          instagram: (clubData as any).instagram || undefined,
          linkedin: (clubData as any).linkedin || undefined,
          twitter: (clubData as any).twitter || undefined,
        });

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

          const filteredEvents = events.map((e) => {
            const imageUrl = e.posterUrl || e.eventHeaderImage || '/default-event-image.jpg';
            console.log('Event image mapping:', {
              eventId: e.id,
              eventName: e.EventName,
              posterUrl: e.posterUrl,
              eventHeaderImage: e.eventHeaderImage,
              finalImage: imageUrl
            });
            return {
              id: e.id,
              EventName: e.EventName,
              description: e.description,
              clubName: e.clubName,
              createdAt: new Date(e.createdAt), // Convert string to Date
              image: imageUrl,
              title: e.EventName,
            };
          });

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
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const userResponse = await axios.get<UserApiResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = userResponse.data.user as any;
     
      // Check if the user's club ID matches the current club ID
      if (userData.clubId === id) {
        setUserClub(true);
       
      }
     
      
      setCurrentUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (token) {
    fetchUserData();
  }
}, [token]);

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
  };

  const handleLeaveClub = async () => {
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
      const leaveResponse = await axios.put<{ message?: string; msg?: string }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/leaveClub`,
        null,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success(leaveResponse.data.message || leaveResponse.data.msg || 'Successfully left the club');
      setIsJoined(false);
      
      // Refresh the page to update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error leaving club:', error);
      toast.error(error.response?.data?.message || error.response?.data?.msg || 'Failed to leave club. Please try again.');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 w-full h-full">
      {/* Hero Section - Compact & Minimalist */}
      <div className="relative w-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>

        {/* Compact Header with Club Info */}
        <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Club Logo - Compact */}
            <div className="relative flex-shrink-0">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-yellow-400/30 shadow-lg bg-gray-900/50 backdrop-blur-sm">
                <Image
                  src={club.image || '/logozynvo.jpg'}
                  alt={club.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-yellow-400/10 blur-xl -z-10"></div>
            </div>

            {/* Club Info Section */}
            <div className="flex-1 min-w-0">
              {/* College Name - Compact */}
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-yellow-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm font-medium truncate">
                  {club.collegeName}
                </span>
              </div>

              {/* Club Name */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {club.name}
              </h1>

              {/* Quick Stats - Compact */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center text-gray-300 bg-gray-800/50 px-2.5 py-1 rounded-lg text-xs">
                  <Users size={12} className="mr-1.5 text-yellow-400" />
                  <span>{getMemberCount(club)} members</span>
                </div>
                <span className="bg-gray-800/50 text-gray-200 px-2.5 py-1 rounded-lg text-xs border border-gray-700/50">
                  {String(club.category || club.type || 'general').toString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Club Details - Compact Layout */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Left: Description & Info */}
          <div className="flex-1 space-y-4">
            {/* Description */}
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">About</h3>
                <button
                  onClick={() => setOpenCriteriaModal(true)}
                  className="text-xs text-yellow-400/80 hover:text-yellow-300 transition-colors"
                  title="View membership criteria"
                >
                  Membership Criteria →
                </button>
              </div>
              <p
                className="text-gray-300 text-sm leading-relaxed"
                style={
                  isDescriptionExpanded
                    ? undefined
                    : {
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical' as any,
                        WebkitLineClamp: 3,
                        overflow: 'hidden',
                      }
                }
              >
                {club.description || 'No description available.'}
              </p>
              {club?.description && club.description.length > 150 && (
                <button
                  onClick={() => setIsDescriptionExpanded((v) => !v)}
                  className="mt-2 text-xs text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                >
                  {isDescriptionExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

            {/* Additional Info Tags */}
            <div className="flex flex-wrap gap-2">
              {club.isPopular && (
                <span className="bg-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-lg text-xs border border-yellow-400/30 font-medium">
                  Popular
                </span>
              )}
              {club.isNew && (
                <span className="bg-yellow-500 text-black px-2.5 py-1 rounded-lg text-xs font-medium">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Right: Action Buttons - Compact */}
          <div className="flex flex-col gap-3 lg:min-w-[200px]">
            {usersClub ? (
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/40 text-green-300 text-sm font-medium">
                <UserCheck className="w-4 h-4" />
                Hi member
              </div>
            ) : (
              <Button
                onClick={handleJoinClick}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-2.5 transition-all shadow-lg shadow-yellow-500/20"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join Club
              </Button>
            )}

            {isAdmin && (
              <Link href={`/admin/${id}`}>
                <Button
                  variant="outline"
                  className="w-full bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/50 text-blue-400 hover:text-blue-300 font-medium py-2.5 transition-all text-sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Controls
                </Button>
              </Link>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleShare}
                variant="outline"
                size="icon"
                className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 text-white border-gray-700/50 transition-colors"
                title="Share this club"
              >
                <Share2 size={18} />
              </Button>
              <Button 
                variant="outline"
                size="icon"
                className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 text-white border-gray-700/50 transition-colors"
                title="Report club"
              >
                <Flag size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

       {/* Navigation Tabs - Responsive Design */}
       <div className="sticky top-0 z-40 backdrop-blur-xl mt-6 sm:mt-8">
         <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8">
           {/* Mobile: Horizontal scroll tabs */}
           <div className="block sm:hidden py-4">
             <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
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
               <Button
                 onClick={() => setActiveTab('social')}
                 className={`flex-shrink-0 px-4 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                   activeTab === 'social'
                     ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg'
                     : 'text-gray-400 bg-gray-800/50 hover:text-white hover:bg-gray-700/50'
                 }`}
               >
                 <Share2 className="w-4 h-4" />
                 <span className="text-sm">Social</span>
               </Button>
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
             </div>
           </div>

           {/* Desktop: Centered tabs */}
           <div className="hidden sm:flex justify-center py-6">
             <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-2 shadow-2xl">
               <div className="flex items-center gap-2">
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
                 <Button
                   onClick={() => setActiveTab('social')}
                   className={`px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 lg:gap-3 ${
                     activeTab === 'social'
                       ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-500/25 transform scale-105'
                       : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-105'
                   }`}
                 >
                   <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
                   <span className="text-sm lg:text-base">Social</span>
                 </Button>
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
               </div>
             </div>
           </div>
         </div>
       </div>

      {/* Main Content - Responsive Design */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Tab Content */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
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

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Social Header - Responsive Design */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Social Media</h2>
                </div>
              </div>

              {/* Social Links */}
              {(socialLinks.instagram || socialLinks.linkedin || socialLinks.twitter) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Instagram */}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Instagram className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Instagram</h3>
    
                        </div>
                        <div className="flex items-center text-white/90 text-sm group-hover:text-white transition-colors">
                          <span>Visit Profile</span>
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </a>
                  )}

                  {/* LinkedIn */}
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Linkedin className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">LinkedIn</h3>
                          <p className="text-white/80 text-sm truncate max-w-full overflow-hidden">{socialLinks.linkedin}</p>
                        </div>
                        <div className="flex items-center text-white/90 text-sm group-hover:text-white transition-colors">
                          <span>Visit Profile</span>
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </a>
                  )}

                  {/* Twitter */}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/25"
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Twitter className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Twitter</h3>
                        
                        </div>
                        <div className="flex items-center text-white/90 text-sm group-hover:text-white transition-colors">
                          <span>Visit Profile</span>
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              ) : (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-8 sm:p-12 md:p-16 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    <Share2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Social Media Links</h3>
                  <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">This club hasn't added any social media links yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Show announcement component for everyone */}
              <ZynvoClubAnnouncement club={club} />
            </div>
          )}
        </div>
      </div>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-black/80 backdrop-blur-sm mt-8 sm:mt-12 md:mt-16 border-t border-gray-800/50 w-full">
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
          requirements={club.requirements}
        />
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
      />

      {/* Membership Criteria Modal */}
      {openCriteriaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpenCriteriaModal(false)}></div>
          <div className="relative z-10 w-full max-w-xl mx-4 bg-gray-950 border border-yellow-400/30 rounded-2xl p-6 text-white shadow-[0_0_30px_rgba(255,215,0,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-yellow-300">Membership Criteria</h3>
              <button
                onClick={() => setOpenCriteriaModal(false)}
                className="text-sm text-yellow-400/80 hover:text-yellow-300"
              >
                Close
              </button>
            </div>
            <div className="max-h-80 overflow-auto pr-1 text-gray-200 leading-relaxed whitespace-pre-wrap">
              {club?.requirements?.trim() ? club.requirements : 'No membership criteria provided.'}
            </div>
          </div>
        </div>
      )}

      <NoTokenModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} hasToken={hasTokenForModal} />
    </div>
  );
}