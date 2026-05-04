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
  Star,
  TrendingUp,
  Globe,
  BadgeCheck,
  MessageCircle,
  Activity,
  Search,
  Zap,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

// Custom Skeletons for Bento Grid Items

const HeroSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex h-full min-h-[380px] w-full flex-col justify-between overflow-hidden rounded-3xl bg-[#FEF6D6] p-5 text-left shadow-lg transition-shadow hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div className="">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-600">
            Discover
          </p>
          <h3 className="text-lg font-bold text-slate-900">Campus Clubs</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Explore tech, dance, gaming, and more.
          </p>
        </div>
        <div className="flex items-center  rounded-full bg-yellow-400/20 px-2  text-[10px] font-bold text-yellow-700 shrink-0">
          <Zap className="h-3 w-3" />
          <span>142 Active</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className=" flex items-center  rounded-xl bg-white/60 p-2 shadow-sm backdrop-blur-sm shrink-0">
        <Search className="  text-slate-400" />
        <span className="text-xs text-slate-500">Search clubs…</span>
      </div>

      {/* Club List - always visible */}
      <div className=" min-h-[140px] space-y-2 overflow-y-auto pr-1">
        {[
          { name: 'Tech Society', members: '8.2K', accent: 'bg-blue-500', icon: '💻' },
          { name: 'Dance Club', members: '4.1K', accent: 'bg-pink-500', icon: '💃' },
          { name: 'Entrepreneurs', members: '2.7K', accent: 'bg-amber-500', icon: '🚀' },
          { name: 'Gaming Squad', members: '3.8K', accent: 'bg-emerald-500', icon: '🎮' },
          { name: 'Debate Team', members: '1.2K', accent: 'bg-purple-500', icon: '🎙️' },
        ].map((club) => (
          <motion.div
            key={club.name}
            whileHover={{ scale: 0.95 }}
            className="flex items-center justify-between rounded-xl bg-white p-2 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${club.accent} text-xs text-white shadow-sm`}>
                {club.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{club.name}</p>
                <p className="text-[10px] text-slate-500">{club.members} members</p>
              </div>
            </div>
            <button className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-yellow-400 hover:text-black transition-colors shrink-0">
              Join
            </button>
          </motion.div>
        ))}
      </div>
      
      {/* Avatars - 4 only, bigger size */}
      <div className="mt-3 flex items-center justify-between border-t border-yellow-500/10 pt-3 shrink-0">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-16 overflow-hidden rounded-full border-2 border-[#FEF6D6] bg-white shadow-md">
              <Image
                src={`/avatars/avatar${i}.png`}
                alt="Avatar"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] font-medium text-slate-500">+2.4k joined</p>
      </div>
    </motion.div>
  );
};

const StatsSkeleton = () => {
  const stats = [
    { value: '8.5K+', label: 'Students', icon: <Users className="h-4 w-4" />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: '142', label: 'Events', icon: <Calendar className="h-4 w-4" />, color: 'text-pink-500', bg: 'bg-pink-50' },
    { value: '98%', label: 'Happy', icon: <Heart className="h-4 w-4" />, color: 'text-red-500', bg: 'bg-red-50' },
    { value: '36', label: 'Campus', icon: <Globe className="h-4 w-4" />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="grid h-full w-full grid-cols-2 gap-3">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.05 }}
          className="flex flex-col justify-center rounded-2xl bg-white p-3 shadow-sm border border-slate-100"
        >
          <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
            {stat.icon}
          </div>
          <div className="text-lg font-bold text-slate-900">{stat.value}</div>
          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
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
      className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-900 shadow-lg group"
    >
      <Image
        src="https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/photo_2025-05-23_20-16-14.jpg?updatedAt=1748011606544"
        alt="Tech Fest"
        layout="fill"
        objectFit="cover"
        className="opacity-80 transition-opacity group-hover:opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      
      <div className="absolute top-4 right-4 rounded-xl bg-white/10 px-3 py-1 text-center backdrop-blur-md border border-white/20">
        <p className="text-[10px] font-bold uppercase text-white/80">May</p>
        <p className="text-lg font-bold text-white">25</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-md bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-black">
            FEATURED
          </span>
          <span className="text-[10px] font-medium text-white/80 flex items-center gap-1">
            <Globe className="h-3 w-3" /> Online
          </span>
        </div>
        <h3 className="text-lg font-bold text-white leading-tight">
          Tech Fest 2025
        </h3>
        <p className="mt-1 text-xs text-slate-300 line-clamp-2">
          Join the biggest campus tech festival. Hackathons, workshops, and networking.
        </p>
        <button className="mt-3 w-full rounded-lg bg-white/10 py-2 text-xs font-bold text-white backdrop-blur-sm hover:bg-white hover:text-black transition-colors">
          Register Now
        </button>
      </div>
    </motion.div>
  );
};

const FeaturesSkeleton = () => {
  const features = [
    { title: 'Club Discovery', icon: <BookOpen className="h-4 w-4" />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Event Manager', icon: <Calendar className="h-4 w-4" />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Networking', icon: <Users className="h-4 w-4" />, color: 'bg-green-100 text-green-600' },
    { title: 'Analytics', icon: <TrendingUp className="h-4 w-4" />, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl bg-[#F4ECFF] p-5 shadow-md">
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center rounded-2xl bg-white p-3 text-center shadow-sm"
          >
            <div className={`mb-2 rounded-full p-2 ${feature.color}`}>
              {feature.icon}
            </div>
            <span className="text-[10px] font-bold text-black leading-tight">
              {feature.title}
            </span>
          </motion.div>
        ))}
      </div>
      
      {/* Chat Bubble UI */}
      <div className="mt-4 rounded-2xl bg-white p-3 shadow-sm border border-purple-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-purple-100">
               <Image
                  src={`/avatars/avatar1.png`}
                  alt="Avatar"
                  width={56}
                  height={56}
                />
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          <div className="flex-1">
             <div className="flex items-center justify-between">
               <p className="text-xs font-bold text-slate-800">Sarah from Design</p>
               <span className="text-[10px] text-slate-400">2m</span>
             </div>
             <p className="text-[10px] text-slate-500 mt-0.5">Anyone up for a collab?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClubRoomSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      whileHover={{ opacity: 1 }}
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl bg-[#FFECEF] p-6 shadow-md"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500 shadow-inner">
          <MessageCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Club Rooms</h3>
        <p className="mt-1 text-xs text-slate-600">
          Private spaces for your community discussions.
        </p>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-center -space-x-4">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5, zIndex: 10 }}
              className="h-16 w-16 overflow-hidden rounded-full border-4 border-white shadow-md"
            >
              <Image
                src={`/avatars/avatar${i}.png`}
                alt="Avatar"
                width={64}
                height={64}
                className="object-cover"
              />
            </motion.div>
          ))}
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-rose-100 text-xs font-bold text-rose-600 shadow-md">
            +42
          </div>
        </div>
        <button className="mt-4 w-full rounded-xl bg-rose-500 py-2 text-xs font-bold text-white shadow-md shadow-rose-200 hover:bg-rose-600 transition-colors">
          Start a Room
        </button>
      </div>
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
      title: 'Discover Clubs',
      description: (
        <span className="text-sm text-white">
          Find and join communities that match your vibe.
        </span>
      ),
      header: <HeroSkeleton />,
      className: 'md:col-span-2 md:row-span-2',
      icon: <Sparkles className="h-4 w-4 text-yellow-600" />,
    },
    {
      title: 'Campus Pulse',
      description: (
        <span className="text-sm text-slate-600">
          Live stats from your campus.
        </span>
      ),
      header: <StatsSkeleton />,
      className: 'md:col-span-1',
      icon: <Activity className="h-4 w-4 text-sky-500" />,
    },
    {
      title: 'Never Miss Events',
      description: (
        <span className="text-sm text-slate-600">
          All your campus events in one place.
        </span>
      ),
      header: <EventSkeleton />,
      className: 'md:col-span-1',
      icon: <Calendar className="h-4 w-4 text-pink-500" />,
    },
    {
      title: 'Find Your Tribe',
      description: (
        <span className="text-sm text-slate-600">
          Connect with like-minded peers.
        </span>
      ),
      header: <ClubRoomSkeleton />,
      className: 'md:col-span-1',
      icon: <Users className="h-4 w-4 text-rose-500" />,
    },
    {
      title: 'Club Chat & Tools',
      description: (
        <span className="text-sm text-slate-600 ">
          Powerful tools to manage your community.
        </span>
      ),
      header: <FeaturesSkeleton />,
      className: 'md:col-span-1',
      icon: <Zap className="h-4 w-4 text-purple-500" />,
    },
    {
      title: 'Your Campus Community',
      description: (
        <span className="text-sm text-slate-600">
          Thousands of students connecting every day.
        </span>
      ),
      header: (
        <div className="relative h-full w-full overflow-hidden rounded-3xl">
          <Image
            src="/avatars/crowd1.png"
            alt="Campus community"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ),
      className: 'md:col-span-1',
      icon: <Users className="h-4 w-4 text-yellow-600" />,
    },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-yellow-300 py-10 sm:py-16 md:py-24"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 space-y-4 text-center sm:mb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="rounded-full bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-yellow-300 shadow-lg">
              The Campus Super App
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-balance text-3xl font-black text-slate-900 sm:text-5xl md:text-6xl"
          >
            Everything happening on campus.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
              Finally in one place.
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-800 sm:text-lg"
          >
            Discover clubs, register for events, find your community, and make college
            more than just classes.
          </motion.p>
        </div>

        {/* Responsive BentoGrid */}
        <BentoGrid className="mx-auto grid max-w-6xl grid-cols-1 gap-6 text-black sm:grid-cols-2 md:auto-rows-[24rem] md:grid-cols-3">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn(
                '[&>p:text-sm] sm:[&>p:text-base] rounded-3xl bg-black border-none shadow-none hover:bg-white/60 transition-colors duration-300',
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
