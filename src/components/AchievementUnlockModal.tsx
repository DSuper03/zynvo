'use client';

import React, { useEffect, useRef } from 'react';
import { Trophy, Share2, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AchievementUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeName: string;
  badgeIcon?: React.ReactNode;
  achievementCount: number;
  description: string;
  shareText?: string;
}

const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  isOpen,
  onClose,
  badgeName,
  badgeIcon,
  achievementCount,
  description,
  shareText,
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

    const createParticles = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < 100; i++) {
        const angle = (Math.PI * 2 * i) / 100;
        const velocity = 6 + Math.random() * 6;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 2,
          life: 1,
          size: 10 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          type: ['confetti', 'star'][Math.floor(Math.random() * 2)],
        });
      }

      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 10 + Math.random() * 8;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 0.8,
          size: 5 + Math.random() * 5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          type: 'cracker',
        });
      }
    };

    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00BFFF', '#32CD32', '#FF1493', '#00FF00'];

    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.life;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);

      const color = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillStyle = color;

      if (particle.type === 'star') {
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
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
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

  const handleShare = async () => {
    const text = shareText || `🏆 I just unlocked the "${badgeName}" badge on Zynvo! I've created ${achievementCount} amazing events. Join me and build our campus community! 🎉`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Zynvo Achievement Unlocked!',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Achievement text copied to clipboard!');
    }
  };

  const handleDownloadBadge = () => {
    // Create a simple badge image and download
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#FFF8DC';
      ctx.fillRect(0, 0, 400, 400);

      // Border
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, 380, 380);

      // Badge name
      ctx.fillStyle = '#000';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(badgeName, 200, 100);

      // Achievement text
      ctx.fillStyle = '#333';
      ctx.font = '24px Arial';
      ctx.fillText(`${achievementCount} Events Created`, 200, 150);

      // Download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `zynvo-badge-${badgeName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      <div className="fixed inset-0 flex items-center justify-center pointer-events-auto">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-12 shadow-2xl border-2 border-yellow-400 max-w-md w-full mx-4 animate-in fade-in scale-in duration-500 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Main Content */}
          <div className="text-center space-y-6">
            {/* Trophy/Badge Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative z-10 text-6xl drop-shadow-lg">
                🏆
              </div>
            </div>

            {/* Achievement Title */}
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300 mb-2">
                Congratulations! 🎉
              </h2>
              <p className="text-2xl font-bold text-yellow-400">
                {badgeName}
              </p>
            </div>

            {/* Achievement Stats */}
            <div className="bg-black/50 rounded-lg p-4 border border-yellow-400/30">
              <p className="text-gray-300 text-sm mb-2">You've unlocked:</p>
              <p className="text-3xl font-bold text-yellow-400">
                {achievementCount} Events
              </p>
              <p className="text-gray-400 text-sm mt-2">{description}</p>
            </div>

            {/* Achievement Badge Display */}
            <div className="grid grid-cols-3 gap-3 py-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-3 flex flex-col items-center justify-center border-2 border-yellow-300">
                <span className="text-3xl mb-1">⭐</span>
                <span className="text-xs font-bold text-black">UNLOCKED</span>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 flex flex-col items-center justify-center border-2 border-purple-400">
                <span className="text-3xl mb-1">🎖️</span>
                <span className="text-xs font-bold text-white">VERIFIED</span>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-3 flex flex-col items-center justify-center border-2 border-cyan-400">
                <span className="text-3xl mb-1">🚀</span>
                <span className="text-xs font-bold text-white">LEGEND</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleShare}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share on Social Media
              </Button>

              <Button
                onClick={handleDownloadBadge}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Badge
              </Button>

              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Awesome! 🚀
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-6 left-6 text-3xl animate-spin" style={{ animationDuration: '4s' }}>
            ✨
          </div>
          <div className="absolute bottom-6 right-6 text-3xl animate-pulse">
            🎊
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementUnlockModal;
