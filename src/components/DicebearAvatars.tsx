// DiceBearAvatar.js
import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import Image from 'next/image';

const DiceBearAvatar = ({
  name,
  onAvatarChange,
}: {
  name: any;
  onAvatarChange: any;
}) => {
  const [avatarStyle, setAvatarStyle] = useState('lorelei');
  const [randomSeed, setRandomSeed] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [useNameAsSeed, setUseNameAsSeed] = useState(true);

  // Available DiceBear styles that work well with your theme
  const avatarStyles = [
    'lorelei',
    'avataaars',
    'bottts',
    'pixel-art',
    'micah',
    'notionists',
  ];

  // Generate a random seed for avatar regeneration
  const generateRandomSeed = useCallback(() => {
    return Math.random().toString(36).substring(2, 10);
  }, []);

  // Initialize random seed only once when component mounts
  useEffect(() => {
    if (!randomSeed) {
      const initialSeed = Math.random().toString(36).substring(2, 10);
      setRandomSeed(initialSeed);
    }
  }, [randomSeed]);

  // Update the avatar URL when name, seed, or style changes
  useEffect(() => {
    // Use name as seed if enabled and name exists, otherwise use random seed
    const seed = (useNameAsSeed && name.trim()) ? name.trim() : (randomSeed || 'default');
    const url = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(seed)}`;
    setAvatarUrl(url);

    // Pass the avatar URL back to the parent component
    if (onAvatarChange) {
      onAvatarChange(url);
    }
  }, [name, randomSeed, avatarStyle, useNameAsSeed, onAvatarChange]);

  // Handle regenerate button click
  const handleRegenerate = () => {
    const newSeed = generateRandomSeed();
    setRandomSeed(newSeed);
    setUseNameAsSeed(false); // Switch to random mode when regenerating
    // Force update the avatar immediately
    const url = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(newSeed)}`;
    setAvatarUrl(url);
    if (onAvatarChange) {
      onAvatarChange(url);
    }
  };

  // Handle style change
  const handleStyleChange = (e: any) => {
    setAvatarStyle(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-300 text-sm font-medium">
        Profile Avatar
      </label>
      <div className="flex items-start space-x-4">
        <div className="relative group">
          {avatarUrl && (
            <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700 group-hover:border-yellow-500 transition-colors duration-200">
              <Image
                src={avatarUrl}
                alt="Profile Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <button
            type="button"
            onClick={handleRegenerate}
            className="absolute -bottom-2 -right-2 bg-yellow-500 text-black rounded-full p-2 shadow-md hover:bg-yellow-400 transition duration-300 transform hover:-translate-y-1 hover:scale-110"
            aria-label="Generate new avatar"
            title="Generate new avatar"
          >
            <FiRefreshCw size={12} />
          </button>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              Avatar Style
            </label>
            <select
              value={avatarStyle}
              onChange={handleStyleChange}
              className="bg-gray-800 text-white w-full py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700 transition-all duration-200"
            >
              {avatarStyles.map((style) => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() +
                    style.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useNameSeed"
                checked={useNameAsSeed}
                onChange={(e) => setUseNameAsSeed(e.target.checked)}
                className="h-3 w-3 rounded border-gray-700 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
              />
              <label htmlFor="useNameSeed" className="text-gray-300 text-xs">
                Use my name for avatar generation
              </label>
            </div>
            <p className="text-gray-400 text-xs">
              {useNameAsSeed && name.trim() 
                ? `Avatar generated from your name: "${name.trim()}"` 
                : useNameAsSeed 
                  ? "Avatar will be generated from your name when you enter it"
                  : "Avatar generated with random seed"
              }
            </p>
            <p className="text-gray-500 text-xs">
              Click the refresh button to generate a random avatar, or change the style above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceBearAvatar;
