"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiHeart, FiShare2 } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export interface EventCardProps {
  event: {
    id: string | number;
    title: string;
    date: Date;
    location?: string;
    imageUrl: string;
    attendees?: number;
    clubName?: string;
    clubId?: string;
    category?: string;
    isFeatured?: boolean;
    time?: string;
    description?: string;
  };
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function EventCard({ event, variant = 'default', className }: EventCardProps) {
  const {
    id,
    title,
    date,
    location,
    imageUrl,
    attendees,
    clubName,
    category,
    isFeatured,
    time,
    description
  } = event;

  const [isLiked, setIsLiked] = React.useState(false);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description || `Join us for ${title}`,
        url: window.location.origin + `/events/${id}`,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.origin + `/events/${id}`);
      // You might want to add a toast notification here
    }
  };

  // Variants
  if (variant === 'compact') {
    return (
      <Link href={`/events/${id}`} className="block w-full">
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300",
            className
          )}
        >
          <div className="flex items-center h-full">
            <div className="relative h-16 w-16 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col p-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                {title}
              </h3>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <FiCalendar className="h-3 w-3 mr-1" />
                <span>{format(date, 'MMM d, yyyy')}</span>
                {time && (
                  <>
                    <span className="mx-1 opacity-50">•</span>
                    <FiClock className="h-3 w-3 mr-1" />
                    <span>{time}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/events/${id}`} className="block w-full">
        <motion.div
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300",
            className
          )}
        >
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            
            <div className="absolute top-3 left-3 flex space-x-2">
              {isFeatured && (
                <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
              {category && (
                <span className="px-2 py-1 bg-white/90 text-gray-800 text-xs font-medium rounded-full">
                  {category}
                </span>
              )}
            </div>
            
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <div className="px-2 py-1 bg-primary-600/90 text-white text-xs font-semibold rounded-full inline-flex w-fit">
                  {format(date, 'MMM d')}
                </div>
                {time && (
                  <div className="px-2 py-1 bg-gray-900/80 text-white text-xs font-medium rounded-full inline-flex items-center w-fit">
                    <FiClock className="mr-1 h-3 w-3" />
                    {time}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {title}
            </h3>
            
            {description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {description}
              </p>
            )}
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {location && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FiMapPin className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-500" />
                    <span className="truncate max-w-[150px]">{location}</span>
                  </div>
                )}
                {attendees !== undefined && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FiUsers className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-500" />
                    <span>{attendees}</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleLike}
                  className={cn(
                    "p-1.5 rounded-full",
                    isLiked 
                      ? "text-red-500 bg-red-50 dark:bg-red-900/20" 
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <FiHeart className={cn("h-4 w-4", isLiked && "fill-red-500")} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiShare2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
          
          {clubName && (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {clubName}
              </div>
              <Link href={`/events/${id}`}>
                <motion.span
                  whileHover={{ x: 2 }}
                  className="text-xs font-medium text-primary-600 dark:text-primary-400"
                >
                  View Details
                </motion.span>
              </Link>
            </div>
          )}
        </motion.div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/events/${id}`} className="block w-full">
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300",
          className
        )}
      >
        <div className="relative h-40 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {category && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full">
              {category}
            </div>
          )}
          
          <div className="absolute bottom-3 left-3">
            <div className="px-2 py-1 bg-primary-600/90 text-white text-xs font-semibold rounded-full">
              {format(date, 'MMM d')}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {title}
          </h3>
          
          <div className="mt-3 flex flex-wrap gap-y-2 text-sm text-gray-600 dark:text-gray-400">
            {time && (
              <div className="flex items-center mr-4">
                <FiClock className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-500" />
                <span>{time}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center">
                <FiMapPin className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-500" />
                <span className="truncate max-w-[150px]">{location}</span>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            {clubName ? (
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {clubName}
              </div>
            ) : (
              <div></div>
            )}
            {attendees !== undefined && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <FiUsers className="h-3.5 w-3.5 mr-1" />
                <span>{attendees} attending</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLike}
              className={cn(
                "p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
                isLiked ? "text-red-500" : "text-gray-700 dark:text-gray-300"
              )}
            >
              <FiHeart className={cn("h-3.5 w-3.5", isLiked && "fill-red-500")} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300"
            >
              <FiShare2 className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default EventCard;