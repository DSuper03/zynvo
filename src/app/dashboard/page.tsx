'use client';
import { useEffect, useState } from 'react';
import { Calendar, BarChart2, User, X, BellDotIcon, Menu } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { AuroraText } from '@/components/magicui/aurora-text';
import { Badge } from '@/components/ui/badge';

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
        relative cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 sm:hover:-translate-y-2
        ${colors[index % colors.length]}
        rounded-lg px-2 py-1 sm:px-4 sm:py-2 text-white font-bold text-xs sm:text-sm shadow-lg
        hover:shadow-xl hover:shadow-yellow-500/30
        group
      `}
    >
      <span className="relative z-10">{skill}</span>
      <div className="absolute inset-0 rounded-lg border-2   duration-300" />
      
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

// Skills Modal Component
const SkillsModal = ({ skill, isOpen, onClose }: { skill: string, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-white">Communities for "{skill}"</h2>
          <Button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <h3 className="font-bold text-white text-sm sm:text-base">{skill} Club</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Join fellow {skill} enthusiasts</p>
              <div className="flex items-center mt-2 text-xs text-yellow-400">
                <User className="w-3 h-3 mr-1" />
                <span>142 members</span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <h3 className="font-bold text-white text-sm sm:text-base">{skill} Study Group</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Collaborate and learn together</p>
              <div className="flex items-center mt-2 text-xs text-yellow-400">
                <User className="w-3 h-3 mr-1" />
                <span>89 members</span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <h3 className="font-bold text-white text-sm sm:text-base">Upcoming {skill} Workshop</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Hands-on session this Friday</p>
              <div className="flex items-center mt-2 text-xs text-yellow-400">
                <Calendar className="w-3 h-3 mr-1" />
                <span>This Friday 3PM</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            className="w-full mt-4 sm:mt-6 bg-yellow-400 text-gray-900 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors text-sm sm:text-base"
          >
            Explore More
          </Button>
        </div>
      </div>
    </div>
  );
};

// Update the TagSelector component to fix the missing props
const TagSelector = ({ 
  selectedTags, 
  onTagsChange,
  profileForm,
  handleProfileFormChange
}: { 
  selectedTags: string[], 
  onTagsChange: (tags: string[]) => void,
  profileForm: { tags: string },
  handleProfileFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  // Add the missing useState for searchTerm and showAll
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const predefinedTags = [
  // 🔥 Campus & Personality Vibes
  'Maths-Champ 📐', 'CR 📝', 'Heroine 💅', 'Yapper 🎤', 'Kanyakumari 🌊',
  'MuscleMommy 💪👩', 'OverAchiever 🏆', 'Natkhat 😏', 'Pookie 🐻', 
  'Senorita 💃', 'Rust-Coder 🦀', 'Mini-CR 👶📝', 'Cutiepie 🌸', 
  '9Gpa 📊🤓', 'Back Nhi Aii 🫡', 'LFG 🚀', 'Certified Rizzler 😎✨',
  'Main Character 🎬', 'Lowkey Genius 🧠', 'Sleep Deprived 💤',
  'Coffee Addict ☕🔥', 'Gym Rat 🐀🏋️', 'Anime Binger 🍥', 'Memer 😂📲',
  'Delulu 😵‍💫', 'NPC 🕹️', 'Sigma 😤', 'Skibidi 🚽', 'Ohio Vibes 🌽',
  'Broke but Happy 💸🙂', 'Canteen King 🍔👑', 'Hostel Survivor 🛏️',
  
  // 👨‍💻 Tech & Geek Energy
  'AI 🤖', 'Web Dev 🌐', 'App Dev 📱', 'Backend Bro 💻', 'Frontend Girl ✨',
  'Full Stack ⚡', 'DevOps ⚙️', 'Cloud ☁️', 'Docker 🐳', 'K8s 🚢',
  'Bug Slayer 🐞🔪', 'Hackathon Addict ⏱️', 'LeetCode Grinder 🧩',
  'CTF Player 🕵️', 'Open Source 🌍', 'Cybersecurity 🔒', 
  'Robotics 🤖🔧', 'Blockchain ⛓️', 'Crypto Bro 📈', 'VR/AR 🥽',
  
  // 🎨 Creative & Artsy
  'UI/UX ✏️', 'Aesthetic Queen 🌷', 'Figma Warrior 🎨', 'Canva Pro 🖼️',
  'Photographer 📸', 'Video Editor ✂️🎞️', 'Digital Artist 🖌️',
  'Animator 🕺', 'Content Creator 🎥', 'Reel Star 📱✨',
  'Poet ✒️', 'Writer 📝', 'Podcaster 🎙️', 'Stand-up Comedian 🎭😂',
  'Musician 🎶', 'Singer 🎤', 'Dancer 🕺', 'Theatre Kid 🎭', 'K-Pop Stan 💜',
  
  // 📚 Academics (but fun)
  'Maths Nerd ➗', 'Physics Buff ⚛️', 'Bio Bae 🧬', 'Chem Geek ⚗️',
  'Psych Major 🧠', 'Lawyer Loading ⚖️', 'Doctor Saap 🩺',
  'Engg Survivor 🛠️', 'Eco Bro 📉', 'Political Junkie 🗳️',
  
  // 🏀 Sports & Fitness
  'Football ⚽', 'Cricket 🏏', 'Hooper 🏀', 'Tennis 🎾', 
  'Badminton 🏸', 'Runner 🏃', 'Cyclist 🚴', 'Yoga Girl 🧘',
  'Boxer 🥊', 'Hiker 🏔️', 'Gym Rat 🐀', 'MMA Fighter 🐅',
  
  // 🌎 Languages (Spicy)
  'English 🇬🇧', 'Hindi 🇮🇳', 'Spanish 🇪🇸', 'French 🥖', 
  'Japanese 🍣', 'Korean 🇰🇷✨', 'Anime Subtitles Master 🈸',
  'Multilingual Flex 🌍',
  
  // 🎮 Hobbies
  'Gamer 🎮', 'Valorant Addict 🔫', 'BGMI Warrior 🪖', 'COD Mobile 🔥',
  'Minecraft Builder ⛏️', 'Chess Nerd ♟️', 'Puzzle Solver 🧩',
  'Netflix Binger 🍿', 'Manga Reader 📚', 'K-Drama Addict 💔',
  'Fashion Icon 👗', 'Sneakerhead 👟', 'Pet Lover 🐾', 'Foodie 🍕',
  'Traveller ✈️', 'Backpacker 🎒', 'Café Explorer ☕',
  
  // 🧑‍💼 Skills (with Gen-Z drip)
  'Public Speaking 🎤', 'Leader 🫡', 'Team Player 🤝', 'Problem Solver 🔍',
  'Networking Plug 🔗', 'Time Juggler ⏰', 'Critical Thinker 🤔',
  'Research Wizard 🔮', 'Data Guy 📊', 'Excel Pro 📑',
  
  // 🌀 Misc Gen-Z Energy
  'Manifesting ✨', 'Astro Girl 🔮', 'Vibe Curator 🎧', 'Zen Mode 🧘',
  'Therapy Needed 🛋️', 'Mentally in Goa 🏝️', 'Future CEO 👔',
  'Start-up Kid 🚀', 'Crypto is Life 📉📈', 'Side Hustler 💼',
  'Based 🗿', 'No Cap 🧢', 'Bet 💯', 'Slay Queen 👑',
];

  const toggleTag = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(updatedTags);
  };

  const filteredTags = predefinedTags.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayTags = showAll ? filteredTags : filteredTags.slice(0, 30);

  return (
    <div className="mb-4 sm:mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Skills & Interests
      </label>
      
      {/* Search input */}
      <input
        type="text"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 mb-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
      />
      
      {/* Selected tags count */}
      <div className="mb-3 text-xs text-gray-400">
        Selected: {selectedTags.length} tags
      </div>
      
      {/* Tags grid */}
      <div className="max-h-60 overflow-y-auto bg-gray-800 rounded-lg p-3 border border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {displayTags.map(tag => (
            <Button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`
                px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                ${selectedTags.includes(tag)
                  ? 'bg-yellow-400 text-gray-900 scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }
              `}
            >
              {tag}
            </Button>
          ))}
        </div>
        
        {!showAll && filteredTags.length > 30 && (
          <Button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-3 text-yellow-400 text-xs hover:text-yellow-300 transition-colors"
          >
            Show {filteredTags.length - 30} more tags...
          </Button>
        )}
        
        {showAll && (
          <Button
            type="button"
            onClick={() => setShowAll(false)}
            className="mt-3 text-yellow-400 text-xs hover:text-yellow-300 transition-colors"
          >
            Show fewer tags
          </Button>
        )}
      </div>
      
      {/* Manual input for custom tags */}
      <div className="mt-3">
        <input
          type="text"
          name="tags"
          value={profileForm.tags}
          onChange={handleProfileFormChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
          placeholder="Or add custom tags separated by commas..."
        />
        <p className="text-xs text-gray-400 mt-1">
          You can also type custom tags separated by commas
        </p>
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
   const [selectedPredefinedTags, setSelectedPredefinedTags] = useState<string[]>([]);

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
            
            // Set selected predefined tags
            setSelectedPredefinedTags(tags || []);
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
    
    // Combine predefined tags with manual tags
    const manualTags = profileForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    const allTags = [...new Set([...selectedPredefinedTags, ...manualTags])];
    
    const data = {
      ...profileForm,
      tags: allTags
    };
    
    const update = await axios.put<{
      msg : string
    }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/updateProfile`, 
      data ,
      {
        headers : {
          authorization : `Bearer ${token}`
        }
      }
    );
    
    if(update.status == 200) {
      toast(update.data.msg);
    } else {
      toast("Error on backend");
    }
    setShowProfileModal(false);
    setUpdate(true);
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
      <main className="max-w-7xl mx-auto pt-16 sm:pt-20 md:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <AuroraText className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Welcome {userData.name}
          </AuroraText>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={() => setShowProfileModal(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm flex-1 sm:flex-initial"
            >
              Complete Profile
            </Button>
            <Button
              onClick={() => navigate.push('/feedback')}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm flex-1 sm:flex-initial"
            >
              Feature Request
            </Button>
            <Button className="bg-yellow-500 px-3 py-2 sm:px-4 sm:py-2">
              <BellDotIcon className="text-black w-4 h-4 sm:w-5 sm:h-5" />
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
                <Image
                  className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-full border-2 sm:border-4 border-gray-900 bg-yellow-400 object-cover"
                  src={userData.profileAvatar}
                  width={96}
                  height={96}
                  alt="User profile avatar"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-full border-2 sm:border-4 border-gray-900 bg-yellow-400 flex items-center justify-center text-gray-900 text-xl sm:text-3xl md:text-4xl font-bold">
                  {userData.name ? userData.name.charAt(0) : 'Z'}
                </div>
              )}
            </div>
            <div className="pt-10 sm:pt-12 md:pt-16">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                {userData.name || 'User'}
              </h2>
              <p className="text-gray-400 mb-2 text-sm sm:text-base">{userData.bio}</p>
              
              {/* Course and Year - Mobile Stack */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mb-3 sm:mb-4">
                <p className="text-yellow-400 font-bold text-sm sm:text-base">
                  Course: <span className="text-gray-400">{userData.course ? userData.course : "complete profile"}</span>
                </p>
                <p className="text-yellow-400 font-bold text-sm sm:text-base">
                  Year: <span className="text-gray-400">{userData.year ? userData.year : "complete profile"}</span>
                </p>
              </div>

              
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
                  <span className=" text-yellow-400 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                    complete your profile
                  </span>
                )}
              </div>

              {/* Stats - Mobile Stack */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400" />
                  <span>
                    Joined {userData.createdAt ? new Date(userData.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'July 2026'}
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

        {/* Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1 text-sm sm:text-base">Total Posts</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {posts?.length}
                </h2>
              </div>
              <div className="bg-yellow-400 p-2 sm:p-3 rounded-full">
                <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 mb-1 text-sm sm:text-base">Events Attended</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                  {userData.events?.length || 0}
                </h2>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {userData.events && userData.events.length > 0 ? (
                    userData.events.map(event => (
                      <span 
                        key={event.id} 
                        className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs bg-yellow-400/20 text-yellow-300 border border-yellow-500/30"
                      >
                        <Calendar className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                        <span className="truncate max-w-20 sm:max-w-none">{event.EventName}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-xs sm:text-sm italic">No events attended yet</span>
                  )}
                </div>
              </div>
              <div className="bg-yellow-400 p-2 sm:p-3 rounded-full ml-2 flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts - Mobile Responsive */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Your Recent Posts
              </h3>
            </div>
            <div className="max-h-60 sm:max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-700">
              <ul className="divide-y divide-gray-700">
                {posts?.map((post) => (
                  <li key={post.id} className="py-3 sm:py-4">
                    <div className="flex justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-200 font-medium text-sm sm:text-base pr-2">
                          {post.description.length > (window.innerWidth < 640 ? 60 : 100)
                            ? post.description.slice(0, window.innerWidth < 640 ? 60 : 100) + '...'
                            : post.description}
                        </h4>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Complete Profile Modal - Mobile Responsive */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-white">Complete Your Profile</h2>
              <Button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
            
            <form onSubmit={handleProfileFormSubmit} className="p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileFormChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course
                </label>
                <input
                  type="text"
                  name="course"
                  value={profileForm.course}
                  onChange={handleProfileFormChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={profileForm.year}
                  onChange={handleProfileFormChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g. 2025"
                />
              </div>

              {/* Fix: Use only one TagSelector component */}
              <TagSelector
                selectedTags={selectedPredefinedTags}
                onTagsChange={setSelectedPredefinedTags}
                profileForm={profileForm}
                handleProfileFormChange={handleProfileFormChange}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant={'destructive'}
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium text-sm sm:text-base"
                >
                  Save Profile
                </Button>
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