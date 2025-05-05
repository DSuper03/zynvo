'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Upload, Camera } from 'lucide-react';

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateClubModal: React.FC<CreateClubModalProps> = ({ isOpen, onClose }) => {
  const [clubData, setClubData] = useState({
    clubName: '',
    description: '',
    category: '',
    founderName: '',
    facultyAdvisor: '',
    membershipCriteria: '',
    contactInfo: '',
    logo: null as File | null
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClubData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setClubData(prev => ({
        ...prev,
        logo: file
      }));
      
      // Create preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Club data to submit:', clubData);
    // After successful submission, close modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-gray-900 border border-yellow-500/30 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-yellow-500/30 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create a New Club</h2>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Logo Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-800 border-2 border-dashed border-yellow-500/50 flex items-center justify-center overflow-hidden relative">
              {previewImage ? (
                <Image 
                  src={previewImage} 
                  alt="Club logo preview" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <Camera size={40} className="text-yellow-500/70" />
              )}
            </div>
            <label htmlFor="logo-upload" className="mt-3 cursor-pointer bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center transition-colors">
              <Upload size={16} className="mr-2" />
              Upload Logo
              <input
                id="logo-upload"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="text-gray-400 text-xs mt-2">Recommended: Square image, 300x300px or larger</p>
          </div>

          {/* Club Name */}
          <div className="space-y-2">
            <label htmlFor="clubName" className="block text-sm font-medium text-yellow-400">
              Club Name*
            </label>
            <input
              id="clubName"
              name="clubName"
              type="text"
              required
              placeholder="Enter your club name"
              value={clubData.clubName}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Club Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-yellow-400">
              Club Description*
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Describe the purpose and activities of your club"
              value={clubData.description}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Category/Type */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-yellow-400">
              Category/Type*
            </label>
            <select
              id="category"
              name="category"
              required
              value={clubData.category}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            >
              <option value="" disabled>Select a category</option>
              <option value="tech">Tech & Engineering</option>
              <option value="cultural">Cultural & Arts</option>
              <option value="business">Business & Consulting</option>
              <option value="social">Social Impact</option>
              <option value="literary">Literary & Debate</option>
              <option value="design">Design & Media</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Founder/Club President Name */}
            <div className="space-y-2">
              <label htmlFor="founderName" className="block text-sm font-medium text-yellow-400">
                Founder/Club President Name*
              </label>
              <input
                id="founderName"
                name="founderName"
                type="text"
                required
                placeholder="Enter founder's name"
                value={clubData.founderName}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
              />
            </div>

            {/* Faculty Advisor */}
            <div className="space-y-2">
              <label htmlFor="facultyAdvisor" className="block text-sm font-medium text-yellow-400">
                Club Faculty Advisor*
              </label>
              <input
                id="facultyAdvisor"
                name="facultyAdvisor"
                type="text"
                required
                placeholder="Enter faculty advisor's name"
                value={clubData.facultyAdvisor}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Membership Criteria */}
          <div className="space-y-2">
            <label htmlFor="membershipCriteria" className="block text-sm font-medium text-yellow-400">
              Membership Criteria
            </label>
            <textarea
              id="membershipCriteria"
              name="membershipCriteria"
              rows={3}
              placeholder="Any specific requirements to join the club (optional)"
              value={clubData.membershipCriteria}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <label htmlFor="contactInfo" className="block text-sm font-medium text-yellow-400">
              Club Contact Information*
            </label>
            <input
              id="contactInfo"
              name="contactInfo"
              type="text"
              required
              placeholder="Email or phone number"
              value={clubData.contactInfo}
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
              Create Club
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClubModal;