'use client';

import React, { useEffect, useRef } from 'react';
import { Trophy, Star } from 'lucide-react';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      type: string;
    }

    const particles: Particle[] = [];

    // Create particles
    const createParticles = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Create confetti particles
      for (let i = 0; i < 80; i++) {
        const angle = (Math.PI * 2 * i) / 80;
        const velocity = 5 + Math.random() * 5;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 2,
          life: 1,
          size: 8 + Math.random() * 8,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          type: ['confetti', 'star'][Math.floor(Math.random() * 2)],
        });
      }

      // Create crackers (fast particles)
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 8 + Math.random() * 6;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 0.8,
          size: 4 + Math.random() * 4,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          type: 'cracker',
        });
      }
    };

    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00BFFF', '#32CD32', '#FF1493'];

    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.life;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);

      const color = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      if (particle.type === 'star') {
        // Draw star
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const x = Math.cos(angle) * particle.size;
          const y = Math.sin(angle) * particle.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else if (particle.type === 'cracker') {
        // Draw small circle
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw confetti rectangle
        ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
      }

      ctx.restore();
    };

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.life -= 0.01;
        p.rotation += p.rotationSpeed;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          drawParticle(p);
        }
      }

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    createParticles();
    animate();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Achievement Modal */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-auto">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-12 shadow-2xl border border-yellow-500/50 max-w-md w-full mx-4 animate-in fade-in scale-in duration-500">
          {/* Trophy Icon with Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50 animate-pulse" />
              <Trophy className="w-20 h-20 text-yellow-400 relative z-10 animate-bounce" />
            </div>
          </div>

          {/* Success Text */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300 mb-3">
              Wooh! 🎉
            </h2>
            <p className="text-xl text-white font-semibold mb-2">
              You've Successfully Registered!
            </p>
            <p className="text-gray-300 mb-6">
              for <span className="text-yellow-400 font-bold">{eventName}</span>
            </p>

            {/* Achievement Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 flex flex-col items-center justify-center">
                <Star className="w-5 h-5 text-white mb-1" />
                <span className="text-xs text-white font-semibold">Registered</span>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 flex flex-col items-center justify-center">
                <Trophy className="w-5 h-5 text-white mb-1" />
                <span className="text-xs text-white font-semibold">Achiever</span>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-3 flex flex-col items-center justify-center">
                <span className="text-xl mb-1">⚡</span>
                <span className="text-xs text-white font-semibold">Ready!</span>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <p className="text-green-400 text-sm font-medium">
                ✓ You are all set for this exciting event ahead. Keep an eye on your email for further updates!
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Let's Go! 🚀
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 text-2xl animate-spin" style={{ animationDuration: '3s' }}>
            ✨
          </div>
          <div className="absolute bottom-4 left-4 text-2xl animate-pulse">
            🎊
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCelebration;
