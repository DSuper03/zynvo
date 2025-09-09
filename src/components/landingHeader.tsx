'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
          className="cursor-pointer text-gray-300 hover:text-white transition-colors"
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
              {/* Invisible gap-filling element */}
              <div className="absolute top-full left-0 h-5 w-full" />

              <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 z-50">
                <motion.div
                  layoutId="active"
                  className="bg-black/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-yellow-500/20 shadow-xl"
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
      className="text-gray-400 hover:text-white transition-colors py-2 block"
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

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed w-full space-x-10 px-10 top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md py-2 shadow-lg'
          : 'bg-black/50 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Lens
                zoomFactor={2}
                lensSize={150}
                isStatic={false}
                ariaLabel="Zoom Area"
              >
                <Image
                  src="https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/logozynvo.jpg?updatedAt=1747920152959"
                  alt="image placeholder"
                  width={50}
                  height={50}
                  className="transition-transform duration-300 group-hover:scale-125"
                />
              </Lens>
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
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 text-lg">⚡</span>
                    <div>
                      <p className="font-medium text-white">Campus Events</p>
                      <p className="text-xs text-gray-400">
                        Find exciting events near you
                      </p>
                    </div>
                  </div>
                </HoveredLink>
                <HoveredLink href="/clubs">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 text-lg">👥</span>
                    <div>
                      <p className="font-medium text-white">College Clubs</p>
                      <p className="text-xs text-gray-400">
                        Join groups that match your interests
                      </p>
                    </div>
                  </div>
                </HoveredLink>

                <HoveredLink href="/leaderboard">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 text-lg">💡</span>
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
              (console.log(user)),
              <div className="flex items-center gap-4">
                <button
                  onClick={login}
                  className="bg-yellow-500 text-black hover:bg-yellow-400 px-4 py-1 rounded-full font-medium transition-colors"
                >
                  <span className='flex gap-1 justify-center items-center'>
                   <span>
                    <img src={user.pfp} alt="pfp" className="flex-shrink-0 bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg"/>
                    </span> 
                    <strong>{user.name}</strong>
                  </span>
                </button>
                <button
                  onClick={hardLogout}
                  className="bg-yellow-500 text-black hover:bg-yellow-400 px-5 py-2 rounded-md font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  href="/auth/signup"
                  className="bg-yellow-500 text-black hover:bg-yellow-400 px-5 py-2 rounded-md font-medium transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/signin"
                  className="bg-yellow-500 text-black hover:bg-yellow-400 px-5 py-2 rounded-md font-medium transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}

       
          <Button
            className="md:hidden text-white"
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
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative mx-6 mt-24 rounded-[28px] bg-[#0b0b0b] border border-yellow-500/20 shadow-[0_0_60px_0_rgba(234,179,8,0.35)]"
            role="dialog"
            aria-modal="true"
          >
            {/* Header row inside panel */}
            <div className="flex items-center justify-between px-6 pt-6">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 font-extrabold text-3xl">
                  Z
                </span>
                <span className="text-white font-semibold text-2xl">ynvo</span>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
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
            <div className="px-6 py-6 space-y-6">
              <Link
                href="/discover"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-2xl text-gray-200 hover:text-white"
              >
                Discover
              </Link>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-2xl text-gray-200 hover:text-white"
              >
                Testimonials
              </Link>
              {/* <Link href="/founders" onClick={() => setIsMobileMenuOpen(false)} className="block text-2xl text-gray-200 hover:text-white">
                Devs
              </Link> */}
              <Link
                href="/clubs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-2xl text-gray-200 hover:text-white"
              >
                Clubs
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-2xl text-gray-200 hover:text-white"
              >
                Contact
              </Link>
            </div>

            {/* Actions */}

            {user ? (
              <div className="px-6 pb-6 pt-2 flex flex-col items-center gap-4 bg-black/60 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 w-full justify-center">
                  <div className="flex-shrink-0 bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                    {/* {user.email ? user.email.charAt(0).toUpperCase() : (user.id ? user.id.charAt(0).toUpperCase() : '?')} */}
                    {user.pfp && 
                    <img src={user.pfp} alt="" />
                  }
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Signed in as</span>
                    <span className="font-semibold text-white truncate max-w-[120px]">{user.name ?? (user.email ?? '')}</span>
                  </div>
                </div>
                <Button
                  onClick={hardLogout}
                  className="w-full rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 py-3 font-semibold transition-colors"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full rounded-xl bg-white/10 text-yellow-300 hover:bg-white/20 text-center py-3 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 text-center py-3 font-semibold transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
