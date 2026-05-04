'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileTabBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { 
      id: 'discover', 
      label: 'Discover', 
      icon: Search, 
      href: '/discover' 
    },
    { 
      id: 'events', 
      label: 'Events', 
      icon: Calendar, 
      href: '/events' 
    },
    { 
      id: 'clubs', 
      label: 'Clubs', 
      icon: Users, 
      href: '/clubs' 
    },
    { 
      id: 'cmap', 
      label: 'Map', 
      icon: MapPin, 
      href: '/cmap' 
    },
    { 
      id: 'zyncers', 
      label: 'Zyncers', 
      icon: () => (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M17 3l4 4-4 4" />
          <path d="M3 11v6a2 2 0 0 0 2 2h12" />
          <path d="M7 21l-4-4 4-4" />
          <path d="M21 13V7a2 2 0 0 0-2-2H7" />
        </svg>
      ), 
      href: '/zyncers' 
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleTabClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 md:hidden flex items-center justify-center px-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div 
          className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-full shadow-lg backdrop-blur-sm"
          style={{
            backgroundColor: '#FFD700',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.href)}
                className="relative flex flex-col items-center justify-center px-2.5 py-1 rounded-full transition-all duration-200 min-w-[52px]"
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  animate={{
                    color: active ? '#FFD700' : '#121212',
                    scale: active ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-0.5 relative z-10"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-bold tracking-tight whitespace-nowrap">
                    {tab.label}
                  </span>
                </motion.div>
                
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-full z-0"
                    style={{
                      backgroundColor: '#121212',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default MobileTabBar;

