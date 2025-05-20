import { Sidebar } from '@/components/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clubs & Societies | Zynvo',
  description: 'Discover and join exciting college clubs and societies. Find the perfect community that matches your interests and passions.',
  openGraph: {
    title: 'Clubs & Societies | Zynvo',
    description: 'Discover and join exciting college clubs and societies',
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
