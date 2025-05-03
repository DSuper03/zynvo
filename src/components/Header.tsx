"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Default navigation items if none are provided
const defaultNavItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
];

export type NavItem = {
  name: string;
  path: string;
};

interface HeaderProps {
  navItems?: NavItem[];
  logoText?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
}

export function Header({
  navItems = defaultNavItems,
  logoText = "Zynvo",
  ctaText = "Get Started",
  ctaLink = "/auth/signup",
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-gray-900/90 backdrop-blur-md py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                <span className="text-black font-bold text-xl">{logoText.charAt(0)}</span>
              </div>
              <span className="ml-2 text-xl font-bold text-yellow-400">
                {logoText}
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <Link key={item.name} href={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center px-3 py-2 mx-1 ${
                      isActive 
                        ? "bg-yellow-400 text-black" 
                        : "bg-transparent text-white hover:bg-yellow-400/20"
                    } rounded-full transition-all duration-300 font-medium`}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              );
            })}
            
            {/* Get Started Button - Only shows if showCta is true */}
            {showCta && (
              <Link href={ctaLink} className="ml-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 text-black font-medium px-6 py-2 rounded-full hover:bg-yellow-300 transition-colors shadow-md shadow-yellow-400/20"
                >
                  {ctaText}
                </motion.button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-full ${
                mobileMenuOpen ? "bg-yellow-400 text-black" : "bg-yellow-400/20 text-yellow-400"
              }`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
          className="md:hidden bg-gray-900/95 backdrop-blur-md py-4 px-4"
        >
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <Link key={item.name} href={item.path}>
                  <div className={`py-3 px-4 rounded-full text-center font-medium ${
                    isActive 
                      ? "bg-yellow-400 text-black" 
                      : "bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20"
                  }`}>
                    {item.name}
                  </div>
                </Link>
              );
            })}
            
            {/* Get Started Button - Only shows if showCta is true */}
            {showCta && (
              <Link href={ctaLink} className="mt-2">
                <div className="bg-yellow-400 text-black font-medium py-3 px-4 rounded-full text-center shadow-lg shadow-yellow-400/10">
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