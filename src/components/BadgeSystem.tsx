'use client';

import React from 'react';
import { Trophy, Users, Star, Zap, Crown, Award, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
  earnedAt?: string;
  achievementLevel?: number;
}

interface BadgeDisplayProps {
  badge: BadgeData;
  isEarned: boolean;
  onClick?: () => void;
}

// Badge definitions
export const BADGE_TYPES = {
  CLUB_FOUNDER: {
    id: 'club_founder',
    name: 'Club Founder',
    description: 'Founded a club on Zynvo',
    icon: <Crown className="w-6 h-6" />,
    color: '#FFD700',
    backgroundColor: '#FFF8DC',
  },
  CLUB_MEMBER: {
    id: 'club_member',
    name: 'Club Member',
    description: 'Active member of a Zynvo club',
    icon: <Users className="w-6 h-6" />,
    color: '#4169E1',
    backgroundColor: '#E6F0FF',
  },
  EVENT_CREATOR: {
    id: 'event_creator',
    name: 'Event Creator',
    description: 'Created your first event',
    icon: <Star className="w-6 h-6" />,
    color: '#FF6B6B',
    backgroundColor: '#FFE6E6',
  },
  EVENT_MASTER: {
    id: 'event_master_5',
    name: 'Event Master',
    description: 'Created 5 events',
    icon: <Trophy className="w-8 h-8" />,
    color: '#FFD700',
    backgroundColor: '#FFF8DC',
    achievementLevel: 5,
  },
  EVENT_LEGENDARY: {
    id: 'event_legendary_10',
    name: 'Event Legendary',
    description: 'Created 10 events',
    icon: <Zap className="w-8 h-8" />,
    color: '#FF00FF',
    backgroundColor: '#FFE6FF',
    achievementLevel: 10,
  },
  COMMUNITY_CHAMPION: {
    id: 'community_champion_20',
    name: 'Community Champion',
    description: 'Created 20 events',
    icon: <Award className="w-8 h-8" />,
    color: '#00CED1',
    backgroundColor: '#E6FFFF',
    achievementLevel: 20,
  },
};

// Individual Badge Display Component
export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badge,
  isEarned,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-lg p-4 text-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isEarned
          ? `bg-gradient-to-br border-2 border-yellow-400/50 shadow-lg hover:shadow-xl`
          : 'bg-gray-800 border border-gray-700 opacity-50 grayscale'
      }`}
      style={
        isEarned
          ? {
              background: `linear-gradient(135deg, ${badge.backgroundColor} 0%, rgba(255,255,255,0.05) 100%)`,
            }
          : {}
      }
    >
      {/* Lock/Unlock Indicator */}
      {!isEarned && (
        <div className="absolute top-1 right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
          <span className="text-xs text-white">🔒</span>
        </div>
      )}

      {/* Badge Icon */}
      <div
        className="mb-3 flex justify-center"
        style={{ color: isEarned ? badge.color : '#999' }}
      >
        {badge.icon}
      </div>

      {/* Badge Name */}
      <h3 className={`font-bold text-sm mb-1 ${isEarned ? 'text-gray-900' : 'text-gray-400'}`}>
        {badge.name}
      </h3>

      {/* Badge Description */}
      <p className={`text-xs mb-2 ${isEarned ? 'text-gray-700' : 'text-gray-500'}`}>
        {badge.description}
      </p>

      {/* Achievement Level */}
      {badge.achievementLevel && (
        <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
          isEarned
            ? 'bg-yellow-400 text-black'
            : 'bg-gray-600 text-gray-400'
        }`}>
          {badge.achievementLevel} Events
        </div>
      )}

      {/* Earned Date */}
      {isEarned && badge.earnedAt && (
        <p className="text-xs text-gray-600 mt-2">
          Earned {new Date(badge.earnedAt).toLocaleDateString()}
        </p>
      )}
      {isEarned && !badge.earnedAt && (
        <p className="text-xs text-gray-500 mt-2">Unlocked</p>
      )}
    </div>
  );
};

// Badge Collection Component
interface BadgeCollectionProps {
  userBadges: string[];
  userEventCount?: number;
  isFounder?: boolean;
  earnedDates?: Record<string, string>;
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  userBadges,
  userEventCount = 0,
  isFounder = false,
  earnedDates = {},
}) => {
  // Determine which event creation badges are earned
  const getEarnedEventBadges = () => {
    const earned = [];
    if (userEventCount >= 1) earned.push(BADGE_TYPES.EVENT_CREATOR.id);
    if (userEventCount >= 5) earned.push(BADGE_TYPES.EVENT_MASTER.id);
    if (userEventCount >= 10) earned.push(BADGE_TYPES.EVENT_LEGENDARY.id);
    if (userEventCount >= 20) earned.push(BADGE_TYPES.COMMUNITY_CHAMPION.id);
    return earned;
  };

  const allBadges = [
    isFounder && BADGE_TYPES.CLUB_FOUNDER,
    userBadges.includes('club_member') && BADGE_TYPES.CLUB_MEMBER,
    ...getEarnedEventBadges().map((id) => {
      if (id === BADGE_TYPES.EVENT_CREATOR.id) return BADGE_TYPES.EVENT_CREATOR;
      if (id === BADGE_TYPES.EVENT_MASTER.id) return BADGE_TYPES.EVENT_MASTER;
      if (id === BADGE_TYPES.EVENT_LEGENDARY.id) return BADGE_TYPES.EVENT_LEGENDARY;
      if (id === BADGE_TYPES.COMMUNITY_CHAMPION.id) return BADGE_TYPES.COMMUNITY_CHAMPION;
      return null;
    }),
  ].filter(Boolean) as BadgeData[];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {allBadges.map((badge) => (
        <BadgeDisplay
          key={badge.id}
          badge={{
            ...badge,
            earnedAt: earnedDates[badge.id],
          }}
          isEarned={true}
        />
      ))}
    </div>
  );
};

export default BadgeDisplay;
