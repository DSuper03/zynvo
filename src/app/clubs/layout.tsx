'use client';

import { Sidebar } from '@/components/Sidebar';
import MobileTabBar from '@/components/MobileTabBar';
import { WarmupProvider } from '@/components/WarmupProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area - takes remaining width */}
      <main
        className={`
          flex-1 overflow-auto p-4 md:p-6 
          bg-black
          pb-24 md:pb-6 /* Add padding-bottom for mobile to avoid content behind the tab bar */
        `}
      >
        <WarmupProvider>{children}</WarmupProvider>
      </main>

      {/* Mobile Tab Bar - shown on mobile, hidden on desktop */}
      <MobileTabBar />
    </div>
  );
}
