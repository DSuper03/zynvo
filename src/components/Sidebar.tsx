'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Calendar,
  Users,
  User,
  LogOut,
  NotebookText,
  Trophy,
  Newspaper,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';
import { FaBahai, FaUsers } from 'react-icons/fa';
import { useWarmup } from './WarmupProvider';

dotenv.config();

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const { userData, loading } = useWarmup();
  const { name, profileAvatar: profile } = userData;

  const menuItems = [
    { icon: <Search size={22} />, label: 'Discover', href: '/discover' },
    { icon: <FaUsers size={22} />, label: 'Zyncers', href: '/zyncers' },
    { icon: <Calendar size={22} />, label: 'Events', href: '/events' },
    { icon: <Users size={22} />, label: 'Clubs', href: '/clubs' },
    // { icon: <Newspaper size={22} />, label: 'News', href: '/news' },
    // @keku bhai agent banne ke ba dconnect karke uncomment kar dena🫡 good night
    { icon: <FaBahai />, label: 'AI', href: '/ai' },
    {
      icon: <NotebookText size={22} />,
      label: 'Resources',
      href: '/resources',
    },
    { icon: <Trophy size={22} />, label: 'Leaderboard', href: '/leaderboard' },
    { icon: <User size={22} />, label: 'Profile', href: '/dashboard' },
  ];

  const accountItems = [
    { icon: <LogOut size={22} />, label: 'Logout', href: '/' },
  ];

  const showText = isOpen;

  return (
    <div
      className={`
      h-full min-h-screen flex flex-col bg-black border-r border-gray-800
      transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-16'}
    `}
    >
      {/* User Profile Header - Mobile Responsive */}
      <div className="p-3 sm:p-4 border-b border-gray-800">
        <div className="flex flex-col items-center w-full">
          {/* Profile Section - Now in vertical layout */}
          <div
            className={`flex flex-col items-center ${isOpen ? 'w-full' : 'w-full'}`}
          >
            {/* Profile Image - Slightly to the right with margin */}
            <div className="flex-shrink-0 ml-2">
              <Link href="/dashboard">
                {profile ? (
                  <div className={`relative rounded-full border-2 border-yellow-500 overflow-hidden ${
                    isOpen ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-10 h-10'
                  }`}>
                    <Image
                      src={profile}
                      alt="Profile"
                      width={isOpen ? 64 : 40}
                      height={isOpen ? 64 : 40}
                      className="object-cover"
                      priority
                      sizes={isOpen ? "(max-width: 640px) 56px, 64px" : "40px"}
                    />
                  </div>
                ) : (
                  <div
                    className={`bg-yellow-500 rounded-full flex items-center justify-center border-2 border-yellow-500 ${
                      isOpen ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-10 h-10'
                    }`}
                  >
                    <User
                      className={`text-black ${isOpen ? 'w-8 h-8' : 'w-5 h-5'}`}
                    />
                  </div>
                )}
              </Link>
            </div>

            {/* Name - Below the image */}
            {showText && (
              <div className="flex-1 min-w-0 mt-3 text-center">
                <h1 className="text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 truncate">
                  {name ? name : 'Zynvo User'}
                </h1>
                <p className="text-xs text-gray-400 truncate">Welcome back!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`
              flex items-center p-3 text-gray-300 rounded-md
              transition-all duration-200 ease-in-out
              ${pathname === item.href ? 'bg-gray-800' : 'hover:bg-gray-700'}
              ${!isOpen ? 'justify-center' : ''}
            `}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            {showText && (
              <span className="ml-3 text-sm font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Account Items - Always visible */}
      <div className="p-3 border-t border-gray-800">
        {accountItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`
              flex items-center p-3 text-gray-300 rounded-md
              transition-all duration-200 ease-in-out
              ${pathname === item.href ? 'bg-gray-800' : 'hover:bg-gray-700'}
              ${!isOpen ? 'justify-center' : ''}
            `}
            onClick={() => {
              sessionStorage.removeItem('activeSession');
            }}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            {showText && (
              <span className="ml-3 text-sm font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
