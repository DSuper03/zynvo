import React, { useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ZynvoDashboard = () => {
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
  
  const stats = [
    { value: '8.5K', label: 'Active Students', icon: <Users className="w-5 h-5" /> },
    { value: '142', label: 'Events Created', icon: <Calendar className="w-5 h-5" /> },
    { value: '95%', label: 'Student Satisfaction', icon: <Star className="w-5 h-5" /> },
    { value: '36', label: 'Colleges', icon: <Globe className="w-5 h-5" /> },
  ];
  
  // Featured colleges
  const colleges = [
    "Tyler School of Martial Arts",
    "Nikumb College of Design and Fashion",
    "Ved School of Drama and Philosophy",
    "Barney Stinson College of Simping",
    "B99 Army College of Engineering"
  ];
  
  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center py-20 md:py-32 overflow-hidden"
    >
      {/* Minimalist background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://ik.imagekit.io/lljhk5qgc/zynvo-Admin/photo_2025-05-23_20-16-14.jpg?updatedAt=1748011606544"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Simple dark overlay */}
        <div className="absolute inset-0 bg-black/80"></div>
        
        {/* Minimal accent lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-yellow-500 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <span className="text-lg font-semibold text-yellow-500">Zynvo</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
          >
            Your Campus <br className="md:hidden" />
            <span className="text-yellow-500">
              Connection Hub
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg"
          >
            Connect with clubs, discover events, and build your campus network all in one place.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-2 rounded-md text-lg font-medium">
              Zync it
            </Button>
            <Button variant="outline" className="border-yellow-500/50 text-yellow-500  px-8 py-2 rounded-md text-lg font-medium">
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section - Minimalist */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="bg-black/50 rounded-md p-6 border border-gray-800"
            >
              <div className="text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <span className="mr-2 text-yellow-500">{stat.icon}</span>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Feature Cards - Minimalist */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {/* Main Feature Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="border border-gray-800 rounded-md p-6 relative"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 text-sm font-medium">FEATURED</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-4">
              Join the upcoming Tech Fest 2025
            </h2>
            
            <p className="text-gray-300 mb-6 text-sm">
              Connect with innovative tech clubs, participate in hackathons, and showcase your projects.
            </p>
            
            
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md">
              <Link href="/events">Register</Link>
            </Button>
          </motion.div>
          
          {/* Secondary Feature Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="border border-gray-800 rounded-md p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 text-sm font-medium">NEW FEATURE</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-4">
              Create Instant Club Rooms
            </h2>
            
            <p className="text-gray-300 mb-6 text-sm">
              Host virtual meetings and discussions for your club members with our new collaborative spaces.
            </p>
            
            <Button variant="outline" className="border-yellow-500/50 text-yellow-500  px-4 py-2 rounded-md">
              <span className='text-outline'>
                <Link href="/resources">
                  Try Now
                </Link>
                Try Now</span>  
            </Button>
          </motion.div>
          
          {/* Feature List - Minimal cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="border border-gray-800 rounded-md p-6 md:col-span-2"
          >
            <h2 className="text-xl font-bold text-white mb-6">Key Features</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Club Discovery",
                  description: "Find clubs matching your interests",
                  icon: <BookOpen className="w-5 h-5 text-yellow-500" />,
                },
                {
                  title: "Network Builder",
                  description: "Connect with like-minded students",
                  icon: <Users className="w-5 h-5 text-yellow-500" />,
                },
                {
                  title: "Event Management",
                  description: "Create and manage campus events",
                  icon: <Calendar className="w-5 h-5 text-yellow-500" />,
                },
                {
                  title: "Growth Analytics",
                  description: "Track club engagement metrics",
                  icon: <TrendingUp className="w-5 h-5 text-yellow-500" />,
                }
              ].map((feature, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {feature.icon}
                    <h3 className="font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        
        {/* College List - Minimalist */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-8 justify-center">
            <BadgeCheck className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Partner Colleges</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {colleges.map((college, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="bg-black/30 border border-gray-800 p-4 rounded-md text-center"
              >
                <span className="text-lg text-white">{college}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Minimal Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="text-center border-t border-gray-800 pt-16"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to join your campus community?
          </h2>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-2 rounded-md text-lg font-medium mt-4">
            Sign Up Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ZynvoDashboard;
