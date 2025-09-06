'use client';
import { useEffect, useState } from 'react';
import { Calendar, BarChart2, User, ArrowLeft, Share2 } from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
                  <div className="flex items-center justify-between">
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
                    <Badge variant="secondary" className="text-xs">
                      Attended
                    </Badge>
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
    </div>
  );
}
