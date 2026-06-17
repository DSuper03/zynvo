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
    <div className="flex flex-col md:flex-row h-screen bg-black w-full overflow-hidden">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area - takes remaining width */}
      <main
        className={`
          flex-1 flex flex-col overflow-y-auto overflow-x-hidden
          p-4 md:p-6 
          bg-black w-full
          pb-24 md:pb-6
        `}
      >
        <WarmupProvider>{children}</WarmupProvider>
      </main>

      {/* Mobile Tab Bar - shown on mobile, hidden on desktop */}
      <MobileTabBar />
    </div>
  );
}
