'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Sparkles, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWarmup } from './WarmupProvider';

const ProfileHeader = () => {
  const router = useRouter();
  const { userData, loading } = useWarmup();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-gray-800/50 overflow-hidden">
          <div className="p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-700 rounded w-48"></div>
                <div className="h-4 bg-gray-700 rounded w-32"></div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = userData.name?.split(' ')[0] || 'Guest';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-6"
    >
      <Card className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 overflow-hidden group">
        {/* Animated background gradient */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 rounded-full blur-3xl -z-10"
        />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            {/* Left side: Avatar and Info */}
            <div className="flex items-center gap-4 flex-1">
              {/* Avatar with click handler */}
              <motion.button
                onClick={() => router.push('/dashboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group/avatar"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(234, 179, 8, 0.3)',
                      '0 0 30px rgba(234, 179, 8, 0.5)',
                      '0 0 20px rgba(234, 179, 8, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-yellow-500/50 group-hover/avatar:ring-yellow-400 transition-all duration-300"
                >
                  {userData.profileAvatar ? (
                    <Image
                      src={userData.profileAvatar}
                      alt={userData.name || 'User'}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                    </div>
                  )}
                </motion.div>
                
                {/* Hover indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.div>
              </motion.button>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span className="text-sm text-gray-400 font-medium">
                    {getGreeting()}
                  </span>
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent truncate"
                >
                  {firstName}!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-400 mt-1 hidden sm:block"
                >
                  Welcome back to your feed
                </motion.p>
              </div>
            </div>

            {/* Right side: Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden md:flex flex-col gap-2"
            >
              <Badge 
                variant="outline" 
                className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors cursor-pointer"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Active
              </Badge>
              <Badge 
                variant="outline" 
                className="bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-colors cursor-pointer"
              >
                <Award className="w-3 h-3 mr-1" />
                Member
              </Badge>
            </motion.div>
          </div>

          {/* Bottom Section: Quick Actions or Stats (Mobile visible) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-1 group"
              >
                <span>View Profile</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="flex gap-2 md:hidden">
              <Badge 
                variant="outline" 
                className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400 text-xs"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>
    </motion.div>
  );
};

export default ProfileHeader;


