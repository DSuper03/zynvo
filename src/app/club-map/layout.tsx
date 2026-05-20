'use client';

import { Sidebar } from '@/components/Sidebar';
import MobileTabBar from '@/components/MobileTabBar';

export default function ClubMapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col bg-black md:flex-row">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-auto bg-gradient-to-br from-black to-gray-900 p-4 pb-24 md:p-6 md:pb-6">
        {children}
      </main>

      <MobileTabBar />
    </div>
  );
}
