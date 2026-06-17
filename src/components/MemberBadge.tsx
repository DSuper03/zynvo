'use client';

import React from 'react';
import { Crown, Users, Shield, Star } from 'lucide-react';

interface MemberBadgeProps {
  role: 'founder' | 'member' | 'admin';
  joinedDate?: string;
  eventCount?: number;
  isVerified?: boolean;
}

export const MemberBadge: React.FC<MemberBadgeProps> = ({
  role,
  joinedDate,
  eventCount = 0,
  isVerified = false,
}) => {
  const badgeConfig = {
    founder: {
      label: 'Club Founder',
      icon: Crown,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30',
      emoji: '👑',
      tier: 'GOLD',
      description: 'Founder of this club',
    },
    admin: {
      label: 'Club Admin',
      icon: Shield,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/30',
      emoji: '⚡',
      tier: 'SILVER',
      description: 'Administrator',
    },
    member: {
      label: 'Club Member',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/30',
      emoji: '🤝',
      tier: 'BRONZE',
      description: 'Active member',
    },
  };

  const config = badgeConfig[role];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${config.bgColor} ${config.borderColor} ${config.color}`}
    >
      <span className="text-lg">{config.emoji}</span>
      <div className="flex flex-col">
        <span className="font-bold text-sm">{config.label}</span>
        {joinedDate && (
          <span className="text-xs opacity-75">
            Joined {new Date(joinedDate).toLocaleDateString()}
          </span>
        )}
      </div>
      {isVerified && <span className="text-lg ml-2">✓</span>}
    </div>
  );
};

interface ClubMemberListProps {
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: 'founder' | 'member' | 'admin';
    joinedDate: string;
    avatar?: string;
    eventCount?: number;
  }>;
}

export const ClubMemberList: React.FC<ClubMemberListProps> = ({ members }) => {
  // Sort members: Founder first, then Admin, then Members
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = { founder: 0, admin: 1, member: 2 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  return (
    <div className="space-y-3">
      {sortedMembers.map((member) => (
        <div
          key={member.id}
          className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-yellow-400/30 transition-colors"
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <span className="text-white font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Member Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white truncate">{member.name}</h3>
                <MemberBadge role={member.role} joinedDate={member.joinedDate} />
              </div>
              <p className="text-sm text-gray-400 truncate">{member.email}</p>

              {/* Event Count for Founders/Admins */}
              {member.eventCount !== undefined && member.eventCount > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-semibold">
                    {member.eventCount} Events Created
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberBadge;
