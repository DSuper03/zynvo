'use client';
import { useEffect, useState } from 'react';
import { Calendar, BarChart2, User, X } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Define interfaces for better type checking
interface Event {
  EventName: string;
  id: string;
}

export interface UserData {
  name: string | null;
  email: string;
  clubName: string | null;
  isVerified: boolean | null;
  events: Event[];
  profileAvatar: string;
  bio : string
  year : string 
  tags : string[]
  course : string
  createdAt : Date
}

export interface ApiResponse {
  user: {
    id : string
    createdAt : Date
    bio : string
    year : string 
    tags : string[]
    course : string
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
     CreatePost: {
        id: string;
        description: string;
    }[];
  };
}

export default function ZynvoDashboard() {
  const navigate = useRouter();
  // integration is not complete therefore used any

  const [posts, setPosts] = useState<{id : string, description : string}[]>([])
  const [id, setId] = useState<string>("")
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: '',
    course: '',
    year: '',
    tags: ''
  });
  const [update, setUpdate] = useState<boolean>(false)

  useEffect(() => {
    setIsClient(true);
  }, []);

 
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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`,
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
              bio,
              course,
              year,
              tags,
              createdAt
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
              tags,
              course,
              bio,
              year, 
              createdAt
            });
            setId(response.data.user.id)
            setPosts(response.data.user.CreatePost)
            setUpdate(false)
            // Set form values with existing data
            setProfileForm({
              bio: bio || '',
              course: course || '',
              year: year || '',
              tags: tags ? tags.join(', ') : ''
            });
          } else {
            alert("Error fetching in details")
            navigate.push("/auth/signin")
          }
        } catch (error) {
          console.error('API Error:', error);
            alert("Error fetching in details")
            navigate.push("/auth/signin")
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isClient, navigate, update]);

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...profileForm,
      tags: profileForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }
    const update = await axios.put<{
      msg : string
    }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/updateProfile`, 
      data ,
      {
        headers : {
          authorization : `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    if(update.status == 200) {
      toast(update.data.msg);
    } else {
      toast("Error on backend");
    }
    setShowProfileModal(false);
    setUpdate(true)
  };

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }


  if (!userData) {
    return null; 
  }

  return (
    <div className="min-h-screen h-full bg-black text-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-24 pb-8 px-4">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Your Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowProfileModal(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-full"
            >
              Complete Profile
            </button>
            <button
              onClick={() => navigate.push('/feedback')}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-full"
            >
              Feature Request
            </button>
          </div>
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
              <p className="text-gray-400 mb-4">{userData.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                {userData.tags && userData.tags.length > 0 ? (
                  userData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                  ))
                ) : (
                  <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm">
                  complete your profile
                  </span>
                )}
                </div>
              <div className="flex space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1 text-yellow-400" />
                    <span>
                    Joined {userData.createdAt ? new Date(userData.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'July 2026'}
                    </span>
                </div>
                <div className="flex items-center">
                  <BarChart2 className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>{posts?.length || 0} Posts</span>
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
                  {posts?.length}
                </h2>
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
              </div>
              <div className="bg-yellow-400 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>
        </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Your Recent Posts
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-700">
              <ul className="divide-y divide-gray-700">
                {posts?.map((post) => (
                  <li key={post.id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-gray-200 font-medium">
                            {post.description.length > 100
                            ? post.description.slice(0, 100) + '...'
                            : post.description}
                        </h4>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Recent Events Attended
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-700">
              <ul className="divide-y divide-gray-700">
                {userData.events?.map((event) => (
                  <li
                    key={event.id}
                    className="py-4 cursor-pointer hover:bg-gray-800 rounded transition"
                    onClick={() => navigate.push(`/events/${event.id}`)}
                  >
                    <h4 className="text-gray-200 font-medium">{event.EventName}</h4>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Calendar className="w-4 h-4 mr-1 text-yellow-400" />
                      <span>Event ID: {event.id}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Complete Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleProfileFormSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileFormChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course
                </label>
                <input
                  type="text"
                  name="course"
                  value={profileForm.course}
                  onChange={handleProfileFormChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={profileForm.year}
                  onChange={handleProfileFormChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g. 2025"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={profileForm.tags}
                  onChange={handleProfileFormChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g. Web Development, React, JavaScript (comma separated)"
                />
                <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}