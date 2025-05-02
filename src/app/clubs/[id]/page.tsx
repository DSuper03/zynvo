'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiCalendar, FiMapPin, FiTag, FiClock, FiShare2, 
  FiExternalLink, FiMessageCircle, FiBookmark, FiHeart, 
  FiChevronRight, FiMoreHorizontal, FiGlobe, FiArchive,
  FiPlus
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { clubsData } from '@/utils/constants/clubsData';

export default function ClubPage() {
  const params = useParams();
  const clubId = params.id as string;
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchClub = () => {
      setLoading(true);
      // Find club with matching ID
      const foundClub = clubsData.find(c => c.id === clubId);
      
      // In a real app, handle the case when club is not found
      setTimeout(() => {
        setClub(foundClub || {
          id: clubId,
          name: 'Unknown Club',
          description: 'Details not available',
          members: 0,
          established: 'N/A',
          category: 'Miscellaneous',
          meetingSchedule: 'Not specified',
          location: 'Not specified',
          bannerImage: 'https://images.unsplash.com/photo-1560732488-6b0df240254a',
          logoImage: 'https://images.unsplash.com/photo-1560732488-6b0df240254a',
          tags: [],
          upcomingEvents: []
        });
        setLoading(false);
      }, 300);
    };

    fetchClub();
  }, [clubId]);

  const handleJoinClub = () => {
    setIsJoined(!isJoined);
    // In a real app, make an API call to join/leave the club
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading club details...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="relative h-[45vh] min-h-[300px] w-full overflow-hidden">
        <Image 
          src={club.bannerImage}
          alt={`${club.name} banner`}
          fill
          priority
          className="object-cover transition-all duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        
        <div className="absolute top-6 right-6 flex gap-2 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBookmarked(!bookmarked)}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full p-2.5 transition-all"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark club"}
          >
            <FiBookmark 
              className={`h-5 w-5 ${bookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} 
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLiked(!liked)}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full p-2.5 transition-all"
            aria-label={liked ? "Unlike" : "Like club"}
          >
            <FiHeart 
              className={`h-5 w-5 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} 
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full p-2.5 transition-all"
            aria-label="Share club"
          >
            <FiShare2 className="h-5 w-5 text-white" />
          </motion.button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        {/* Club Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 lg:p-8 mb-6 border border-gray-100 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Logo */}
            <div className="relative h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              <Image 
                src={club.logoImage || club.bannerImage}
                alt={club.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Club Name and Basic Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{club.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <FiUsers className="mr-1.5 h-4 w-4 text-indigo-500 dark:text-indigo-400" /> 
                      <span>{club.members} members</span>
                    </span>
                    <span className="flex items-center">
                      <FiCalendar className="mr-1.5 h-4 w-4 text-indigo-500 dark:text-indigo-400" /> 
                      <span>Est. {club.established}</span>
                    </span>
                    <span className="flex items-center">
                      <FiTag className="mr-1.5 h-4 w-4 text-indigo-500 dark:text-indigo-400" /> 
                      <span>{club.category}</span>
                    </span>
                  </div>
                </div>
                
                {/* Join Button */}
                <div className="sm:ml-auto">
                  <Button
                    onClick={handleJoinClub}
                    size="lg"
                    className={`font-medium px-6 ${
                      isJoined 
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700" 
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                    }`}
                  >
                    {isJoined ? "Joined" : "Join Club"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-hide">
              {['about', 'events', 'members', 'discussions', 'photos', 'resources'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg capitalize whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* About Section */}
              {activeTab === 'about' && (
                <>
                  <motion.div 
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800"
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{club.description}</p>
                    
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                        <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-4">
                          <FiMapPin className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Meeting Location</p>
                          <p className="font-medium text-gray-900 dark:text-white">{club.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                        <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-4">
                          <FiClock className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Meeting Schedule</p>
                          <p className="font-medium text-gray-900 dark:text-white">{club.meetingSchedule}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Club Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {club.tags && club.tags.map((tag: string) => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                        {(!club.tags || club.tags.length === 0) && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">No tags added yet</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Club Leaders */}
                  <motion.div 
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Club Leaders</h2>
                      <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 -mr-2">
                        View All <FiChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-900/50">
                            <Image 
                              src={`https://i.pravatar.cc/150?img=${20+i}`}
                              alt={`Club leader ${i}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Leader {i}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{['President', 'Vice President', 'Secretary', 'Treasurer'][i-1]}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
              
              {/* Upcoming Events */}
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
                  <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 -mr-2">
                    View Calendar <FiExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                {club.upcomingEvents && club.upcomingEvents.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <FiCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming events</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new event.</p>
                    <div className="mt-6">
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        <FiPlus className="mr-2 h-4 w-4" />
                        Create Event
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {club.upcomingEvents && club.upcomingEvents.map((event: any) => (
                      <motion.div
                        key={event.id}
                        whileHover={{ y: -2 }}
                        className="flex gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                      >
                        <div className="flex-shrink-0 h-16 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex flex-col items-center justify-center text-center">
                          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">{event.name}</h3>
                            <div className="ml-2 flex-shrink-0">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                {new Date(event.date) < new Date() ? 'Past' : 'Upcoming'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FiClock className="mr-1 h-3 w-3" />
                            <span>{event.time}</span>
                            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                            <FiMapPin className="mr-1 h-3 w-3" />
                            <span className="truncate">{event.location || club.location}</span>
                          </div>
                          
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex -space-x-1">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="h-5 w-5 rounded-full ring-2 ring-white dark:ring-gray-900 overflow-hidden relative">
                                  <Image 
                                    src={`https://i.pravatar.cc/150?img=${i+10}`}
                                    alt="Attendee"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {Math.floor(Math.random() * 20) + 5} attending
                            </span>
                            <div className="ml-auto">
                              <Button variant="outline" size="xs" className="h-6 text-xs border-gray-200 dark:border-gray-700">
                                RSVP
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Demo events if none exist */}
                    {(!club.upcomingEvents || club.upcomingEvents.length === 0) && (
                      [1, 2].map((i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i * 3);
                        
                        return (
                          <motion.div
                            key={i}
                            whileHover={{ y: -2 }}
                            className="flex gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                          >
                            <div className="flex-shrink-0 h-16 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex flex-col items-center justify-center text-center">
                              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                                {date.toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                                {date.getDate()}
                              </span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                                  {i === 1 ? "Weekly Club Meeting" : "Workshop: Introduction to Photography"}
                                </h3>
                                <div className="ml-2 flex-shrink-0">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                    Upcoming
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <FiClock className="mr-1 h-3 w-3" />
                                <span>{i === 1 ? "6:00 PM - 8:00 PM" : "2:00 PM - 4:00 PM"}</span>
                                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                <FiMapPin className="mr-1 h-3 w-3" />
                                <span className="truncate">{club.location || "Main Campus, Room 101"}</span>
                              </div>
                              
                              <div className="mt-2 flex items-center gap-3">
                                <div className="flex -space-x-1">
                                  {[1, 2, 3].map(j => (
                                    <div key={j} className="h-5 w-5 rounded-full ring-2 ring-white dark:ring-gray-900 overflow-hidden relative">
                                      <Image 
                                        src={`https://i.pravatar.cc/150?img=${j+i*10}`}
                                        alt="Attendee"
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {i === 1 ? "12" : "8"} attending
                                </span>
                                <div className="ml-auto">
                                  <Button variant="outline" size="xs" className="h-6 text-xs border-gray-200 dark:border-gray-700">
                                    RSVP
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Club Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Join {club.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Become a member to participate in events, discussions, and connect with other members.
              </p>
              
              <Button
                onClick={handleJoinClub}
                className={`w-full font-medium ${
                  isJoined 
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                }`}
                size="lg"
              >
                {isJoined ? "Leave Club" : "Join Club"}
              </Button>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Club Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Members</span>
                    <span className="font-medium text-gray-900 dark:text-white">{club.members}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Events This Month</span>
                    <span className="font-medium text-gray-900 dark:text-white">{club.upcomingEvents?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Active Since</span>
                    <span className="font-medium text-gray-900 dark:text-white">{club.established}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Social Links */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
              <div className="space-y-3">
                <Link href="#" className="flex items-center group">
                  <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    <FiGlobe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Official Website
                  </span>
                </Link>
                <Link href="#" className="flex items-center group">
                  <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    <FiMessageCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Discussion Forum
                  </span>
                </Link>
                <Link href="#" className="flex items-center group">
                  <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    <FiArchive className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Resource Library
                  </span>
                </Link>
              </div>
            </motion.div>
            
            {/* Similar Clubs */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Similar Clubs</h3>
              <div className="space-y-3">
                {clubsData
                  .filter(c => c.id !== club.id && c.category === club.category)
                  .slice(0, 3)
                  .map((similarClub) => (
                    <Link href={`/clubs/${similarClub.id}`} key={similarClub.id}>
                      <div className="flex items-center group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="h-10 w-10 relative rounded-lg overflow-hidden mr-3">
                          <Image 
                            src={similarClub.logoImage || similarClub.bannerImage} 
                            alt={similarClub.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                            {similarClub.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {similarClub.members} members
                          </p>
                        </div>
                        <FiChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                      </div>
                    </Link>
                  ))}
                
                {/* Fallback if no similar clubs or not enough */}
                {(!clubsData.filter(c => c.id !== club.id && c.category === club.category).length ||
                  clubsData.filter(c => c.id !== club.id && c.category === club.category).length < 3) && (
                  <div className="flex justify-center p-4 text-sm text-gray-500 dark:text-gray-400">
                    No more similar clubs found
                  </div>
                )}
                
                <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800 text-center">
                  <Link href="/clubs" className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                    Browse All Clubs
                    <FiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}