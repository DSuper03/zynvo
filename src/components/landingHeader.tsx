'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/legacy/image';
import { Lens } from './magicui/lens';
import { useAuth } from '@/context/authContex';
import { Button } from './ui/button';


// Animation transition settings
const transition = {
  type: 'spring',
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// MenuItem component
const MenuItem = ({
  setActive,
  active,
  item,
  href,
  children,
}: {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  href: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <Link href={href}>
        <motion.p
          transition={{ duration: 0.3 }}
          className="cursor-pointer text-gray-300 hover:text-white transition-colors font-medium"
        >
          {item}
        </motion.p>
      </Link>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
        >
          {active === item && children && (
            <>
              <div className="absolute top-full left-0 h-5 w-full" />
              <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 z-50">
                <motion.div
                  layoutId="active"
                  className="bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-xl rounded-2xl overflow-hidden border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.2)]"
                >
                  <motion.div layout className="w-max h-full p-4">
                    {children}
                  </motion.div>
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

// HoveredLink component
const HoveredLink = ({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-400 hover:text-white transition-all duration-200 py-2 block hover:translate-x-1"
    >
      {children}
    </Link>
  );
};

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const { user, softLogout, hardLogout, login } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-md bg-black/80 py-2 shadow-lg border-b border-yellow-500/10'
          : 'backdrop-blur-sm bg-black/40 py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/50 transition-shadow">
                <span className="text-black font-bold text-xl">Z</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:inline">ynvo</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <nav
            className="hidden md:flex items-center space-x-8"
            onMouseLeave={() => setActiveItem(null)}
          >
            <MenuItem
              setActive={setActiveItem}
              active={activeItem}
              item="Discover"
              href="/discover"
            >
              <div className="grid grid-cols-2 gap-4 w-[400px]">
                <HoveredLink href="/events">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="text-yellow-400 text-2xl">⚡</span>
                    <div>
                      <p className="font-medium text-white">Campus Events</p>
                      <p className="text-xs text-gray-400">
                        Find exciting events near you
                      </p>
                    </div>
                  </div>
                </HoveredLink>
                <HoveredLink href="/clubs">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="text-yellow-400 text-2xl">👥</span>
                    <div>
                      <p className="font-medium text-white">College Clubs</p>
                      <p className="text-xs text-gray-400">
                        Join groups that match your interests
                      </p>
                    </div>
                  </div>
                </HoveredLink>
                <HoveredLink href="/leaderboard">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="text-yellow-400 text-2xl">💡</span>
                    <div>
                      <p className="font-medium text-white">Leaderboard</p>
                      <p className="text-xs text-gray-400">
                        Compete with others and climb the ranks
                      </p>
                    </div>
                  </div>
                </HoveredLink>
              </div>
            </MenuItem>

            <MenuItem
              setActive={setActiveItem}
              active={activeItem}
              item="Clubs"
              href="/clubs"
            />

            <MenuItem
              setActive={setActiveItem}
              active={activeItem}
              item="Contact"
              href="/contact"
            />

            {user ? (
              <div className="flex items-center gap-4">
                <Button
                  onClick={login}
                  className="bg-yellow-500 hover:bg-yellow-400 p-0 rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
                >
                  <img
                    src={user.pfp}
                    alt="pfp"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Button>
                <button
                  onClick={hardLogout}
                  className="bg-yellow-500 text-black hover:bg-yellow-400 px-5 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth/signup"
                  className="bg-yellow-500 text-black hover:bg-yellow-400 px-6 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/signin"
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-6 py-2.5 rounded-lg font-semibold transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
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
          </Button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative mx-4 mt-20 rounded-3xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-yellow-500/30 shadow-[0_0_80px_rgba(234,179,8,0.25)] overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
              
              {/* Header row inside panel */}
              <div className="relative flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                    <span className="text-black font-bold text-lg">Z</span>
                  </div>
                  <span className="text-white font-bold text-xl">ynvo</span>
                </div>
                <button
                  aria-label="Close menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Menu items */}
              <motion.div 
                className="relative px-6 py-6 space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {[
                  { href: '/discover', label: 'Discover', icon: '🔍' },
                  { href: '/events', label: 'Events', icon: '⚡' },
                  { href: '/clubs', label: 'Clubs', icon: '👥' },
                  { href: '/contact', label: 'Contact', icon: '📧' }
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-200 hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="text-lg font-medium">{item.label}</span>
                      <svg
                        className="ml-auto h-5 w-5 text-gray-600 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Actions */}
              {user ? (
                <div className="relative px-6 pb-6 pt-4">
                  <div className="rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                        {user.pfp ? (
                          <img src={user.pfp} alt="" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <span className="text-black font-bold text-lg">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                          Signed in as
                        </span>
                        <span className="font-semibold text-white truncate">
                          {user.name ?? user.email ?? ''}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={hardLogout}
                      className="w-full rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 py-3.5 font-bold transition-all shadow-lg hover:shadow-yellow-500/50 hover:scale-[1.02]"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative px-6 pb-6 pt-4 flex flex-col gap-3">
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-center py-3.5 font-semibold transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 text-center py-3.5 font-bold transition-all shadow-lg hover:shadow-yellow-500/50 hover:scale-[1.02]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingHeader;