'use client';
import { useEffect, useState } from 'react';
import { Calendar, BarChart2, User } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Define interfaces for better type checking
interface Event {
  EventName: string;
  id: string;
}

interface UserData {
  name: string | null;
  email: string;
  clubName: string | null;
  isVerified: boolean | null;
  events: Event[];
  profileAvatar: string;
}

interface ApiResponse {
  user: {
    isVerified: boolean | null;
    name: string | null;
    email: string;
    clubName: string | null;
    profileAvatar: string;
    eventAttended: {
      event: {
        id: string;
        EventName: string;
      };
    }[];
  };
}

// Mock data to use as fallback
const mockUserData = {
  name: 'ASM devs',
  profileAvatar: 'aaaa',
  email: 'devSuper03@contact.com',
  clubName: 'zynvo',
  isVerified: true,
  events: [
    {
      EventName: 'lets create zynvo',
      id: '20072004ID',
    },
    {
      EventName: 'Zynvo is Deployed',
      id: '70024002ID',
    },
  ],
};

// Sample static data
const sampleData = {
  posts: 24,
  recentPosts: [
    { id: 1, title: 'Blockchain Basics', date: 'Apr 28, 2025', likes: 42 },
    { id: 2, title: 'Future of Web3', date: 'Apr 22, 2025', likes: 38 },
    { id: 3, title: 'Understanding DeFi', date: 'Apr 15, 2025', likes: 29 },
    {
      id: 4,
      title: 'NFT Marketplace Analysis',
      date: 'Apr 8, 2025',
      likes: 56,
    },
  ],
  recentEvents: [
    {
      id: 1,
      title: 'Web3 Developer Conference',
      date: 'Apr 30, 2025',
      location: 'San Francisco',
    },
    {
      id: 2,
      title: 'Crypto Investment Summit',
      date: 'Apr 18, 2025',
      location: 'New York',
    },
    {
      id: 3,
      title: 'Blockchain Technology Expo',
      date: 'Mar 25, 2025',
      location: 'London',
    },
  ],
};

export default function ZynvoDashboard() {
  const navigate = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // First useEffect to set isClient to true
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Second useEffect to fetch user data and handle authentication
  useEffect(() => {
    if (!isClient) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate.push('/auth/signup');
          return;
        }

        try {
          const response = await axios.get<ApiResponse>(
            'http://localhost:8000/api/v1/user/getUser',
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
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
            } = response.data.user;

            const events =
              eventAttended?.map((eve) => ({
                EventName: eve.event.EventName,
                id: eve.event.id,
              })) || [];

            setUserData({
              name,
              clubName,
              email,
              isVerified,
              events,
              profileAvatar,
            });
          } else {
            setUserData(mockUserData);
          }
        } catch (error) {
          console.error('API Error:', error);
          setUserData(mockUserData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isClient, navigate]);

  // Early return for non-client rendering or loading state
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  // If no userData after loading, redirect or show message (this should rarely happen)
  if (!userData) {
    return null; // This will be brief as the redirect should happen in the useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-24 pb-8 px-4">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Your Dashboard</h1>
          <button
            onClick={() => navigate.push('/feedback')}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-full"
          >
            Feature Request
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900 rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
          <div className="relative px-6 pb-6">
            <div className="absolute -top-12 left-6">
              {userData.profileAvatar ? (
                <img
                  className="w-24 h-24 rounded-full border-4 border-gray-900 bg-yellow-400"
                  src={userData.profileAvatar}
                ></img>
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-gray-900 bg-yellow-400 flex items-center justify-center text-gray-900 text-4xl font-bold">
                  {userData.name ? userData.name.charAt(0) : 'Z'}
                </div>
              )}
            </div>
            <div className="pt-16">
              <h2 className="text-xl font-bold text-white">
                {userData.name || 'User'}
              </h2>
              <p className="text-gray-400 mb-4">Zynvo Community Member</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm">
                  Blockchain
                </span>
                <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm">
                  NFT
                </span>
                <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm">
                  Smart Contracts
                </span>
                <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm">
                  DeFi
                </span>
              </div>
              <div className="flex space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>Joined Jan 2025</span>
                </div>
                <div className="flex items-center">
                  <BarChart2 className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>{sampleData.posts} Posts</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>{userData.events?.length || 0} Events</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Posts</p>
                <h2 className="text-4xl font-bold text-white">
                  {sampleData.posts}
                </h2>
                <p className="text-gray-400 mt-2 text-sm">
                  +3 posts this month
                </p>
              </div>
              <div className="bg-yellow-400 p-3 rounded-full">
                <BarChart2 className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Events Attended</p>
                <h2 className="text-4xl font-bold text-white">
                  {userData.events?.length || 0}
                </h2>
                <p className="text-gray-400 mt-2 text-sm">
                  +2 events this month
                </p>
              </div>
              <div className="bg-yellow-400 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts & Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Your Recent Posts
              </h3>
              <a
                href="#"
                className="text-yellow-400 hover:text-yellow-500 text-sm font-medium"
              >
                View All
              </a>
            </div>
            <ul className="divide-y divide-gray-700">
              {sampleData.recentPosts.map((post) => (
                <li key={post.id} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-gray-200 font-medium">
                        {post.title}
                      </h4>
                      <p className="text-gray-400 text-sm">{post.date}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm mr-1">
                        {post.likes}
                      </span>
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15.585l-7.07-7.07 1.41-1.41L10 12.585l5.66-5.66 1.41 1.41-7.07 7.07z" />
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Events */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Recent Events Attended
              </h3>
              <a
                href="#"
                className="text-yellow-400 hover:text-yellow-500 text-sm font-medium"
              >
                View All
              </a>
            </div>
            <ul className="divide-y divide-gray-700">
              {sampleData.recentEvents.map((event) => (
                <li key={event.id} className="py-4">
                  <h4 className="text-gray-200 font-medium">{event.title}</h4>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <Calendar className="w-4 h-4 mr-1 text-yellow-400" />
                    <span>{event.date}</span>
                    <span className="mx-2">•</span>
                    <span>{event.location}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
