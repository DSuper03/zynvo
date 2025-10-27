'use client';

import React, { useState } from 'react';
import { Send, X, Bell, BellOff, Image, Smile, Users, Megaphone, Star, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Mock club data
const mockClub = {
  id: '1',
  name: 'Zynvo Tech Club',
  logo: '/icons/icon-192x192.png', // Using existing icon
  tagline: 'Innovation Through Technology',
  description: 'Innovation Through Technology',
  memberCount: 245
};

interface ZynvoClubAnnouncementProps {
  club?: {
    id: string;
    name: string;
    image?: string;
    description?: string;
    members?: any[];
    memberCount?: number;
  };
}

const ZynvoClubAnnouncement: React.FC<ZynvoClubAnnouncementProps> = ({ club }) => {
  // Use passed club data or fallback to mock data
  const clubData = club || mockClub;
  const memberCount = club?.members?.length || club?.memberCount || mockClub.memberCount;
  
  const [announcement, setAnnouncement] = useState({
    title: '',
    description: '',
    notifyAll: true,
    hasAttachment: false
  });
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!announcement.title.trim() || !announcement.description.trim()) {
      return;
    }

    setIsPosting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Announcement posted:', announcement);
      setAnnouncement({ title: '', description: '', notifyAll: true, hasAttachment: false });
      setIsPosting(false);
      // You can add success notification here
    }, 1500);
  };

  const handleCancel = () => {
    setAnnouncement({ title: '', description: '', notifyAll: true, hasAttachment: false });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* LEGO brick patterns */}
        <div className="absolute top-20 left-10 w-6 h-3 bg-[#FACC15] rounded-sm opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-4 h-2 bg-[#FACC15] rounded-sm opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-8 h-4 bg-[#FACC15] rounded-sm opacity-25 animate-pulse delay-2000"></div>
        <div className="absolute top-60 left-1/3 w-3 h-2 bg-[#FACC15] rounded-sm opacity-40 animate-pulse delay-500"></div>
        <div className="absolute bottom-60 right-1/3 w-5 h-3 bg-[#FACC15] rounded-sm opacity-20 animate-pulse delay-1500"></div>
        
        {/* Floating tech elements */}
        <div className="absolute top-32 right-10 text-[#FACC15] opacity-20 animate-bounce">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-32 left-10 text-[#FACC15] opacity-30 animate-bounce delay-1000">
          <Star className="w-3 h-3" />
        </div>
        <div className="absolute top-1/2 left-1/4 text-[#FACC15] opacity-25 animate-bounce delay-500">
          <Megaphone className="w-3 h-3" />
        </div>

        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(250, 204, 21, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(250, 204, 21, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Club Logo */}
            <div className="relative">
              <div className="w-16 h-16 bg-[#FACC15] rounded-full flex items-center justify-center shadow-lg shadow-[#FACC15]/30 animate-lego-pulse-3d">
                <Users className="w-8 h-8 text-black" />
              </div>
              {/* LEGO-style studs */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FACC15] rounded-full opacity-60"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#FACC15] rounded-full opacity-40"></div>
            </div>
            
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-[#FACC15] mb-1">
                {clubData.name}
              </h1>
              <p className="text-[#A3A3A3] text-sm uppercase tracking-wider">
                Official Announcement
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[#A3A3A3] text-sm">
            <Users className="w-4 h-4" />
            <span>{memberCount} members</span>
            <span>•</span>
            <span>{clubData.description || 'Innovation Through Technology'}</span>
          </div>
        </div>

        {/* Main Announcement Card */}
        <div className="lego-card group relative bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-800 hover:border-[#FACC15]/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#FACC15]/20 mb-8">
          {/* Card Shadow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FACC15]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* LEGO-style corner accents */}
          <div className="absolute top-4 left-4 w-6 h-6 bg-[#FACC15] rounded-sm opacity-20 rotate-45"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#FACC15] rounded-sm opacity-15 rotate-45"></div>
          
          <div className="p-8 space-y-6">
            {/* Title Input Area */}
            <div className="space-y-2">
              <label className="text-[#A3A3A3] text-sm font-medium uppercase tracking-wider">
                Announcement Title
              </label>
              <div className="relative">
                <Input
                  placeholder="Add Announcement Title..."
                  value={announcement.title}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-transparent border-0 text-white text-xl font-bold placeholder-gray-500 focus:outline-none focus:ring-0 border-b-2 border-gray-700 focus:border-[#FACC15] transition-colors duration-300 pb-2"
                />
                {/* Soft yellow underline effect */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FACC15]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Description Area */}
            <div className="space-y-2">
              <label className="text-[#A3A3A3] text-sm font-medium uppercase tracking-wider">
                Description
              </label>
              <div className="relative">
                <Textarea
                  placeholder="Write a short description for members..."
                  value={announcement.description}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-[#FACC15] focus:ring-[#FACC15]/20 rounded-xl resize-none text-sm leading-relaxed"
                />
                
                {/* Attachment/Emoji icons */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button
                    size="sm"
                    className="w-8 h-8 p-0 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-[#FACC15] transition-colors duration-200"
                    onClick={() => setAnnouncement(prev => ({ ...prev, hasAttachment: !prev.hasAttachment }))}
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="w-8 h-8 p-0 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-[#FACC15] transition-colors duration-200"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Character count */}
            <div className="text-right text-[#A3A3A3] text-xs">
              {announcement.description.length}/500 characters
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="space-y-6">
          {/* Notification Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FACC15] rounded-lg flex items-center justify-center">
                {announcement.notifyAll ? (
                  <Bell className="w-5 h-5 text-black" />
                ) : (
                  <BellOff className="w-5 h-5 text-black" />
                )}
              </div>
              <div>
                <p className="text-white font-medium">Notify all members</p>
                <p className="text-[#A3A3A3] text-sm">Send push notification to all {memberCount} members</p>
              </div>
            </div>
            <Switch
              checked={announcement.notifyAll}
              onCheckedChange={(checked) => setAnnouncement(prev => ({ ...prev, notifyAll: checked }))}
              className="data-[state=checked]:bg-[#FACC15]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleCancel}
              className="lego-button flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 bg-transparent border-2 border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15] hover:text-black"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={!announcement.title.trim() || !announcement.description.trim() || isPosting}
              className="lego-button flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 bg-[#FACC15] text-black shadow-lg shadow-[#FACC15]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPosting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post Announcement
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview Section (if there's content) */}
        {(announcement.title || announcement.description) && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#FACC15]" />
              Preview
            </h3>
            <div className="lego-card bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h4 className="text-xl font-bold text-white mb-2">
                {announcement.title || 'Announcement Title'}
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {announcement.description || 'Announcement description will appear here...'}
              </p>
              <div className="flex items-center gap-2 mt-4 text-[#A3A3A3] text-xs">
                <Clock className="w-3 h-3" />
                <span>Posted just now</span>
                {announcement.notifyAll && (
                  <>
                    <span>•</span>
                    <Bell className="w-3 h-3" />
                    <span>All members notified</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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

        /* Custom input focus effects */
        input:focus + div {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ZynvoClubAnnouncement;
