'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clubData } from '@/constants/realclubs';
import { CalendarDays, Users, MapPin, Globe, Instagram, Twitter, ExternalLink, Heart, MessageCircle, Share2, Clock, ChevronRight, Flag } from 'lucide-react';

interface ClubPageProps {
  params: {
    id: string;
  };
}

// Mock upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Annual Hackathon 2025",
    date: "May 15, 2025",
    time: "9:00 AM - 9:00 PM",
    location: "Engineering Building Block A",
    image: "/pic1.jpg",
    attendees: 45
  },
  {
    id: 2,
    title: "Tech Talk: Future of AI",
    date: "May 22, 2025",
    time: "4:00 PM - 6:00 PM",
    location: "Central Auditorium",
    image: "/pic2.jpg",
    attendees: 78
  },
  {
    id: 3,
    title: "Workshop: Web Development",
    date: "June 5, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Computer Lab 3",
    image: "/pic3.jpg",
    attendees: 32
  }
];

// Mock announcements/posts
const clubPosts = [
  {
    id: 1,
    content: "Applications for the Core Team 2025-26 are now open! Apply through the link in bio.",
    timestamp: "2 days ago",
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    content: "Congratulations to our members who won the National Coding Championship! Proud moment for our club. 🏆",
    timestamp: "1 week ago",
    likes: 89,
    comments: 24,
    image: "/pic1.jpg"
  },
  {
    id: 3,
    content: "Weekly meeting reminder: Thursday at 7 PM in the Central Hall. We'll be discussing the upcoming hackathon preparations.",
    timestamp: "2 weeks ago",
    likes: 32,
    comments: 8
  }
];

export default function ClubPage({ params }: ClubPageProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'posts'>('about');
  const [isJoined, setIsJoined] = useState(false);
  const [club, setClub] = useState<any>(null);
  
  useEffect(() => {
    // Find the club by ID from our data
    const foundClub = clubData.find(c => c.id === parseInt(params.id));
    if (foundClub) {
      setClub(foundClub);
    }
  }, [params.id]);
  
  if (!club) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }
  
  // Get club category styling
  const getCategoryStyle = (category: string) => {
    switch(category) {
      case 'tech':
        return 'bg-blue-900/30 text-blue-300';
      case 'cultural':
        return 'bg-purple-900/30 text-purple-300';
      case 'business':
        return 'bg-green-900/30 text-green-300';
      case 'social':
        return 'bg-amber-900/30 text-amber-300';
      case 'literary':
        return 'bg-red-900/30 text-red-300';
      case 'design':
        return 'bg-pink-900/30 text-pink-300';
      default:
        return 'bg-gray-900/30 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-16">
      {/* Club Header Section with Hero Image */}
      <div className="relative h-64 md:h-80 w-full">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src={club.image}
              alt={club.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-900"></div>
          </div>
        </div>
        
        {/* Floating Club Logo */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10">
          <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-yellow-500 shadow-lg shadow-black/50">
            <Image
              src={club.image}
              alt={club.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        {/* College Name */}
        <div className="absolute top-8 left-4 md:left-8 z-10">
          <div className="flex items-center">
            <MapPin size={16} className="text-yellow-400 mr-2" />
            <span className="text-white text-sm font-medium">{club.college}</span>
          </div>
        </div>
      </div>
      
      {/* Club Details */}
      <div className="max-w-6xl mx-auto px-4 pt-20">
        {/* Club Name and Basic Info */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{club.name}</h1>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${getCategoryStyle(club.category)}`}>
              {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
            </span>
            
            <div className="flex items-center text-gray-300">
              <Users size={16} className="mr-1" />
              <span>{club.members} members</span>
            </div>
            
            {club.isPopular && (
              <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm border border-yellow-400/30">
                Popular
              </span>
            )}
            
            {club.isNew && (
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                New
              </span>
            )}
          </div>
          
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">{club.description}</p>
          
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => setIsJoined(!isJoined)}
              className={`px-6 py-2 rounded-lg font-medium ${
                isJoined
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-yellow-500 text-black hover:bg-yellow-400'
              } transition-colors`}
            >
              {isJoined ? 'Leave Club' : 'Join Club'}
            </button>
            
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
              <Share2 size={20} />
            </button>
            
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
              <Flag size={20} />
            </button>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            onClick={() => setActiveTab('about')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'about'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            About
          </button>
          
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'events'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Events
          </button>
          
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'posts'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Announcements
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* About Tab Content */}
            {activeTab === 'about' && (
              <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">About {club.name}</h2>
                  <p className="text-gray-300">
                    {club.name} is a dynamic student club at {club.college} focused on {club.category === 'tech' ? 'technology and innovation' : 
                    club.category === 'cultural' ? 'arts and cultural activities' : 
                    club.category === 'business' ? 'entrepreneurship and business skills' : 
                    club.category === 'social' ? 'community service and social impact' : 
                    club.category === 'literary' ? 'literature, debate, and academic pursuits' : 
                    'creativity and design'}.
                    
                    Our mission is to provide students with opportunities to enhance their skills, network with like-minded peers, and gain practical experience through various events, workshops, and projects.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Club Achievements</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Winner of the National Intercollegiate {club.category.charAt(0).toUpperCase() + club.category.slice(1)} Competition 2024</li>
                    <li>Organized over 15 successful workshops and events in the past year</li>
                    <li>Collaborated with industry professionals for mentorship programs</li>
                    <li>Featured in the Campus Annual Magazine for outstanding contributions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Contact Information</h3>
                  <div className="space-y-2 text-gray-300">
                    <p className="flex items-center">
                      <Globe size={18} className="mr-2" /> 
                      <a href="#" className="text-yellow-400 hover:underline">www.{club.name.toLowerCase().replace(/\s/g, '')}.org</a>
                    </p>
                    <p className="flex items-center">
                      <Instagram size={18} className="mr-2" /> 
                      <a href="#" className="text-yellow-400 hover:underline">@{club.name.toLowerCase().replace(/\s/g, '')}</a>
                    </p>
                    <p className="flex items-center">
                      <Twitter size={18} className="mr-2" /> 
                      <a href="#" className="text-yellow-400 hover:underline">@{club.name.toLowerCase().replace(/\s/g, '')}</a>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Meeting Schedule</h3>
                  <p className="text-gray-300 flex items-center">
                    <CalendarDays size={18} className="mr-2" /> 
                    Weekly on Thursdays, 7:00 PM - 9:00 PM
                  </p>
                  <p className="text-gray-300 flex items-center">
                    <MapPin size={18} className="mr-2" /> 
                    {club.college} - Block C, Room 204
                  </p>
                </div>
              </div>
            )}
            
            {/* Events Tab Content */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
                
                {upcomingEvents.map(event => (
                  <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden hover:border hover:border-yellow-500/30 transition-all duration-300 shadow-md">
                    <div className="relative h-48 w-full">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                        <div className="flex items-center text-yellow-400 mt-1">
                          <CalendarDays size={16} className="mr-1" />
                          <span className="text-sm">{event.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center text-gray-300 mb-2">
                        <Clock size={16} className="mr-1" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-300 mb-4">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-400">
                          <Users size={16} className="mr-1" />
                          <span className="text-sm">{event.attendees} going</span>
                        </div>
                        
                        <button className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-sm font-medium transition-colors">
                          RSVP
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Link href="#" className="flex items-center justify-center text-yellow-400 hover:text-yellow-300 py-3">
                  <span className="mr-1">View all events</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            )}
            
            {/* Posts Tab Content */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Club Announcements</h2>
                
                {clubPosts.map(post => (
                  <div key={post.id} className="bg-gray-800 rounded-lg overflow-hidden p-4 shadow-md">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src={club.image}
                          alt={club.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-white">{club.name}</h4>
                        <p className="text-gray-400 text-xs">{post.timestamp}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{post.content}</p>
                    
                    {post.image && (
                      <div className="rounded-lg overflow-hidden mb-4">
                        <div className="relative h-60 w-full">
                          <Image
                            src={post.image}
                            alt="Post image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-400 border-t border-gray-700 pt-3">
                      <button className="flex items-center hover:text-yellow-400">
                        <Heart size={18} className="mr-1" />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center hover:text-yellow-400">
                        <MessageCircle size={18} className="mr-1" />
                        <span>{post.comments}</span>
                      </button>
                      
                      <button className="flex items-center hover:text-yellow-400">
                        <Share2 size={18} className="mr-1" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                <Link href="#" className="flex items-center justify-center text-yellow-400 hover:text-yellow-300 py-3">
                  <span className="mr-1">View all announcements</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">Club Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-yellow-400 text-xl font-bold">{club.members}</p>
                  <p className="text-gray-300 text-sm">Members</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-yellow-400 text-xl font-bold">15</p>
                  <p className="text-gray-300 text-sm">Events</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-yellow-400 text-xl font-bold">4.8</p>
                  <p className="text-gray-300 text-sm">Rating</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-yellow-400 text-xl font-bold">2018</p>
                  <p className="text-gray-300 text-sm">Founded</p>
                </div>
              </div>
            </div>
            
            {/* Core Team */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">Core Team</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src="https://i.pravatar.cc/150?img=11"
                      alt="President"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Rahul Mehta</h4>
                    <p className="text-gray-400 text-xs">President</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src="https://i.pravatar.cc/150?img=20"
                      alt="Vice President"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Aisha Sharma</h4>
                    <p className="text-gray-400 text-xs">Vice President</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src="https://i.pravatar.cc/150?img=21"
                      alt="Secretary"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Dev Patel</h4>
                    <p className="text-gray-400 text-xs">Secretary</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src="https://i.pravatar.cc/150?img=32"
                      alt="Treasurer"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Neha Kapoor</h4>
                    <p className="text-gray-400 text-xs">Treasurer</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Similar Clubs */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">Similar Clubs</h3>
              <div className="space-y-3">
                {clubData
                  .filter(c => c.category === club.category && c.id !== club.id)
                  .slice(0, 3)
                  .map(similarClub => (
                    <Link href={`/clubs/${similarClub.id}`} key={similarClub.id}>
                      <div className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <div className="relative h-full w-full">
                            <Image
                              src={similarClub.image}
                              alt={similarClub.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{similarClub.name}</h4>
                          <p className="text-gray-400 text-xs">{similarClub.college}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
            
            {/* Join CTA */}
            <div className="bg-yellow-500 rounded-lg p-4 text-center">
              <h3 className="text-xl font-bold text-black mb-2">Join {club.name} Today!</h3>
              <p className="text-gray-800 mb-4">Connect with like-minded peers and grow your skills.</p>
              {!isJoined && (
                <button 
                  onClick={() => setIsJoined(true)}
                  className="w-full py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Become a Member
                </button>
              )}
              {isJoined && (
                <p className="font-medium text-black">You are a member! 🎉</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}