'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { JoinClubModalProps } from '@/types/global-Interface';

const JoinClubModal: React.FC<JoinClubModalProps> = ({
  isOpen,
  onClose,
  clubName,
  clubImage,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    stream: '',
    year: '',
    motivation: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Join request data:', formData);
   
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-gray-900 border border-yellow-500/30 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-yellow-500/30 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Join <span className="text-yellow-400">{clubName}</span>
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex justify-center pt-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-500">
            <Image
              src={clubImage}
              alt={clubName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-yellow-400"
            >
              Full Name*
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-yellow-400"
            >
              Email Address*
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stream/Major */}
            <div className="space-y-2">
              <label
                htmlFor="stream"
                className="block text-sm font-medium text-yellow-400"
              >
                Stream/Major*
              </label>
              <input
                id="stream"
                name="stream"
                type="text"
                required
                placeholder="E.g., Computer Science"
                value={formData.stream}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
              />
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label
                htmlFor="year"
                className="block text-sm font-medium text-yellow-400"
              >
                Year of Study*
              </label>
              <select
                id="year"
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
              >
                <option value="" disabled>
                  Select your year
                </option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
                <option value="5+">Fifth Year or Beyond</option>
              </select>
            </div>
          </div>

          {/* Motivation */}
          <div className="space-y-2">
            <label
              htmlFor="motivation"
              className="block text-sm font-medium text-yellow-400"
            >
              Why do you want to join this club?
            </label>
            <textarea
              id="motivation"
              name="motivation"
              rows={3}
              placeholder="Share your motivation for joining this club (optional)"
              value={formData.motivation}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-medium transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinClubModal;
