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
} from "@/components/ui/hover-card"


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
  twitter : string | null;
  instagram : string | null;
  linkedin : string | null;
}

export interface ApiResponse {
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
    twitter : string | null;
  instagram : string | null;
  linkedin : string | null;
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

// LEGO-like Skills Component (same as dashboard)
const LegoSkillBlock = ({ skill, index, onClick }: { skill: string, index: number, onClick: () => void }) => {
  const colors = [
    'bg-red-500 hover:bg-red-400',
    'bg-blue-500 hover:bg-blue-400', 
    'bg-green-500 hover:bg-green-400',
    'bg-yellow-500 hover:bg-yellow-400',
    'bg-purple-500 hover:bg-purple-400',
    'bg-pink-500 hover:bg-pink-400',
    'bg-indigo-500 hover:bg-indigo-400',
    'bg-teal-500 hover:bg-teal-400'
  ];
  
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 sm:hover:-translate-y-2
        ${colors[index % colors.length]}
        rounded-lg px-2 py-1 sm:px-4 sm:py-2 text-white font-bold text-xs sm:text-sm shadow-lg
        hover:shadow-xl hover:shadow-yellow-500/30
        group
      `}
    >
      <span className="relative z-10">{skill}</span>
      <div className="absolute inset-0 rounded-lg border-2 duration-300" />
      
      {/* LEGO studs effect - hide on mobile */}
      <div className="hidden sm:flex absolute top-0 left-0 right-0 justify-center space-x-1 p-1">
        <div className="w-2 h-2 bg-white/20 rounded-full group-hover:bg-white/40 transition-all duration-300" />
        <div className="w-2 h-2 bg-white/20 rounded-full group-hover:bg-white/40 transition-all duration-300" />
      </div>
    </div>
  );
};

// High-Five Button Component
const HighFiveButton = ({ postId, isHighFived, onHighFive }: { postId: string, isHighFived: boolean, onHighFive: (id: string) => void }) => {
  return (
    <Button 
      onClick={() => onHighFive(postId)}
      className={`
        flex items-center space-x-2 transition-all duration-300 transform
        ${isHighFived 
          ? 'text-yellow-400 scale-110' 
          : 'text-gray-400 hover:text-yellow-400 hover:scale-105'
        }
        group relative
      `}
    >
      <div className="relative">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-all duration-300 ${isHighFived ? 'animate-bounce' : 'group-hover:rotate-12'}`}
          fill={isHighFived ? 'currentColor' : 'none'} 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5T6.5 15a2 2 0 104 0m-3-2.5v-3a2 2 0 114 0v3M14 13.5V11m0-1V7.5" />
        </svg>
        {isHighFived && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
        )}
      </div>
      <span className="text-xs font-medium">
        {isHighFived ? 'High-Fived!' : 'High-Five'}
      </span>
      
      {/* Sparkle effect on hover */}
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      </div>
    </Button>
  );
};

export default function PublicUserProfile() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [posts, setPosts] = useState<{id: string, description: string}[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [highFivedPosts, setHighFivedPosts] = useState<Set<string>>(new Set());
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem("token");
      if (tok) setToken(tok);
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
            headers: token ? {
              authorization: `Bearer ${token}`,
            } : {},
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
            linkedin
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
            linkedin
          });
          
          setPosts(response.data.user.CreatePost);
        } else {
          setIsNotFound(true);
        }
      } catch (error : any) {
        console.error('Error fetching user data:', error);
        if ( error.response?.status === 404) {
          setIsNotFound(true);
        } else {
          toast("Error loading user profile");
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
    setHighFivedPosts(prev => {
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
          }
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
      toast("Profile URL copied to clipboard!");
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
          <p className="text-gray-400 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
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
    <div className="min-h-screen h-full bg-black text-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-16 sm:pt-20 md:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <AuroraText className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {userData.name}'s Profile
            </AuroraText>
          </div>
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={handleShareProfile}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm flex-1 sm:flex-initial flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Profile
            </Button>
          </div>
        </div>

        {/* Profile Card - Mobile Responsive */}
        <div className="bg-gray-900 rounded-lg shadow-lg mb-6 sm:mb-8 overflow-hidden">
          <div className="h-24 sm:h-32 relative overflow-hidden">
            <Image
              src="/banners/profilebanner.jpg"
              alt="Profile Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="absolute -top-8 sm:-top-12 left-4 sm:left-6">
              {userData.profileAvatar ? (
                <img 
                  src={userData.profileAvatar} 
                  className='w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-full border-2 sm:border-4 border-gray-900 bg-yellow-400 object-cover' 
                  alt="user profile"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-full border-2 sm:border-4 border-gray-900 bg-yellow-400 flex items-center justify-center text-gray-900 text-xl sm:text-3xl md:text-4xl font-bold">
                  {userData.name ? userData.name.charAt(0) : 'U'}
                </div>
              )}
            </div>
            <div className="pt-10 sm:pt-12 md:pt-16">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-0">
                  {userData.name || 'User'}
                </h2>
                {userData.isVerified && (
                  <Badge className="bg-yellow-400 text-gray-900 text-xs">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-400 mb-2 text-sm sm:text-base">
                {userData.bio || "This user hasn't added a bio yet."}
              </p>
              
              {/* Course and Year - Mobile Stack */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mb-3 sm:mb-4">
                <p className="text-yellow-400 font-bold text-sm sm:text-base">
                  Course: <span className="text-gray-400">{userData.course || "Not specified"}</span>
                </p>
                <p className="text-yellow-400 font-bold text-sm sm:text-base">
                  Year: <span className="text-gray-400">{userData.year || "Not specified"}</span>
                </p>
                <p className='text-white text-sm sm:text-base'>
                  {userData.collegeName || "College not specified"}
                </p>
              </div>

              {/* Skills/Tags */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                {userData.tags && userData.tags.length > 0 ? (
                  userData.tags.map((tag, idx) => (
                    <LegoSkillBlock
                      key={idx}
                      skill={tag}
                      index={idx}
                      onClick={() => handleSkillClick(tag)}
                    />
                  ))
                ) : (
                  <span className="text-gray-500 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                    No skills listed
                  </span>
                )}
              </div>

              {/* Stats - Mobile Stack */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400" />
                  <span>
                    Joined {userData.createdAt ? new Date(userData.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'Recently'}
                  </span>
                </div>
                <div className="flex items-center">
                  <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400" />
                  <span>{posts?.length || 0} Posts</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400" />
                  <span>{userData.events?.length || 0} Events</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Posts & Events Section - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          {/* Posts Section - Left Side */}
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 p-2 rounded-full">
                  <BarChart2 className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Posts</h3>
                  <p className="text-xl font-bold text-yellow-400">
                    Total: {posts?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-700">
              {posts && posts.length > 0 ? (
                <ul className="space-y-2">
                  {posts.map((post, index) => (
                    <li key={post.id} className="py-2">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="cursor-pointer hover:bg-gray-800 rounded-lg p-3 transition-colors border border-gray-800 hover:border-yellow-500/30">
                            <div className="flex justify-between items-center">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-yellow-400 text-xs font-medium">
                                    #{index + 1}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    Public
                                  </Badge>
                                </div>
                                <h4 className="text-gray-200 font-medium text-sm truncate">
                                  {post.description.length > 40
                                    ? post.description.slice(0, 40) + '...'
                                    : post.description || 'Untitled Post'}
                                </h4>
                              </div>
                              <div className="ml-2 text-gray-500 text-xs">
                                Hover →
                              </div>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent 
                          className="w-80 bg-gray-800 border-gray-700" 
                          side="right"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-white">
                                Post #{index + 1}
                              </h4>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-300 leading-relaxed">
                                {post.description || 'No description available for this post.'}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <User className="w-3 h-3" />
                                <span>by {userData.name}</span>
                              </div>
                              <HighFiveButton
                                postId={post.id}
                                isHighFived={highFivedPosts.has(post.id)}
                                onHighFive={handleHighFive}
                              />
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <BarChart2 className="w-10 h-10 mx-auto mb-2 text-gray-500 opacity-50" />
                  <p className="text-gray-400 text-sm">No posts yet</p>
                  <p className="text-gray-500 text-xs">Nothing shared yet!</p>
                </div>
              )}
            </div>
          </div>

          {/* Events Section - Right Side */}
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Events Attended</h3>
                  <p className="text-xl font-bold text-yellow-400">
                    Total: {userData.events?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-700">
              {userData.events && userData.events.length > 0 ? (
                <ul className="space-y-2">
                  {userData.events.map((event, index) => (
                    <li key={event.id} className="py-2">
                      <div className="hover:bg-gray-800 rounded-lg p-3 transition-colors border border-gray-800 hover:border-yellow-500/30">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-yellow-400 text-xs font-medium">
                                #{index + 1}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                Attended
                              </Badge>
                            </div>
                            <h4 className="text-gray-200 font-medium text-sm truncate">
                              {event.EventName}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(event.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-2">
                            <Calendar className="w-4 h-4 text-yellow-400" />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-500 opacity-50" />
                  <p className="text-gray-400 text-sm">No events yet</p>
                  <p className="text-gray-500 text-xs">No events attended!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}