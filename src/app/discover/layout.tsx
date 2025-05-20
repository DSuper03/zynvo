import { Sidebar } from '@/components/Sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Campus Activities | Zynvo',
  description: 'Explore trending clubs, upcoming events, and exciting opportunities at your university. Find the perfect activities to match your interests.',
  keywords: 'discover clubs, campus events, university activities',
  openGraph: {
    title: 'Discover Campus Activities | Zynvo',
    description: 'Explore trending clubs and events at your university',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
