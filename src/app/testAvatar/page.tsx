'use client';

import { useState, useEffect } from 'react';

const AvatarGenerator = () => {
  const [name, setName] = useState('');
  const [seed, setSeed] = useState('');
  const [style, setStyle] = useState('lorelei');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Available DiceBear styles
  const avatarStyles = [
    'lorelei',
    'notionists',
    'avataaars',
    'bottts',
    'pixel-art',
    'identicon',
    'initials',
    'micah',
  ];

  // Generate a random seed for regeneration
  const generateRandomSeed = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  // Update the avatar URL when name, seed, or style changes
  useEffect(() => {
    // Use name as seed if available, otherwise use random seed
    const currentSeed = name.trim() ? name : seed || generateRandomSeed();
    const url = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(currentSeed)}`;
    setAvatarUrl(url);
  }, [name, seed, style]);

  // Handle regenerate button click
  const handleRegenerate = () => {
    setSeed(generateRandomSeed());
  };

  // Handle style change
  const handleStyleChange = (e: any) => {
    setStyle(e.target.value);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Create Your Avatar</h2>

      {/* Name input */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Style selector */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar Style
        </label>
        <select
          value={style}
          onChange={handleStyleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {avatarStyles.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Avatar preview */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 relative">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-full h-full rounded-full border-4 border-gray-200"
            />
          )}
          <button
            onClick={handleRegenerate}
            className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Click the button to regenerate your avatar
        </p>
      </div>

      {/* Avatar URL (for developers) */}
      <div className="w-full text-xs text-gray-500 bg-gray-100 p-2 rounded overflow-x-auto">
        <p className="font-mono">{avatarUrl}</p>
      </div>

      {/* Save button for signup form */}
      <button className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Continue with Signup
      </button>
    </div>
  );
};

export default AvatarGenerator;
