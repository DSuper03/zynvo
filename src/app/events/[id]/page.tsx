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
} from 'lucide-react';
import { toast } from 'sonner';

dotenv.config();

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
    contactPhone: 0,
    university: '',
    applicationStatus: 'open',
    posterUrl: '',
    eventHeader: '',
  });

  const router = useRouter();

  const [forkedUpId, setForkedUpId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'speakers' | 'schedule' | 'gallery'
  >('overview');
  const [signedin, setSignedin] = useState<boolean>(false);
  const [userAttendedEventIds, setUserAttendedEventIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      if (sessionStorage.getItem('activeSession') !== 'true') {
        toast('login please');
        return;
      } else {
        setSignedin(true);
      }
    }
  }, []);

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
    if (!token || !id) return;

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
            contactPhone: res.data.response.contactPhone || 0,
            applicationStatus: res.data.response.applicationStatus || 'open',
            posterUrl:
              res.data.response.posterUrl ||
              res.data.response.eventHeaderImage ||
              '',
              
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
    <div className="min-h-screen  text-white">
      {/* Top App Bar */}

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#0B0B0B] border border-gray-800">
          {/* soft glow blobs */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10">
            {/* Left: Event primary info */}
            <div className="lg:col-span-7">
              <p className="text-gray-300 mb-2">
                {data.description
                  ? 'The Ultimate, Student Developer Experience'
                  : 'Curated by Zynvo'}
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-yellow-400">
                {data.EventName || 'Event Title'}
              </h1>

              <div className="mt-6 space-y-3 text-gray-200">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-4 h-4" />
                  <span className="text-sm">
                    {formatDateRange(data.startDate, data.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{data.university || 'TBD'}</span>
                </div>
                <div className="flex items-center gap-3">
                  {isOnline ? (
                    <Globe className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {isOnline ? 'Online' : data.EventMode || 'Mode TBD'}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {signedin ? (
                  isUserAttendingEvent() ? (
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold">
                      <CheckSquare className="w-5 h-5" />
                      You are attending this event
                    </div>
                  ) : (
                    <Button
                      onClick={handleRegistration}
                      disabled={
                        isRegistering || data.applicationStatus !== 'open'
                      }
                      className={`rounded-xl px-5 py-3 font-semibold ${
                        isRegistering || data.applicationStatus !== 'open'
                          ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                          : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                      }`}
                    >
                      {isRegistering ? 'Registering...' : 'Register Now'}
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={() => {
                      router.push('/auth/signup');
                    }}
                    className={`rounded-xl px-5 py-3 font-semibold bg-yellow-400 hover:bg-yellow-500 text-black
                  `}
                  >
                    Sign Up to Regester
                  </Button>
                )}

                     {/* Success notice (unchanged logic) */}
                      {forkedUpId && (
                        <div className="mt-6 p-4 bg-green-900/30 border border-green-500/30 rounded-2xl">
                          <p className="text-green-400 font-medium mb-1">
                            Registration Successful! 🎉
                          </p>
                          <p className="text-gray-300">
                            Get your pass for this event on{' '}
                            <a
                              href={`https://zynvo.social/ticket/${forkedUpId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-400 hover:text-yellow-300 underline font-semibold transition-colors"
                            >
                              Zynced It
                            </a>
                            . Without this you&apos;ll not be allowed to take part.
                          </p>
                        </div>
                      )}

                <a
                  href={googleCalendarHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl px-5 py-3 font-semibold bg-[#0E0E0E] border border-gray-800 hover:border-gray-700 text-white inline-flex items-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  Add to Calendar
                </a>
              </div>
            </div>

            {/* Right: Poster */}
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/3] md:aspect-[3/2] rounded-2xl bg-gradient-to-br from-yellow-500/15 to-transparent border border-gray-800 overflow-hidden">
                {data.posterUrl || data.eventHeader ? (
                  <Image
                    src={data.posterUrl || '/poster/2.png'}
                    alt="Event Poster"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-200/70">
                    <CalendarIcon className="w-16 h-16 mb-2 opacity-60" />
                    <span className="text-sm">Event poster coming soon</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'speakers', label: 'Speakers & Judges' },
                { id: 'schedule', label: 'Schedule' },
                { id: 'gallery', label: 'Gallery' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  activeTab === t.id
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'bg-[#0E0E0E] text-gray-300 border-gray-800 hover:border-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'overview' && (
              <div className="rounded-2xl bg-[#0B0B0B] border border-gray-800 p-6">
                <h2 className="text-2xl font-bold text-yellow-400 mb-3">
                  Design Thinking Workshop
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {data.description ||
                    'Event description will be available soon...'}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    <span>University</span>
                    <span className="ml-auto text-white">
                      {data.university || 'TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Globe className="w-4 h-4 text-yellow-400" />
                    <span>Mode</span>
                    <span className="ml-auto text-white">
                      {data.EventMode || 'TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <AlarmClock className="w-4 h-4 text-yellow-400" />
                    <span>Starts</span>
                    <span className="ml-auto text-white">
                      {data.startDate
                        ? new Date(data.startDate).toLocaleString()
                        : 'TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <AlarmClock className="w-4 h-4 text-yellow-400" />
                    <span>Ends</span>
                    <span className="ml-auto text-white">
                      {data.endDate
                        ? new Date(data.endDate).toLocaleString()
                        : 'TBD'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      data.applicationStatus === 'open'
                        ? 'bg-green-300/20 text-green-300 border border-green-400/30'
                        : 'bg-red-300/20 text-red-300 border border-red-400/30'
                    }`}
                  >
                    Applications {data.applicationStatus}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="rounded-2xl bg-[#0B0B0B] border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-2">
                  Schedule
                </h2>
                <p className="text-gray-400">
                  Schedule details will be announced soon.
                </p>
              </div>
            )}

            {activeTab === 'speakers' && (
              <div className="rounded-2xl bg-[#0B0B0B] border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-2">
                  Speakers & Judges
                </h2>
                <p className="text-gray-400">
                  Speakers will be revealed closer to the event.
                </p>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="rounded-2xl bg-[#0B0B0B] border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-2">
                  Gallery
                </h2>
                <p className="text-gray-400">
                  Photos and videos will appear here after the event.
                </p>
              </div>
            )}

            {/* Big CTA card (like the design) */}
            <div className="rounded-2xl bg-[#0B0B0B] border border-gray-800 p-6">
              <h3 className="text-2xl md:text-3xl font-extrabold text-yellow-400">
                Make Your Campus Life Unforgettable. Join Zynvo!
              </h3>
              <div className="mt-4">
                <Button
                  onClick={() => (window.location.href = '/auth/signup')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl px-6 py-3"
                >
                  Join Zynvo
                </Button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Compact poster card (matches right-hand visual in design) */}
            <div className="rounded-2xl bg-[#0B0B0B] border border-gray-800 p-3">
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-yellow-500/10">
                {data.posterUrl ? (
                  <Image
                    src={data.posterUrl}
                    alt="Event Poster"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-yellow-200/70">
                    <CalendarIcon className="w-12 h-12 opacity-60" />
                  </div>
                )}
              </div>
            </div>

            {/* Contact info card */}
            {(data.contactEmail || data.contactPhone) && (
              <div className="rounded-2xl bg-[#0B0B0B] border border-gray-800 p-6">
                <h3 className="text-lg font-bold mb-4">Contact info</h3>
                <div className="space-y-3 text-sm">
                  {data.contactEmail && (
                    <a
                      href={`mailto:${data.contactEmail}`}
                      className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-yellow-400" />
                      <span>{data.contactEmail}</span>
                    </a>
                  )}
                  {data.contactPhone ? (
                    <a
                      href={`tel:${data.contactPhone}`}
                      className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-yellow-400" />
                      <span>{data.contactPhone}</span>
                    </a>
                  ) : null}
                </div>

                <div className="mt-6">
                  <a
                    href={googleCalendarHref}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    Save / Share
                  </a>
                </div>
              </div>
            )}

            {/* Small reactions bar to echo the design accents */}
            <div className="rounded-2xl bg-[#0B0B0B] border border-gray-800 p-4 flex items-center gap-3">
              <button className="w-9 h-9 rounded-full bg-[#0E0E0E] border border-gray-800 hover:border-gray-700" />
              <button className="w-9 h-9 rounded-full bg-[#0E0E0E] border border-gray-800 hover:border-gray-700" />
              <button className="w-9 h-9 rounded-full bg-[#0E0E0E] border border-gray-800 hover:border-gray-700 flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>

   

        <div className="h-8" />
      </div>
    </div>
  );
};

export default Eventid;
