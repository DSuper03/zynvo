// DiceBearAvatar.js
import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

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
      setRandomSeed(generateRandomSeed());
    }
  }, [generateRandomSeed, randomSeed]);

  // Update the avatar URL when name, seed, or style changes
  useEffect(() => {
    // Only proceed if we have a randomSeed (prevents initial render issues)
    if (!randomSeed && !name.trim()) return;

    const seed = name.trim() || randomSeed;
    const url = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(seed)}`;
    setAvatarUrl(url);

    // Pass the avatar URL back to the parent component
    if (onAvatarChange) {
      onAvatarChange(url);
    }
  }, [name, randomSeed, avatarStyle]); // Removed onAvatarChange from dependencies

  // Handle regenerate button click
  const handleRegenerate = () => {
    setRandomSeed(generateRandomSeed());
  };

  // Handle style change
  const handleStyleChange = (e: any) => {
    setAvatarStyle(e.target.value);
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        Profile Avatar
      </label>
      <div className="flex items-center space-x-4">
        <div className="relative">
          {avatarUrl && (
            <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-full h-full"
              />
            </div>
          )}
          <button
            type="button"
            onClick={handleRegenerate}
            className="absolute -bottom-2 -right-2 bg-yellow-500 text-black rounded-full p-2 shadow-md hover:bg-yellow-400 transition duration-300 transform hover:-translate-y-1"
            aria-label="Regenerate avatar"
          >
            <FiRefreshCw size={12} />
          </button>
        </div>
        <div className="flex-1">
          <select
            value={avatarStyle}
            onChange={handleStyleChange}
            className="bg-gray-800 text-white w-full py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
          >
            {avatarStyles.map((style) => (
              <option key={style} value={style}>
                {style.charAt(0).toUpperCase() +
                  style.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
          <p className="text-gray-400 text-xs mt-2">
            Your avatar is generated based on your name. Click the refresh
            button to get a different one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiceBearAvatar;
