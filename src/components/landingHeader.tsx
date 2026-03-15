'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/authContex';
import { Button } from './ui/button';

const navItems = [
  { href: '/discover', label: 'Discover' },
  { href: '/events', label: 'Events' },
  { href: '/clubs', label: 'Clubs' },
  { href: '/contact', label: 'Contact' },
];

const LandingHeader = () => {
  const pathname = usePathname();
  const { user, hardLogout, login } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto w-full max-w-7xl px-3 pt-3 sm:px-6">
        <motion.div
          initial={false}
          animate={{
            borderColor: isScrolled ? 'rgba(234, 179, 8, 0.25)' : 'rgba(255, 255, 255, 0.08)'
           
        ,
          }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="rounded-2xl border bg-transparent "
        >
          <div className="flex h-16 items-center justify-between px-3 sm:px-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-yellow-400 text-sm font-extrabold text-black shadow-[0_6px_20px_rgba(250,204,21,0.35)] transition-transform duration-200 group-hover:scale-105">
                Z
              </span>
              <span className="text-sm font-bold tracking-wide text-black sm:text-base">Zynvo</span>
            </Link>

            <nav className="hidden">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative text-sm font-medium text-gray-200 transition-colors hover:text-white"
                  >
                    {item.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-yellow-400 transition-all duration-200 ${
                        isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <>
                  <button
                    onClick={login}
                    className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-yellow-400/40 bg-yellow-500/10 transition-all duration-200 hover:scale-105 hover:border-yellow-300"
                    aria-label="Open profile"
                  >
                    {user.pfp ? (
                      <img src={user.pfp} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold uppercase text-yellow-300">
                        {user.name?.charAt(0) ?? 'U'}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={hardLogout}
                    className="rounded-xl border border-yellow-500/50 bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-yellow-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-xl border border-yellow-500/50 bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-yellow-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <Button
              className={`md:hidden h-11 w-11 rounded-2xl border transition-all duration-200 active:scale-95 ${
                isMobileMenuOpen
                  ? 'border-yellow-300/70 bg-yellow-300 text-black shadow-[0_10px_30px_rgba(250,204,21,0.35)]'
                  : 'border-yellow-400/60 bg-yellow-400 text-black shadow-[0_8px_24px_rgba(250,204,21,0.25)] hover:bg-yellow-300'
              }`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-black" /> : <Menu className="h-5 w-5 text-black" />}
            </Button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <motion.div
              className="absolute inset-0 bg-black/78"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative mx-3 mt-20 rounded-2xl border border-black bg-black p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
              role="dialog"
              aria-modal="true"
            >
              <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-sm font-semibold text-gray-300">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl border border-yellow-400/50 bg-yellow-400 p-2 text-black transition-colors hover:bg-yellow-300"
                >
                  <X className="h-4 w-4 text-black" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-yellow-400 text-black'
                            : 'bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        login();
                        setIsMobileMenuOpen(false);
                      }}
                      className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        hardLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="rounded-xl border border-yellow-500/50 bg-yellow-400 px-3 py-2.5 text-sm font-semibold text-black"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-center text-sm font-semibold text-white"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-xl border border-yellow-500/50 bg-yellow-400 px-3 py-2.5 text-center text-sm font-semibold text-black"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingHeader;
