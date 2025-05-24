import Header from '@/components/Header';
import '@/app/globals.css';
import { ReactNode } from 'react';
import { DashboardLayoutProps } from '@/types/global-Interface';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Custom navigation items for dashboard
  const dashboardNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Events', path: '/events' },
    { name: 'Clubs', path: '/clubs' },
  ];

  return (
     <div className="flex h-screen bg-black">
      {/* Sidebar - fixed on the left */}
      <Sidebar />

      {/* Main content area - takes remaining width */}
      <main className="flex-1 overflow-auto p-6   bg-gradient-to-br from-black to-gray-900">
        {children}
      </main>
    </div>
  );
}
