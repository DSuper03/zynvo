import Header from "@/components/Header";
import "@/app/globals.css";
import { ReactNode } from "react";
import { DashboardLayoutProps } from "@/types/global-Interface";



export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
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
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}