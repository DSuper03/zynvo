import { Sidebar } from '@/components/Sidebar';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Campus Events | Zynvo',
  description: 'Stay updated with the latest campus events, workshops, and activities. Never miss an opportunity to engage with your college community.',
  openGraph: {
    title: 'Campus Events | Zynvo',
    description: 'Stay updated with the latest campus events and activities',
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
