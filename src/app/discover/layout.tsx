import Header from "@/components/Header";
import LandingHeader from "@/components/landingHeader";
import { Sidebar } from "@/components/Sidebar";

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