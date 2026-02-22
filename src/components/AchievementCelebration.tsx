'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface AchievementCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
}

const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
  isOpen,
  onClose,
  eventName,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti explosion
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Card Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm mx-auto perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* The Card */}
            <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-purple-500/5 to-blue-500/10 opacity-50" />
              
              {/* Noise Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

              {/* Shine Effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'linear',
                  repeatDelay: 1,
                }}
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
              />

              {/* Content */}
              <div className="relative p-8 flex flex-col items-center text-center">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Trophy Icon Container */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                  className="relative mb-6"
                >
                  <div className="absolute inset-0 bg-yellow-500/30 blur-2xl rounded-full" />
                  <div className="relative w-24 h-24 bg-gradient-to-b from-neutral-800 to-neutral-950 rounded-2xl border border-white/10 flex items-center justify-center shadow-xl group">
                    <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                    
                    {/* Floating particles around trophy */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-2xl border border-yellow-500/20 border-dashed"
                    />
                  </div>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-2 -right-2 bg-green-500 text-black p-1.5 rounded-full border-2 border-neutral-900"
                  >
                    <CheckCircle2 size={16} strokeWidth={3} />
                  </motion.div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2 mb-8"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium uppercase tracking-wider mb-2">
                    <Sparkles size={12} />
                    <span>Registration Confirmed</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    You're In!
                  </h2>
                  
                  <p className="text-neutral-400 text-sm leading-relaxed max-w-[260px] mx-auto">
                    You've successfully secured your spot for <span className="text-white font-medium">{eventName}</span>.
                  </p>
                </motion.div>

                {/* Ticket Stub Visual */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full bg-neutral-950/50 rounded-xl border border-white/5 p-4 mb-6 flex items-center justify-between group hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-xl">
                      🎟️
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Ticket Status</div>
                      <div className="text-sm text-white font-medium">Confirmed • 1 Attendee</div>
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-white/10" />
                  <div className="text-right">
                    <div className="text-xs text-neutral-500">ID</div>
                    <div className="text-sm font-mono text-yellow-500">#8X29</div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/10 hover:bg-white/5 text-white hover:text-white h-11 rounded-xl"
                    onClick={() => {}}
                  >
                    <Share2 size={16} className="mr-2" />
                    Share
                  </Button>
                  <Button
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-11 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all duration-300"
                    onClick={onClose}
                  >
                    Continue
                  </Button>
                </div>

                {/* Footer Tip */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 text-[10px] text-neutral-500 font-medium"
                >
                  Tip: Click on <span className="text-yellow-500 font-bold">Zynced It</span> to get your event tickets
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementCelebration;
