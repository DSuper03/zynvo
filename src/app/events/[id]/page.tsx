'use client';

import { Button } from '@/components/ui/button';
import { EventByIdResponse, respnseUseState } from '@/types/global-Interface';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import dotenv from 'dotenv';
import Image from 'next/image';
import {
  Calendar as CalendarIcon,
  MapPin,
  Globe,
  CheckSquare,
  Square,
  AlarmClock,
  Phone,
  Mail,
  Share2,
  ChevronRight,
  Menu,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import EventAnnouncements from '../components/eventAnnouncement';
import NoTokenModal from '@/components/modals/remindModal';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import AddSpeakerModal from './speakers/AddSpeakerModal';
import { Plus, Download, Users } from 'lucide-react';
import { useParticipants, downloadParticipantsCSV, type Participant } from '@/hooks/useParticipants';

dotenv.config();

interface Speaker {
  id: number;
  email: string;
  name: string;
  profilePic: string | null;
  about: string;
  eventId: string;
}

interface SpeakerResponse {
  msg: string;
  speakers: Speaker[];
}

const Eventid = () => {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<respnseUseState>({
    EventName: '',
    description: '',
    EventMode: '',
    startDate: '',
    endDate: '',
    contactEmail: '',
    contactPhone: '',
    university: '',
    applicationStatus: 'open',
    posterUrl: '',
    eventHeader: '',
    whatsappLink: '',
    eventWebsite: '',
    form: '',
  });

  const router = useRouter();

  const [forkedUpId, setForkedUpId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'speakers' | 'schedule' | 'gallery' | 'announcement' | 'attendees'
  >('overview');
  const [signedin, setSignedin] = useState<boolean>(false);
  const [userAttendedEventIds, setUserAttendedEventIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasTokenForModal, setHasTokenForModal] = useState(false);
  const [isAddSpeakerModalOpen, setIsAddSpeakerModalOpen] = useState(false);
  const [isFounder, setIsFounder] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const session = sessionStorage.getItem('activeSession');
      
      if (storedToken) {
        setToken(storedToken);
        setHasTokenForModal(true);
              if (session !== 'true') {
              // Has token but no session - user needs to sign in
              toast('Login required', {
                action: {
                  label: 'Sign in',
                  onClick: () => router.push('/auth/signin'),
                },
              });
              return;
            } else {
              setSignedin(true);
            }
      } else {
        // No token - user needs to sign up
        toast('Sign up required');
        setHasTokenForModal(false);    
        return;
      } 
    }
  }, [router]);

  // Fetch speakers for this event (used in the Speakers tab)
  const {
    data: speakersData,
    isLoading: isSpeakersLoading,
  } = useQuery<SpeakerResponse>({
    queryKey: ['speakers', id],
    queryFn: async () => {
      if (!id || !token) throw new Error('Missing id or token');
      const res = await axios.get<SpeakerResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/getSpeakers?id=${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!id && !!token,
    staleTime: 5 * 60 * 1000,
  });

  const speakers = speakersData?.speakers || [];

  // Fetch participants for this event
  const [participantsPage, setParticipantsPage] = useState(1);
  const participantsLimit = 50;
  const {
    data: participantsData,
    isLoading: isParticipantsLoading,
    error: participantsError,
  } = useParticipants({
    eventId: id,
    page: participantsPage,
    limit: participantsLimit,
    enabled: activeTab === 'attendees' && !!id && isFounder,
  });

  const participants = participantsData?.data || [];
  const participantsPagination = participantsData?.pagination;

  // Check if user is founder
  useEffect(() => {
    if (!id || !token) return;

    async function checkFounderStatus() {
      try {
        const checkFounder = await axios.get<{ msg: string }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/isFounder?id=${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          checkFounder.status === 200 &&
          checkFounder.data.msg === 'identified'
        ) {
          setIsFounder(true);
        }
      } catch (error) {
        console.error('Error checking founder status:', error);
      }
    }

    checkFounderStatus();
  }, [id, token]);

  // Fetch user data and attended events
  useEffect(() => {
    async function fetchUserData() {
      if (!token) return;
      
      try {
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (userResponse.data && (userResponse.data as any).user) {
          const userData = (userResponse.data as any).user;
          setCurrentUser(userData);
          
          // Extract attended event IDs from user data
          if (userData.eventAttended && Array.isArray(userData.eventAttended)) {
            const attendedIds = userData.eventAttended.map((attendance: any) => attendance.event.id);
            setUserAttendedEventIds(attendedIds);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    
    if (token) {
      fetchUserData();
    }
  }, [token]);

  useEffect(() => {
    if (!id) return;

    async function fetchEventData() {
      try {
        setIsLoading(true);
        const res = await axios.get<EventByIdResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/event/${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (res && res.status === 200) {
          setData({
            EventName: res.data.response.EventName || '',
            description: res.data.response.description || '',
            EventMode: res.data.response.EventMode || '',
            startDate: res.data.response.startDate || '',
            endDate: res.data.response.endDate || '',
            university: res.data.response.university || '',
            contactEmail: res.data.response.contactEmail || '',
            contactPhone: res.data.response.contactPhone || '',
            applicationStatus: res.data.response.applicationStatus || 'open',
            posterUrl:
              res.data.response.posterUrl ||
              res.data.response.eventHeaderImage ||
              '',
            whatsappLink: res.data.response.whatsappLink || res.data.response.whatsappGroupLink || '',
            eventWebsite: res.data.response.eventWebsite || res.data.response.EventUrl || '',
            form: res.data.response.form || res.data.response.registrationForm || '',
          });
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
        alert('Error loading event data');
      } finally {
        setIsLoading(false);
      }
    }
   
    fetchEventData();
  }, [token, id]);

  const handleRegistration = async () => {
    if (!token) {
      alert('Please login to register for this event');
      return;
    }

    try {
      setIsRegistering(true);
      const bodyData = { eventId: id };

      const resp = await axios.post<{
        msg: string;
        ForkedUpId: string;
      }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/registerEvent`,
        bodyData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp && resp.status === 200) {
        alert(resp.data.msg);
        setForkedUpId(resp.data.ForkedUpId);
        // Show WhatsApp modal if link is available
        if (data.whatsappLink) {
          setShowWhatsappModal(true);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Helper function to check if user is attending this event
  const isUserAttendingEvent = (): boolean => {
    if (!currentUser) return false;
    return userAttendedEventIds.includes(id);
  };
  const formatDateRange = (start?: string, end?: string) => {
    if (!start && !end) return 'TBD';
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    const fmt = (d: Date) =>
      d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    if (s && e) return `${fmt(s)} → ${fmt(e)}`;
    if (s) return fmt(s);
    return fmt(e as Date);
  };

  const isOnline = useMemo(
    () => (data?.EventMode || '').toLowerCase().includes('online'),
    [data.EventMode]
  );

  // Check if event has ended
  const isEventEnded = useMemo(() => {
    if (!data.endDate) return false;
    return new Date(data.endDate) < new Date();
  }, [data.endDate]);

  // Check if registration is disabled (event ended or applications closed)
  const isRegistrationDisabled = useMemo(() => {
    return isEventEnded || data.applicationStatus !== 'open';
  }, [isEventEnded, data.applicationStatus]);

  const googleCalendarHref = useMemo(() => {
    // Build a Google Calendar event URL (best-effort if dates exist)
    const toGoogleDate = (iso?: string) => {
      if (!iso) return '';
      const d = new Date(iso);
      // YYYYMMDDTHHMMSSZ
      const pad = (n: number) => `${n}`.padStart(2, '0');
      const yyyy = d.getUTCFullYear();
      const MM = pad(d.getUTCMonth() + 1);
      const dd = pad(d.getUTCDate());
      const hh = pad(d.getUTCHours());
      const mm = pad(d.getUTCMinutes());
      const ss = pad(d.getUTCSeconds());
      return `${yyyy}${MM}${dd}T${hh}${mm}${ss}Z`;
    };

    const start = toGoogleDate(data.startDate);
    const end = toGoogleDate(data.endDate || data.startDate);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: data.EventName || 'Event',
      details: data.description || '',
      location: data.university || (isOnline ? 'Online' : ''),
    });
    if (start && end) {
      params.set('dates', `${start}/${end}`);
    }
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [
    data.EventName,
    data.description,
    data.university,
    data.startDate,
    data.endDate,
    isOnline,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading event details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>

        {/* Hero Section - Compact Design */}
        <div className="relative rounded-2xl bg-[#0B0B0B] border border-gray-800 overflow-hidden mb-6">
          {/* Subtle glow effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl -z-0" />

          <div className="relative z-10 p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Event Info */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Event</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 leading-tight">
                    {data.EventName || 'Event Title'}
                  </h1>
                </div>

                {/* Event Details - Compact */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <CalendarIcon className="w-4 h-4 text-yellow-400" />
                    <span>{formatDateRange(data.startDate, data.endDate)}</span>
                  </div>
                  {data.university && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <span>{data.university}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-300">
                    {isOnline ? (
                      <Globe className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Square className="w-4 h-4 text-yellow-400" />
                    )}
                    <span>{isOnline ? 'Online' : data.EventMode || 'TBD'}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      data.applicationStatus === 'open'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.applicationStatus === 'open' ? (
                      <CheckSquare className="w-3 h-3 mr-1.5" />
                    ) : null}
                    Applications {data.applicationStatus}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {signedin ? (
                    isUserAttendingEvent() ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg font-medium">
                        <CheckSquare className="w-4 h-4" />
                        <span>You're attending</span>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={handleRegistration}
                          disabled={isRegistering || isRegistrationDisabled}
                          className={`rounded-lg px-5 py-2 font-medium ${
                            isRegistering || isRegistrationDisabled
                              ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                              : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                          }`}
                        >
                          {isRegistering ? 'Registering...' : isEventEnded ? 'Event Ended' : 'Register Now'}
                        </Button>
                        {isEventEnded && (
                          <p className="text-xs text-red-400">This event has already ended</p>
                        )}
                      </>
                    )
                  ) : (
                    <Button
                      onClick={() => router.push('/auth/signup')}
                      className="rounded-lg px-5 py-2 font-medium bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      Sign Up to Register
                    </Button>
                  )}

                  <a
                    href={googleCalendarHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-white transition-colors"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>Add to Calendar</span>
                  </a>
                </div>

                {/* Success notice */}
                {forkedUpId && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 font-medium mb-1 text-sm">
                      Registration Successful! 🎉
                    </p>
                    <p className="text-gray-300 text-sm">
                      Get your pass on{' '}
                      <a
                        href={`https://zynvo.social/ticket/${forkedUpId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 underline font-medium"
                      >
                        Zynced It
                      </a>
                      .
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Compact Poster Image */}
              <div className="lg:col-span-1">
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                  {data.posterUrl ? (
                    <Image
                      src={data.posterUrl}
                      alt="Event Poster"
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                      <CalendarIcon className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-xs">Poster coming soon</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-800">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'speakers', label: 'Speakers & Judges' },
                { id: 'schedule', label: 'Schedule' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'announcement', label: 'Announcements' },
                { id: 'attendees', label: 'Attendees' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === t.id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">
                  About This Event
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {data.description ||
                    'Event description will be available soon...'}
                </p>

                {/* WhatsApp Group Link - Only show if user is registered */}
                {data.whatsappLink && userAttendedEventIds.includes(id) && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-green-400 text-lg">💬</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-400 mb-2">Join Our WhatsApp Group</h3>
                        <p className="text-gray-300 text-sm mb-3">Connect with other participants and stay updated with event announcements.</p>
                        <a
                          href={data.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                        >
                          <span>Join WhatsApp Group</span>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Website Link */}
                {data.eventWebsite && (
                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-400 text-lg">🌐</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-400 mb-2">Event Website</h3>
                        <p className="text-gray-300 text-sm mb-3">Visit the official event website for more information.</p>
                        <a
                          href={data.eventWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                          <span>Visit Website</span>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registration Form Link */}
                {data.form && (
                  <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-purple-400 text-lg">📋</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-purple-400 mb-2">Registration Form</h3>
                        <p className="text-gray-300 text-sm mb-3">Fill out the registration form to participate in this event.</p>
                        <a
                          href={data.form}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                        >
                          <span>Open Form</span>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="text-white">{data.university || 'TBD'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Mode</p>
                    <p className="text-white">{data.EventMode || 'TBD'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Start Date</p>
                    <p className="text-white">
                      {data.startDate
                        ? new Date(data.startDate).toLocaleDateString()
                        : 'TBD'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">End Date</p>
                    <p className="text-white">
                      {data.endDate
                        ? new Date(data.endDate).toLocaleDateString()
                        : 'TBD'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">
                  Schedule
                </h2>
                <p className="text-gray-400">
                  Schedule details will be announced soon.
                </p>
              </div>
            )}

            {activeTab === 'speakers' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-yellow-400">
                    Speakers & Judges
                  </h2>
                  {isFounder && (
                    <Button
                      onClick={() => setIsAddSpeakerModalOpen(true)}
                      className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Speaker
                    </Button>
                  )}
                </div>

                {isSpeakersLoading ? (
                  <p className="text-gray-400">Loading speakers...</p>
                ) : speakers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">
                      Speakers will be revealed closer to the event.
                    </p>
                    {isFounder && (
                      <Button
                        onClick={() => setIsAddSpeakerModalOpen(true)}
                        className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Add First Speaker
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {speakers.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="bg-black border border-yellow-500/20 rounded-lg p-4 flex gap-3"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                          <Image
                            src={
                              speaker.profilePic ||
                              'https://i.pravatar.cc/150?img=11'
                            }
                            alt={speaker.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white truncate">
                            {speaker.name}
                          </h3>
                          <p className="text-xs text-yellow-400 truncate">
                            {speaker.email}
                          </p>
                          <p className="mt-1 text-xs text-gray-300 line-clamp-2">
                            {speaker.about}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-yellow-400">
                    Event Schedule
                  </h2>
                  <a
                    href={`/events/${id}/schedule`}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    <span>Full Schedule</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-gray-400">
                  Click "Full Schedule" to view the complete event timeline and manage sessions.
                </p>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-yellow-400">
                    Gallery
                  </h2>
                  <a
                    href={`/events/${id}/gallery`}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    <span>View Gallery</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-gray-400">
                  Click "View Gallery" to see photos and media from the event.
                </p>
              </div>
            )}

            {activeTab === 'announcement' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">
                  Announcements
                </h2>
                <EventAnnouncements />
              </div>
            )}

            {activeTab === 'attendees' && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Attendees
                  </h2>
                  {isFounder && (
                    <Button
                      onClick={async () => {
                        try {
                          await downloadParticipantsCSV(id, token);
                        } catch (error) {
                          console.error('Error downloading CSV:', error);
                        }
                      }}
                      className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download CSV
                    </Button>
                  )}
                </div>

                {!isFounder ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      You are not allowed to view the attendees list.
                    </p>
                  </div>
                ) : isParticipantsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Loading attendees...</p>
                  </div>
                ) : participantsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-400">
                      Failed to load attendees. Please try again.
                    </p>
                  </div>
                ) : participants.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      No attendees registered yet.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {participants.map((participant: Participant) => (
                        <div
                          key={`${participant.user.id}-${participant.joinedAt}`}
                          className="bg-black border border-yellow-500/20 rounded-lg p-4 flex gap-4 hover:border-yellow-500/40 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                            {participant.user.profileAvatar ? (
                              <Image
                                src={participant.user.profileAvatar}
                                alt={participant.user.name || 'User'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                                <span className="text-black font-bold text-sm">
                                  {participant.user.name
                                    ? participant.user.name.charAt(0).toUpperCase()
                                    : 'U'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-white truncate">
                              {participant.user.name || 'Anonymous User'}
                            </h3>
                            <p className="text-xs text-yellow-400 truncate">
                              {participant.user.email}
                            </p>
                            {participant.user.collegeName && (
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {participant.user.collegeName}

                                {participant.user.year && ` • Year ${participant.user.year}`}
                              </p>
                            )}

                            <p className="text-xs text-gray-500 mt-1">
                              Joined:{' '}
                              {new Date(participant.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {participantsPagination &&
                      participantsPagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                          <p className="text-sm text-gray-400">
                            Showing {participants.length} of{' '}
                            {participantsPagination.total} attendees
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() =>
                                setParticipantsPage((p) => Math.max(1, p - 1))
                              }
                              disabled={participantsPage === 1}
                              variant="outline"
                              size="sm"
                              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                            >
                              Previous
                            </Button>
                            <span className="text-sm text-gray-400">
                              Page {participantsPagination.page} of{' '}
                              {participantsPagination.totalPages}
                            </span>
                            <Button
                              onClick={() =>
                                setParticipantsPage((p) =>
                                  Math.min(
                                    participantsPagination.totalPages,
                                    p + 1
                                  )
                                )
                              }
                              disabled={
                                participantsPage >=
                                participantsPagination.totalPages
                              }
                              variant="outline"
                              size="sm"
                              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}

            {/* CTA Card */}
            <div className="rounded-xl bg-gradient-to-br from-yellow-400/10 to-transparent border border-yellow-400/20 p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                Make Your Campus Life Unforgettable
              </h3>
              <p className="text-gray-300 mb-4 text-sm">
                Join Zynvo and connect with your campus community.
              </p>
              <Button
                onClick={() => router.push('/auth/signup')}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg px-5 py-2"
              >
                Join Zynvo
              </Button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            {(data.contactEmail || data.contactPhone) && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-5">
                <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
                <div className="space-y-3">
                  {data.contactEmail && (
                    <a
                      href={`mailto:${data.contactEmail}`}
                      className="flex items-center gap-3 text-sm text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="break-all">{data.contactEmail}</span>
                    </a>
                  )}
                  {data.contactPhone && (
                    <a
                      href={`tel:${data.contactPhone}`}
                      className="flex items-center gap-3 text-sm text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span>{data.contactPhone}</span>
                    </a>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <a
                    href={googleCalendarHref}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-gray-900 border border-gray-800 hover:border-yellow-400/50 text-white transition-colors text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Save / Share
                  </a>
                </div>
              </div>
            )}

            {/* Compact Poster Card */}
            {data.posterUrl && (
              <div className="rounded-xl bg-[#0B0B0B] border border-gray-800 p-3">
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-900">
                  <Image
                    src={data.posterUrl}
                    alt="Event Poster"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <NoTokenModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} hasToken={hasTokenForModal} />
      
      {/* Add Speaker Modal */}
      <AddSpeakerModal
        isOpen={isAddSpeakerModalOpen}
        onClose={() => setIsAddSpeakerModalOpen(false)}
        eventId={id}
      />

      {/* WhatsApp Group Modal */}
      {showWhatsappModal && data.whatsappLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#0B0B0B] border border-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">💚</div>
              <h2 className="text-2xl font-bold text-white mb-2">Join WhatsApp Group!</h2>
              <p className="text-gray-300 mb-6">
                You've successfully registered! Join our WhatsApp group to stay updated with event announcements and connect with other participants.
              </p>
              <div className="space-y-3">
                <a
                  href={data.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <span>Open WhatsApp Group</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setShowWhatsappModal(false)}
                  className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eventid;
