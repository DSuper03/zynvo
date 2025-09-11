import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/legacy/image';

const Hero = () => {
  const heroRef = useRef(null);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full bg-yellow-400/90 flex items-center justify-center py-18 sm:py-16 md:py-24 overflow-hidden"
    >
      {/* Lego-like dotted pattern background */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,0,0,0.25) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="rounded-3xl bg-yellow-200 shadow-xl border border-amber-500/60 p-6 sm:p-8 lg:p-12 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text and CTAs */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"
              >
                Build, Bond, Belong – Zynvo for Campus Connections
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-5 text-lg sm:text-xl text-gray-700 max-w-xl"
              >
                Connecting students through activities that spark creativity, collaboration, and fun
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <Link href="/auth/signup" className="inline-flex">
                  <span className="inline-flex items-center justify-center rounded-xl bg-black text-white px-6 py-3 text-base font-semibold shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    Get Started
                  </span>
                </Link>

                <Link href="/stories" className="inline-flex">
                  <span className="inline-flex items-center gap-3 rounded-xl bg-gray-900 text-white px-5 py-3 text-base font-semibold shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    <span className="relative inline-flex h-7 w-7 overflow-hidden rounded-full bg-yellow-200">
                      <Image src="/student1.png" alt="avatar" layout="fill" objectFit="cover" />
                    </span>
                    Check student stories
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Right: Illustration, floating blocks, stats card */}
            <div className="relative h-[420px] sm:h-[480px] lg:h-[560px] overflow-visible">
  {/* Character illustration placeholder */}
  <div className="absolute bottom-0 right-0 left-0 mx-auto w-[100%] sm:w-[95%] lg:w-[90%] z-0 pb-16 scale-125">

    <Image
      src="/cutouts/landingPagecutout.png"
      alt="Lego style character"
      layout="responsive"
      width={1400}
      height={1400}
      priority
    />
  </div>

  {/* Floating colorful blocks */}
  <div className="absolute -top-2 right-6 sm:right-12 w-12 h-12 sm:w-16 sm:h-16 bg-yellow-600 rounded-lg shadow-md grid place-items-center rotate-6">
    <span className="text-white text-xl">💡</span>
  </div>
  <div className="absolute top-16 left-2 sm:left-6 w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-lg shadow-md grid place-items-center -rotate-6">
    <span className="text-white text-xl">💬</span>
  </div>
  <div className="absolute top-36 right-24 w-10 h-10 sm:w-14 sm:h-14 bg-red-500 rounded-lg shadow-md grid place-items-center rotate-3">
    <span className="text-white text-lg">👥</span>
  </div>
  <div className="absolute top-48 left-12 w-10 h-10 sm:w-14 sm:h-14 bg-green-500 rounded-lg shadow-md grid place-items-center -rotate-3">
    <span className="text-white text-lg">🎯</span>
  </div>

  {/* Stats Card */}
  <div className="absolute right-0 sm:right-2 lg:right-4 bottom-4 sm:bottom-6 w-[64%] sm:w-[52%] lg:w-[46%] bg-gray-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl z-20">
    <p className="text-sm sm:text-base text-gray-200">Campus Clubs Thriving – Zynvo in Action</p>
    <div className="mt-3">
      <p className="text-2xl sm:text-3xl font-extrabold">500+ <span className="font-semibold text-gray-200">Clubs Connected</span></p>
      <p className="mt-2 text-2xl sm:text-3xl font-extrabold">800+ <span className="font-semibold text-gray-200">Successful Collaborations</span></p>
    </div>
  </div>
</div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
