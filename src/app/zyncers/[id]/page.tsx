'use client';
import { useEffect, useState, useRef } from 'react';
import { Calendar, BarChart2, User, ArrowLeft, Share2 } from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import EventBadgeCard from '@/components/ticket';
import * as htmlToImage from 'html-to-image';
import Image from 'next/image';
import { AuroraText } from '@/components/magicui/aurora-text';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

// Define interfaces for better type checking
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

// LEGO-like Skills Component
const LegoSkillBlock = ({
  skill,
  index,
  onClick,
}: {
  skill: string;
  index: number;
  onClick: () => void;
}) => {
  const colors = [
    'bg-red-500 hover:bg-red-400',
    'bg-blue-500 hover:bg-blue-400',
    'bg-green-500 hover:bg-green-400',
    'bg-yellow-500 hover:bg-yellow-400',
    'bg-purple-500 hover:bg-purple-400',
    'bg-pink-500 hover:bg-pink-400',
    'bg-indigo-500 hover:bg-indigo-400',
    'bg-teal-500 hover:bg-teal-400',
  ];

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 transform hover:scale-105
        ${colors[index % colors.length]}
        rounded-lg px-2 py-1 text-white font-bold text-xs shadow-lg
        hover:shadow-xl hover:shadow-yellow-500/30
        group
      `}
    >
      <span className="relative z-10">{skill}</span>
    </div>
  );
};

// High-Five Button Component
const HighFiveButton = ({
  postId,
  isHighFived,
  onHighFive,
}: {
  postId: string;
  isHighFived: boolean;
  onHighFive: (id: string) => void;
}) => {
  return (
    <Button
      onClick={() => onHighFive(postId)}
      className={`
        flex items-center space-x-2 transition-all duration-300 transform
        ${
          isHighFived
            ? 'text-yellow-400 scale-110'
            : 'text-gray-400 hover:text-yellow-400 hover:scale-105'
        }
        group relative
      `}
    >
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-all duration-300 ${isHighFived ? 'animate-bounce' : 'group-hover:rotate-12'}`}
          fill={isHighFived ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5T6.5 15a2 2 0 104 0m-3-2.5v-3a2 2 0 114 0v3M14 13.5V11m0-1V7.5"
          />
        </svg>
        {isHighFived && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
        )}
      </div>
      <span className="text-xs font-medium">
        {isHighFived ? 'High-Fived!' : 'High-Five'}
      </span>
    </Button>
  );
};

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
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (tok) setToken(tok);
      if (sessionStorage.getItem('activeSession') != 'true') {
        toast('login please');
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
          {
            headers: token
              ? {
                  authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        if (response.status === 200 && response.data.user) {
          const {
            name,
            clubName,
            email,
            isVerified,
            eventAttended,
            profileAvatar,
            bio,
            course,
            year,
            tags,
            createdAt,
            collegeName,
            twitter,
            instagram,
            linkedin,
          } = response.data.user;

          const events =
            eventAttended?.map((eve) => ({
              EventName: eve.event.EventName,
              startDate: eve.event.startDate,
              id: eve.event.id,
            })) || [];

          setUserData({
            name,
            clubName,
            email,
            isVerified,
            events,
            profileAvatar,
            tags,
            course,
            bio,
            year,
            createdAt,
            collegeName,
            twitter,
            instagram,
            linkedin,
          });

          setPosts(response.data.user.CreatePost);
        } else {
          setIsNotFound(true);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
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
    toast(`Exploring ${skill} communities...`, {
      duration: 2000,
    });
  };

  const handleHighFive = (postId: string) => {
    setHighFivedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
        toast(`🙌 High-Five sent!`, {
          duration: 2000,
          style: {
            background: '#FCD34D',
            color: '#1F2937',
            border: 'none',
          },
        });
      }
      return newSet;
    });
  };

  const handleShareProfile = async () => {
    try {
      await navigator.share({
        title: `${userData?.name}'s Profile`,
        text: `Check out ${userData?.name}'s profile on Zynvo!`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast('Profile URL copied to clipboard!');
    }
  };

  const openTicketModal = async (eventId: string) => {
    try {
      setSelectedEventId(eventId);
      const safeId = encodeURIComponent(eventId);
      const url = `/api/proxy/events/event-details?id=${safeId}`;
      const headers: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const tok = localStorage.getItem('token');
        if (tok) headers['authorization'] = `Bearer ${tok}`;
      }
      const resp = await axios.get<{
        data: {
          eventName: string;
          clubName: string;
          collegeName: string;
          startDate: Date;
          profilePic: string;
        };
      }>(url, { headers });
      if (resp && resp.data && resp.data.data) {
        const d = resp.data.data;
        setTicketData({
          ...d,
          startDate: new Date(d.startDate).toLocaleString(),
        });
        setShowTicketModal(true);
      }
    } catch (e: any) {
      console.error('Ticket fetch failed', e);
      toast(e?.response?.data?.msg || e?.message || 'Unable to load ticket');
    }
  };

  const downloadTicket = async () => {
    if (badgeRef.current) {
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

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
          <p className="text-gray-400 mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Facebook-style Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.back()}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-white">
              {userData.name || 'Profile'}
            </h1>
          </div>
          <Button
            onClick={handleShareProfile}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-3 py-2 rounded-full text-sm flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Facebook-style Cover Photo & Profile */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 relative overflow-hidden">
          <Image
            src="/banners/profilebanner.jpg"
            alt="Profile Banner"
            fill
            className="object-cover size-5"
            priority
            sizes="3"
          />
        </div>

        {/* Profile Info Section */}
        <div className="bg-black px-4 pb-4">
          {/* Profile Picture */}
          <div className="relative -mt-16 mb-4">
            {userData.profileAvatar ? (
              <img
                src={userData.profileAvatar}
                className="w-32 h-32 rounded-full border-4 border-black bg-yellow-400 object-cover"
                alt="user profile"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-black bg-yellow-400 flex items-center justify-center text-gray-900 text-4xl font-bold">
                {userData.name ? userData.name.charAt(0) : 'U'}
              </div>
            )}
            {userData.isVerified && (
              <div className="absolute bottom-2 right-2 bg-yellow-400 rounded-full p-1">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold">
                  ✓
                </div>
              </div>
            )}
          </div>

          {/* Name and Bio */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              {userData.name || 'User'}
            </h2>
            <p className="text-gray-400 mb-3 leading-relaxed">
              {userData.bio || "This user hasn't added a bio yet."}
            </p>

            {/* Info Row */}
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-yellow-400" />
                <span>{userData.course || 'Course not specified'}</span>
                {userData.year && <span>• Year {userData.year}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <span>
                  Joined{' '}
                  {userData.createdAt
                    ? new Date(userData.createdAt).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Recently'}
                </span>
              </div>
              {userData.collegeName && (
                <div className="text-gray-300">{userData.collegeName}</div>
              )}
            </div>
          </div>

          {/* Skills Tags */}
          {userData.tags && userData.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {userData.tags.map((tag, idx) => (
                  <LegoSkillBlock
                    key={idx}
                    skill={tag}
                    index={idx}
                    onClick={() => handleSkillClick(tag)}
                  />
                ))}
              </div>
            </div>
          )}

                {/* Socials: Twitter/X, LinkedIn, Instagram */}
                <div className="flex flex-wrap gap-2 mt-2">
                {userData.twitter && (
                  <a
                  href={userData.twitter.startsWith('http') ? userData.twitter : `https://x.com/${userData.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1 rounded-full bg-black text-white text-xs sm:text-sm font-medium hover:bg-gray-900 transition-colors"
                  >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="mr-1">
                    <path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37c-.83.5-1.75.87-2.72 1.07A4.28 4.28 0 0 0 12 8.75c0 .34.04.67.1.99C8.09 9.6 4.83 7.88 2.67 5.15c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.83 1.92 3.61-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.49 3.85 3.47 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.07.54 1.68 2.11 2.9 3.97 2.93A8.6 8.6 0 0 1 2 19.54c-.32 0-.64-.02-.95-.06A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.69-6.26 11.69-11.69 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.19 8.19 0 0 1-2.36.65z"/>
                  </svg>
                  <span className="truncate max-w-[100px]">{userData.twitter.replace('https://x.com/', '').replace('@', '')}</span>
                  </a>
                )}
                {userData.linkedin && (
                  <a
                  href={userData.linkedin.startsWith('http') ? userData.linkedin : `https://linkedin.com/in/${userData.linkedin.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="mr-1">
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.25h-3v-5.5c0-1.1-.9-2-2-2s-2 .9-2 2v5.5h-3v-10h3v1.5c.41-.77 1.36-1.5 2.5-1.5 1.93 0 3.5 1.57 3.5 3.5v6.5z"/>
                  </svg>
                  <span className="truncate max-w-[100px]">{userData.linkedin.replace('https://linkedin.com/in/', '').replace('@', '')}</span>
                  </a>
                )}
                {userData.instagram && (
                  <a
                  href={userData.instagram.startsWith('http') ? userData.instagram : `https://instagram.com/${userData.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1 rounded-full bg-pink-500 text-white text-xs sm:text-sm font-medium hover:bg-pink-600 transition-colors"
                  >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="mr-1">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.013-4.947.072-1.276.059-2.555.334-3.535 1.314-.98.98-1.255 2.259-1.314 3.535-.059 1.28-.072 1.688-.072 4.947s.013 3.667.072 4.947c.059 1.276.334 2.555 1.314 3.535.98.98 2.259 1.255 3.535 1.314 1.28.059 1.688.072 4.947.072s3.667-.013 4.947-.072c1.276-.059 2.555-.334 3.535-1.314.98-.98 1.255-2.259 1.314-3.535.059-1.28.072-1.688.072-4.947s-.013-3.667-.072-4.947c-.059-1.276-.334-2.555-1.314-3.535-.98-.98-2.259-1.255-3.535-1.314-1.28-.059-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
                  </svg>
                  <span className="truncate max-w-[100px]">{userData.instagram.replace('https://instagram.com/', '').replace('@', '')}</span>
                  </a>
                )}
                </div>


          {/* Stats Row */}
          <div className="flex justify-around py-3 border-t border-gray-800">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">
                {posts?.length || 0}
              </div>
              <div className="text-xs text-gray-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">
                {userData.events?.length || 0}
              </div>
              <div className="text-xs text-gray-400">Events</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">
                {userData.createdAt
                  ? new Date().getFullYear() -
                    new Date(userData.createdAt).getFullYear()
                  : 0}
              </div>
              <div className="text-xs text-gray-400">Years</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-4 space-y-4">
        {/* Posts Section */}
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Posts</h3>
            </div>
            <Badge className="bg-yellow-400 text-gray-900 text-xs">
              {posts?.length || 0} total
            </Badge>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {posts && posts.length > 0 ? (
              posts.map((post, index) => (
                <div
                  key={post.id}
                  className="border border-gray-800 rounded-lg p-3 hover:border-yellow-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {userData.profileAvatar ? (
                        <img
                          src={userData.profileAvatar}
                          className="w-8 h-8 rounded-full object-cover"
                          alt="user"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 text-xs font-bold">
                          {userData.name ? userData.name.charAt(0) : 'U'}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">
                          {userData.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          Post #{index + 1}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                    {post.description ||
                      'No description available for this post.'}
                  </p>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                    <div className="text-xs text-gray-400">Public post</div>
                    <HighFiveButton
                      postId={post.id}
                      isHighFived={highFivedPosts.has(post.id)}
                      onHighFive={handleHighFive}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BarChart2 className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
                <p className="text-gray-400">No posts yet</p>
                <p className="text-gray-500 text-sm">Nothing shared yet!</p>
              </div>
            )}
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Events Attended</h3>
            </div>
            <Badge className="bg-yellow-400 text-gray-900 text-xs">
              {userData.events?.length || 0} total
            </Badge>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {userData.events && userData.events.length > 0 ? (
              userData.events.map((event, index) => (
                <div
                  key={event.id}
                  className="border border-gray-800 rounded-lg p-3 hover:border-yellow-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-400 p-2 rounded-full">
                        <Calendar className="w-4 h-4 text-gray-900" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">
                          {event.EventName}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {new Date(event.startDate).toLocaleDateString(
                            'default',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Attended
                      </Badge>
                      <button
                        onClick={() => openTicketModal(event.id)}
                        className="text-xs px-2 py-1 rounded-md bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                      >
                        View Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
                <p className="text-gray-400">No events yet</p>
                <p className="text-gray-500 text-sm">No events attended!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>

      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl w-full max-w-md border border-neutral-800 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Your Ticket</div>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div ref={badgeRef}>
                <EventBadgeCard
                  eventName={ticketData.eventName || 'Event'}
                  eventTimings={ticketData.startDate || ''}
                  collegeName={ticketData.collegeName || ''}
                  clubName={ticketData.clubName || ''}
                  profileImage={ticketData.profilePic || ''}
                  qrCodeImage={selectedEventId ? `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://zynvo.social/verify-event/${selectedEventId}` : undefined}
                  style={{ backgroundColor: '#1e293b', textColor: 'white', overlayOpacity: 0.6 }}
                />
              </div>
              <div className="mt-3 flex justify-end">
                <Button onClick={downloadTicket} className="bg-yellow-500 hover:bg-yellow-400 text-black">
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
