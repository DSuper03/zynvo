"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { 
  FiHome, FiCalendar, FiUsers, FiCompass, 
  FiMessageSquare, FiBookmark, FiSettings, 
  FiHelpCircle, FiChevronLeft, FiChevronRight,
  FiTrendingUp, FiBell, FiStar
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Home', icon: <FiHome className="h-5 w-5" />, path: '/' },
  { name: 'Events', icon: <FiCalendar className="h-5 w-5" />, path: '/events' },
  { name: 'Clubs', icon: <FiUsers className="h-5 w-5" />, path: '/clubs' },
  { name: 'Discover', icon: <FiCompass className="h-5 w-5" />, path: '/discover' },
  { name: 'Feed', icon: <FiMessageSquare className="h-5 w-5" />, path: '/feed' },
];

const otherItems = [
  { name: 'Saved', icon: <FiBookmark className="h-5 w-5" />, path: '/saved' },
  { name: 'Trending', icon: <FiTrendingUp className="h-5 w-5" />, path: '/trending' },
  { name: 'Notifications', icon: <FiBell className="h-5 w-5" />, path: '/notifications', badge: true },
];

const bottomItems = [
  { name: 'Settings', icon: <FiSettings className="h-5 w-5" />, path: '/settings' },
  { name: 'Help & Support', icon: <FiHelpCircle className="h-5 w-5" />, path: '/help' },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsExpanded(window.innerWidth >= 1024);
      setIsCollapsed(window.innerWidth < 1024 && window.innerWidth >= 768);
    };

    // Set initial states
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const variants = {
    expanded: { width: 240 },
    collapsed: { width: 72 },
  };

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 },
  };

  // Hide sidebar completely on mobile unless triggered from Header
  if (isMobile) {
    return null;
  }

  return (
    <motion.aside
      initial={isCollapsed ? "collapsed" : "expanded"}
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={variants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "h-screen fixed top-0 left-0 z-30 pt-20 pb-4 border-r",
        "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
        "flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700",
        "no-scrollbar scrollbar-track-transparent"
      )}
    >
      <div className="flex-grow px-3">
        {/* Main Menu */}
        <nav className="space-y-1 mb-8">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <Link key={item.name} href={item.path}>
                <motion.div
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg",
                    "text-sm font-medium cursor-pointer",
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={isActive ? "text-primary-600 dark:text-primary-400" : ""}>
                    {item.icon}
                  </div>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.span
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={itemVariants}
                        className="ml-3 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-6 bg-primary-600 dark:bg-primary-400 rounded-r-full"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Secondary Menu */}
        <div className="mb-4">
          {isExpanded && (
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Shortcuts
            </h3>
          )}
          <nav className="space-y-1">
            {otherItems.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <Link key={item.name} href={item.path}>
                  <motion.div
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg",
                      "text-sm font-medium cursor-pointer",
                      isActive
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative">
                      <div className={isActive ? "text-primary-600 dark:text-primary-400" : ""}>
                        {item.icon}
                      </div>
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary-500"></span>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.span
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          variants={itemVariants}
                          className="ml-3 whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Featured Section (only when expanded) */}
        {isExpanded && (
          <div className="mb-6 px-3">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-4 border border-primary-100 dark:border-primary-800/20">
              <div className="flex items-center mb-2">
                <FiStar className="text-primary-500 h-4 w-4 mr-1" />
                <h4 className="text-sm font-medium text-primary-700 dark:text-primary-300">Featured Event</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Annual Campus Tech Hackathon - Apr 25</p>
              <Link href="/events/hackathon">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-xs text-primary-600 dark:text-primary-400 font-medium inline-flex items-center"
                >
                  Learn more
                  <FiChevronRight className="ml-1 h-3 w-3" />
                </motion.div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="px-3 mt-auto">
        {/* Collapsible Separator */}
        {isExpanded && (
          <div className="h-px bg-gray-200 dark:bg-gray-800 mb-3"></div>
        )}

        {/* Bottom Menu */}
        <nav className="space-y-1 mb-4">
          {bottomItems.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <Link key={item.name} href={item.path}>
                <motion.div
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg",
                    "text-sm font-medium cursor-pointer",
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={isActive ? "text-primary-600 dark:text-primary-400" : ""}>
                    {item.icon}
                  </div>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.span
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={itemVariants}
                        className="ml-3 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isExpanded ? (
            <FiChevronLeft className="h-5 w-5" />
          ) : (
            <FiChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;