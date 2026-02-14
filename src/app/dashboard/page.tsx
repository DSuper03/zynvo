'use client';
import { useEffect, useState, useRef, use } from 'react';
import {
  Calendar,
  BarChart2,
  User,
  X,
  Menu,
  School,
  UserCheck,
  Settings,
  Building,
  Lock,
} from 'lucide-react';
import { NotificationDropdown } from '@/components/notifications';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { AuroraText } from '@/components/magicui/aurora-text';
import CompleteProfileModal from '@/components/modals/CompleteProfileModal';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import CollegeSearchSelect from '@/components/colleges/collegeSelect';
import { FaSchool } from 'react-icons/fa';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import EventBadgeCard from '@/components/ticket';
import TextWithLinks from '@/components/TextWithLinks';


interface Event {
  EventName: string;
  startDate: string;
  id: string;
  passId?: string | null;
  
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
  clubId: string | null;
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
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
    clubId: string | null;
    eventAttended: {
      passId?: string | null;
      uniquePassId?: string | null;
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

interface isAdminResponse {
  msg : string;
  founder : string;
}

// Add these new components and styles to your dashboard
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
        relative cursor-pointer transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 hover:-translate-y-0.5 sm:hover:-translate-y-1
        ${colors[index % colors.length]}
        rounded-md sm:rounded-lg px-2 py-1 sm:px-3 md:px-4 sm:py-1.5 md:py-2 text-white font-bold text-xs sm:text-sm shadow-md sm:shadow-lg
        hover:shadow-lg sm:hover:shadow-xl hover:shadow-yellow-500/30
        group max-w-[120px] sm:max-w-none
      `}
    >
      <span className="relative z-10 truncate block">{skill}</span>
      <div className="absolute inset-0 rounded-md sm:rounded-lg border-2 duration-300" />

      {/* LEGO studs effect - hide on mobile */}
      <div className="hidden sm:flex absolute top-0 left-0 right-0 justify-center space-x-1 p-1">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/20 rounded-full group-hover:bg-white/40 transition-all duration-300" />
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/20 rounded-full group-hover:bg-white/40 transition-all duration-300" />
      </div>
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
          className={`h-5 w-5 transition-all duration-300 ${isHighFived ? 'animate-bounce' : 'group-hover:rotate-12'}`}
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
const SkillsModal = ({
  skill,
  isOpen,
  onClose,
}: {
  skill: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Communities for "{skill}"
          </h2>
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
              <h3 className="font-bold text-white text-sm sm:text-base">
                {skill} Club
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Join fellow {skill} enthusiasts
              </p>
              <div className="flex items-center mt-2 text-xs text-yellow-400">
                <User className="w-3 h-3 mr-1" />
                <span>142 members</span>
              </div>
            </div>

            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <h3 className="font-bold text-white text-sm sm:text-base">
                {skill} Study Group
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Collaborate and learn together
              </p>
              <div className="flex items-center mt-2 text-xs text-yellow-400">
                <User className="w-3 h-3 mr-1" />
                <span>89 members</span>
              </div>
            </div>

            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <h3 className="font-bold text-white text-sm sm:text-base">
                Upcoming {skill} Workshop
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Hands-on session this Friday
              </p>
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
  handleProfileFormChange,
}: {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  profileForm: { tags: string };
  handleProfileFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  // Add the missing useState for searchTerm and showAll
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const predefinedTags = [
    // 🔥 Campus & Personality Vibes
    'Maths-Champ 📐',
    'CR 📝',
    'Heroine 💅',
    'Yapper 🎤',
    'Kanyakumari 🌊',
    'MuscleMommy 💪👩',
    'OverAchiever 🏆',
    'Natkhat 😏',
    'Pookie 🐻',
    'Senorita 💃',
    'Rust-Coder 🦀',
    'Mini-CR 👶📝',
    'Cutiepie 🌸',
    '9Gpa 📊🤓',
    'Back Nhi Aii 🫡',
    'LFG 🚀',
    'Certified Rizzler 😎✨',
    'Main Character 🎬',
    'Lowkey Genius 🧠',
    'Sleep Deprived 💤',
    'Coffee Addict ☕🔥',
    'Gym Rat 🐀🏋️',
    'Anime Binger 🍥',
    'Memer 😂📲',
    'Delulu 😵‍💫',
    'NPC 🕹️',
    'Sigma 😤',
    'Skibidi 🚽',
    'Ohio Vibes 🌽',
    'Broke but Happy 💸🙂',
    'Canteen King 🍔👑',
    'Hostel Survivor 🛏️',

    // 👨‍💻 Tech & Geek Energy
    'AI 🤖',
    'Web Dev 🌐',
    'App Dev 📱',
    'Backend Bro 💻',
    'Frontend Girl ✨',
    'Full Stack ⚡',
    'DevOps ⚙️',
    'Cloud ☁️',
    'Docker 🐳',
    'K8s 🚢',
    'Bug Slayer 🐞🔪',
    'Hackathon Addict ⏱️',
    'LeetCode Grinder 🧩',
    'CTF Player 🕵️',
    'Open Source 🌍',
    'Cybersecurity 🔒',
    'Robotics 🤖🔧',
    'Blockchain ⛓️',
    'Crypto Bro 📈',
    'VR/AR 🥽',

    // 🎨 Creative & Artsy
    'UI/UX ✏️',
    'Aesthetic Queen 🌷',
    'Figma Warrior 🎨',
    'Canva Pro 🖼️',
    'Photographer 📸',
    'Video Editor ✂️🎞️',
    'Digital Artist 🖌️',
    'Animator 🕺',
    'Content Creator 🎥',
    'Reel Star 📱✨',
    'Poet ✒️',
    'Writer 📝',
    'Podcaster 🎙️',
    'Stand-up Comedian 🎭😂',
    'Musician 🎶',
    'Singer 🎤',
    'Dancer 🕺',
    'Theatre Kid 🎭',
    'K-Pop Stan 💜',

    // 📚 Academics (but fun)
    'Maths Nerd ➗',
    'Physics Buff ⚛️',
    'Bio Bae 🧬',
    'Chem Geek ⚗️',
    'Psych Major 🧠',
    'Lawyer Loading ⚖️',
    'Doctor Saap 🩺',
    'Engg Survivor 🛠️',
    'Eco Bro 📉',
    'Political Junkie 🗳️',

    // 🏀 Sports & Fitness
    'Football ⚽',
    'Cricket 🏏',
    'Hooper 🏀',
    'Tennis 🎾',
    'Badminton 🏸',
    'Runner 🏃',
    'Cyclist 🚴',
    'Yoga Girl 🧘',
    'Boxer 🥊',
    'Hiker 🏔️',
    'Gym Rat 🐀',
    'MMA Fighter 🐅',

    // 🌎 Languages (Spicy)
    'English 🇬🇧',
    'Hindi 🇮🇳',
    'Spanish 🇪🇸',
    'French 🥖',
    'Japanese 🍣',
    'Korean 🇰🇷✨',
    'Anime Subtitles Master 🈸',
    'Multilingual Flex 🌍',

    // 🎮 Hobbies
    'Gamer 🎮',
    'Valorant Addict 🔫',
    'BGMI Warrior 🪖',
    'COD Mobile 🔥',
    'Minecraft Builder ⛏️',
    'Chess Nerd ♟️',
    'Puzzle Solver 🧩',
    'Netflix Binger 🍿',
    'Manga Reader 📚',
    'K-Drama Addict 💔',
    'Fashion Icon 👗',
    'Sneakerhead 👟',
    'Pet Lover 🐾',
    'Foodie 🍕',
    'Traveller ✈️',
    'Backpacker 🎒',
    'Café Explorer ☕',

    // 🧑‍💼 Skills (with Gen-Z drip)
    'Public Speaking 🎤',
    'Leader 🫡',
    'Team Player 🤝',
    'Problem Solver 🔍',
    'Networking Plug 🔗',
    'Time Juggler ⏰',
    'Critical Thinker 🤔',
    'Research Wizard 🔮',
    'Data Guy 📊',
    'Excel Pro 📑',

    // 🌀 Misc Gen-Z Energy
    'Manifesting ✨',
    'Astro Girl 🔮',
    'Vibe Curator 🎧',
    'Zen Mode 🧘',
    'Therapy Needed 🛋️',
    'Mentally in Goa 🏝️',
    'Future CEO 👔',
    'Start-up Kid 🚀',
    'Crypto is Life 📉📈',
    'Side Hustler 💼',
    'Based 🗿',
    'No Cap 🧢',
    'Bet 💯',
    'Slay Queen 👑',
  ];

  const toggleTag = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(updatedTags);
  };

  const filteredTags = predefinedTags.filter((tag) =>
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
          {displayTags.map((tag) => (
            <Button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`
                px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                ${
                  selectedTags.includes(tag)
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
  const [posts, setPosts] = useState<{ id: string; description: string }[]>([]);
  const [id, setId] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: '',
    course: '',
    year: '',
    tags: '',
    collegeName: '',
    twitter: '',
    instagram: '',
    linkedin: '',
  });
  const [update, setUpdate] = useState<boolean>(false);
  const [token, setToken] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [highFivedPosts, setHighFivedPosts] = useState<Set<string>>(new Set());
  const [selectedPredefinedTags, setSelectedPredefinedTags] = useState<
    string[]
  >([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<any>({});
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isQrGenerating, setIsQrGenerating] = useState(false);
  const [qrPreviewOpen, setQrPreviewOpen] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  // NEW: compact UI controls
  const [activePane, setActivePane] = useState<'posts' | 'events'>('posts');
  const [viewAllPosts, setViewAllPosts] = useState(false);
  const [viewAllEvents, setViewAllEvents] = useState(false);
  const [showAllProfileTags, setShowAllProfileTags] = useState(false);
  const [founder , setFounder] = useState<string>('false')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (tok) setToken(tok);
      else {
         toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => navigate.push('/auth/signin'),
          },
        });
        return;
      }

      if (sessionStorage.getItem('activeSession') != 'true') {
         toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => navigate.push('/auth/signin'),
          },
        });
        return;
      }
    }
  }, [navigate]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (!token) {
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
              createdAt,
              collegeName,
              twitter,
              instagram,
              linkedin,
              clubId
            } = response.data.user;

            const events =
              eventAttended?.map((eve) => ({
                EventName: eve.event.EventName,
                startDate: eve.event.startDate,
                id: eve.event.id,
                passId: eve.uniquePassId ?? eve.passId ?? null,
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
              clubId
            });
            setId(response.data.user.id);
            setPosts(response.data.user.CreatePost);
            setUpdate(false);
            // Set form values with existing data
            setProfileForm({
              bio: bio || '',
              course: course || '',
              year: year || '',
              tags: tags ? tags.join(', ') : '',
              collegeName: collegeName || '',
              twitter : twitter || '',
              linkedin : linkedin || '',
              instagram : instagram || ''
            });

            // Set selected predefined tags
            setSelectedPredefinedTags(tags || []);
          } else {
            alert('Error fetching in details');
            navigate.push('/auth/signin');
          }
        } catch (error) {
          console.error('API Error:', error);
          alert('Error fetching in details');
          navigate.push('/auth/signin');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isClient, navigate, update,token]);




  useEffect(()=> {
   if(!isClient) return;

   if(!token || !sessionStorage.getItem('activeSession') || sessionStorage.getItem('activeSession') != "true") {
    toast("please login")
    return;
   }

   if(sessionStorage.getItem('founder')) {
    setFounder(sessionStorage.getItem('founder') as string);
    return;
   } 

   const fetch = async() => {
     const isfounder = await axios.get<isAdminResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/isClubAdmin`
      , {
        headers : {
          authorization : `Bearer ${token}`
        }
      }
     )
     if(isfounder.data.founder) {
      sessionStorage.setItem('founder', isfounder.data.founder )
      setFounder(isfounder.data.founder);
     } else {
      // remove in production
      alert('check console')
      console.log(isfounder.data.msg);
     }
     return;
   }

   // add this in loader as well ki agar ye set nhi hai toh keep the loader on.
   fetch()
  },[isClient])

  const handleProfileFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
       toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => navigate.push('/auth/signin'),
          },
        });
      return;
    }

    // Combine predefined tags with manual tags
    const manualTags = profileForm.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    const allTags = [...new Set([...selectedPredefinedTags, ...manualTags])];

    const data = {
      ...profileForm,
      tags: allTags,
    };

    const update = await axios.put<{
      msg: string;
    }>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/updateProfile`,
      data,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (update.status == 200) {
      toast(update.data.msg);
    } else {
      toast('Error on backend');
    }
    setShowProfileModal(false);
    setUpdate(true);
  };

  const buildPassUrl = (passId: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/verify-pass/${encodeURIComponent(passId)}`;
    }
    return `/verify-pass/${encodeURIComponent(passId)}`;
  };

  const generateQrCode = async (value: string | null | undefined) => {
    if (!value) {
      setQrCodeDataUrl(null);
      setIsQrGenerating(false);
      return;
    }
    setIsQrGenerating(true);
    try {
      const QRCode = await import('qrcode');
      const toDataURL =
        (QRCode as any).toDataURL || (QRCode as any).default?.toDataURL;
      if (!toDataURL) {
        throw new Error('QR toDataURL not available');
      }
      const dataUrl = await toDataURL(value, {
        margin: 1,
        width: 160,
      });
      setQrCodeDataUrl(dataUrl);
    } catch (e) {
      console.error('QR generation failed', e);
      setQrCodeDataUrl(null);
    } finally {
      setIsQrGenerating(false);
    }
  };

  const openTicketModal = async (eventId: string, passId?: string | null) => {
    try {
      setSelectedEventId(eventId);
      setTicketData({});
      setShowTicketModal(true);
      setQrPreviewOpen(false);
      const qrValue = passId ? buildPassUrl(passId) : buildPassUrl(eventId);
      await generateQrCode(qrValue);
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
      let payload: any = null;
      try {
        const resp = await axios.get<{ data: any }>(url, { headers });
        payload = resp?.data?.data ?? null;
      } catch (err) {
        // fall back to local event info
      }

      const fallback = userData?.events?.find((e) => e.id === eventId);
      const eventName =
        payload?.eventName ??
        payload?.EventName ??
        payload?.event?.eventName ??
        payload?.event?.EventName ??
        fallback?.EventName ??
        'Event';
      const clubName =
        payload?.clubName ??
        payload?.club?.name ??
        payload?.event?.clubName ??
        userData?.clubName ??
        '';
      const collegeName =
        payload?.collegeName ??
        payload?.university ??
        payload?.univerisity ??
        payload?.event?.collegeName ??
        userData?.collegeName ??
        '';
      const startDateRaw = payload?.startDate ?? payload?.event?.startDate ?? fallback?.startDate;
      const profilePic =
        payload?.profilePic ??
        payload?.profileAvatar ??
        payload?.event?.profilePic ??
        userData?.profileAvatar ??
        '';

      if (eventName || startDateRaw || clubName || collegeName) {
        setTicketData({
          eventName,
          clubName,
          collegeName,
          startDate: startDateRaw ? new Date(startDateRaw).toLocaleString() : '',
          profilePic,
        });
      } else {
        toast('Unable to load ticket');
      }
    } catch (e: any) {
      console.error('Ticket fetch failed', e);
      toast(e?.response?.data?.msg || e?.message || 'Unable to load ticket');
    }
  };

  const downloadTicket = async () => {
    if (badgeRef.current) {
      // Lazy load html-to-image only when needed
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

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(skill);
    setShowSkillsModal(true);
  };

  const handleHighFive = (postId: string) => {
    setHighFivedPosts((prev) => {
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
          },
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
    <div className="min-h-screen h-full bg-black text-gray-100 top-3 ">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto pt-12 sm:pt-16 md:pt-20 pb-10 px-4 sm:px-6">
        {/* Dashboard Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div className="flex flex-wrap justify-end gap-2 sm:gap-3 w-full sm:w-auto self-end sm:self-auto">
            <NotificationDropdown />
          </div>
        </div>

        {/* Profile Card - Mobile Responsive */}
        <div className="bg-gray-900 rounded-2xl shadow-lg mb-8 sm:mb-10 overflow-hidden">
          <div className="h-24 sm:h-28 md:h-36 relative overflow-hidden">
            <Image
              src="/banners/profilebanner.jpg"
              alt="Profile Banner"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
            />
          </div>
          <div className="relative px-3 sm:px-4 md:px-6 pb-4 sm:pb-6">
            <div className="absolute -top-6 sm:-top-8 md:-top-12 left-3 sm:left-4 md:left-6">
              {userData.profileAvatar ? (
                <Image
                  src={userData.profileAvatar}
                  className="w-12 h-12 sm:w-16 md:w-20 lg:w-24  sm:h-16 md:h-20 lg:h-24 rounded-full border-2 sm:border-4 border-gray-900 bg-yellow-400 object-cover"
                  alt="user pfp"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 md:w-20 lg:w-24  sm:h-16 md:h-20 lg:h-24 rounded-full border-2 sm:border-4 border-gray-900 bg-yellow-400 flex items-center justify-center text-gray-900 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  {userData.name ? userData.name.charAt(0) : 'Z'}
                </div>
              )}
            </div>

            <div className="pt-8 sm:pt-10 md:pt-12 lg:pt-14 xl:pt-16">
              {/* Name Section */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-sans bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent leading-tight mb-3 sm:mb-4">
                {userData.name}
              </h1>

              {/* Club Section - Mobile Responsive */}
              {userData.clubName ? (
                <div className="mb-4 sm:mb-5">
                  {/* Club Name Badge with Reset Password Button */}
                  <div className="flex items-center gap-2 mb-3">
                    <Link href={`/clubs/${userData.clubId}`}>
                      <div className="inline-flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer">
                        <Building className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm sm:text-base font-medium truncate max-w-[200px] sm:max-w-none">
                          {userData.clubName}
                        </p>
                      </div>
                    </Link>
                    <Button
                      onClick={() => navigate.push('/reset-password')}
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-gray-800/50 hover:bg-gray-800 border border-neutral-300 hover:border-yellow-400/50 text-gray-400 hover:text-yellow-400 transition-all duration-200"
                      aria-label="Reset Password"
                    >
                      <Lock className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Action Buttons - Stack on Mobile */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
                    <Button
                      onClick={async () => {
                        try {
                          const leave = await axios.put<any>(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/leaveClub`,
                            {
                              clubId: userData.clubId,
                              clubname: userData.clubName,
                            },
                            {
                              headers: {
                                authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          toast.success(leave.data.message || leave.data.msg || 'Successfully left the club');
                          setTimeout(() => window.location.reload(), 1000);
                        } catch (error: any) {
                          toast.error(error.response?.data?.message || error.response?.data?.msg || 'Error leaving club');
                        }
                      }}
                      variant="outline"
                      className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 border-red-500/50 text-red-400 hover:text-red-300 font-medium py-2 transition-all"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Leave Club
                    </Button>

                    {founder === 'true' && (
                      <Button
                        onClick={() => navigate.push(`/admin/${userData.clubId}`)}
                        variant="outline"
                        className="w-full sm:w-auto bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/50 text-blue-400 hover:text-blue-300 font-medium py-2 transition-all"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Controls
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div 
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-center cursor-pointer hover:bg-gray-700 transition-colors mb-4"
                  onClick={() => navigate.push('/clubs')}
                >
                  <p className="text-gray-300 text-sm sm:text-base">
                    You haven't joined any club yet
                  </p>
                  <p className="text-yellow-400 text-xs sm:text-sm font-medium mt-1 hover:text-yellow-300 transition-colors">
                    Join fast! →
                  </p>
                </div>
              )}
              <p className="text-gray-100 mb-3 text-sm sm:text-base font-serif line-clamp-2 leading-relaxed">
                {userData.bio}
              </p>

              {/* Course / Year / College */}
              <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <p className="text-yellow-400 font-bold text-xs sm:text-sm">
                    Course:{' '}
                    <span className="text-gray-300 font-normal">
                      {userData.course || 'complete profile'}
                    </span>
                  </p>
                  <p className="text-yellow-400 font-bold text-xs sm:text-sm">
                    Year:{' '}
                    <span className="text-gray-300 font-normal">
                      {userData.year || 'complete profile'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center bg-gray-800 text-gray-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm w-fit">
                  <FaSchool className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-yellow-400 flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-none">
                    {userData.collegeName || 'College not set'}
                  </span>
                </div>
                
                {/* Complete Profile Button - Contextually placed */}
                {  (
                  <div className="mt-3">
                    <Button
                      onClick={() => setShowProfileModal(true)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105"
                    >
                      ✨ Complete Your Profile
                    </Button>
                  </div>
                )}
              </div>

              {/* Social Links Section - Redesigned with Senior Dev UX */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Connect
                  </h3>
                  <div className="h-px bg-gradient-to-r from-yellow-400/20 to-transparent flex-1 ml-3"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Twitter/X Link */}
                  {userData.twitter && (
                    <a
                      href={userData.twitter.startsWith('http') ? userData.twitter : `https://x.com/${userData.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02]"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="group-hover:scale-110 transition-transform duration-300">
                            <path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37c-.83.5-1.75.87-2.72 1.07A4.28 4.28 0 0 0 12 8.75c0 .34.04.67.1.99C8.09 9.6 4.83 7.88 2.67 5.15c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.83 1.92 3.61-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.49 3.85 3.47 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.07.54 1.68 2.11 2.9 3.97 2.93A8.6 8.6 0 0 1 2 19.54c-.32 0-.64-.02-.95-.06A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.69-6.26 11.69-11.69 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.19 8.19 0 0 1-2.36.65z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-gray-100 transition-colors">
                            Twitter/X
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            @{userData.twitter.replace('https://x.com/', '').replace('@', '')}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300">
                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                          </svg>
                        </div>
                      </div>
                    </a>
                  )}
                  {/* LinkedIn Link */}
                  {userData.linkedin && (
                    <a
                      href={userData.linkedin.startsWith('http') ? userData.linkedin : `https://linkedin.com/in/${userData.linkedin.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-xl p-4 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02]"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="group-hover:scale-110 transition-transform duration-300">
                            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.25h-3v-5.5c0-1.1-.9-2-2-2s-2 .9-2 2v5.5h-3v-10h3v1.5c.41-.77 1.36-1.5 2.5-1.5 1.93 0 3.5 1.57 3.5 3.5v6.5z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-blue-100 transition-colors">
                            LinkedIn
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {userData.linkedin.replace('https://linkedin.com/in/', '').replace('@', '')}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all duration-300">
                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                          </svg>
                        </div>
                      </div>
                    </a>
                  )}
                {userData.instagram && (
                  <a
                  href={userData.instagram.startsWith('http') ? userData.instagram : `https://instagram.com/${userData.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-gradient-to-br from-pink-900/20 to-purple-800/10 border border-pink-700/30 rounded-xl p-4 hover:border-pink-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 hover:scale-[1.02]"
                  >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="mr-1">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.013-4.947.072-1.276.059-2.555.334-3.535 1.314-.98.98-1.255 2.259-1.314 3.535-.059 1.28-.072 1.688-.072 4.947s.013 3.667.072 4.947c.059 1.276.334 2.555 1.314 3.535.98.98 2.259 1.255 3.535 1.314 1.28.059 1.688.072 4.947.072s3.667-.013 4.947-.072c1.276-.059 2.555-.334 3.535-1.314.98-.98 1.255-2.259 1.314-3.535.059-1.28.072-1.688.072-4.947s-.013-3.667-.072-4.947c-.059-1.276-.334-2.555-1.314-3.535-.98-.98-2.259-1.255-3.535-1.314-1.28-.059-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
                  </svg>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:from-pink-600 group-hover:to-purple-700 transition-all duration-300">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="group-hover:scale-110 transition-transform duration-300">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308 1.266-.058 1.646.07-4.85.07zm0-2.163c-3.259 0-3.667.013-4.947.072-1.276.059-2.555.334-3.535 1.314-.98.98-1.255 2.259-1.314 3.535-.059 1.28-.072 1.688-.072 4.947s.013 3.667.072 4.947c.059 1.276.334 2.555 1.314 3.535.98.98 2.259 1.255 3.535 1.314 1.28.059 1.688.072 4.947.072s3.667-.013 4.947-.072c1.276-.059 2.555-.334 3.535-1.314.98-.98 1.255-2.259 1.314-3.535.059-1.28.072-1.688.072-4.947s-.013-3.667-.072-4.947c-.059-1.276-.334-2.555-1.314-3.535-.98-.98-2.259-1.255-3.535-1.314-1.28-.059-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-pink-100 transition-colors">
                            Instagram
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            @{userData.instagram.replace('https://instagram.com/', '').replace('@', '')}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-pink-300 group-hover:translate-x-1 transition-all duration-300">
                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                          </svg>
                        </div>
                      </div>
                  </a>
                )}
                </div>

                {/* Empty State for No Social Links */}
                {!userData.twitter && !userData.linkedin && !userData.instagram && (
                  <div className="text-center py-8 px-4 bg-gray-800/30 border border-gray-700/50 rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">No social links added yet</p>
                    <p className="text-xs text-gray-500">Complete your profile to add social connections</p>
                  </div>
                )}
              </div>

              {/* Tags (limited) */}
              <div className="mb-3 sm:mb-4">
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {(userData.tags && userData.tags.length > 0
                    ? showAllProfileTags
                      ? userData.tags
                      : userData.tags.slice(0, 6)
                    : []
                  ).map((tag, idx) => (
                    <LegoSkillBlock
                      key={idx}
                      skill={tag}
                      index={idx}
                      onClick={() => handleSkillClick(tag)}
                    />
                  ))}
                  {(!userData.tags || userData.tags.length === 0) && (
                    <span className="text-yellow-400 px-2 py-1 rounded-full text-xs">
                      complete your profile
                    </span>
                  )}
                </div>
                {userData.tags && userData.tags.length > 6 && (
                  <button
                    className="mt-2 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                    onClick={() => setShowAllProfileTags((v) => !v)}
                  >
                    {showAllProfileTags
                      ? 'Show less'
                      : `Show ${userData.tags.length - 6} more`}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400 flex-shrink-0" />
                  <span className="truncate">
                    Joined{' '}
                    {userData.createdAt
                      ? new Date(userData.createdAt).toLocaleString('default', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </span>
                </div>
                <div className="flex items-center">
                  <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400 flex-shrink-0" />
                  <span>{posts?.length || 0} Posts</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400 flex-shrink-0" />
                  <span>{userData.events?.length || 0} Events</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Segmented control: Posts | Events */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="inline-flex rounded-full bg-gray-800 border border-gray-700 p-0.5 sm:p-1">
            <button
              onClick={() => setActivePane('posts')}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                activePane === 'posts'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActivePane('events')}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                activePane === 'events'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Events
            </button>
          </div>
        </div>

        {/* Posts */}
        {activePane === 'posts' && (
          <div className="bg-gray-900 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-md border-l-2 sm:border-l-4 border-yellow-400 mb-8 sm:mb-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-yellow-400 p-1.5 sm:p-2 rounded-full">
                <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Your Posts</h3>
                <p className="text-lg sm:text-xl font-bold text-yellow-400">
                  Total: {posts?.length || 0}
                </p>
              </div>
            </div>

            {posts && posts.length > 0 ? (
              <ul className="space-y-1.5 sm:space-y-2">
                {(viewAllPosts ? posts : posts.slice(0, 5)).map(
                  (post, index) => (
                    <li key={post.id} className="py-1 sm:py-2">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="cursor-pointer hover:bg-gray-800 rounded-lg p-2 sm:p-3 transition-colors border border-gray-800 hover:border-yellow-500/30">
                            <div className="flex justify-between items-start sm:items-center">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                                  <span className="text-yellow-400 text-xs font-medium">
                                    #{index + 1}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5"
                                  >
                                    Recent
                                  </Badge>
                                </div>
                                <h4 className="text-gray-200 font-medium text-xs sm:text-sm truncate leading-relaxed">
                                  {post.description?.length > 50
                                    ? <TextWithLinks text={post.description.slice(0, 50) + '...'} />
                                    : <TextWithLinks text={post.description || 'Untitled Post'} />}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-72 sm:w-80 bg-gray-800 border-gray-700"
                          side="right"
                        >
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-white">
                                Post #{index + 1}
                              </h4>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                {post.description ||
                                  'No description available for this post.'}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Calendar className="w-3 h-3" />
                                <span className="truncate">{post.description}</span>
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
                  )
                )}
              </ul>
            ) : (
              <div className="text-center py-4 sm:py-6">
                <BarChart2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-500 opacity-50" />
                <p className="text-gray-400 text-xs sm:text-sm">No posts yet</p>
                <p className="text-gray-500 text-xs">Start sharing!</p>
              </div>
            )}

            {posts && posts.length > 5 && (
              <div className="mt-3 sm:mt-4 flex justify-center">
                <Button
                  className="bg-white/10 hover:bg-white/15 text-gray-200 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                  onClick={() => setViewAllPosts((v) => !v)}
                >
                  {viewAllPosts ? 'View less' : `View all (${posts.length})`}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Events */}
        {activePane === 'events' && (
          <div className="bg-gray-900 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-md border-l-2 sm:border-l-4 border-yellow-400 mb-8 sm:mb-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-yellow-400 p-1.5 sm:p-2 rounded-full">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Events Attended
                </h3>
                <p className="text-lg sm:text-xl font-bold text-yellow-400">
                  Total: {userData.events?.length || 0}
                </p>
              </div>
            </div>

            {userData.events && userData.events.length > 0 ? (
              <ul className="space-y-1.5 sm:space-y-2">
                {(viewAllEvents
                  ? userData.events
                  : userData.events.slice(0, 5)
                ).map((event, index) => (
                  <li key={event.id} className="py-1 sm:py-2">
                    <div className="hover:bg-gray-800 rounded-lg p-2 sm:p-3 transition-colors border border-gray-800 hover:border-yellow-500/30">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                            <span className="text-yellow-400 text-xs font-medium">
                              #{index + 1}
                            </span>
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              Attended
                            </Badge>
                            <span className="text-[10px] sm:text-xs text-gray-400">
                              Pass ID:{' '}
                              <span className="font-mono text-gray-200">
                                {event.passId || '—'}
                              </span>
                            </span>
                          </div>
                          <h4 className="text-gray-200 font-medium text-xs sm:text-sm truncate leading-relaxed">
                            {event.EventName}
                          </h4>
                          {/* <p className="text-xs text-gray-400 mt-1">
                            {new Date(event.startDate).toLocaleString('default', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p> */}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                          <button
                            onClick={() => openTicketModal(event.id, event.passId)}
                            className="text-[10px] sm:text-xs px-2 py-1 rounded-md bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                          >
                            View Ticket
                          </button>
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 sm:py-6">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-500 opacity-50" />
                <p className="text-gray-400 text-xs sm:text-sm">No events yet</p>
                <p className="text-gray-500 text-xs">Join some events!</p>
              </div>
            )}

            {userData.events && userData.events.length > 5 && (
              <div className="mt-3 sm:mt-4 flex justify-center">
                <Button
                  className="bg-white/10 hover:bg-white/15 text-gray-200 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                  onClick={() => setViewAllEvents((v) => !v)}
                >
                  {viewAllEvents
                    ? 'View less'
                    : `View all (${userData.events.length})`}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl w-full max-w-md border border-neutral-800 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Your Ticket</div>
              <button
                onClick={() => {
                  setShowTicketModal(false);
                  setQrPreviewOpen(false);
                  setIsQrGenerating(false);
                }}
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
                  qrCodeImage={qrCodeDataUrl || undefined}
                  onQrClick={qrCodeDataUrl ? () => setQrPreviewOpen(true) : undefined}
                  isQrLoading={isQrGenerating}
                  
                 
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

      {qrPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl w-full max-w-sm border border-neutral-800 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">QR Code</div>
              <button
                onClick={() => setQrPreviewOpen(false)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                X
              </button>
            </div>
            <div className="p-4 flex items-center justify-center">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="QR Code" className="h-64 w-64" />
              ) : (
                <div className="text-sm text-gray-500">QR code not available</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feature Request Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => navigate.push('/feedback')}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-medium px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
        >
          <span className="text-sm">💡</span>
          <span className="hidden sm:inline text-sm">Feature Request</span>
        </Button>
      </div>

      {/* Complete Profile Modal */}
      <CompleteProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profileForm={profileForm}
        onChange={handleProfileFormChange}
        onSubmit={handleProfileFormSubmit}
        selectedPredefinedTags={selectedPredefinedTags}
        onTagsChange={setSelectedPredefinedTags}
      />

      {/* Skills Modal */}
      <SkillsModal
        skill={selectedSkill}
        isOpen={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
      />
    </div>
  );
}
