'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { HeaderProps } from '@/types/global-Interface';

// Default navigation items if none are provided
const defaultNavItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
];

export function Header({
  navItems = defaultNavItems,
  logoText = 'Zynvo',
  ctaText = 'Get Started',
  ctaLink = '/auth/signup',
  showCta = true,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={`absolute  left-1/2 transform -translate-x-1/2 mt-3 rounded-full ${
        scrolled ? 'bg-black/90 backdrop-blur-md py-3' : 'bg-black py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <span className="text-2xl font-bold text-yellow-400">
                {logoText}
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Pages dropdown (like in the reference) */}

            {/* Main Navigation */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <Link key={item.name} href={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center px-3 py-2 ${
                        isActive
                          ? 'bg-yellow-500 text-black'
                          : 'text-white hover:bg-yellow-500/10 hover:text-yellow-400'
                      } rounded-md transition-all duration-300 font-medium`}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Docs Button */}
            <button className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Docs
            </button>

            {/* User Avatar (as in the reference) */}
            <div className="ml-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold shadow-md overflow-hidden"
              >
                A
              </motion.div>
            </div>

            {/* Get Started Button - Only shows if showCta is true */}
            {showCta && (
              <Link href={ctaLink} className="ml-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-500 text-black font-medium px-5 py-2 rounded-md hover:bg-yellow-400 transition-colors shadow-md"
                >
                  {ctaText}
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${
                mobileMenuOpen
                  ? 'bg-yellow-500 text-black'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-black/95 backdrop-blur-md py-4 px-4"
        >
          <div className="flex flex-col space-y-2">
            {/* Pages dropdown for mobile */}
            <div className="py-3 px-4 bg-yellow-500/10 text-yellow-400 rounded-md flex justify-between items-center">
              <span>Pages</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Main Navigation */}
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link key={item.name} href={item.path}>
                  <div
                    className={`py-3 px-4 rounded-md text-center font-medium ${
                      isActive
                        ? 'bg-yellow-500 text-black'
                        : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                    }`}
                  >
                    {item.name}
                  </div>
                </Link>
              );
            })}

            {/* Docs for mobile */}
            <div className="py-3 px-4 rounded-md text-center font-medium bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Docs
            </div>

            {/* Avatar for mobile */}
            <div className="flex items-center space-x-3 py-3 px-4 bg-yellow-500/10 rounded-md">
              <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-white">Account</p>
              </div>
            </div>

            {/* Get Started Button - Only shows if showCta is true */}
            {showCta && (
              <Link href={ctaLink} className="mt-2">
                <div className="bg-yellow-500 text-black font-medium py-3 px-4 rounded-md text-center shadow-md">
                  {ctaText}
                </div>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}

export default Header;
