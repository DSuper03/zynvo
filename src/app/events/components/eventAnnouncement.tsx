'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Edit3, X, Save, Star, Sparkles, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Mock event data for a specific event
const mockEvent = {
  id: '1',
  title: 'Techno Innovators Summit 2025',
  organizer: 'Zynvo Tech Club',
  date: '2024-12-15',
  time: '10:00 AM – 5:00 PM',
  venue: 'University Auditorium',
  description: 'Explore the future of technology and innovation. Join workshops, expert talks, and hackathons!',
  tags: ['Tech', 'Innovation', 'Workshop'],
  interested: 350,
  going: 180,
  image: '/posters/1.png',
  isOfficial: true,
  countdown: '02d 15h 30m'
};

// Mock announcements data
const mockAnnouncements = [
  {
    id: '1',
    title: 'Registration Deadline Extended!',
    description: 'Due to overwhelming response, we\'ve extended the registration deadline to December 10th. Don\'t miss out on this amazing opportunity!',
    timestamp: '2 hours ago',
    isImportant: true
  },
  {
    id: '2',
    title: 'Workshop Schedule Released',
    description: 'Check out our detailed workshop schedule. We have sessions on AI, Blockchain, IoT, and more. Choose your tracks wisely!',
    timestamp: '1 day ago',
    isImportant: false
  },
  {
    id: '3',
    title: 'Guest Speaker Announcement',
    description: 'We\'re excited to announce that Dr. Sarah Johnson, CTO of TechCorp, will be our keynote speaker. Prepare your questions!',
    timestamp: '3 days ago',
    isImportant: true
  }
];

const EventAnnouncement = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [isAdmin, setIsAdmin] = useState(true); // Mock admin status
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    isImportant: false
  });

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title.trim() && newAnnouncement.description.trim()) {
      const announcement = {
        id: Date.now().toString(),
        title: newAnnouncement.title,
        description: newAnnouncement.description,
        timestamp: 'Just now',
        isImportant: newAnnouncement.isImportant
      };
      
      setAnnouncements(prev => [announcement, ...prev]);
      setNewAnnouncement({ title: '', description: '', isImportant: false });
      setIsAddingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-[#FACC15] rounded-sm opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-[#FACC15] rounded-sm opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-[#FACC15] rounded-sm opacity-25 animate-pulse delay-2000"></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-[#FACC15] rounded-sm opacity-40 animate-pulse delay-500"></div>
        <div className="absolute bottom-60 right-1/3 w-3 h-3 bg-[#FACC15] rounded-sm opacity-20 animate-pulse delay-1500"></div>
        
        {/* Floating confetti elements */}
        <div className="absolute top-32 right-10 text-[#FACC15] opacity-20 animate-bounce">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-32 left-10 text-[#FACC15] opacity-30 animate-bounce delay-1000">
          <Star className="w-3 h-3" />
        </div>
        <div className="absolute top-1/2 left-1/4 text-[#FACC15] opacity-25 animate-bounce delay-500">
          <Megaphone className="w-3 h-3" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <span className="text-4xl">📢</span>
            <span className="bg-gradient-to-r from-[#FACC15] to-yellow-300 bg-clip-text text-transparent">
              Event Announcement
            </span>
          </h1>
          <p className="text-lg text-gray-300">
            Brought to you by {mockEvent.organizer}
          </p>
        </div>

        {/* Main Event Card */}
        <div className="lego-card group relative bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-800 hover:border-[#FACC15]/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#FACC15]/20 mb-8">
          {/* Card Shadow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FACC15]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Event Image */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
            <div className="absolute top-4 right-4 flex gap-2">
              {mockEvent.isOfficial && (
                <Badge className="bg-[#FACC15] text-black font-semibold px-3 py-1 rounded-lg shadow-lg">
                  Official
                </Badge>
              )}
              <Badge className="bg-[#FACC15] text-black font-semibold px-3 py-1 rounded-lg shadow-lg">
                {mockEvent.countdown}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-[#FACC15] mb-2">
                {mockEvent.title}
              </h2>
              <p className="text-gray-300 text-sm">
                by {mockEvent.organizer}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6 space-y-4">
            {/* Event Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-4 h-4 text-[#FACC15]" />
                <span className="text-sm">{new Date(mockEvent.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {mockEvent.time}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-[#FACC15]" />
                <span className="text-sm">{mockEvent.venue}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {mockEvent.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {mockEvent.tags.map((tag, tagIndex) => (
                <Badge
                  key={tagIndex}
                  variant="outline"
                  className="border-[#FACC15]/50 text-[#FACC15] hover:bg-[#FACC15]/10 transition-colors duration-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="lego-button flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 bg-[#FACC15] text-black shadow-lg shadow-[#FACC15]/30">
                <Users className="w-4 h-4 mr-2" />
                Join Event
              </Button>
              <Button className="lego-button flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 bg-gray-800 text-white hover:bg-gray-700 border border-gray-600">
                <Star className="w-4 h-4 mr-2" />
                Remind Me
              </Button>
            </div>

            {/* Interest Count */}
            <div className="flex items-center gap-2 pt-2">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-[#FACC15] rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <Users className="w-3 h-3 text-black" />
                  </div>
                ))}
              </div>
              <span className="text-gray-300 text-sm">{mockEvent.interested}+ interested</span>
            </div>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-[#FACC15]" />
              Latest Announcements
            </h3>
            {isAdmin && (
              <Button
                onClick={() => setIsAddingAnnouncement(true)}
                className="lego-button bg-[#FACC15] hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Announcement
              </Button>
            )}
          </div>

          {/* Add Announcement Form */}
          {isAddingAnnouncement && (
            <div className="lego-card bg-gray-900 rounded-2xl border-2 border-[#FACC15]/50 p-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Add New Announcement</h4>
                  <Button
                    onClick={() => setIsAddingAnnouncement(false)}
                    className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <Input
                  placeholder="Announcement title..."
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#FACC15] focus:ring-[#FACC15]/20"
                />
                
                <Textarea
                  placeholder="Announcement description..."
                  value={newAnnouncement.description}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#FACC15] focus:ring-[#FACC15]/20"
                />
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.isImportant}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, isImportant: e.target.checked }))}
                      className="rounded border-gray-600 bg-gray-800 text-[#FACC15] focus:ring-[#FACC15]/20"
                    />
                    Mark as important
                  </label>
                  
                  <div className="flex gap-2 ml-auto">
                    <Button
                      onClick={() => setIsAddingAnnouncement(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddAnnouncement}
                      className="lego-button bg-[#FACC15] hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Announcement
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Announcements List */}
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div
                key={announcement.id}
                className="lego-card group relative bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-800 hover:border-[#FACC15]/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#FACC15]/20"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-white">{announcement.title}</h4>
                      {announcement.isImportant && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Important
                        </Badge>
                      )}
                    </div>
                    {isAdmin && (
                      <Button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-gray-700 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    {announcement.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{announcement.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {announcements.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                No Announcements Yet
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {isAdmin 
                  ? 'Be the first to add an announcement for this event!'
                  : 'Check back later for updates about this event.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EventAnnouncement;