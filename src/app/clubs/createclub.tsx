'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Upload, Camera } from 'lucide-react';
import { CreateClubModalProps } from '@/types/global-Interface';
import { toast } from 'sonner';

const CreateClubModal: React.FC<CreateClubModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [clubData, setClubData] = useState({
    name: '',
    description: '',
    type: '',
    FounderEmail: '',
    facultyEmail: '',
    requirements: '',
    clubContact: '',
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setClubData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setClubData((prev) => ({
        ...prev,
        logo: file,
      }));

   
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    
    const upload = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/club`,
      clubData
    );

    const msg = upload?.data;
    if (upload.status == 200) {
      toast(`${msg} and your clubID : ${upload?.data}`);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-gray-900 border border-yellow-500/30 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-yellow-500/30 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create a New Club</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
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
            <label
              htmlFor="logo-upload"
              className="mt-3 cursor-pointer bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center transition-colors"
            >
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
            <p className="text-gray-400 text-xs mt-2">
              Recommended: Square image, 300x300px or larger
            </p>
          </div>

          {/* Club Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-yellow-400"
            >
              Club Name*
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter your club name"
              value={clubData.name}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Club Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-yellow-400"
            >
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

          {/* type/Type */}
          <div className="space-y-2">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-yellow-400"
            >
              Category/Type*
            </label>
            <select
              id="type"
              name="type"
              required
              value={clubData.type}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            >
              <option value="" disabled>
                Select a type
              </option>
              <option value="tech">Technology</option>
              <option value="cultural">Cultural</option>
              <option value="business">Business </option>
              <option value="social">Social</option>
              <option value="literary">Literature</option>
              <option value="design">Design</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Founder/Club President Name */}
            <div className="space-y-2">
              <label
                htmlFor="FounderEmail"
                className="block text-sm font-medium text-yellow-400"
              >
                Founder/Club President Email*
              </label>
              <input
                id="FounderEmail"
                name="FounderEmail"
                type="text"
                required
                placeholder="Enter founder's name"
                value={clubData.FounderEmail}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
              />
            </div>

            {/* Faculty Advisor */}
            <div className="space-y-2">
              <label
                htmlFor="facultyEmail"
                className="block text-sm font-medium text-yellow-400"
              >
                Club Faculty Advisor*
              </label>
              <input
                id="facultyEmail"
                name="facultyEmail"
                type="text"
                required
                placeholder="Enter faculty advisor's name"
                value={clubData.facultyEmail}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Membership Criteria */}
          <div className="space-y-2">
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-yellow-400"
            >
              Membership Criteria
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={3}
              placeholder="Any specific requirements to join the club (optional)"
              value={clubData.requirements}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <label
              htmlFor="clubContact"
              className="block text-sm font-medium text-yellow-400"
            >
              Club Contact Information*
            </label>
            <input
              id="clubContact"
              name="clubContact"
              type="text"
              required
              placeholder="Email or phone number"
              value={clubData.clubContact}
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
