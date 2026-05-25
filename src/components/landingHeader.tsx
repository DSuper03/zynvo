'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/authContex';

const LandingHeader = () => {
  const { user, hardLogout, login, isLoggedIn } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto w-full max-w-7xl px-3 pt-3 sm:px-6">
        <motion.div
          initial={false}
          animate={{
            opacity: isScrolled ? 0.98 : 1,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-transparent"
        >
          <div className="flex h-16 items-center justify-between px-1 sm:px-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-yellow-400 text-sm font-extrabold text-black shadow-[0_6px_20px_rgba(250,204,21,0.35)] transition-transform duration-200 group-hover:scale-105">
                Z
              </span>
              <span className="text-sm font-bold tracking-wide text-yellow-300 sm:text-base">Zynvo</span>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={login}
                    className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-yellow-400/40 bg-yellow-500/10 transition-all duration-200 hover:scale-105 hover:border-yellow-300"
                    aria-label="Open profile"
                  >
                    <img
                      src={
                        user?.pfp ||
                        `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(user?.name || 'user')}&size=64`
                      }
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
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
                    className="rounded-xl border border-white/20 bg-black/70 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black/90"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-xl border border-yellow-500/50 bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-yellow-300"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/#open-roles"
                    className="rounded-xl border border-yellow-300/45 bg-black px-4 py-2 text-sm font-semibold text-yellow-300 transition-colors hover:bg-black/80"
                  >
                    Open Roles
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/auth/signup"
                className="rounded-xl border border-yellow-500/50 bg-yellow-400 px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-yellow-300"
              >
                Sign Up
              </Link>
              <Link
                href="/#open-roles"
                className="rounded-xl border border-yellow-300/45 bg-black px-3 py-2 text-xs font-semibold text-yellow-300 transition-colors hover:bg-black/80"
              >
                Open Roles
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default LandingHeader;
