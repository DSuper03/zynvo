'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  Megaphone,
  MessageCircle,
  Users,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/legacy/image';

// Feature data
const features = [
  {
    title: 'Club Discovery',
    description: 'Find and join student communities',
    icon: <Search className="w-6 h-6" />,
    color: 'bg-red-500',
  },
  {
    title: 'Event Management',
    description: 'Create, manage, and attend college events',
    icon: <Calendar className="w-6 h-6" />,
    color: 'bg-yellow-500',
  },
  {
    title: 'Campus Buzz',
    description: 'Stay updated with trending news, protests, and happenings',
    icon: <Megaphone className="w-6 h-6" />,
    color: 'bg-red-500',
  },
  {
    title: 'Club Rooms',
    description: 'Host discussions and brainstorming sessions',
    icon: <MessageCircle className="w-6 h-6" />,
    color: 'bg-blue-500',
  },
  {
    title: 'Network Builder',
    description: 'Connect with peers across departments and colleges',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-yellow-500',
  },
  {
    title: 'Growth Analytics',
    description: 'Insights for clubs and event organizers',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'bg-yellow-500',
  },
];

const Features = () => {
  const heroRef = useRef(null);

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-yellow-400 py-16 sm:py-20 md:py-24"
    >
      {/* Lego-like dotted pattern background */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center  sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 ">
            Explore What Zynvo Offers
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            Tools that empower students, clubs, and colleges to connect, collaborate, and grow
          </p>
        </motion.div>

        {/* Features Cutout Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center  sm:mb-2"
        >
          <div className="relative w-full max-w-2xl">
            <Image
              src="/cutouts/featurescutout.png"
              alt="Features illustration"
              width={1800}
              height={800}
              className="w-full h-auto"
              priority
            />
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Build Your Campus Connections with Zynvo
            </h2>
            <div className="w-8 h-10 sm:w-10 sm:h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg sm:text-xl">👋</span>
            </div>
          </div>
          <Link href="/auth/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-900 transition-colors duration-300 shadow-lg"
            >
              Get Started Today
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
