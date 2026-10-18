import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { PLAY_STORE_URL, PLAY_STORE_PROMO } from '@/lib/playstore';

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden border-0 bg-yellow-300">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-0 py-0 md:grid-cols-2 md:gap-12">
        <div className="space-y-6 text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center rounded-full bg-black/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300 sm:text-[0.7rem]"
          >
            Built for real campus life
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-balance bg-gradient-to-br from-black via-black to-yellow-700 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl"
          >
            Your Campus.
            <br className="hidden sm:block" />
            <span className="text-yellow-950"> Your People.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
            className="max-w-xl text-pretty text-sm font-medium leading-relaxed text-gray-900 sm:text-base md:text-lg"
          >
            Thousands of students, clubs, and communities all in one place.
            Find your people, join the movement, and make college actually worth
            it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            className="pt-1"
          >
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-yellow-300 shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-black/90 hover:shadow-[0_14px_30px_rgba(0,0,0,0.35)] sm:px-7 sm:py-3 sm:text-base"
            >
              <span>Find Your Tribe</span>
              <span className="text-lg">→</span>
            </Link>

            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow-100 px-6 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-black hover:text-yellow-300 sm:px-7 sm:py-3 sm:text-base"
            >
              <span>Get it on Play Store</span>
              <span className="text-lg">📱</span>
            </a>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/60 sm:text-[0.7rem]">
                No noise. Just your people.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="relative h-[340px] w-full md:h-[520px]">
          <div className="absolute inset-0">
            <Image
              src="/posters/openpeeps.png"
              alt="Illustrated crowd of students"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <motion.a
            initial={{ opacity: 0, y: 18, rotate: -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: -4 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get Zynvo on Google Play"
            className="absolute bottom-3 left-3 z-10 block w-32 overflow-hidden rounded-2xl border-2 border-black shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:w-40 md:bottom-6 md:left-6 md:w-48"
          >
            <Image
              src={PLAY_STORE_PROMO.portrait}
              alt="Zynvo is available on Google Play — download the app"
              width={800}
              height={1000}
              className="h-auto w-full"
              sizes="(max-width: 768px) 128px, 192px"
            />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
