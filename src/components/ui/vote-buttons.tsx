'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useVote, VoteType } from '@/hooks/useVote';

interface VoteButtonsProps {
  postId: string;
  initialUpvotes?: number;
  initialDownvotes?: number;
  initialUserVote?: VoteType;
  className?: string;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  enableParticles?: boolean;
}

const Particle = ({ 
  style, 
  color 
}: { 
  style: React.CSSProperties; 
  color: string;
}) => (
  <span
    className="absolute rounded-full pointer-events-none animate-particle"
    style={{
      ...style,
      backgroundColor: color,
      width: '6px',
      height: '6px',
    }}
  />
);

// Animated number counter
const AnimatedCounter = ({ 
  value, 
  className 
}: { 
  value: number; 
  className?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setDisplayValue(value);
        prevValue.current = value;
      }, 150);

      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [value]);

  return (
    <span className={cn('relative overflow-hidden inline-flex', className)}>
      <span
        className={cn(
          'transition-all duration-300 ease-out tabular-nums',
          isAnimating && value > prevValue.current && '-translate-y-full opacity-0',
          isAnimating && value < prevValue.current && 'translate-y-full opacity-0'
        )}
      >
        {displayValue}
      </span>
    </span>
  );
};

// Theme colors
const themeColors = {
  upvote: ['#eab308', '#facc15', '#fde047', '#fef08a', '#ca8a04'],
  downvote: ['#ef4444', '#f87171', '#fca5a5', '#dc2626', '#b91c1c'],
};

const sizeConfig = {
  sm: {
    button: 'h-7 w-7 rounded-md',
    icon: 'w-3.5 h-3.5',
    counter: 'text-xs font-semibold min-w-[24px]',
    gap: 'gap-0.5',
  },
  md: {
    button: 'h-9 w-9 rounded-lg',
    icon: 'w-4 h-4',
    counter: 'text-sm font-semibold min-w-[32px]',
    gap: 'gap-1',
  },
  lg: {
    button: 'h-11 w-11 rounded-xl',
    icon: 'w-5 h-5',
    counter: 'text-base font-bold min-w-[40px]',
    gap: 'gap-1.5',
  },
};

// Upvote arrow icon
const UpvoteIcon = ({ 
  className, 
  filled 
}: { 
  className?: string; 
  filled?: boolean;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 4L4 14h5v6h6v-6h5L12 4z" />
  </svg>
);

// Downvote arrow icon (flipped)
const DownvoteIcon = ({ 
  className, 
  filled 
}: { 
  className?: string; 
  filled?: boolean;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20L4 10h5V4h6v6h5L12 20z" />
  </svg>
);

export function VoteButtons({
  postId,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null,
  className,
  showScore = true,
  size = 'md',
  orientation = 'horizontal',
  enableParticles = true,
}: VoteButtonsProps) {
  const { score, userVote, loading, upvote, downvote } = useVote({
    postId,
    initialUpvotes,
    initialDownvotes,
    initialUserVote,
  });

  const [particles, setParticles] = useState<Array<{ id: number; style: React.CSSProperties; color: string }>>([]);
  const [pressedButton, setPressedButton] = useState<'up' | 'down' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSize = sizeConfig[size];
  const isVertical = orientation === 'vertical';

  const createParticles = (type: 'upvote' | 'downvote') => {
    if (!enableParticles || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const colors = type === 'upvote' ? themeColors.upvote : themeColors.downvote;

    const newParticles = Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.5;
      const velocity = 30 + Math.random() * 25;
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        id: Date.now() + i,
        color,
        style: {
          left: centerX,
          top: centerY,
          '--tx': `${Math.cos(angle) * velocity}px`,
          '--ty': `${Math.sin(angle) * velocity - 15}px`,
        } as React.CSSProperties,
      };
    });

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    setPressedButton('up');
    setTimeout(() => setPressedButton(null), 150);

    const wasUpvoted = userVote === 'upvote';
    await upvote();

    if (!wasUpvoted) {
      createParticles('upvote');
    }
  };

  const handleDownvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    setPressedButton('down');
    setTimeout(() => setPressedButton(null), 150);

    const wasDownvoted = userVote === 'downvote';
    await downvote();

    if (!wasDownvoted) {
      createParticles('downvote');
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-flex items-center',
        isVertical ? 'flex-col' : 'flex-row',
        currentSize.gap,
        className
      )}
    >
      {/* Upvote Button */}
      <button
        onClick={handleUpvote}
        disabled={loading}
        aria-pressed={userVote === 'upvote'}
        aria-label={userVote === 'upvote' ? 'Remove upvote' : 'Upvote'}
        className={cn(
          'relative flex items-center justify-center',
          'border backdrop-blur-sm',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'active:scale-90',
          currentSize.button,
          userVote === 'upvote'
            ? cn(
                'bg-gradient-to-br from-yellow-500/25 to-amber-500/15',
                'border-yellow-500/60',
                'text-yellow-400',
                'shadow-[0_0_15px_rgba(234,179,8,0.25)]'
              )
            : cn(
                'bg-gray-800/70',
                'border-gray-700/50',
                'text-gray-400',
                'hover:border-yellow-500/40',
                'hover:text-yellow-400',
                'hover:bg-gray-800/90'
              ),
          pressedButton === 'up' && 'scale-90'
        )}
      >
        <UpvoteIcon
          className={cn(
            currentSize.icon,
            'transition-all duration-200',
            userVote === 'upvote' && 'drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]',
            loading && 'animate-pulse'
          )}
          filled={userVote === 'upvote'}
        />
      </button>

      
      {showScore && (
        <span
          className={cn(
            'text-center tabular-nums transition-colors duration-200',
            currentSize.counter,
            userVote === 'upvote' && 'text-yellow-400',
            userVote === 'downvote' && 'text-red-400',
            userVote === null && 'text-gray-400'
          )}
        >
          <AnimatedCounter value={score} />
        </span>
      )}

      {/* Downvote Button */}
      <button
        onClick={handleDownvote}
        disabled={loading}
        aria-pressed={userVote === 'downvote'}
        aria-label={userVote === 'downvote' ? 'Remove downvote' : 'Downvote'}
        className={cn(
          'relative flex items-center justify-center',
          'border backdrop-blur-sm',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'active:scale-90',
          currentSize.button,
          userVote === 'downvote'
            ? cn(
                'bg-gradient-to-br from-red-500/25 to-rose-500/15',
                'border-red-500/60',
                'text-red-400',
                'shadow-[0_0_15px_rgba(239,68,68,0.25)]'
              )
            : cn(
                'bg-gray-800/70',
                'border-gray-700/50',
                'text-gray-400',
                'hover:border-red-500/40',
                'hover:text-red-400',
                'hover:bg-gray-800/90'
              ),
          pressedButton === 'down' && 'scale-90'
        )}
      >
        <DownvoteIcon
          className={cn(
            currentSize.icon,
            'transition-all duration-200',
            userVote === 'downvote' && 'drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]',
            loading && 'animate-pulse'
          )}
          filled={userVote === 'downvote'}
        />
      </button>

      {/* Particles */}
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          style={particle.style}
          color={particle.color}
        />
      ))}
    </div>
  );
}

// Compact inline variant
export function VoteButtonsCompact({
  postId,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null,
  className,
}: Omit<VoteButtonsProps, 'size' | 'showScore' | 'enableParticles' | 'orientation'>) {
  const { score, userVote, loading, upvote, downvote } = useVote({
    postId,
    initialUpvotes,
    initialDownvotes,
    initialUserVote,
  });

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading) await upvote();
  };

  const handleDownvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading) await downvote();
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-lg',
        'bg-gray-800/50 border border-gray-700/50',
        className
      )}
    >
      <button
        onClick={handleUpvote}
        disabled={loading}
        className={cn(
          'p-1 rounded transition-all duration-200',
          'hover:bg-gray-700/50',
          userVote === 'upvote'
            ? 'text-yellow-400'
            : 'text-gray-400 hover:text-yellow-400'
        )}
      >
        <UpvoteIcon className="w-4 h-4" filled={userVote === 'upvote'} />
      </button>
      
      <span
        className={cn(
          'text-xs font-semibold tabular-nums min-w-[20px] text-center',
          userVote === 'upvote' && 'text-yellow-400',
          userVote === 'downvote' && 'text-red-400',
          userVote === null && 'text-gray-400'
        )}
      >
        {score}
      </span>
      
      <button
        onClick={handleDownvote}
        disabled={loading}
        className={cn(
          'p-1 rounded transition-all duration-200',
          'hover:bg-gray-700/50',
          userVote === 'downvote'
            ? 'text-red-400'
            : 'text-gray-400 hover:text-red-400'
        )}
      >
        <DownvoteIcon className="w-4 h-4" filled={userVote === 'downvote'} />
      </button>
    </div>
  );
}

// Vertical sidebar style (like Reddit)
export function VoteButtonsVertical({
  postId,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null,
  className,
  size = 'md',
}: Omit<VoteButtonsProps, 'orientation' | 'enableParticles'>) {
  return (
    <VoteButtons
      postId={postId}
      initialUpvotes={initialUpvotes}
      initialDownvotes={initialDownvotes}
      initialUserVote={initialUserVote}
      className={className}
      size={size}
      orientation="vertical"
      enableParticles={false}
    />
  );
}

export default VoteButtons;

