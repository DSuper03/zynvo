"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import { 
  FiSearch, 
  FiMenu, 
  FiX, 
  FiBell, 
  FiMoon, 
  FiSun, 
  FiUser, 
  FiSettings, 
  FiHelpCircle, 
  FiLogOut,
  FiChevronDown,
  FiHome,
  FiCalendar,
  FiUsers,
  FiBookOpen,
  FiCompass
} from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

// Main navigation items with nested options
const navItems = [
  { 
    name: 'Home', 
    path: '/',
    icon: FiHome
  },
  { 
    name: 'Events', 
    path: '/events',
    icon: FiCalendar,
    dropdown: [
      { name: 'Upcoming Events', path: '/events?filter=upcoming' },
      { name: 'My Events', path: '/events?filter=my-events' },
      { name: 'Calendar View', path: '/events/calendar' },
      { name: 'Create Event', path: '/events/create' }
    ] 
  },
  { 
    name: 'Clubs', 
    path: '/clubs',
    icon: FiUsers,
    dropdown: [
      { name: 'Browse Clubs', path: '/clubs' },
      { name: 'My Clubs', path: '/clubs?filter=my-clubs' },
      { name: 'Club Categories', path: '/clubs/categories' },
      { name: 'Create Club', path: '/clubs/create' }
    ]
  },
  { 
    name: 'Feed', 
    path: '/feed',
    icon: FiBookOpen 
  },
  { 
    name: 'Discover', 
    path: '/discover',
    icon: FiCompass,
    dropdown: [
      { name: 'Popular', path: '/discover?sort=popular' },
      { name: 'New', path: '/discover?sort=new' },
      { name: 'Trending', path: '/discover?sort=trending' },
      { name: 'Categories', path: '/discover/categories' }
    ] 
  },
];

// Mock user data - replace with real authentication in production
const mockUser = {
  name: "Jane Doe",
  email: "jane@university.edu",
  avatar: "https://i.pravatar.cc/150?u=jane",
  isLoggedIn: true
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme: currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(mockUser);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => setUser({...mockUser, isLoggedIn: false});

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b backdrop-blur-md",
          scrolled 
            ? "bg-white/85 dark:bg-gray-900/90 border-gray-200/70 dark:border-gray-800/70 shadow-sm" 
            : "bg-transparent border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 m-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <span className="text-white font-bold text-xl">Z</span>
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Zynvo
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation with Dropdowns - Redesigned */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                item.dropdown ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-900 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                        <FiChevronDown className="ml-1 h-3 w-3 opacity-70" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-52 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200 dark:border-gray-800">
                      {item.dropdown.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link href={subItem.path} className="w-full cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link key={item.name} href={item.path}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </motion.div>
                  </Link>
                )
              ))}
            </nav>

            {/* Desktop Right Section - Redesigned */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
              >
                <FiSearch className="h-5 w-5" />
              </motion.button>
              
              {/* Theme Toggle */}
              {mounted && (
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                  aria-label="Toggle theme"
                >
                  {currentTheme === 'dark' ? (
                    <FiSun className="h-5 w-5" />
                  ) : (
                    <FiMoon className="h-5 w-5" />
                  )}
                </motion.button>
              )}
              
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 relative"
                    aria-label="Notifications"
                  >
                    <FiBell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-gray-900"></span>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200 dark:border-gray-800">
                  <DropdownMenuLabel className="font-semibold text-gray-900 dark:text-gray-100">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                      <DropdownMenuItem key={i} className="p-3 cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/50 focus:bg-gray-50/80 dark:focus:bg-gray-800/50">
                        <div className="flex space-x-3">
                          <div className="relative flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <FiCalendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              New event: Photography Workshop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              5 minutes ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center justify-center" asChild>
                    <Link href="/notifications" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Auth Buttons or Profile */}
              {user.isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 rounded-full focus:outline-none"
                    >
                      <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-800/50 shadow-sm">
                        <Image 
                          src={user.avatar}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <FiChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200 dark:border-gray-800">
                    <div className="flex items-center p-3">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 border-2 border-indigo-200 dark:border-indigo-800/50">
                        <Image 
                          src={user.avatar}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer flex items-center">
                          <FiUser className="mr-2 h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer flex items-center">
                          <FiSettings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/help" className="cursor-pointer flex items-center">
                          <FiHelpCircle className="mr-2 h-4 w-4" />
                          <span>Help & Support</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                      <FiLogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="font-medium border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button size="sm" className="font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-sm shadow-indigo-500/20">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Mobile Notifications */}
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 relative">
                <FiBell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-gray-900"></span>
              </button>
              
              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with Accordions - Redesigned */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800"
            >
              <div className="px-4 pt-2 pb-3 space-y-1 max-h-[70vh] overflow-y-auto">
                {/* Mobile User Profile */}
                {user.isLoggedIn && (
                  <div className="py-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-3 p-2">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-800/50">
                        <Image 
                          src={user.avatar}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <Link href="/profile" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full justify-center border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600">
                          <FiUser className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                      <Link href="/settings" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full justify-center border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600">
                          <FiSettings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                
                {/* Mobile Navigation Items */}
                <div className="py-2">
                  {navItems.map((item) => (
                    <div key={item.name} className="py-1">
                      {item.dropdown ? (
                        <div className="py-1">
                          <div className="flex items-center justify-between py-2 px-3 text-base font-medium text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-100/70 dark:hover:bg-gray-800/70">
                            <Link href={item.path} className="flex items-center flex-1">
                              <item.icon className="mr-3 h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                              {item.name}
                            </Link>
                            <button className="p-1 rounded-md hover:bg-gray-200/80 dark:hover:bg-gray-700/80">
                              <FiChevronDown className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                          <div className="ml-10 border-l-2 border-indigo-200/50 dark:border-indigo-800/30 pl-3 space-y-1">
                            {item.dropdown.map((subItem) => (
                              <Link key={subItem.name} href={subItem.path}>
                                <div className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                  {subItem.name}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link href={item.path}>
                          <div className="flex items-center py-2 px-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-gray-100/70 dark:hover:bg-gray-800/70">
                            <item.icon className="mr-3 h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                            {item.name}
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    {/* Theme Toggle */}
                    {mounted && (
                      <button
                        onClick={toggleTheme}
                        className="flex items-center py-2 px-3 text-base font-medium text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-100/70 dark:hover:bg-gray-800/70 w-full"
                      >
                        {currentTheme === 'dark' ? (
                          <>
                            <FiSun className="mr-3 h-5 w-5 text-yellow-500" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <FiMoon className="mr-3 h-5 w-5 text-indigo-500" />
                            Dark Mode
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Auth Buttons for Mobile */}
                  {!user.isLoggedIn && (
                    <div className="mt-4 flex space-x-3">
                      <Link href="/auth/login" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600">
                          Log in
                        </Button>
                      </Link>
                      <Link href="/auth/sign-up" className="flex-1">
                        <Button size="sm" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-sm">
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {/* Logout Button for Mobile */}
                  {user.isLoggedIn && (
                    <button 
                      onClick={handleLogout}
                      className="mt-4 flex items-center w-full py-2 px-3 text-base font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50/70 dark:hover:bg-red-900/20"
                    >
                      <FiLogOut className="mr-3 h-5 w-5" />
                      Log out
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* Add a spacer to prevent content from being hidden behind the fixed header */}
      <div className="h-16"></div>
    </>
  );
}

export default Header;