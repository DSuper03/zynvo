'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Building2, Calendar, Users, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface UserDetails {
  name: string | null;
  profileAvatar: string | null;
  collegeName?: string | null;
  college?: string | null;
  clubName?: string | null;
  year?: string | null;
}

const ProfileHeaderCompact = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserDetails>({
    name: null,
    profileAvatar: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get<{ user: UserDetails }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.user) {
          const user = response.data.user;
          console.log('ProfileHeaderCompact - User data received:', user);
          setUserData({
            name: user.name || null,
            profileAvatar: user.profileAvatar || null,
            collegeName: user.collegeName || user.college || undefined,
            clubName: user.clubName || undefined,
            year: user.year || undefined,
          });
        } else {
          
        }
      } catch (error) {
        console.error('ProfileHeaderCompact - Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="sm:hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-2xl border border-gray-800/50 animate-pulse"
        >
          <div className="w-12 h-12 rounded-full bg-gray-700"></div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
            <div className="h-3 bg-gray-700 rounded w-32"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  const firstName = userData.name?.split(' ')[0] || 'Guest';

  return (
    <div className="sm:hidden">
      <motion.button
        onClick={() => router.push('/dashboard')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileTap={{ scale: 0.97 }}
        className="w-full group"
      >
        <div className="relative flex items-center gap-3 p-3 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 overflow-hidden">
          {/* Background gradient animation */}
          <motion.div
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-2xl -z-10"
          />

          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-yellow-500/50 flex-shrink-0"
          >
            {userData.profileAvatar ? (
              <Image
                src={userData.profileAvatar}
                alt={userData.name || 'User'}
                width={48}
                height={48}
                className="object-cover w-full h-full"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                <User className="w-6 h-6 text-black" />
              </div>
            )}
          </motion.div>

          {/* User Info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent truncate">
                Hi, {userData.name?.split(' ')[0] || 'Guest'}!
              </h3>
            </div>
            
            <div className="space-y-0.5">
              {userData.collegeName && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Building2 className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  <span className="truncate">{userData.collegeName}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {userData.clubName && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="w-3 h-3 text-purple-400 flex-shrink-0" />
                    <span className="truncate max-w-[100px]">{userData.clubName}</span>
                  </div>
                )}
                {userData.year && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span>{userData.year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Arrow indicator */}
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>
      </motion.button>
    </div>
  );
};

export default ProfileHeaderCompact;


