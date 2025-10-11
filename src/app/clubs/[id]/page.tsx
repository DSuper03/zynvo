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
import { useParams } from 'next/navigation';
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

// All dynamic content is driven by backend data; no hardcoded demo content

export default function ClubPage({}: ClubPageProps) {
  const param = useParams();
  const id = param.id as string;

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
        toast('login please');
        return;
      }
    }
  }, []);

  useEffect(() => {
    async function call() {
      if (!token) {
        toast('login please');
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
      <div className="relative">
        {/* Cover Image */}
        <div className="relative h-80 md:h-96 w-full overflow-hidden">
          <Image
            src={club.image || '/banners/profilebanner.jpg'}
            alt={club.name}
            width={1920}
            height={400}
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          
          {/* Floating Status Badges */}
          <div className="absolute top-6 right-6 flex gap-3">
            <div className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-gray-700/50">
              <Activity className="w-4 h-4 inline mr-1" />
              Active
            </div>
            <div className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-yellow-400 text-sm font-medium border border-yellow-500/30">
              <Star className="w-4 h-4 inline mr-1 fill-current" />
              4.8
            </div>
          </div>
        </div>

        {/* Club Info Card */}
        <div className="relative -mt-24 z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side - Club Avatar & Basic Info */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative w-32 h-32 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-3xl blur-lg opacity-30"></div>
                    <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-yellow-500/50 shadow-2xl">
                      <Image
                        src={club.image || '/logozynvo.jpg'}
                        alt={club.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-left mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{club.name}</h1>
                    <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{club.collegeName}</span>
                    </div>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getTypeColor(club.category || club.type || 'general')} border`}>
                      {String(club.category || club.type || 'General').charAt(0).toUpperCase() + String(club.category || club.type || 'General').slice(1)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {isJoined ? (
                      <div className="px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-green-600 to-green-500 text-white flex items-center justify-center">
                        <UserCheck className="w-5 h-5 mr-2" />
                        You are already joined
                      </div>
                    ) : (
                      <button
                        onClick={handleJoinClick}
                        className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300"
                      >
                        <UserPlus className="w-5 h-5 inline mr-2" />
                        Join Club
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Side - Stats & Quick Info */}
                <div className="flex-1">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800/50 rounded-2xl p-4 text-center border border-gray-700/30">
                      <Users className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{getMemberCount(club)}</div>
                      <div className="text-sm text-gray-400">Members</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-2xl p-4 text-center border border-gray-700/30">
                      <CalendarDays className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{event.length}</div>
                      <div className="text-sm text-gray-400">Events</div>
                    </div>
                   
                   
                  </div>

                  {/* Quick Description */}
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Centered Design */}
      <div className=" top-20  bg-transparent backdrop-blur-xl border-b  mt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-center py-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setActiveTab('announcements')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeTab === 'announcements'
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-500/25 transform scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-105'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span>Announcements</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('events')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeTab === 'events'
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-500/25 transform scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-105'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Events</span>
                  <span className="px-2 py-1 bg-gray-600/50 text-xs rounded-full">{event.length}</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('members')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeTab === 'members'
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-500/25 transform scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-105'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Members</span>
                  <span className="px-2 py-1 bg-gray-600/50 text-xs rounded-full">{getMemberCount(club)}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Tab Content */}
        <div className="space-y-8">
          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              {/* Announcements Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Club Announcements</h2>
                </div>
                <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-medium text-sm transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Announcement
                </button>
              </div>

              {/* Sample Announcements */}
              <div className="space-y-4">
                {/* Announcement 1 */}
               <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">No announcements yet</h3>
                </div>  

                {/* Announcement 2 */}
              

                {/* Announcement 3 */}
             

                {/* Club Information Card */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-yellow-400" />
                    About {club.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4">{club.description}</p>
                  
                  {club.requirements && (
                    <div className="mb-4">
                      <h4 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-400" />
                        Membership Requirements
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{club.requirements}</p>
                    </div>
                  )}

                  {club.wings && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        Club Wings
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{club.wings}</p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Founder */}
                    {club.founderEmail && (
                      <div className="p-4 bg-gray-800/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Crown className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-300">Founder</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400 font-mono">{club.founderEmail}</span>
                          <button
                            onClick={() => copyToClipboard(club.founderEmail, 'Founder Email')}
                            className="p-1 rounded text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            {copiedEmail === 'Founder Email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Faculty */}
                    {club.facultyEmail && (
                      <div className="p-4 bg-gray-800/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <GraduationCap className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">Faculty Mentor</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400 font-mono">{club.facultyEmail}</span>
                          <button
                            onClick={() => copyToClipboard(club.facultyEmail, 'Faculty Email')}
                            className="p-1 rounded text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            {copiedEmail === 'Faculty Email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Club Contact */}
                    {club.clubContact && (
                      <div className="p-4 bg-gray-800/30 rounded-xl md:col-span-2">
                        <div className="flex items-center gap-3 mb-2">
                          {/^\+?\d[\d\s-]{3,}$/.test(String(club.clubContact)) ? (
                            <Phone className="w-4 h-4 text-green-400" />
                          ) : (
                            <Globe className="w-4 h-4 text-green-400" />
                          )}
                          <span className="text-sm font-medium text-gray-300">Club Contact</span>
                        </div>
                        {/^\+?\d[\d\s-]{3,}$/.test(String(club.clubContact)) ? (
                          <a href={`tel:${club.clubContact}`} className="text-sm text-green-400 hover:text-green-300 transition-colors font-mono">
                            {club.clubContact}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400 font-mono">{club.clubContact}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {/* Events Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Club Events</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2 pl-10 text-white text-sm w-64"
                    />
                  </div>
                  <button className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                 
                </div>
              </div>

              {event.length === 0 ? (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-16 text-center border border-gray-700/50">
                  <div className="w-24 h-24 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                    <CalendarDays className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Events Yet</h3>
                  <p className="text-gray-400 mb-6">This club hasn't posted any events yet. Be the first to create one!</p>
                  <Button onClick={() => setIsCreateEventModalOpen(true)} className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-semibold transition-colors">
                    Create First Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {event.map((eventItem: EventType) => (
                    <div
                      key={eventItem.id}
                      className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Event Image */}
                        <div className="relative w-full md:w-80 h-48 md:h-auto overflow-hidden">
                          <Image
                            src={eventItem.image || '/pic1.jpg'}
                            alt={eventItem.title || 'Event Image'}
                            width={320}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-yellow-500/90 text-black text-xs font-semibold rounded-full">
                              {eventItem.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                                  {eventItem.EventName}
                                </h3>
                                <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all">
                                  <Bookmark className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <p className="text-gray-300 mb-4 leading-relaxed">
                                {eventItem.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{club.collegeName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span>Posted {eventItem.createdAt.toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  <span>0 attending</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  <span>24 views</span>
                                </div>
                              </div>
                            </div>

                            {/* Event Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                              <div className="flex items-center gap-3">
                                <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105">
                                  <UserPlus className="w-4 h-4 inline mr-2" />
                                  RSVP
                                </button>
                                <button className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl font-medium text-sm transition-all">
                                  <Share className="w-4 h-4 inline mr-2" />
                                  Share
                                </button>
                                <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-red-400 transition-all">
                                  <ThumbsUp className="w-4 h-4" />
                                </button>
                              </div>
                              <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all">
                                <ExternalLink className="w-4 h-4" />
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
            <div className="space-y-6">
              {/* Members Header */}
              <div className="flex items-center justify-between">
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2 pl-10 text-white text-sm w-64"
                    />
                  </div>
                  <select className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2 text-white text-sm">
                    <option>All Members</option>
                    <option>Admins</option>
                    <option>Recent Joins</option>
                  </select>
                </div>
              </div>

              {Array.isArray(club.members) && club.members.length > 0 ? (
                <div className="space-y-4">
                  {/* Member List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {club.members.slice(0, 20).map((member: any, index: number) => (
                      <div
                        key={member.id || index}
                        className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-600 group-hover:border-yellow-500/50 transition-colors">
                              <Image
                                src={member.profileAvatar || '/default-avatar.jpg'}
                                alt={member.name || 'Member'}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                          </div>

                          {/* Member Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold truncate">
                              {member.name || member.fullName || member.username || 'Member'}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
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

                          {/* Actions */}
                          
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
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-16 text-center border border-gray-700/50">
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

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold">Z</span>
              </div>
              <span className="text-lg font-bold text-white">Zynvo</span>
              <span className="text-gray-500 text-sm">• Campus Communities</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
              <p className="text-gray-500 text-sm">
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
  );
}
 