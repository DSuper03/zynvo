'use client';
import { useEffect, useState, useRef } from 'react';
import {
  Calendar,
  BarChart2,
  ArrowLeft,
  Share2,
  Trophy,
  MapPin,
  BookOpen,
  CheckCircle2,
  Ticket,
} from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import EventBadgeCard from '@/components/ticket';
import Image from 'next/image';
import { FaUserGraduate } from 'react-icons/fa';
import TextWithLinks from '@/components/TextWithLinks';
import { UserBadgesDisplay } from '@/components/UserBadgesDisplay';

interface Event {
  EventName: string;
  startDate: string;
  id: string;
}

export interface UserData {
  name: string | null;
  email: string;
  clubName: string | null;
  isVerified: boolean | null;
  events: Event[];
  profileAvatar: string;
  bio: string;
  year: string;
  tags: string[];
  course: string;
  createdAt: Date;
  collegeName: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
}

export interface ApiResponse {
  msg: string;
  user: {
    id: string;
    createdAt: Date;
    bio: string;
    year: string;
    tags: string[];
    course: string;
    isVerified: boolean | null;
    name: string | null;
    email: string;
    clubName: string | null;
    collegeName: string | null;
    profileAvatar: string;
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
    eventAttended: {
      event: {
        id: string;
        EventName: string;
        startDate: string;
      };
    }[];
    CreatePost: {
      id: string;
      description: string;
    }[];
  };
}

// Skeleton pulse block
const Pulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-lg bg-gray-800 ${className}`} />
);

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-black">
    {/* header */}
    <div className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">
      <Pulse className="w-9 h-9 rounded-full" />
      <Pulse className="w-32 h-5" />
    </div>
    {/* cover */}
    <Pulse className="h-44 w-full rounded-none" />
    <div className="px-4 -mt-12 pb-4 bg-black">
      <Pulse className="w-28 h-28 rounded-full border-4 border-black mb-4" />
      <Pulse className="w-40 h-6 mb-2" />
      <Pulse className="w-64 h-4 mb-4" />
      <div className="flex gap-3">
        <Pulse className="w-16 h-4" />
        <Pulse className="w-20 h-4" />
        <Pulse className="w-24 h-4" />
      </div>
    </div>
    <div className="px-4 space-y-4 mt-4">
      <Pulse className="h-28" />
      <Pulse className="h-48" />
      <Pulse className="h-48" />
    </div>
  </div>
);

// Skill tag — brand yellow palette
const SkillTag = ({ skill, onClick }: { skill: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 hover:bg-yellow-500/20 hover:border-yellow-500/40 transition-all duration-200 hover:scale-105"
  >
    {skill}
  </button>
);

// Section card wrapper with consistent header
const SectionCard = ({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <div className="text-yellow-400">{icon}</div>
        <h3 className="text-base font-bold text-white">{title}</h3>
      </div>
      {count !== undefined && (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          {count}
        </span>
      )}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// Stat pill
const StatPill = ({ value, label }: { value: string | number; label: string }) => (
  <div className="flex flex-col items-center gap-0.5">
    <span className="text-xl font-bold text-yellow-400 leading-none">{value}</span>
    <span className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</span>
  </div>
);

// High-Five button
const HighFiveButton = ({
  postId,
  isHighFived,
  onHighFive,
}: {
  postId: string;
  isHighFived: boolean;
  onHighFive: (id: string) => void;
}) => (
  <button
    onClick={() => onHighFive(postId)}
    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
      isHighFived
        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 scale-105'
        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-yellow-500/30 hover:text-yellow-400'
    }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-3.5 w-3.5 transition-transform duration-200 ${isHighFived ? 'animate-bounce' : ''}`}
      fill={isHighFived ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11"
      />
    </svg>
    {isHighFived ? 'High-Fived!' : 'High-Five'}
  </button>
);

export default function PublicUserProfile() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [posts, setPosts] = useState<{ id: string; description: string }[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');
  const [highFivedPosts, setHighFivedPosts] = useState<Set<string>>(new Set());
  const [isNotFound, setIsNotFound] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<any>({});
  const [clubId, setClubId] = useState<string | null>(null);
  const [isFounder, setIsFounder] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (tok) setToken(tok);
      if (sessionStorage.getItem('activeSession') !== 'true') {
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
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !userId) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      setIsNotFound(false);

      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getPublicUser?id=${userId}`,
          { headers: token ? { authorization: `Bearer ${token}` } : {} }
        );

        if (response.status === 200 && response.data.user) {
          const {
            name, clubName, email, isVerified, eventAttended,
            profileAvatar, bio, course, year, tags, createdAt,
            collegeName, twitter, instagram, linkedin,
          } = response.data.user;

          const events =
            eventAttended?.map((eve) => ({
              EventName: eve.event.EventName,
              startDate: eve.event.startDate,
              id: eve.event.id,
            })) || [];

          setUserData({
            name, clubName, email, isVerified, events,
            profileAvatar, tags, course, bio, year, createdAt,
            collegeName, twitter, instagram, linkedin,
          });

          setPosts(response.data.user.CreatePost);

          if (clubName) {
            try {
              const clubsResponse = await axios.get<any>(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/getAll?page=1&limit=1000`,
                { headers: token ? { authorization: `Bearer ${token}` } : {} }
              );
              const clubs = clubsResponse.data?.resp || clubsResponse.data?.clubs || [];
              const matchingClub = clubs.find(
                (club: any) => club.name?.toLowerCase() === clubName.toLowerCase()
              );
              if (matchingClub?.id) {
                setClubId(matchingClub.id);
                if (matchingClub.founderEmail && email) {
                  const isUserFounder =
                    email.toLowerCase() === matchingClub.founderEmail.toLowerCase();
                  setIsFounder(isUserFounder);
                  setIsMember(!isUserFounder);
                } else {
                  setIsMember(true);
                }
              } else {
                setIsMember(true);
              }
            } catch {
              setIsMember(true);
            }
          }
        } else {
          setIsNotFound(true);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setIsNotFound(true);
        } else {
          toast('Error loading user profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isClient, userId, token]);

  const handleSkillClick = (skill: string) => {
    toast(`Exploring ${skill} communities…`, { duration: 2000 });
  };

  const handleHighFive = (postId: string) => {
    setHighFivedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
        toast('🙌 High-Five sent!', {
          duration: 2000,
          style: { background: '#FCD34D', color: '#1F2937', border: 'none' },
        });
      }
      return next;
    });
  };

  const handleShareProfile = async () => {
    try {
      await navigator.share({
        title: `${userData?.name}'s Profile`,
        text: `Check out ${userData?.name}'s profile on Zynvo!`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast('Profile URL copied to clipboard!');
    }
  };

  const openTicketModal = async (eventId: string) => {
    try {
      setSelectedEventId(eventId);
      const safeId = encodeURIComponent(eventId);
      const base = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
      const url = base
        ? `${base}/api/v1/events/event-details?id=${safeId}`
        : `/api/v1/events/event-details?id=${safeId}`;

      const headers: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const tok = localStorage.getItem('token');
        if (tok) headers['authorization'] = `Bearer ${tok}`;
      }

      let resolvedData: {
        eventName: string;
        clubName: string;
        collegeName: string;
        startDate: Date;
        profilePic: string;
      } | null = null;

      try {
        const resp = await axios.get<{ data: any }>(url, { headers });
        if (resp?.data?.data) resolvedData = resp.data.data;
      } catch {
        // fall through to local data
      }

      if (!resolvedData && userData?.events) {
        const fallback = userData.events.find((e) => e.id === eventId);
        if (fallback) {
          resolvedData = {
            eventName: fallback.EventName,
            clubName: userData.clubName || 'Club',
            collegeName: userData.collegeName || 'College',
            startDate: new Date(fallback.startDate),
            profilePic: userData.profileAvatar,
          };
        }
      }

      if (resolvedData) {
        setTicketData({
          ...resolvedData,
          startDate: new Date(resolvedData.startDate).toLocaleString(),
        });
        setShowTicketModal(true);
      } else {
        toast('Unable to load ticket');
      }
    } catch (e: any) {
      toast(e?.response?.data?.msg || e?.message || 'Unable to load ticket');
    }
  };

  const downloadTicket = async () => {
    if (badgeRef.current) {
      const htmlToImage = await import('html-to-image');
      const dataUrl = await htmlToImage.toPng(badgeRef.current, {
        cacheBust: true,
        skipFonts: false,
      });
      const link = document.createElement('a');
      link.download = `${ticketData.eventName || 'event-badge'}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  if (!isClient || isLoading) return <ProfileSkeleton />;

  if (isNotFound) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">User Not Found</h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            The profile you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-2.5 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  const eventCount = userData.events?.length || 0;
  const joinedLabel = userData.createdAt
    ? new Date(userData.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Top nav — full width */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/60">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <span className="text-base font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
              {userData.name || 'Profile'}
            </span>
          </div>
          <button
            onClick={handleShareProfile}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold text-sm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      {/* Cover — full bleed */}
      <div className="relative h-52 sm:h-64 lg:h-72 w-full overflow-hidden bg-gray-900">
        <Image
          src="/banners/profilebanner.jpg"
          alt="Profile Banner"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Main content — wide container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* On desktop: two-column layout. On mobile: stacked. */}
        <div className="lg:grid lg:grid-cols-[340px_1fr] lg:gap-8 lg:items-start">

          {/* ── LEFT: Profile card (sticky on desktop) ── */}
          <div className="lg:sticky lg:top-[57px] pb-4 lg:pb-8">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-14 mb-5">
              <div className="relative">
                {userData.profileAvatar ? (
                  <img
                    src={userData.profileAvatar}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-black object-cover ring-2 ring-yellow-400/20 shadow-xl"
                    alt={userData.name || 'Profile'}
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-black bg-yellow-400 flex items-center justify-center text-gray-900 text-4xl font-bold ring-2 ring-yellow-400/20 shadow-xl">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                {userData.isVerified && (
                  <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-gray-900" />
                  </div>
                )}
              </div>

              {/* Club badge */}
              {userData.clubName?.trim() && (
                <div className="mb-1">
                  {clubId ? (
                    <Link
                      href={`/clubs/${clubId}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400 transition-all text-xs font-semibold group"
                    >
                      <FaUserGraduate className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      {userData.clubName.trim()}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
                      <FaUserGraduate className="w-3 h-3" />
                      {userData.clubName.trim()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Name + bio */}
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {userData.name || 'User'}
              </h2>
              {userData.bio ? (
                <p className="mt-2 text-gray-300 text-sm leading-relaxed">
                  {userData.bio}
                </p>
              ) : (
                <p className="mt-2 text-gray-500 text-sm italic">No bio yet.</p>
              )}
            </div>

            {/* Meta info */}
            <div className="flex flex-col gap-1.5 mb-4 text-sm text-gray-400">
              {(userData.course || userData.year) && (
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-yellow-400/70 flex-shrink-0" />
                  <span>
                    {userData.course || 'Course not specified'}
                    {userData.year && ` · Year ${userData.year}`}
                  </span>
                </div>
              )}
              {userData.collegeName && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-yellow-400/70 flex-shrink-0" />
                  <span>{userData.collegeName}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-yellow-400/70 flex-shrink-0" />
                <span>Joined {joinedLabel}</span>
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex justify-around py-3.5 border-t border-b border-gray-800 mb-4">
              <StatPill value={posts?.length || 0} label="Posts" />
              <div className="w-px bg-gray-800" />
              <StatPill value={eventCount} label="Events" />
              <div className="w-px bg-gray-800" />
              <StatPill value={joinedLabel} label="Since" />
            </div>

            {/* Skill tags */}
            {userData.tags && userData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {userData.tags.map((tag, idx) => (
                  <SkillTag key={idx} skill={tag} onClick={() => handleSkillClick(tag)} />
                ))}
              </div>
            )}

            {/* Social links */}
            {(userData.twitter || userData.linkedin || userData.instagram) && (
              <div className="flex flex-wrap gap-2">
                {userData.twitter && (
                  <a
                    href={userData.twitter.startsWith('http') ? userData.twitter : `https://x.com/${userData.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition-colors border border-gray-700 hover:border-gray-600"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="truncate max-w-[90px]">
                      {userData.twitter.replace('https://x.com/', '').replace('@', '')}
                    </span>
                  </a>
                )}
                {userData.linkedin && (
                  <a
                    href={userData.linkedin.startsWith('http') ? userData.linkedin : `https://linkedin.com/in/${userData.linkedin.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium transition-colors border border-blue-600/30"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.25h-3v-5.5c0-1.1-.9-2-2-2s-2 .9-2 2v5.5h-3v-10h3v1.5c.41-.77 1.36-1.5 2.5-1.5 1.93 0 3.5 1.57 3.5 3.5v6.5z" />
                    </svg>
                    <span className="truncate max-w-[90px]">
                      {userData.linkedin.replace('https://linkedin.com/in/', '').replace('@', '')}
                    </span>
                  </a>
                )}
                {userData.instagram && (
                  <a
                    href={userData.instagram.startsWith('http') ? userData.instagram : `https://instagram.com/${userData.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 text-xs font-medium transition-colors border border-pink-500/25"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163c-3.259 0-3.667.013-4.947.072-1.276.059-2.555.334-3.535 1.314-.98.98-1.255 2.259-1.314 3.535C2.145 5.919 2.163 6.327 2.163 9.587c0 3.259.013 3.667.072 4.947.059 1.276.334 2.555 1.314 3.535.98.98 2.259 1.255 3.535 1.314 1.28.059 1.688.072 4.947.072s3.667-.013 4.947-.072c1.276-.059 2.555-.334 3.535-1.314.98-.98 1.255-2.259 1.314-3.535.059-1.28.072-1.688.072-4.947s-.013-3.667-.072-4.947c-.059-1.276-.334-2.555-1.314-3.535-.98-.98-2.259-1.255-3.535-1.314C15.667.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
                    </svg>
                    <span className="truncate max-w-[90px]">
                      {userData.instagram.replace('https://instagram.com/', '').replace('@', '')}
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Content sections ── */}
          <div className="pt-4 lg:pt-6 pb-12 space-y-4 min-w-0">
            {/* Achievements */}
            <SectionCard icon={<Trophy className="w-4 h-4" />} title="Achievements">
              <UserBadgesDisplay
                isFounder={isFounder}
                isMember={isMember}
                eventCount={eventCount}
                clubName={userData.clubName || ''}
                userName={userData.name || 'User'}
              />
            </SectionCard>

            {/* Posts + Events: side-by-side on wide screens */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Posts */}
              <SectionCard
                icon={<BarChart2 className="w-4 h-4" />}
                title="Posts"
                count={posts?.length || 0}
              >
                {posts && posts.length > 0 ? (
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {posts.map((post, index) => (
                      <div
                        key={post.id}
                        className="rounded-xl border border-gray-800 bg-black/40 p-4 hover:border-yellow-500/20 hover:bg-black/60 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          {userData.profileAvatar ? (
                            <img
                              src={userData.profileAvatar}
                              className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                              alt="user"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 text-xs font-bold flex-shrink-0">
                              {userData.name ? userData.name.charAt(0) : 'U'}
                            </div>
                          )}
                          <div>
                            <div className="text-xs font-semibold text-white leading-none">
                              {userData.name}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-0.5">Post #{index + 1}</div>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                          <TextWithLinks
                            text={post.description || 'No description available for this post.'}
                          />
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-800/60">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide">Public</span>
                          <HighFiveButton
                            postId={post.id}
                            isHighFived={highFivedPosts.has(post.id)}
                            onHighFive={handleHighFive}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                      <BarChart2 className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">No posts yet</p>
                    <p className="text-xs text-gray-600 mt-1">Nothing shared here yet!</p>
                  </div>
                )}
              </SectionCard>

              {/* Events */}
              <SectionCard
                icon={<Calendar className="w-4 h-4" />}
                title="Events Attended"
                count={eventCount}
              >
                {userData.events && userData.events.length > 0 ? (
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {userData.events.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-xl border border-gray-800 bg-black/40 p-4 hover:border-yellow-500/20 hover:bg-black/60 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-4 h-4 text-yellow-400" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-white font-semibold text-sm leading-snug truncate">
                                {event.EventName}
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(event.startDate).toLocaleDateString('default', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="hidden sm:block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                              Attended
                            </span>
                            <button
                              onClick={() => openTicketModal(event.id)}
                              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold transition-colors"
                            >
                              <Ticket className="w-3 h-3" />
                              Ticket
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">No events yet</p>
                    <p className="text-xs text-gray-600 mt-1">Events attended will show up here.</p>
                  </div>
                )}
              </SectionCard>
            </div>
          </div>

        </div>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-950 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Your Ticket</span>
              </div>
              <button
                onClick={() => setShowTicketModal(false)}
                className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <div ref={badgeRef}>
                <EventBadgeCard
                  eventName={ticketData.eventName || 'Event'}
                  eventTimings={ticketData.startDate || ''}
                  collegeName={ticketData.collegeName || ''}
                  clubName={ticketData.clubName || ''}
                  profileImage={ticketData.profilePic || ''}
                  qrCodeImage={
                    selectedEventId
                      ? `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://zynvo.social/verify-event/${selectedEventId}`
                      : undefined
                  }
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={downloadTicket}
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded-full px-5"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
