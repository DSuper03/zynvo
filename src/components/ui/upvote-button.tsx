'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useUpvote } from '@/hooks/useUpvote';

interface UpvoteButtonProps {
  postId: string;
  initialUpvotes?: number;
  initialIsUpvoted?: boolean;
  className?: string;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  enableParticles?: boolean;
}

// Particle component for the celebration effect
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

// Yellow/Black theme colors (matching Zynvo design)
const themeColors = {
  particles: ['#eab308', '#facc15', '#fde047', '#fef08a', '#ca8a04'],
};

const sizeConfig = {
  sm: {
    button: 'h-8 px-3 gap-1.5 text-xs rounded-lg',
    icon: 'w-4 h-4',
    counter: 'text-xs font-semibold',
  },
  md: {
    button: 'h-10 px-4 gap-2 text-sm rounded-xl',
    icon: 'w-5 h-5',
    counter: 'text-sm font-semibold',
  },
  lg: {
    button: 'h-12 px-5 gap-2.5 text-base rounded-xl',
    icon: 'w-6 h-6',
    counter: 'text-base font-bold',
  },
};

// Custom arrow icon with better proportions
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

export function UpvoteButton({
  postId,
  initialUpvotes = 0,
  initialIsUpvoted = false,
  className,
  showCount = true,
  size = 'md',
  enableParticles = true,
}: UpvoteButtonProps) {
  const { upvotes, isUpvoted, loading, toggle } = useUpvote({
    postId,
    initialUpvotes,
    initialIsUpvoted,
  });

  const [particles, setParticles] = useState<Array<{ id: number; style: React.CSSProperties; color: string }>>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentSize = sizeConfig[size];

  const createParticles = () => {
    if (!enableParticles || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newParticles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
      const velocity = 40 + Math.random() * 30;
      const color = themeColors.particles[Math.floor(Math.random() * themeColors.particles.length)];

      return {
        id: Date.now() + i,
        color,
        style: {
          left: centerX,
          top: centerY,
          '--tx': `${Math.cos(angle) * velocity}px`,
          '--ty': `${Math.sin(angle) * velocity - 20}px`,
        } as React.CSSProperties,
      };
    });

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (loading) return;

    setIsPressed(true);
    setShowRipple(true);
    
    setTimeout(() => setIsPressed(false), 150);
    setTimeout(() => setShowRipple(false), 400);

    const wasUpvoted = isUpvoted;
    await toggle();

    // Create particles only when upvoting (not removing upvote)
    if (!wasUpvoted) {
      createParticles();
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={loading}
      aria-pressed={isUpvoted}
      aria-label={isUpvoted ? 'Remove upvote' : 'Upvote this post'}
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center font-medium',
        'border backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        'active:scale-95',
        'overflow-hidden',
        'select-none',
        currentSize.button,
        
        // State-based styles - Yellow/Black theme
        isUpvoted
          ? cn(
              // Active state - Yellow gradient background
              'bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-amber-400/10',
              'border-yellow-500/60',
              'text-yellow-400',
              'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
              'hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]',
              'hover:border-yellow-400/70'
            )
          : cn(
              // Inactive state - Dark background
              'bg-gray-800/80',
              'border-gray-700/50',
              'text-gray-400',
              'hover:border-yellow-500/30',
              'hover:text-yellow-400',
              'hover:bg-gray-800'
            ),
        
        // Press animation
        isPressed && 'scale-90',
        
        className
      )}
    >
      {/* Gradient overlay for active state */}
      {isUpvoted && (
        <span className="absolute inset-0 opacity-20 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-400" />
      )}

      {/* Ripple effect */}
      {showRipple && (
        <span
          className={cn(
            'absolute inset-0 animate-ripple rounded-inherit',
            isUpvoted ? 'bg-yellow-400/30' : 'bg-yellow-500/20'
          )}
        />
      )}

      {/* Icon with animation */}
      <span
        className={cn(
          'relative z-10 transition-all duration-300',
          isUpvoted && 'animate-bounce-once',
          loading && 'animate-pulse'
        )}
      >
        <UpvoteIcon
          className={cn(
            currentSize.icon,
            'transition-all duration-300',
            isUpvoted && 'fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]'
          )}
          filled={isUpvoted}
        />
      </span>

      {/* Counter with animation */}
      {showCount && (
        <span className={cn('relative z-10', currentSize.counter)}>
          <AnimatedCounter value={upvotes} />
        </span>
      )}

      {/* Particles */}
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          style={particle.style}
          color={particle.color}
        />
      ))}

      {/* Shimmer effect on hover */}
      <span
        className={cn(
          'absolute inset-0 -translate-x-full',
          'bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent',
          'transition-transform duration-700',
          'group-hover:translate-x-full'
        )}
      />
    </button>
  );
}

// Compact variant for tight spaces - Yellow/Black theme
export function UpvoteButtonCompact({
  postId,
  initialUpvotes = 0,
  initialIsUpvoted = false,
  className,
}: Omit<UpvoteButtonProps, 'size' | 'showCount' | 'enableParticles'>) {
  const { upvotes, isUpvoted, loading, toggle } = useUpvote({
    postId,
    initialUpvotes,
    initialIsUpvoted,
  });

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading) await toggle();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-pressed={isUpvoted}
      className={cn(
        'group flex flex-col items-center gap-0.5 p-2 rounded-xl',
        'transition-all duration-200',
        'hover:bg-gray-800/50',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50',
        className
      )}
    >
      <span
        className={cn(
          'p-1.5 rounded-lg transition-all duration-300',
          isUpvoted
            ? 'bg-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
            : 'group-hover:bg-gray-700/50'
        )}
      >
        <UpvoteIcon
          className={cn(
            'w-5 h-5 transition-all duration-300',
            isUpvoted
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-400 group-hover:text-yellow-400'
          )}
          filled={isUpvoted}
        />
      </span>
      <span
        className={cn(
          'text-xs font-semibold tabular-nums transition-colors duration-200',
          isUpvoted ? 'text-yellow-400' : 'text-gray-500'
        )}
      >
        {upvotes}
      </span>
    </button>
  );
}

// Icon-only variant - Yellow/Black theme
export function UpvoteButtonIcon({
  postId,
  initialUpvotes = 0,
  initialIsUpvoted = false,
  className,
  size = 'md',
}: Omit<UpvoteButtonProps, 'showCount' | 'enableParticles'>) {
  const { isUpvoted, loading, toggle } = useUpvote({
    postId,
    initialUpvotes,
    initialIsUpvoted,
  });

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const iconSizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading) await toggle();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-pressed={isUpvoted}
      className={cn(
        'relative rounded-full flex items-center justify-center',
        'border backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2',
        'active:scale-90',
        sizeMap[size],
        isUpvoted
          ? cn(
              'bg-gradient-to-br from-yellow-500/20 to-amber-500/10',
              'border-yellow-500/60',
              'text-yellow-400',
              'shadow-[0_0_20px_rgba(234,179,8,0.3)]'
            )
          : cn(
              'bg-gray-800/80',
              'border-gray-700/50',
              'text-gray-400',
              'hover:border-yellow-500/30',
              'hover:text-yellow-400'
            ),
        className
      )}
    >
      <UpvoteIcon
        className={cn(
          iconSizeMap[size],
          'transition-all duration-300',
          isUpvoted && 'fill-yellow-400',
          loading && 'animate-pulse'
        )}
        filled={isUpvoted}
      />
    </button>
  );
}

export default UpvoteButton;
