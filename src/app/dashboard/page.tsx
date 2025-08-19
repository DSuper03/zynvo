'use client';
import { useEffect, useState } from 'react';
import { Calendar, BarChart2, User, X, BellDotIcon } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { AuroraText } from '@/components/magicui/aurora-text';

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

// Add these new components and styles to your dashboard

// LEGO-like Skills Component
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
        relative cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-2
        ${colors[index % colors.length]}
        rounded-lg px-4 py-2 text-white font-bold text-sm shadow-lg
        hover:shadow-xl hover:shadow-yellow-500/30
        before:absolute before:top-1 before:left-1/2 before:transform before:-translate-x-1/2
        before:w-3 before:h-1 before:bg-white/30 before:rounded-full
        after:absolute after:top-2 after:left-1/2 after:transform after:-translate-x-1/2
        after:w-1 after:h-1 after:bg-white/20 after:rounded-full
        group
      `}
    >
      <span className="relative z-10">{skill}</span>
      <div className="absolute inset-0 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all duration-300" />
      
      {/* LEGO studs effect */}
      <div className="absolute top-0 left-0 right-0 flex justify-center space-x-1 p-1">
        <div className="w-2 h-2 bg-white/20 rounded-full group-hover:bg-white/40 transition-all duration-300" />
        <div className="w-2 h-2 bg-white/20 rounded-full group-hover:bg-white/40 transition-all duration-300" />
      </div>
    </div>
  );
};

// High-Five Button Component
const HighFiveButton = ({ postId, isHighFived, onHighFive }: { postId: string, isHighFived: boolean, onHighFive: (id: string) => void }) => {
  return (
    <button 
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
    </button>
  );
};

// Skills Modal Component
const SkillsModal = ({ skill, isOpen, onClose }: { skill: string, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Communities for "{skill}"</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <h3 className="font-bold text-white">{skill} Club</h3>
              <p className="text-gray-400 text-sm">Join fellow {skill} enthusiasts</p>
              <div className="flex items-center mt-2 text-xs text-yellow-400">
                <User className="w-3 h-3 mr-1" />
                <span>142 members</span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <h3 className="font-bold text-white">{skill} Study Group</h3>
              <p className="text-gray-400 text-sm">Collaborate and learn together</p>
              <div className="flex items-center mt-2 text-xs text-yellow-400">
                <User className="w-3 h-3 mr-1" />
                <span>89 members</span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <h3 className="font-bold text-white">Upcoming {skill} Workshop</h3>
              <p className="text-gray-400 text-sm">Hands-on session this Friday</p>
              <div className="flex items-center mt-2 text-xs text-yellow-400">
                <Calendar className="w-3 h-3 mr-1" />
                <span>This Friday 3PM</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-6 bg-yellow-400 text-gray-900 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
};

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
   const [token, setToken] = useState("")
   const [selectedSkill, setSelectedSkill] = useState<string>('');
   const [showSkillsModal, setShowSkillsModal] = useState(false);
   const [highFivedPosts, setHighFivedPosts] = useState<Set<string>>(new Set());

  useEffect(()=> {
     if (typeof window !== 'undefined') {
     const tok = localStorage.getItem("token")
     if(tok) setToken(tok)
      else {
       toast("login please")
       return;
      }
    }
  }, [])

  useEffect(() => {
    setIsClient(true);
  }, []);

 
  useEffect(() => {
    if (!isClient) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if(!token) {
        toast("login please");
        return;
      }

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
    if(!token) {
        toast("login please");
        return;
      }
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
          authorization : `Bearer ${token}`
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

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(skill);
    setShowSkillsModal(true);
  };

  const handleHighFive = (postId: string) => {
    setHighFivedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
        // Add celebration animation
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
    <div className="min-h-screen h-full bg-black text-gray-100 pt-3">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-24 pb- px-4">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <AuroraText className="text-4xl font-bold text-white">Welcome {userData.name}</AuroraText>
          <div className="flex space-x-4">
            <Button
              onClick={() => setShowProfileModal(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-full"
            >
              Complete Profile
            </Button>
            <Button
              onClick={() => navigate.push('/feedback')}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-full"
            >
              Feature Request
            </Button>
            <Button className='bg-yellow-500'>
              <BellDotIcon  className='text-black'/>
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900 rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="h-32 relative overflow-hidden">
            <Image
              src="/banners/profilebanner.jpg"
              alt="Profile Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 ">
              {/* Optional overlay */}
            </div>
          </div>
          <div className="relative px-6 pb-6">
            <div className="absolute -top-12 left-6">
              {userData.profileAvatar ? (
                <img
                  className="w-24 h-24 rounded-full border-4 border-gray-900 bg-yellow-400"
                  src={userData.profileAvatar}
                  width={96}
                  height={96}
                  alt='your image'
                />
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
              <p className="text-gray-400 mb-1">{userData.bio}</p>
              <p className='text-yellow-400 font-bold mb-1'>Course : <span className='text-gray-400'>{userData.course ? userData.course : "complete profile"}</span> </p>
              <p className='text-yellow-400 font-bold mb-4'>Year : <span className='text-gray-400'>{userData.year ? userData.year : "complete profile"}</span> </p>
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
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData.events && userData.events.length > 0 ? (
                    userData.events.map(event => (
                      <span key={event.id} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-400/20 text-yellow-300 border border-yellow-500/30">
                        <Calendar className="w-3 h-3 mr-1" />
                        {event.EventName}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm italic">No events attended yet</span>
                  )}
                </div>
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
          {/* <div className="bg-gray-900 p-6 rounded-lg shadow-md">
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
          </div> */}
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

      {/* Skills Modal */}
      <SkillsModal
        skill={selectedSkill}
        isOpen={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
      />
    </div>
  );
}