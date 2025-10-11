'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import WrapButton from './ui/wrap-button';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'secondary',
  size = 'md',
}) => {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await installApp();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't show button if app is already installed
  if (isInstalled) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium ${className}`}
      >
        <Check className="w-4 h-4" />
        <span>App Installed</span>
      </motion.div>
    );
  }

  // Don't show button if not installable
  if (!isInstallable) {
    return null;
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm px-4 py-2';
      case 'lg':
        return 'text-lg px-8 py-4';
      default:
        return 'text-base px-6 py-3';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-lg hover:shadow-yellow-500/25';
      default:
        return 'bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-gray-500/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`
          inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-300 
          transform hover:-translate-y-1 hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${getSizeClasses()} ${getVariantClasses()} ${className}
        `}
      >
        {isInstalling ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Installing...</span>
          </>
        ) : (
          <>
            <Smartphone className="w-4 h-4" />
            <span>Download as App</span>
          </>
        )}
      </button>
    </motion.div>
  );
};

export default PWAInstallButton;
