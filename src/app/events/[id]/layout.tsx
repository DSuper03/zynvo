'use client';

import MobileTabBar from '@/components/MobileTabBar';

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Main Content - Responsive padding */}
      <main className="flex-grow pb-24 md:pb-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
          {children}
        </div>
      </main>
      
      {/* Mobile Tab Bar - only visible on mobile */}
      <MobileTabBar />
    </div>
  );
}
