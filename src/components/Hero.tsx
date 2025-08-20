import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import WrapButton from './ui/wrap-button';
import Link from 'next/link';
import HeroVideoDialog from './magicui/hero-video-dialog';
import Image from "next/legacy/image";

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
          layout="fill"
          objectFit="cover"
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="w-full max-w-xl px-4 sm:px-6 text-center relative z-10 mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-4xl md:text-6xl font-bold mb-6 text-white"
        >
          Connect With Campus Life
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-md mx-auto text-gray-300"
        >
          Zynvo bridges the gap between college clubs and societies, creating a
          vibrant network for students across institutions.
        </motion.p>

        <Link href="/auth/signup" className="flex justify-center gap-4 mb-8 sm:mb-10">
          <WrapButton className="bg-yellow-500 text-black font-medium transition duration-300 transform hover:-translate-y-1">
             Zync It
          </WrapButton>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 sm:mt-16 relative max-w-2xl mx-auto"
        >
          {/* Decorative Elements - Responsive positions */}
          <div className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-500/40 rounded-full blur-xl"></div>
          <div className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-20 h-20 sm:w-32 sm:h-32 bg-yellow-500/40 rounded-full blur-xl"></div>
          <div className="absolute top-10 left-4 sm:top-20 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 bg-yellow-400/30 rounded-full blur-xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
