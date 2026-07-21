'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import LandingHeader from './landingHeader';
import { BackgroundElements } from './TeamSection';

const TestimonialsSection = () => {
  const audiences = [
    {
      title: 'Students',
      body: 'One feed to discover clubs, fests, and campus events—without relying on scattered WhatsApp forwards.',
      href: '/for-students',
      cta: 'Explore for students',
    },
    {
      title: 'Clubs',
      body: 'An operating system to manage members, promote events, and stay discoverable on campus.',
      href: '/for-clubs',
      cta: 'Explore for clubs',
    },
    {
      title: 'Colleges',
      body: 'Structured visibility into campus activity—clubs, events, and involvement beyond the LMS.',
      href: '/for-colleges',
      cta: 'Explore for colleges',
    },
  ];

  return (
    <div className="relative min-h-screen bg-black pt-24">
      <LandingHeader />
      <BackgroundElements />
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Built with campus communities
          </h1>
          <p className="text-lg text-gray-300">
            We are collecting verified stories from students and club organisers.
            Until then, here is what Zynvo is built to deliver—without invented
            ratings or placeholder quotes.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {audiences.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-yellow-500/20 bg-black/50 p-8 backdrop-blur-sm"
            >
              <h2 className="mb-3 text-xl font-bold text-yellow-400">
                {item.title}
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-gray-300">
                {item.body}
              </p>
              <Link
                href={item.href}
                className="text-sm font-semibold text-yellow-400 hover:text-yellow-300"
              >
                {item.cta} →
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-8 text-center">
          <h2 className="mb-3 text-xl font-bold text-white">
            Share your campus story
          </h2>
          <p className="mb-6 text-sm text-gray-300">
            Club head or student with a real outcome on Zynvo? We want named,
            verifiable testimonials—college, role, and what changed.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-black hover:bg-yellow-300"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
