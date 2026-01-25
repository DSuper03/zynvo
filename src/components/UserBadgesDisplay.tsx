'use client';

import React, { useState } from 'react';
import { Badge as BadgeIcon, User, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserBadgesProps {
  isFounder?: boolean;
  isMember?: boolean;
  eventCount?: number;
  clubName?: string;
  userName?: string;
}

export const UserBadgesDisplay: React.FC<UserBadgesProps> = ({
  isFounder = false,
  isMember = false,
  eventCount = 0,
  clubName = '',
  userName = 'User',
}) => {
  const [expandedBadge, setExpandedBadge] = useState<string | null>(null);

  const badges = [];

  // Founder Badge
  if (isFounder) {
    badges.push({
      id: 'founder',
      name: 'Club Founder',
      icon: '👑',
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      description: `Founded ${clubName || 'a club'} on Zynvo`,
      tier: 'GOLD',
    });
  }

  // Member Badge
  if (isMember && !isFounder) {
    badges.push({
      id: 'member',
      name: 'Club Member',
      icon: '🤝',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900',
      description: `Active member of ${clubName || 'a club'}`,
      tier: 'SILVER',
    });
  }

  // Event Creation Badges
  if (eventCount >= 1) {
    badges.push({
      id: 'event_creator',
      name: 'Event Creator',
      icon: '⭐',
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-900',
      description: 'Created your first event',
      tier: 'BRONZE',
    });
  }

  if (eventCount >= 5) {
    badges.push({
      id: 'event_master',
      name: 'Event Master',
      icon: '🏆',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      description: 'Created 5 amazing events',
      tier: 'GOLD',
    });
  }

  if (eventCount >= 10) {
    badges.push({
      id: 'event_legendary',
      name: 'Event Legendary',
      icon: '⚡',
      color: 'from-purple-400 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-900',
      description: 'Created 10 spectacular events',
      tier: 'PLATINUM',
    });
  }

  if (eventCount >= 20) {
    badges.push({
      id: 'community_champion',
      name: 'Community Champion',
      icon: '🌟',
      color: 'from-cyan-400 to-blue-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-900',
      description: 'Created 20 iconic events - A true leader!',
      tier: 'LEGENDARY',
    });
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No badges earned yet. Start creating events to earn badges!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Badge Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 text-center border border-gray-700">
          <p className="text-2xl font-bold text-yellow-400">{badges.length}</p>
          <p className="text-xs text-gray-400">Total Badges</p>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 text-center border border-gray-700">
          <p className="text-2xl font-bold text-blue-400">{eventCount}</p>
          <p className="text-xs text-gray-400">Events Created</p>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 text-center border border-gray-700">
          <p className="text-2xl font-bold text-purple-400">{Math.max(1, badges.length * 10)}</p>
          <p className="text-xs text-gray-400">XP Earned</p>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 text-center border border-gray-700">
          <p className="text-2xl font-bold text-green-400">
            {badges[badges.length - 1]?.tier || 'BRONZE'}
          </p>
          <p className="text-xs text-gray-400">Current Tier</p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            onClick={() => setExpandedBadge(expandedBadge === badge.id ? null : badge.id)}
            className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 ${
              expandedBadge === badge.id
                ? `border-yellow-400 shadow-lg shadow-yellow-400/50 scale-105`
                : 'border-gray-700 hover:border-yellow-400/50'
            }`}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-10`}
            />

            {/* Content */}
            <div className={`relative p-6 ${badge.bgColor}`}>
              {/* Badge Icon */}
              <div className="text-5xl mb-4 text-center drop-shadow-lg">
                {badge.icon}
              </div>

              {/* Badge Name */}
              <h3 className={`font-bold text-lg mb-1 text-center ${badge.textColor}`}>
                {badge.name}
              </h3>

              {/* Tier Badge */}
              <div className="flex justify-center mb-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${badge.color}`}
                >
                  {badge.tier}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm text-center ${badge.textColor}`}>
                {badge.description}
              </p>

              {/* Expanded Info */}
              {expandedBadge === badge.id && (
                <div className="mt-4 pt-4 border-t border-current/20 space-y-2 text-sm">
                  <p className={`${badge.textColor}`}>
                    ✓ Unlocked on {new Date().toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                    <Button
                      size="sm"
                      className={`bg-gradient-to-r ${badge.color} text-white hover:opacity-90`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const text = `🎖️ I just earned the "${badge.name}" badge on Zynvo! 
${badge.description}

Join me and be part of an amazing campus community! 
#Zynvo #Achievement #ClubLife`;
                        navigator.clipboard.writeText(text);
                        alert('Badge achievement copied to clipboard!');
                      }}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progression Bar */}
      <div className="mt-8 bg-gray-900 rounded-lg p-4 border border-gray-800">
        <p className="text-sm text-gray-400 mb-3">Your Achievement Progress</p>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Next Milestone</span>
              <span className="text-yellow-400 font-bold">
                {eventCount < 5 ? `${5 - eventCount} events away` : 'Master Unlocked! ✓'}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full transition-all duration-300"
                style={{ width: `${Math.min((eventCount / 5) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Legendary Status</span>
              <span className="text-purple-400 font-bold">
                {eventCount < 10 ? `${10 - eventCount} events away` : 'Legendary! 🌟'}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-400 to-pink-600 h-full transition-all duration-300"
                style={{ width: `${Math.min((eventCount / 10) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Community Champion</span>
              <span className="text-cyan-400 font-bold">
                {eventCount < 20 ? `${20 - eventCount} events away` : 'Champion! 👑'}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-600 h-full transition-all duration-300"
                style={{ width: `${Math.min((eventCount / 20) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBadgesDisplay;
