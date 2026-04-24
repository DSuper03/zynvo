'use client';

import React from 'react';
import { Crown, Handshake, Star, Zap, Trophy, Flame } from 'lucide-react';
import { toast } from 'sonner';

interface UserBadgesProps {
  isFounder?: boolean;
  isMember?: boolean;
  eventCount?: number;
  clubName?: string;
  userName?: string;
}

type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'LEGENDARY';

interface BadgeDef {
  id: string;
  name: string;
  description: string;
  Icon: React.ElementType;
  tier: Tier;
}

const TIER_STYLES: Record<Tier, { label: string; ring: string; glow: string; text: string; bar: string; dot: string }> = {
  BRONZE:    { label: 'Bronze',    ring: 'border-amber-600/40',    glow: 'shadow-amber-600/10',   text: 'text-amber-400',   bar: 'from-amber-500 to-amber-700',   dot: 'bg-amber-500'   },
  SILVER:    { label: 'Silver',    ring: 'border-slate-400/40',    glow: 'shadow-slate-400/10',   text: 'text-slate-300',   bar: 'from-slate-300 to-slate-500',   dot: 'bg-slate-400'   },
  GOLD:      { label: 'Gold',      ring: 'border-yellow-400/40',   glow: 'shadow-yellow-400/15',  text: 'text-yellow-400',  bar: 'from-yellow-300 to-yellow-500', dot: 'bg-yellow-400'  },
  PLATINUM:  { label: 'Platinum',  ring: 'border-purple-400/40',   glow: 'shadow-purple-400/15',  text: 'text-purple-400',  bar: 'from-purple-400 to-pink-500',   dot: 'bg-purple-400'  },
  LEGENDARY: { label: 'Legendary', ring: 'border-cyan-400/40',     glow: 'shadow-cyan-400/15',    text: 'text-cyan-400',    bar: 'from-cyan-400 to-blue-500',     dot: 'bg-cyan-400'    },
};

const MILESTONES = [
  { label: 'Event Master',        target: 5,  barColor: 'from-yellow-400 to-yellow-600',   textColor: 'text-yellow-400'  },
  { label: 'Legendary Status',    target: 10, barColor: 'from-purple-400 to-pink-500',     textColor: 'text-purple-400'  },
  { label: 'Community Champion',  target: 20, barColor: 'from-cyan-400 to-blue-500',       textColor: 'text-cyan-400'    },
];

export const UserBadgesDisplay: React.FC<UserBadgesProps> = ({
  isFounder = false,
  isMember = false,
  eventCount = 0,
  clubName = '',
  userName = 'User',
}) => {
  const badges: BadgeDef[] = [];

  if (isFounder) {
    badges.push({
      id: 'founder',
      name: 'Club Founder',
      description: `Founded ${clubName || 'a club'} on Zynvo`,
      Icon: Crown,
      tier: 'GOLD',
    });
  }

  if (isMember && !isFounder) {
    badges.push({
      id: 'member',
      name: 'Club Member',
      description: `Active member of ${clubName || 'a club'}`,
      Icon: Handshake,
      tier: 'SILVER',
    });
  }

  if (eventCount >= 1) {
    badges.push({
      id: 'event_creator',
      name: 'Event Creator',
      description: 'Attended their first event',
      Icon: Star,
      tier: 'BRONZE',
    });
  }

  if (eventCount >= 5) {
    badges.push({
      id: 'event_master',
      name: 'Event Master',
      description: 'Attended 5 events',
      Icon: Trophy,
      tier: 'GOLD',
    });
  }

  if (eventCount >= 10) {
    badges.push({
      id: 'event_legendary',
      name: 'Event Legendary',
      description: 'Attended 10 events',
      Icon: Zap,
      tier: 'PLATINUM',
    });
  }

  if (eventCount >= 20) {
    badges.push({
      id: 'community_champion',
      name: 'Community Champion',
      description: 'Attended 20+ events — a true campus leader',
      Icon: Flame,
      tier: 'LEGENDARY',
    });
  }

  const topTier = badges[badges.length - 1]?.tier ?? null;

  const handleShare = (badge: BadgeDef) => {
    const text = `🎖️ I just earned the "${badge.name}" badge on Zynvo!\n${badge.description}\n\nJoin me — #Zynvo #ClubLife`;
    navigator.clipboard.writeText(text);
    toast('Copied to clipboard!', { duration: 2000 });
  };

  if (badges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
          <Trophy className="w-5 h-5 text-gray-600" />
        </div>
        <p className="text-sm font-medium text-gray-400">No badges yet</p>
        <p className="text-xs text-gray-600 mt-1">Attend events or join a club to earn your first badge.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top row: badge count + tier pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{badges.length}</span>
          <span className="text-sm text-gray-400">{badges.length === 1 ? 'badge' : 'badges'} earned</span>
        </div>
        {topTier && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${TIER_STYLES[topTier].ring} ${TIER_STYLES[topTier].text} bg-white/[0.03]`}>
            {TIER_STYLES[topTier].label} tier
          </span>
        )}
      </div>

      {/* Badge list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {badges.map((badge) => {
          const s = TIER_STYLES[badge.tier];
          const Icon = badge.Icon;
          return (
            <div
              key={badge.id}
              className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl border bg-white/[0.025] hover:bg-white/[0.04] transition-all duration-200 ${s.ring} shadow-lg ${s.glow}`}
            >
              {/* Icon circle */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/[0.04] border ${s.ring}`}>
                <Icon className={`w-4.5 h-4.5 ${s.text}`} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white leading-tight">{badge.name}</span>
                  <span className={`hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${s.ring} ${s.text} bg-white/[0.03]`}>
                    {TIER_STYLES[badge.tier].label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{badge.description}</p>
              </div>

              {/* Share */}
              <button
                onClick={() => handleShare(badge)}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all"
              >
                Share
              </button>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="space-y-3 pt-2 border-t border-gray-800/70">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Progress</p>
        {MILESTONES.map((m) => {
          const pct = Math.min((eventCount / m.target) * 100, 100);
          const done = eventCount >= m.target;
          return (
            <div key={m.label}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-gray-400">{m.label}</span>
                <span className={`text-xs font-semibold ${done ? 'text-green-400' : m.textColor}`}>
                  {done ? 'Unlocked ✓' : `${m.target - eventCount} to go`}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${m.barColor} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserBadgesDisplay;
