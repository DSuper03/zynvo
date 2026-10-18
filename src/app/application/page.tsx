'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { PLAY_STORE_URL, PLAY_STORE_PROMO } from '@/lib/playstore';

const DownloadPage = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-yellow-300">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-20">
        <div className="w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex rounded-full bg-black px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300">
              Android Beta
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-5"
          >
            <h1 className="bg-gradient-to-br from-black via-black to-yellow-700 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
              Download
              <br />
              <span className="text-yellow-950">Zynvo Mobile</span>
            </h1>

            <p className="max-w-2xl text-lg font-medium leading-relaxed text-gray-900">
              Welcome to the first public beta of Zynvo. Help us shape the
              future of campus communities by trying the app and sharing your
              feedback.
            </p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get Zynvo on Google Play"
            className="block overflow-hidden rounded-3xl border-2 border-black shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          >
            <Image
              src={PLAY_STORE_PROMO.wide}
              alt="Zynvo is available on Google Play — download the app"
              width={1440}
              height={520}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 960px"
              priority
            />
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border-2 border-black/10 bg-white/40 p-6 backdrop-blur-sm"
          >
            <h2 className="mb-4 text-xl font-bold text-black">
              Before you install
            </h2>

            <ul className="space-y-3 text-sm leading-7 text-gray-900 md:text-base">
              <li>• This is a beta version and is still under active development.</li>
              <li>• You may encounter bugs, crashes, or unfinished features.</li>
              <li>• Some functionality may change or be removed in future updates.</li>
              <li>
                • You can download from the Play Store or install the APK directly.
              </li>
              <li>
                • Please report any bugs or suggestions through our feedback
                form—they directly help improve Zynvo.
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_auto]"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href={PLAY_STORE_URL}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-base font-semibold text-yellow-300 shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-black/90"
              >
                Download on Play Store
                <span className="text-lg">📱</span>
              </Link>

              <Link
                href="/downloads/zynvo-mobile.apk"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-black hover:text-yellow-300"
              >
                Download APK
                <span className="text-lg">↓</span>
              </Link>

              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSd_2lKPn4yBbwPWDahHMwukgX0tSeY-6DlzHWoU960PvoPuaw/viewform?usp=publish-editor"
                target="_blank"
                className="inline-flex items-center justify-center rounded-full border-2 border-black px-8 py-4 text-base font-semibold text-black transition hover:bg-black hover:text-yellow-300"
              >
                Give Feedback
              </Link>
            </div>

            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get Zynvo on Google Play"
              className="mx-auto block w-full max-w-[260px] overflow-hidden rounded-3xl border-2 border-black shadow-[0_16px_40px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:mx-0"
            >
              <Image
                src={PLAY_STORE_PROMO.portrait}
                alt="Zynvo is available on Google Play — download the app"
                width={800}
                height={1000}
                className="h-auto w-full"
                sizes="260px"
              />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-black/10 bg-black/5 p-5"
          >
            <p className="text-sm leading-7 text-gray-900">
              <span className="font-semibold">Current Stage:</span> Public Beta
              v1.0
              <br />
              <span className="font-semibold">Supported Devices:</span> Android
              10+
              <br />
              <span className="font-semibold">Size:</span> ~70 MB
              <br />
              <span className="font-semibold">Cost:</span> Free
            </p>
          </motion.div>

          <p className="text-xs font-medium uppercase tracking-[0.22em] text-black/60">
            Thanks for being one of our early users. 💛
          </p>
        </div>
      </div>
    </section>
  );
};

export default DownloadPage;