'use client';

//need to add a leave club button

import React, { useState, useEffect } from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import {
  CalendarDays,
  Users,
  MapPin,
  Globe,
  Instagram,
  Twitter,
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
} from 'lucide-react';
import JoinClubModal from '../joinclub';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
  ClubPageProps,
  ClubTypeProps,
  EventResponse,
  EventType,
  Response,
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
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// All dynamic content is driven by backend data; no hardcoded demo content

export default function ClubPage({}: ClubPageProps) {
  const param = useParams();
  const id = param.id as string;

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
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'members'>('about');

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
    } else {
      setIsJoined(false); // Just leave the club if already joined
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

  const getTypeColor = (type: string) => {
    const typeLower = type.toLowerCase();
    switch (typeLower) {
      case 'tech':
      case 'technology':
        return 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-400/30 shadow-cyan-500/10';
      case 'cultural':
        return 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30 shadow-purple-500/10';
      case 'business':
        return 'from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-400/30 shadow-emerald-500/10';
      case 'social':
        return 'from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-400/30 shadow-yellow-500/10';
      case 'literature':
      case 'literary':
        return 'from-orange-500/20 to-red-500/20 text-orange-300 border-orange-400/30 shadow-orange-500/10';
      case 'design':
        return 'from-pink-500/20 to-rose-500/20 text-pink-300 border-pink-400/30 shadow-pink-500/10';
      case 'sports':
        return 'from-red-500/20 to-orange-500/20 text-red-300 border-red-400/30 shadow-red-500/10';
      case 'music':
        return 'from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-400/30 shadow-indigo-500/10';
      case 'drama':
        return 'from-violet-500/20 to-purple-500/20 text-violet-300 border-violet-400/30 shadow-violet-500/10';
      default:
        return 'from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-400/30 shadow-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden mb-16 md:mb-24">
        {/* Background Image with Enhanced Overlay */}
        <div className="absolute inset-0 z-0">
            <Image
              src={club.image || '/banners/profilebanner.jpg'}
              alt={club.name}
            width={1920}
            height={1080}
              className="object-cover w-full h-full"
              priority
            />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
          </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-500/15 rounded-full blur-xl animate-pulse delay-500"></div>
          {/* Bottom fade to separate tabs from content */}
          <div className="absolute bottom-0 left-0 right-0 h-20 md:h-28 bg-gradient-to-b from-transparent to-black/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-12">
          {/* Top Bar */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50">
              <Building className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">{club.collegeName}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-3 bg-black/30 backdrop-blur-sm rounded-full border border-gray-700/50 text-white hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 hover:scale-110">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 bg-black/30 backdrop-blur-sm rounded-full border border-gray-700/50 text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:scale-110">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto">
              {/* Club Logo */}
              <div className="relative mb-8 mx-auto w-32 h-32 md:w-40 md:h-40">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-yellow-500/50 shadow-2xl shadow-yellow-500/20 bg-gray-900/60 backdrop-blur-sm">
            <Image
              src={club.image || '/logozynvo.jpg'}
              alt={club.name}
                    width={160}
                    height={160}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

              {/* Club Name */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent animate-gradient">
                  {club.name}
                </span>
              </h1>

              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getTypeColor(club.category || club.type || 'general')} border shadow-lg backdrop-blur-sm`}>
                  {String(club.category || club.type || 'General').charAt(0).toUpperCase() + String(club.category || club.type || 'General').slice(1)}
            </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
        </div>
      </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-semibold">{getMemberCount(club)}</span>
                  <span className="text-gray-300">Members</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CalendarDays className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-semibold">{event.length}</span>
                  <span className="text-gray-300">Events</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-semibold">Active</span>
            </div>
          </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleJoinClick}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl ${
                isJoined
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 shadow-green-500/25'
                      : 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 shadow-yellow-500/25'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Award className="w-5 h-5 inline mr-2" />
                      You're a Member
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 inline mr-2" />
                      Join Club
                    </>
                  )}
            </button>

                <button className="px-6 py-4 rounded-2xl font-semibold text-white border-2 border-yellow-500/50 hover:border-yellow-400 hover:bg-yellow-500/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  <MessageCircle className="w-5 h-5 inline mr-2" />
                  Contact Club
            </button>
              </div>
          </div>
        </div>

          {/* Bottom Navigation */}
          <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-4 md:bottom-8 flex justify-center py-3">
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-700/50">
          <button
            onClick={() => setActiveTab('about')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'about'
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'events'
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Events
          </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === 'members'
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Members
              </button>
            </div>
          </div>
        </div>
                </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 md:mt-16 pt-12 pb-12">
        {/* Tab Content */}
        <div className="space-y-12">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              {/* Description Section */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">About this Club</h2>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{club.description}</p>
                </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Founder Card */}
                {club.founderEmail && (
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Crown className="w-6 h-6 text-black" />
                      </div>
                  <div>
                        <h3 className="text-lg font-bold text-white">Founder</h3>
                        <p className="text-gray-400 text-sm">Club Founder</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-yellow-400" />
                        <span className="text-gray-300 font-mono text-sm">{club.founderEmail}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(club.founderEmail, 'Founder Email')}
                        className="p-2 rounded-lg bg-gray-700/50 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-400 transition-all duration-200 hover:scale-110"
                      >
                        {copiedEmail === 'Founder Email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Faculty Card */}
                {club.facultyEmail && (
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                  <div>
                        <h3 className="text-lg font-bold text-white">Faculty Mentor</h3>
                        <p className="text-gray-400 text-sm">Faculty Advisor</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-300 font-mono text-sm">{club.facultyEmail}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(club.facultyEmail, 'Faculty Email')}
                        className="p-2 rounded-lg bg-gray-700/50 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all duration-200 hover:scale-110"
                      >
                        {copiedEmail === 'Faculty Email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements */}
              {club.requirements && (
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-2xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Requirements</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{club.requirements}</p>
                  </div>
                )}

              {/* Club Contact */}
              {club.clubContact && (
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Club Contact</h3>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl">
                    {/^\+?\d[\d\s-]{3,}$/.test(String(club.clubContact)) ? (
                      <>
                        <Phone className="w-5 h-5 text-purple-400" />
                        <a href={`tel:${club.clubContact}`} className="text-purple-400 hover:text-purple-300 transition-colors font-mono">
                          {club.clubContact}
                        </a>
                      </>
                    ) : (
                      <>
                        <Globe className="w-5 h-5 text-purple-400" />
                        <span className="text-gray-300 font-mono">{club.clubContact}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              </div>
            )}

          {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
              </div>

                {event.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-700/50">
                  <div className="w-24 h-24 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                    <CalendarDays className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Events Yet</h3>
                  <p className="text-gray-400">This club hasn't posted any events yet. Check back later!</p>
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {event.map((eventItem: EventType) => (
                    <div
                      key={eventItem.id}
                      className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/10"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={eventItem.image || '/pic1.jpg'}
                          alt={eventItem.title || 'Event Image'}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-yellow-500/90 text-black text-xs font-semibold rounded-full">
                              {eventItem.createdAt.toLocaleDateString()}
                            </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                          {eventItem.EventName}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {eventItem.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{club.collegeName}</span>
                        </div>
                          <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black rounded-xl font-semibold text-sm hover:from-yellow-400 hover:to-yellow-300 transition-all duration-200 hover:scale-105">
                            RSVP
                          </button>
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
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-black" />
                </div>
                  <h2 className="text-2xl font-bold text-white">Club Members</h2>
                </div>
                <span className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full text-sm">
                  {getMemberCount(club)} Members
                </span>
            </div>

              {Array.isArray(club.members) && club.members.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {club.members.slice(0, 12).map((member: any, index: number) => (
                    <div
                      key={member.id || index}
                      className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 text-center"
                    >
                      <div className="relative w-16 h-16 mx-auto mb-3">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-yellow-500/50">
                          <Image
                            src={member.profileAvatar || '/default-avatar.jpg'}
                            alt={member.name || 'Member'}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                        {member.name || member.fullName || member.username || 'Member'}
                      </h4>
                      {member.course && (
                        <p className="text-gray-400 text-xs line-clamp-1">{member.course}</p>
                      )}
                      {member.year && (
                        <p className="text-yellow-400 text-xs font-medium">{member.year} Year</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-700/50">
                  <div className="w-24 h-24 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Members Yet</h3>
                  <p className="text-gray-400">Be the first to join this amazing club!</p>
                </div>
              )}
            </div>
          )}
        </div>
            </div>

      {/* Footer Section */}
      <footer className="bg-black border-t border-gray-800/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl flex items-center justify-center">
                  <span className="text-black font-bold text-lg">Z</span>
                </div>
                <span className="text-2xl font-bold text-white">Zynvo</span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                Empowering campus communities through technology. Connect, collaborate, and grow together.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Powered by</span>
                <span className="text-yellow-400 font-semibold">Zynvo</span>
              </div>
              
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 hover:scale-110">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 hover:scale-110">
                  <Globe className="w-5 h-5" />
                </a>
          </div>
        </div>
      </div>
          
          <div className="border-t border-gray-800/50 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Zynvo. All rights reserved. Built with ❤️ for campus communities.
            </p>
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
    </div>
  );
}
 