'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import {
  Users,
  Calendar,
  BookOpen,
  Sparkles,
  ArrowRight,
  Star,
  TrendingUp,
  Globe,
  BadgeCheck,
  MessageCircle,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/legacy/image';
import { AuroraText } from './magicui/aurora-text';

// Custom Skeletons for Bento Grid Items
const HeroSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full rounded-lg overflow-hidden bg-yellow-200"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 to-yellow-500" />
      <Image
        src="/banners/featurebanner1.jpg"
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center"></div>
    </motion.div>
  );
};

const StatsSkeleton = () => {
  const stats = [
    { value: '8.5K', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { value: '142', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { value: '95%', label: 'Satisfaction', icon: <Star className="w-4 h-4" /> },
    { value: '36', label: 'Colleges', icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full h-full">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-black/30 rounded-lg p-3 border border-gray-800"
        >
          <div className="text-xl font-bold text-white">{stat.value}</div>
          <div className="flex items-center text-xs text-gray-400">
            <span className="mr-1 text-yellow-500">{stat.icon}</span>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const EventSkeleton = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileHover={{ y: -5 }}
      className="relative w-full h-full rounded-lg overflow-hidden"
    >
      <Image
        src="https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/photo_2025-05-23_20-16-14.jpg?updatedAt=1748011606544"
        alt="Tech Fest"
        className="object-cover"
        width={400}
        height={300}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="inline-block bg-yellow-500 text-black text-xs font-medium px-2 py-1 rounded-full mb-2">
          MAY 25
        </div>
        <h3 className="text-white font-bold">Tech Fest 2025</h3>
        <p className="text-gray-300 text-xs">
          Connect with innovative tech clubs
        </p>
      </div>
    </motion.div>
  );
};

const FeaturesSkeleton = () => {
  const features = [
    { title: 'Club Discovery', icon: <BookOpen className="w-5 h-5" /> },
    { title: 'Event Management', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Network Builder', icon: <Users className="w-5 h-5" /> },
    { title: 'Growth Analytics', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full h-full">
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-black/30 border border-gray-800 rounded-lg p-3 flex flex-col items-center justify-center"
        >
          <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2">
            <div className="text-yellow-500">{feature.icon}</div>
          </div>
          <span className="text-white text-sm font-medium">
            {feature.title}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

const CollegesSkeleton = () => {
  const colleges = [
    'Tyler School of Martial Arts',
    'Nikumb College of Design',
    'Ved School of Drama',
    'Barney Stinson College',
    'B99 Army College',
  ];

  return (
    <div className="w-full h-full flex flex-col space-y-2">
      {colleges.map((college, idx) => (
        <motion.div
          key={idx}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ x: 5 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-black/20 rounded-lg p-2 flex items-center"
        >
          <BadgeCheck className="w-4 h-4 text-yellow-500 mr-2" />
          <span className="text-white text-sm truncate">{college}</span>
        </motion.div>
      ))}
    </div>
  );
};

const ClubRoomSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      whileHover={{ opacity: 1 }}
      className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-yellow-500/20 to-black/80 flex items-center justify-center"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-black" />
          </div>
          <div className="w-32 h-20 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
            <span className="text-yellow-500 text-sm font-medium">
              Club Rooms
            </span>
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
    >
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
