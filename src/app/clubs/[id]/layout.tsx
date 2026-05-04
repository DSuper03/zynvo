'use client';

import React from 'react';
import MobileTabBar from '@/components/MobileTabBar';

const ClubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <main className="flex-1 w-full pb-24 md:pb-0">{children}</main>
      
      {/* Mobile Tab Bar - only visible on mobile */}
      <MobileTabBar />
    </div>
  );
};

export default ClubLayout;
