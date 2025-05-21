import Header from '@/components/Header';
import '@/app/globals.css';
import { ReactNode } from 'react';
import { DashboardLayoutProps } from '@/types/global-Interface';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Dashboard | Zynvo',
  description: 'Manage your club memberships, events, and campus activities all in one place. Stay connected with your university community.',
  keywords: 'student dashboard, club management, campus activities',
  openGraph: {
    title: 'Student Dashboard | Zynvo',
    description: 'Manage your university activities and connections',
    type: 'website',
  }
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Custom navigation items for dashboard
  const dashboardNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Events', path: '/events' },
    { name: 'Clubs', path: '/clubs' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Header
        navItems={dashboardNavItems}
        logoText="Zynvo"
        ctaText="Create Post"
        ctaLink="/post/createPost"
        showCta={true}
      />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
