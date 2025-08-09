'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
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
} from 'lucide-react';
import { Button } from './ui/button';


interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
 

  const menuItems = [
    { icon: <Home size={22} />, label: 'Home', href: '/' },
    { icon: <Search size={22} />, label: 'Discover', href: '/discover' },
    { icon: <Calendar size={22} />, label: 'Events', href: '/events' },
    { icon: <Users size={22} />, label: 'Clubs', href: '/clubs' },
    { icon: <NotebookText size={22} />, label: 'Resources', href: '/resources' },
     { icon: <NotebookText size={22} />, label: 'Leaderboard', href: '/leaderboard' },


  ];

  const accountItems = [
    { icon: <User size={22} />, label: 'Profile', href: '/dashboard' },
    { icon: <Settings size={22} />, label: 'Settings', href: '/dashboard' },
    { icon: <LogOut size={22} />, label: 'Logout', href: '/logout' },
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
      {/* Logo */}
      <div className="p-4 flex items-center text-lg">
        <div className="flex-shrink-0">
          <Image
            src="/logozynvo.jpg"
            alt="Zynvo Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
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
            onClick={onClose} 
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
                width={40}
                height={40}
                className="rounded-full border-2 border-yellow-500"
              />
            </div>
            <div className="ml-3">
              {/* <p className="text-sm font-medium text-white">Anirban </p>
              <p className="text-xs text-gray-400">@anirban001@gmail.com</p> */}
              <p className='text-sm font-bold text-yellow-500'>Zync it!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
