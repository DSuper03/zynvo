'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';


// Animation transition settings
const transition = {
  type: "spring",
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
  setActive: (item: string) => void;
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
          transition={transition}
        >
          {active === item && children && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4 z-50">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-black/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-yellow-500/20 shadow-xl"
              >
                <motion.div
                  layout
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// HoveredLink component
const HoveredLink = ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => {
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

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <div className="text-yellow-500 mr-2">
                <svg 
                  viewBox="0 0 24 24" 
                  width="36" 
                  height="36" 
                  className="fill-current"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
            
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
                <HoveredLink href="/discover/events">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 text-lg">⚡</span>
                    <div>
                      <p className="font-medium text-white">Campus Events</p>
                      <p className="text-xs text-gray-400">Find exciting events near you</p>
                    </div>
                  </div>
                </HoveredLink>
                <HoveredLink href="/discover/clubs">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 text-lg">👥</span>
                    <div>
                      <p className="font-medium text-white">College Clubs</p>
                      <p className="text-xs text-gray-400">Join groups that match your interests</p>
                    </div>
                  </div>
                </HoveredLink>
                <HoveredLink href="/discover/contests">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 text-lg">🏆</span>
                    <div>
                      <p className="font-medium text-white">Competitions</p>
                      <p className="text-xs text-gray-400">Showcase your skills and win prizes</p>
                    </div>
                  </div>
                </HoveredLink>
                <HoveredLink href="/discover/workshops">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 text-lg">💡</span>
                    <div>
                      <p className="font-medium text-white">Workshops</p>
                      <p className="text-xs text-gray-400">Learn new skills and technologies</p>
                    </div>
                  </div>
                </HoveredLink>
              </div>
            </MenuItem>
            
            <MenuItem
              setActive={setActiveItem}
              active={activeItem}
              item="Testimonials"
              href="#testimonials"
            />
            
            <MenuItem
              setActive={setActiveItem}
              active={activeItem}
              item="Devs"
              href="/founders"
            >
              <div className="p-2 w-[300px]">
                <HoveredLink href="/founders">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-yellow-400 text-lg">👨‍💻</span>
                    <div>
                      <p className="font-medium text-white">Our Team</p>
                      <p className="text-xs text-gray-400">Meet the developers behind Zynvo</p>
                    </div>
                  </div>
                </HoveredLink>
                <HoveredLink href="/founders/story">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 text-lg">📖</span>
                    <div>
                      <p className="font-medium text-white">Our Story</p>
                      <p className="text-xs text-gray-400">The journey of building Zynvo</p>
                    </div>
                  </div>
                </HoveredLink>
              </div>
            </MenuItem>
            
            <MenuItem
              setActive={setActiveItem}
              active={activeItem}
              item="FAQ"
              href="#faq"
            />
            
            <MenuItem
              setActive={setActiveItem}
              active={activeItem}
              item="Contact"
              href="#contact"
            />
            
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
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
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
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-black/90 backdrop-blur-md"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/discover"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Discover
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/founders"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Devs
            </Link>
            <Link
              href="#faq"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="#contact"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/register"
              className="bg-yellow-500 text-black hover:bg-yellow-400 transition-colors px-5 py-2 rounded-md font-medium text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default LandingHeader;