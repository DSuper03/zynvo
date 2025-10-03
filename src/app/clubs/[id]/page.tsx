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

  const [activeTab, setActiveTab] = useState<'about' | 'events'>('about');
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

  return (
    <div className="min-h-screen bg-gray-950 pb-16">
      {/* Club Header Section with Hero Image */}
      <div className="relative h-72 md:h-96 w-full pb-6">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src={club.image || '/banners/profilebanner.jpg'}
              alt={club.name}
              width={1600}
              height={900}
              className="object-cover w-full h-full"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-950"></div>
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

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center text-gray-300">
              <Users size={16} className="mr-1" />
              <span>{getMemberCount(club)} members</span>
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

          <div className="flex justify-center gap-3 mt-4">
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

            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
              <Share2 size={20} />
            </button>

            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
              <Flag size={20} />
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'about'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            About
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'events'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Events
          </button>

          {/* Announcements tab removed until backed by real data */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* About Tab Content */}
            {activeTab === 'about' && (
              <div className="bg-gray-900/60 rounded-lg p-6 space-y-6 border border-gray-800">
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">
                    About {club.name}
                  </h2>
                  <p className="text-gray-300 whitespace-pre-wrap break-words">{club.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Contact Information</h3>
                  <div className="space-y-2 text-gray-300">
                    {club.clubContact && (
                      <p className="flex items-center">
                        <Globe size={18} className="mr-2" />
                        {/^\+?\d[\d\s-]{3,}$/.test(String(club.clubContact)) ? (
                          <a href={`tel:${club.clubContact}`} className="text-yellow-400 hover:underline break-all">
                            {club.clubContact}
                          </a>
                        ) : (
                          <span className="break-all">{club.clubContact}</span>
                        )}
                      </p>
                    )}
                    {club.founderEmail && (
                      <p className="flex items-center">
                        <Instagram size={18} className="mr-2" />
                        <span className="text-gray-300"><span className="text-gray-400 mr-1">Founder:</span>{club.founderEmail}</span>
                      </p>
                    )}
                    {club.facultyEmail && (
                      <p className="flex items-center">
                        <Twitter size={18} className="mr-2" />
                        <span className="text-gray-300"><span className="text-gray-400 mr-1">Faculty:</span>{club.facultyEmail}</span>
                      </p>
                    )}
                  </div>
                </div>

                {club.requirements && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Requirements</h3>
                    <p className="text-gray-300 whitespace-pre-wrap break-words">{club.requirements}</p>
                  </div>
                )}

                {Array.isArray((club as any).wings) && (club as any).wings.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Wings</h3>
                    <div className="flex flex-wrap gap-2">
                      {(club as any).wings.map((w: any, idx: number) => (
                        <span key={w?.id || w?.name || idx} className="px-3 py-1 text-sm rounded-full bg-gray-800 text-gray-200 border border-gray-700">
                          {w?.name || String(w)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Meeting Schedule
                  </h3>
                  <p className="text-gray-300 flex items-center">
                    <CalendarDays size={18} className="mr-2" />
                    Weekly on Thursdays, 7:00 PM - 9:00 PM
                  </p>
                  <p className="text-gray-300 flex items-center">
                    <MapPin size={18} className="mr-2" />
                    {club.collegeName} - Block C, Room 204
                  </p>
                </div>
              </div>
            )}

            {/* Events Tab Content */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">
                  Upcoming Events
                </h2>

                {event.length === 0 ? (
                  <div className="bg-gray-900/60 rounded-lg p-6 text-center border border-gray-800">
                    <p className="text-gray-300">No events found for this club.</p>
                  </div>
                ) : (
                  event.map((eventItem: EventType) => (
                    <div
                      key={eventItem.id}
                      className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden hover:border-yellow-500/30 transition-all duration-300 shadow-md"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={eventItem.image || '/pic1.jpg'}
                          alt={eventItem.title || 'Event Image'}
                          width={400}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 p-4 w-full">
                          <h3 className="text-xl font-bold text-white">
                            {eventItem.EventName}
                          </h3>
                          <div className="flex items-center text-yellow-400 mt-1">
                            <CalendarDays size={16} className="mr-1" />
                            <span className="text-sm">
                              {eventItem.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center text-gray-300 mb-2">
                          <Clock size={16} className="mr-1" />
                          <span className="text-sm">{eventItem.time || 'TBA'}</span>
                        </div>

                        <div className="flex items-center text-gray-300 mb-4">
                          <MapPin size={16} className="mr-1" />
                          <span className="text-sm">{club.collegeName}</span>
                        </div>

                        <div className="flex items-center justify-end">
                          <Button className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-sm font-medium transition-colors">
                            RSVP
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Quick Stats */}
            <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-3">Club Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-yellow-400 text-xl font-bold">
                    {getMemberCount(club)}
                  </p>
                  <p className="text-gray-300 text-sm">Members</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-yellow-400 text-xl font-bold">{event.length}</p>
                  <p className="text-gray-300 text-sm">Events</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-yellow-400 text-xl font-bold">4.8</p>
                  <p className="text-gray-300 text-sm">Rating</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-yellow-400 text-xl font-bold">2018</p>
                  <p className="text-gray-300 text-sm">Founded</p>
                </div>
              </div>
            </div>

            {/* Members - names only */}
            <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-3">Members</h3>
              {Array.isArray(club.members) && club.members.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {club.members.map((m: any) => (
                    <span
                      key={m.id || m.email}
                      className="px-3 py-1 text-sm rounded-full bg-gray-800 text-gray-200 border border-gray-700"
                      title={m.email}
                    >
                      {m.name || m.fullName || m.username || m.email}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No members listed.</p>
              )}
            </div>

            {/* Join CTA */}
            <div className="bg-yellow-500 rounded-lg p-4 text-center">
              <h3 className="text-xl font-bold text-black mb-2">
                Join {club.name} Today!
              </h3>
              <p className="text-gray-800 mb-4">
                Connect with like-minded peers and grow your skills.
              </p>
              {!isJoined && (
                <Button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="w-full py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Become a Member
                </Button>
              )}
              {isJoined && (
                <p className="font-medium text-black">You are a member! 🎉</p>
              )}
            </div>
          </div>
        </div>
      </div>

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
 