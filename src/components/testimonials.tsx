'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/legacy/image';

const Testimonials = () => {
  const heroRef = React.useRef(null);

  const stories = [
    {
      title: 'For students',
      quote:
        'Campus updates should not live only in closed chats. Zynvo puts clubs and events in one discovery feed.',
      href: '/for-students',
      image: '/student1.png',
    },
    {
      title: 'For clubs',
      quote:
        'Club ops need more than WhatsApp and spreadsheets—profiles, announcements, and event promotion in one place.',
      href: '/for-clubs',
      image: '/student2.png',
    },
    {
      title: 'For colleges',
      quote:
        'Student affairs deserve structured visibility into co-curricular life—not another LMS plugin.',
      href: '/for-colleges',
      image: '/student3.png',
    },
  ];

  return (
    <div>
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden py-20 md:py-32"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/photo_2025-05-23_20-16-08.jpg?updatedAt=1748011607137"
            alt="Campus community"
            width={1920}
            height={1080}
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="gradient-text">Built for the campus loop</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Students discover. Clubs operate. Colleges see activity. Verified
              testimonials coming as we collect them.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative rounded-xl bg-gray-800 p-8"
              >
                <p className="mb-6 text-gray-300">&ldquo;{story.quote}&rdquo;</p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-white">{story.title}</h4>
                    <Link
                      href={story.href}
                      className="text-xs text-yellow-500 hover:text-yellow-400"
                    >
                      Learn more →
                    </Link>
                  </div>
                  <Image
                    src={story.image}
                    alt=""
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-yellow-500/20"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
