'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/legacy/image";
import {
  Home,
  Search,
  Bell,
  Calendar,
  Users,
  BookOpen,
  MessageSquare,
  User,
  Settings,
  LogOut,
  NotebookText,
  Trophy,
} from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dotenv from "dotenv"
import { toast } from 'sonner';

dotenv.config()

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>("")
  const [profile, setProfile] = useState<string | null>("")
  const [name, setName] = useState<string | null>("")

  useEffect(()=> {
     if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []) 

  useEffect(()=> {
    if(!token) return;
    async function call() {
      const response = await axios.get<{msg : string, 
        data : {
        name : string,
        profileAvatar : string
      }}>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getSidebarUser`, {
        headers : {
          authorization : `Bearer ${token}`
        }
      })

      if(response && response.status === 200){
        setName(response.data.data.name)
        setProfile(response.data.data.profileAvatar)
      }
    }

    call()
  }, [token])

  const menuItems = [
    { icon: <Home size={22} />, label: 'Home', href: '/' },
    { icon: <Search size={22} />, label: 'Discover', href: '/discover' },
    { icon: <Calendar size={22} />, label: 'Events', href: '/events' },
    { icon: <Users size={22} />, label: 'Clubs', href: '/clubs' },
    { icon: <NotebookText size={22} />, label: 'Resources', href: '/resources' },
    { icon: <Trophy size={22} />, label: 'Leaderboard', href: '/leaderboard' },


  ];

  const accountItems = [
    { icon: <User size={22} />, label: 'Profile', href: '/dashboard' },
    // { icon: <Settings size={22} />, label: 'Settings', href: '/dashboard' },
    { icon: <LogOut size={22} />, label: 'Logout', href: '/' },
  ];

  // This will ensure text is ALWAYS visible when sidebar is open
  // Especially important for mobile
  const showText = isOpen;

  return (
    <div
      className={`
      h-full min-h-screen flex flex-col bg-black border-r border-gray-800
      transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-16'}
    `}
    >
      {/* user Profile */}
      <div className="p-4 flex items-center text-lg">
        <div className="flex-shrink-0">
          <div className='flex justify-center items-center pl-8'>
            {profile ?
            <img src={profile} alt="pfp" /> :   <Image
            src='/logozynvo.jpg'
            alt="Zynvo Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          }
          <h1 className='text-yellow-400 font-semibold ml-3'>{name ? name : "zynvo user"}</h1>
          </div>
       </div>
      

        {/* Close button - only on mobile when sidebar is open */}
        {isOpen && onClose && (
          <Button
            onClick={onClose}
            className="ml-auto p-1 rounded-full hover:bg-gray-800 md:hidden"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={index}
              href={item.href}
              className={`
                flex items-center py-3 px-3 rounded-lg transition-colors
                ${
                  isActive
                    ? 'bg-yellow-600/20 text-yellow-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
              `}
              onClick={onClose} // Close sidebar on navigation for mobile
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {showText && (
                <span className="ml-4 text-sm font-medium">{item.label}</span>
              )}
              {isActive && showText && (
                <span className="ml-auto h-2 w-2 rounded-full bg-yellow-500"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Account Section */}
      <div className="px-2 pb-4 pt-2 border-t border-gray-800">
        {accountItems.map((item, index) => (
           <Link
      key={index}
      href={item.href}
      className="flex items-center py-2 px-3 mt-1 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
      onClick={() => {
        if (item.label === "Logout") {
          localStorage.removeItem("token");
          toast("logged out")
        }
        onClose;
      }}
    >
            <span className="flex-shrink-0">{item.icon}</span>
            {showText && (
              <span className="ml-4 text-sm font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </div>

      {/* User Profile */}
      {showText && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image
                src="/logozynvo.jpg"
                alt="User avatar"
                width={50}
                height={50}
                className="rounded-full border-2 border-yellow-500"
              />
            </div>
            <div className="ml-3">
              {/* <p className="text-sm font-medium text-white">Anirban </p>
              <p className="text-xs text-gray-400">@anirban001@gmail.com</p> */}
              <p className='text-lg font-extrabold text-yellow-300 text-'>Zync it!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
