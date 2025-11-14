'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import axios from 'axios';
import { X, Mail, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserResponse {
  user: {
    collegeName?: string;
    college?: string;
  };
}

const CampusReminderModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserCollege = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Check if user has already seen the modal
        const hasSeenModal = localStorage.getItem('hasSeenCampusModal');
        if (hasSeenModal === 'true') {
          setLoading(false);
          return;
        }

        const response = await axios.get<UserResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.user) {
          const user = response.data.user;
          const userCollege =
            user.collegeName || user.college || '';

          // Check if user is NOT from Techno Main Salt Lake
          if (userCollege.trim().toLowerCase() !== 'techno main salt lake') {
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserCollege();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenCampusModal', 'true');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:dsuper03.dev@gmail.com?subject=Campus Location Request&body=Hi, I would like to add my campus location to Zynvo.';
    handleClose();
  };

  if (loading) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-lg w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl overflow-hidden border border-yellow-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Animated gradient background */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-full blur-3xl"
            />

            <div className="relative p-6 space-y-4">
              {/* Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-yellow-500/20 shadow-lg">
                <Image
                  src="/modal/legomodalreminder.png"
                  alt="Campus Reminder"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Content */}
              <div className="space-y-3 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                    Your Campus Awaits! 🎓
                  </h2>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-300 text-sm leading-relaxed"
                >
                  We're excited to bring Zynvo to your campus! Help us map out your college and{' '}
                  <span className="font-semibold text-yellow-400">win amazing prizes</span> in the process.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
                >
                  <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
                    <Gift className="w-4 h-4" />
                    <span className="text-xs font-semibold">Rewards Available!</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Be among the first to add your campus and receive exclusive rewards
                  </p>
                </motion.div>
              </div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2 pt-2"
              >
                <Button
                  onClick={handleEmailClick}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Us Your Campus Details
                </Button>

                <button
                  onClick={handleClose}
                  className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
                >
                  Maybe Later
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-xs text-gray-500"
              >
                📧 Contact: <span className="text-yellow-400">dsuper03.dev@gmail.com</span>
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CampusReminderModal;

