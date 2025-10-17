'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WarmupProvider } from '@/components/WarmupProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMainContentClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen ">
      {/* Mobile Menu Toggle Button */}
      {isMobileView && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`${
            isMobileMenuOpen
              ? 'bg-black/80 text-yellow-400 border border-yellow-400/30'
              : 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 border border-yellow-300/40'
          } fixed top-4 left-4 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 backdrop-blur-sm flex items-center justify-center`}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-pressed={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Sidebar - hidden on mobile by default, shown when toggled */}
      <div
        className={`
          ${isMobileMenuOpen ? 'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm' : 'hidden'} 
          md:relative md:block 
        `}
        onClick={() => isMobileView && setIsMobileMenuOpen(false)}
      >
        <div
          className={`
            fixed left-0 top-0 bottom-0 w-64 bg-black z-40
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:translate-x-0 md:z-auto
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar />
        </div>
      </div>

      {/* Main content area - takes remaining width */}
      <main
        className={`
          flex-1 overflow-auto p-4 md:p-6 
          bg-black
          pt-1 md:pt-6 /* Add padding-top for mobile to avoid content behind the toggle button */
        `}
        onClick={handleMainContentClick}
      >
        <WarmupProvider>{children}</WarmupProvider>
      </main>
    </div>
  );
}
