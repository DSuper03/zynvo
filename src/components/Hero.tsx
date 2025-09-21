import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import WrapButton from './ui/wrap-button';
import Link from 'next/link';
import HeroVideoDialog from './magicui/hero-video-dialog';
import Image from 'next/image';

const Hero = () => {
  const heroRef = useRef(null);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center py-10 sm:py-16 md:py-32 overflow-hidden"
    >
      {/* Background Image - Fixed Correctly */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/landing page.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        {/* Enhanced gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl px-4 sm:px-6 md:px-8 lg:px-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 sm:space-y-6 md:space-y-8"
        >
          {/* Enhanced Title with bigger text and better typography */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-white"
          >
            <span className="block">
              Surf, <span className="text-yellow-400">Connect,</span>
            </span>
            <span className="block">Explore</span>
          </motion.h1>

          {/* Subtitle with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-2"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-yellow-400">
              Zynvo for campus connection
            </h2>
          </motion.div>

          {/* Enhanced description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto text-gray-200 leading-relaxed px-2"
          >
            Bridge the gap between college clubs and societies, creating a
            vibrant network for students across institutions.
          </motion.p>

          {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-4 sm:pt-6"
          >
            <Link href="/dashboard" className="inline-block">
              <WrapButton className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 shadow-lg hover:shadow-yellow-500/25">
                Zync It Now
              </WrapButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Enhanced Decorative Elements - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Animated floating elements - Responsive positioning */}
          <div className="absolute top-1/4 right-4 sm:right-10 w-16 h-16 sm:w-32 sm:h-32 bg-yellow-500/20 rounded-full blur-xl sm:blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/3 right-8 sm:right-20 w-12 h-12 sm:w-24 sm:h-24 bg-yellow-400/30 rounded-full blur-lg sm:blur-2xl animate-bounce"
            style={{ animationDuration: '3s' }}
          ></div>
          <div className="absolute top-1/2 left-4 sm:left-10 w-8 h-8 sm:w-16 sm:h-16 bg-white/10 rounded-full blur-md sm:blur-xl"></div>

          {/* Subtle grid pattern overlay - Hidden on very small screens */}
          <div className="absolute inset-0 opacity-5 hidden sm:block">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            ></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
