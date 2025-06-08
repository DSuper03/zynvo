import { Sidebar } from '@/components/Sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Sidebar - fixed on the left */}
      <div className="h-screen">
        <Sidebar />
      </div>

      {/* Main content area - takes remaining width with controlled overflow */}
      <main className="flex-1 h-screen overflow-hidden bg-gradient-to-br from-black to-gray-900">
        <div className="h-full  p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
