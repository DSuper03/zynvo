'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMicrophone,
  FaPlus,
  FaTimes,
} from 'react-icons/fa';
import Image from 'next/legacy/image';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import AddSpeakerModal from '../speakers/AddSpeakerModal';

interface speakers {
  id: number;
  email: string;
  name: string;
  profilePic: string | null;
  about: string;
  eventId: string;
}

interface speakerResponse {
  msg: string;
  speakers: speakers[];
}

interface SpeakersModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export default function SpeakersModal({
  isOpen,
  onClose,
  eventId,
}: SpeakersModalProps) {
  const [founder, setFounder] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get token on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  // Fetch speakers using TanStack Query
  const {
    data: speakersData,
    isLoading,
  } = useQuery<speakerResponse>({
    queryKey: ['speakers', eventId],
    queryFn: async () => {
      if (!eventId || !token) throw new Error('Missing id or token');
      const res = await axios.get<speakerResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/getSpeakers?id=${eventId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!eventId && !!token && isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const speakers = speakersData?.speakers || [];

  // Check if user is founder
  useEffect(() => {
    if (!eventId || !token || !isOpen) return;

    async function checkFounderStatus() {
      try {
        const checkFounder = await axios.get<{ msg: string }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/isFounder?id=${eventId}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          checkFounder.status === 200 &&
          checkFounder.data.msg === 'identified'
        ) {
          setFounder(true);
        }
      } catch (error) {
        console.error('Error checking founder status:', error);
      }
    }

    checkFounderStatus();
  }, [eventId, token, isOpen]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border-2 border-yellow-500/30 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center">
                  <FaMicrophone className="text-black text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Speakers & Judges
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Learn from industry experts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {founder && (
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add Speaker
                  </Button>
                )}
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-yellow-400 text-xl">Loading speakers...</div>
                </div>
              ) : speakers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No speakers added yet.</p>
                  {founder && (
                    <Button
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-4 px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all"
                    >
                      Add First Speaker
                    </Button>
                  )}
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {speakers.map((speaker) => (
                    <motion.div
                      key={speaker.id}
                      variants={itemVariants}
                      className="bg-black border-2 border-yellow-500/20 rounded-xl overflow-hidden hover:border-yellow-400 transition-all duration-500 group"
                    >
                      <div className="h-48 relative overflow-hidden">
                        <div className="absolute inset-0 bg-yellow-400/20 group-hover:bg-yellow-400/10 transition-all duration-500"></div>
                        <Image
                          src={
                            speaker.profilePic || 'https://i.pravatar.cc/300?img=11'
                          }
                          width={400}
                          height={300}
                          alt={speaker.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
                        />
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {speaker.name}
                        </h3>
                        <p className="text-yellow-400 font-medium mb-3 text-sm">
                          {speaker.email}
                        </p>

                        <p className="text-gray-300 mb-4 text-sm line-clamp-2">
                          {speaker.about}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <span className="bg-gray-800 text-yellow-400 text-xs font-medium px-2 py-1 rounded-full">
                            Speaker & Judge
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Add Speaker Modal */}
          <AddSpeakerModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            eventId={eventId}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

