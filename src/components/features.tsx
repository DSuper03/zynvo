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
        </div>
      </div>
    </motion.div>
  );
};

const CtaSkeleton = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-yellow-500/20 to-black rounded-lg p-6"
    >
      <h3 className="text-white font-bold text-xl mb-3">Ready to join?</h3>
      <Button className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-md">
        <Link href="/auth/signup">Sign Up Today</Link>
      </Button>
    </motion.div>
  );
};

const Features = () => {
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Define BentoGrid items
  const items = [
    {
      title: 'Welcome to Zynvo',
      description: (
        <span className="text-sm text-neutral-50">
          Your ultimate campus connection platform
        </span>
      ),
      header: <HeroSkeleton />,
      className: 'md:col-span-2',
      icon: <Sparkles className="h-5 w-5 text-neutral-50" />,
    },
    {
      title: 'Platform Stats',
      description: (
        <span className="text-sm text-neutral-50">
          Growing network of students and colleges
        </span>
      ),
      header: <StatsSkeleton />,
      className: 'md:col-span-1',
      icon: <Activity className="h-5 w-5 text-neutral-50" />,
    },
    {
      title: 'Tech Fest 2025',
      description: (
        <span className="text-sm">
          Join the upcoming campus-wide tech festival
        </span>
      ),
      header: <EventSkeleton />,
      className: 'md:col-span-1',
      icon: <Calendar className="h-5 w-5 text-neutral-50" />,
    },
    {
      title: 'Create Club Rooms',
      description: (
        <span className="text-sm">
          Host virtual meetings and discussions instantly
        </span>
      ),
      header: <ClubRoomSkeleton />,
      className: 'md:col-span-1',
      icon: <MessageCircle className="h-5 w-5 text-neutral-50" />,
    },
    {
      title: 'Key Features',
      description: (
        <span className="text-sm text-neutral-50 ">
          Tools designed for campus networking
        </span>
      ),
      header: <FeaturesSkeleton />,
      className: 'md:col-span-1',
      icon: <BookOpen className="h-5 w-5 text-neutral-50" />,
    },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen py-10 sm:py-16 md:py-24 overflow-hidden bg-black"
      style={{
        backgroundImage: 'url(/featureLanding.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-yellow-500 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="text-xl font-semibold text-yellow-500">Zynvo</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white"
          >
            Your Campus{' '}
            <span className=" text-yellow-500  to-yellow-900">
              Connection Hub
            </span>
          </motion.h1>
        </div>

        {/* Responsive BentoGrid */}
        <BentoGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto md:auto-rows-[20rem] text-neutral-100">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn(
                '[&>p:text-base] sm:[&>p:text-lg] rounded-lg text-neutral-100',
                item.className
              )}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default Features;
