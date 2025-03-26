/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { format } from "date-fns";
import { FiCalendar, FiUsers, FiMapPin, FiArrowRight, FiChevronRight, FiStar, FiClock } from "react-icons/fi";
import { FaDiscord, FaTwitter, FaInstagram } from "react-icons/fa";
import { RxButton } from "react-icons/rx";
import Link from "next/link";
// 3D Card Component
const Card3D = ({ children, className = "" }: { children: any; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e:any) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((centerY - y) / centerY) * 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative transition-all duration-500 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
      }}
      animate={{
        rotateX: isHovered ? rotation.x : 0,
        rotateY: isHovered ? rotation.y : 0,
        scale: isHovered ? 1.03 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};

// Floating Particles Background
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30"
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [`${particle.y}%`, `${particle.y + 20}%`, `${particle.y}%`],
            x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`, `${particle.x}%`],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Glow Effect Component
const GlowEffect = ({ color = "indigo", size = "md", className = "" }) => {
  const sizes = {
    sm: "h-20 w-20",
    md: "h-32 w-32",
    lg: "h-64 w-64",
    xl: "h-96 w-96",
  };

  const colors = {
    indigo: "from-indigo-500/20 to-indigo-700/10",
    purple: "from-purple-500/20 to-purple-700/10",
    pink: "from-pink-500/20 to-pink-700/10",
    blue: "from-blue-500/20 to-blue-700/10",
  };

  return (
    <div
      className={`absolute rounded-full bg-gradient-to-br  blur-3xl pointer-events-none ${className}`}
    />
  );
};

// Sample data with enhanced content
const FEATURED_EVENTS = [
  {
    id: 1,
    title: "Annual Tech Hackathon",
    date: new Date(2025, 3, 30),
    time: "10:00 AM - 6:00 PM",
    location: "Engineering Building",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    attendees: 120,
    club: "Computer Science Society",
    category: "Technology",
    description: "Join us for a 24-hour coding marathon where you can build innovative projects, network with tech enthusiasts, and win exciting prizes!",
    featured: true,
  },
  {
    id: 2,
    title: "Cultural Festival",
    date: new Date(2025, 4, 5),
    time: "12:00 PM - 8:00 PM",
    location: "Main Campus Quad",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    attendees: 350,
    club: "Cultural Club",
    category: "Arts & Culture",
    description: "Experience a vibrant celebration of diversity with food, music, dance, and art from around the world. Open to all students and faculty!",
    featured: true,
  },
  {
    id: 3,
    title: "Career Fair 2025",
    date: new Date(2025, 4, 15),
    time: "9:00 AM - 4:00 PM",
    location: "Business School Atrium",
    image: "https://images.unsplash.com/photo-1560523160-754a9e25c68f",
    attendees: 280,
    club: "Career Development Center",
    category: "Professional",
    description: "Connect with top employers from various industries. Bring your resume and make an impression that could launch your career!",
    featured: false,
  },
  {
    id: 4,
    title: "Startup Pitch Competition",
    date: new Date(2025, 4, 22),
    time: "2:00 PM - 5:00 PM",
    location: "Innovation Hub",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    attendees: 90,
    club: "Entrepreneurship Club",
    category: "Business",
    description: "Witness groundbreaking ideas from student entrepreneurs and vote for your favorite startup pitch. Cash prizes for winners!",
    featured: true,
  },
];

const CLUBS = [
  {
    id: 101,
    name: "Photography Club",
    members: 86,
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
    events: 12,
    category: "Arts",
    description: "For shutterbugs of all levels. Weekly photo walks, workshops, and exhibitions.",
    social: {
      instagram: "@uphoto",
      discord: "discord.gg/uphoto"
    }
  },
  {
    id: 102,
    name: "Debate Society",
    members: 65,
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624",
    events: 8,
    category: "Academics",
    description: "Sharpen your rhetoric skills and compete in national tournaments.",
    social: {
      twitter: "@udebate",
      discord: "discord.gg/udebate"
    }
  },
  {
    id: 103,
    name: "Athletic Association",
    members: 142,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    events: 20,
    category: "Sports",
    description: "Intramural sports, fitness challenges, and outdoor adventures.",
    social: {
      instagram: "@uathletics",
      discord: "discord.gg/uathletics"
    }
  },
  {
    id: 104,
    name: "AI Research Group",
    members: 54,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    events: 6,
    category: "Technology",
    description: "Cutting-edge research in machine learning and artificial intelligence.",
    social: {
      twitter: "@uairesearch",
      discord: "discord.gg/uai"
    }
  },
];

const CATEGORIES = [
  { id: 1, name: "Technology", icon: "💻", color: "bg-blue-100 text-blue-800" },
  { id: 2, name: "Arts & Culture", icon: "🎨", color: "bg-purple-100 text-purple-800" },
  { id: 3, name: "Sports", icon: "⚽", color: "bg-green-100 text-green-800" },
  { id: 4, name: "Academics", icon: "📚", color: "bg-yellow-100 text-yellow-800" },
  { id: 5, name: "Social", icon: "🎉", color: "bg-pink-100 text-pink-800" },
  { id: 6, name: "Professional", icon: "💼", color: "bg-indigo-100 text-indigo-800" },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Computer Science Senior",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Zynvo completely transformed my campus experience. I've discovered events I would have never known about and made friends through clubs I joined.",
    rating: 5
  },
  {
    id: 2,
    name: "Maria Garcia",
    role: "Business Club President",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "Managing our club events has never been easier. The tools Zynvo provides for organizers are incredibly powerful yet simple to use.",
    rating: 5
  },
  {
    id: 3,
    name: "Jordan Smith",
    role: "Student Government",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    content: "The analytics dashboard helps us understand student engagement across campus like never before. Essential for planning future events.",
    rating: 4
  },
];

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [activeCategory, setActiveCategory] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Parallax effects
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredEvents = activeCategory === 'all' 
    ? FEATURED_EVENTS 
    : FEATURED_EVENTS.filter(event => 
        event.category.toLowerCase() === activeCategory.toLowerCase() ||
        (event.club && event.club.toLowerCase().includes(activeCategory.toLowerCase()))
    );
  
  const filteredClubs = activeCategory === 'all' 
    ? CLUBS 
    : CLUBS.filter(club => 
        club.category.toLowerCase() === activeCategory.toLowerCase() ||
        club.name.toLowerCase().includes(activeCategory.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 font-sans overflow-x-hidden">
      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Animated cursor follower */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
        <motion.div 
          className="absolute w-6 h-6 rounded-full bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30"
          animate={{
            x: [0, 10, 0, -10, 0],
            y: [0, -10, 0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header with glass morphism effect */}
      <header className="fixed w-full top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo with 3D effect */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 flex items-center"
            >
              <motion.div 
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl mr-2 shadow-lg"
              >
                Z
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Zynvo</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 items-center">
              {['Home', 'Events', 'Clubs', 'Discover', 'About'].map((item) => (
                <motion.a 
                  key={item}
                  whileHover={{ 
                    y: -2,
                    color: "#6366f1"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  href="#"
                >
                  {item}
                </motion.a>
              ))}
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
              >
                <svg
                  className={`h-6 w-6 ${menuOpen ? 'hidden' : 'block'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`h-6 w-6 ${menuOpen ? 'block' : 'hidden'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Auth buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <motion.button 
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 5px 15px -3px rgba(99, 102, 241, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
              >
                Log in
              </motion.button>
              <motion.button 
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 5px 15px -3px rgba(124, 58, 237, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
              >
                Sign up
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {['Home', 'Events', 'Clubs', 'Discover', 'About'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button className="w-full px-4 py-2 rounded-md font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50">
                    Log in
                  </button>
                  <button className="w-full mt-3 px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Sign up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero section with parallax effect */}
      <section 
        ref={targetRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
          <GlowEffect color="indigo" size="xl" className="-top-32 -left-32" />
          <GlowEffect color="purple" size="xl" className="-bottom-32 -right-32" />
          <div className="absolute inset-0 opacity-20 dark:opacity-30">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
          </div>
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatePresence>
            {isLoaded && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10 mx-auto max-w-4xl"
                >
                  {/* Animated badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 text-sm font-medium mb-6 shadow-sm"
                  >
                    <motion.span 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                      className="mr-2"
                    >
                      ✨
                    </motion.span>
                    Campus Life, Reimagined
                    <FiChevronRight className="ml-1" />
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight"
                  >
                    <span className="block">Connect with</span>
                    <span className="block">your campus</span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.7 }}
                    className="mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                  >
                    Zynvo is the vibrant hub for all college events, clubs, and communities. Never miss what matters on campus.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.7 }}
                    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <motion.button 
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg overflow-hidden group"
                    >
                      <button className="relative z-10">Explore Events</button>
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-gray-700 font-medium shadow-md flex items-center gap-2"
                    >
                      <RxButton>
                        <Link href="/clubs">
                          Join a Club
                        </Link>
                      </RxButton>
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </motion.div>
                  
                  {/* Stats counter */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                  >
                    {[
                      { value: "500+", label: "Events" },
                      { value: "10K+", label: "Students" },
                      { value: "100+", label: "Clubs" }
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 + i * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-gray-500 dark:text-gray-400 flex flex-col items-center"
          >
            <span className="text-sm mb-1">Scroll down</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      <main className="relative z-10 bg-white dark:bg-gray-950 pt-20">
        {/* Category filter chips */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Categories
            </motion.button>
            
            {CATEGORIES.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeCategory === category.name.toLowerCase()
                    ? `${category.color.replace('100', '600').replace('800', '50')} shadow-md`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* Content Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-4 mb-8">
            <div className="flex space-x-1">
              <motion.button
                whileHover={{ color: "#6366f1" }}
                onClick={() => setActiveTab('events')}
                className={`relative px-4 py-2 font-medium text-lg ${
                  activeTab === 'events'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Trending Events
                {activeTab === 'events' && (
                  <motion.span 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ color: "#6366f1" }}
                onClick={() => setActiveTab('clubs')}
                className={`relative px-4 py-2 font-medium text-lg ${
                  activeTab === 'clubs'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Popular Clubs
                {activeTab === 'clubs' && (
                  <motion.span 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              View all
              <FiArrowRight />
            </motion.button>
          </div>

          {/* Events Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredEvents.map((event, index) => (
                    <Card3D key={event.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer h-full flex flex-col border border-gray-100 dark:border-gray-800"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image 
                            src={event.image} 
                            alt={event.title}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                            priority
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          
                          {event.featured && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                              <FiStar className="mr-1" size={10} />
                              Featured
                            </div>
                          )}
                          
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                            <div className="bg-indigo-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              {format(event.date, "MMM d")}
                            </div>
                            <div className="bg-white/90 text-gray-900 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                              <FiClock className="mr-1" size={10} />
                              {event.time}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5 flex-grow flex flex-col">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{event.title}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              {event.category}
                            </span>
                          </div>
                          
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {event.description}
                          </p>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                              <FiMapPin className="mr-1" size={14} />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                              <FiUsers className="mr-1" size={14} />
                              <span>{event.attendees}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{event.club}</span>
                            <motion.button 
                              whileHover={{ scale: 1.05 }} 
                              whileTap={{ scale: 0.95 }}
                              className="text-xs px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium"
                            >
                              RSVP
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </Card3D>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Clubs Tab */}
            {activeTab === 'clubs' && (
              <motion.div
                key="clubs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredClubs.map((club, index) => (
                    <Card3D key={club.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer h-full flex flex-col border border-gray-100 dark:border-gray-800"
                      >
                        <div className="relative h-40 overflow-hidden">
                          <Image 
                            src={club.image}
                            alt={club.name}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                            priority
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-white font-bold text-xl">{club.name}</h3>
                            <span className="text-xs text-white/80">{club.category}</span>
                          </div>
                        </div>
                        
                        <div className="p-5 flex-grow">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                            {club.description}
                          </p>
                          
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <FiUsers className="mr-1" size={14} />
                              <span>{club.members} members</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <FiCalendar className="mr-1" size={14} />
                              <span>{club.events} events</span>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-2">
                                {club.social.instagram && (
                                  <a href="#" className="text-gray-400 hover:text-pink-500">
                                    <FaInstagram size={16} />
                                  </a>
                                )}
                                {club.social.twitter && (
                                  <a href="#" className="text-gray-400 hover:text-blue-400">
                                    <FaTwitter size={16} />
                                  </a>
                                )}
                                {club.social.discord && (
                                  <a href="#" className="text-gray-400 hover:text-indigo-500">
                                    <FaDiscord size={16} />
                                  </a>
                                )}
                              </div>
                              
                              <motion.button 
                                whileHover={{ scale: 1.03 }} 
                                whileTap={{ scale: 0.98 }}
                                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium text-sm"
                              >
                                Join
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Card3D>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 text-sm font-medium mb-6"
              >
                Why Choose Zynvo
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Campus life made <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">effortless</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              >
                Everything you need to stay connected with your campus community in one place.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  ),
                  title: "Event Discovery",
                  description: "Find and join events happening across campus that match your interests with our smart recommendation system.",
                  color: "text-blue-600 dark:text-blue-400"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  ),
                  title: "Club Management",
                  description: "Create and manage club profiles, recruit members, organize activities, and track engagement all in one dashboard.",
                  color: "text-purple-600 dark:text-purple-400"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                  ),
                  title: "Social Networking",
                  description: "Connect with friends, share experiences, and build your campus community through our integrated social features.",
                  color: "text-pink-600 dark:text-pink-400"
                }
              ].map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800/60 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
                >
                  <div className={`h-14 w-14 rounded-xl ${feature.color.replace('600', '100').replace('400', '900/30')} flex items-center justify-center mb-6`}>
                    <div className={`h-8 w-8 ${feature.color}`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Loved by students <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">worldwide</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              >
                Join thousands of students who have transformed their campus experience.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                      <Image 
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 relative overflow-hidden">
          <GlowEffect color="indigo" size="xl" className="-top-32 -left-32" />
          <GlowEffect color="purple" size="xl" className="-bottom-32 -right-32" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-3xl font-bold text-white mb-4"
                >
                  Ready to transform your campus experience?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-indigo-100 mb-8 text-lg"
                >
                  Join thousands of students already using Zynvo to connect with their campus community.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <motion.button 
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-indigo-600 font-medium px-8 py-3 rounded-full shadow-lg"
                  >
                    Get Started Now
                  </motion.button>
                  <motion.button 
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-full font-medium text-white border border-white/30 hover:border-white/50"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-2">Z</div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Zynvo</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                The ultimate platform for college communities to connect, share events, and build lasting relationships.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <FaTwitter size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <FaInstagram size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <FaDiscord size={18} />
                </a>
              </div>
            </div>
            
            {[
              {
                title: "Platform",
                links: ["About", "Features", "Pricing", "Testimonials"]
              },
              {
                title: "Resources",
                links: ["Blog", "Help Center", "Community", "Guides"]
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Cookie Policy", "GDPR"]
              }
            ].map((section, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a 
                        href="#" 
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Newsletter
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-grow"
                />
                <button className="px-4 py-2 rounded-r-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Zynvo. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}