'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAddSpeaker } from '@/hooks/useAddSpeaker';
import { uploadImageDirectly, compressImageToUnder2MB } from '@/lib/imgkit';
import { X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/legacy/image';

interface AddSpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export default function AddSpeakerModal({
  isOpen,
  onClose,
  eventId,
}: AddSpeakerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    about: '',
    profilePic: '',
  });
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSpeakerMutation = useAddSpeaker();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      // Compress image if needed
      const compressedFile = await compressImageToUnder2MB(file);
      setProfilePicFile(compressedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    setProfilePicFile(null);
    setProfilePicPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.about) {
      return;
    }

    try {
      setIsUploading(true);
      let profilePicUrl = formData.profilePic;

      // Upload image to ImageKit if file is selected
      if (profilePicFile) {
        const folder = `/events/${eventId}/speakers`;
        profilePicUrl = await uploadImageDirectly(profilePicFile, folder);
      }

      // Submit speaker data
      await addSpeakerMutation.mutateAsync({
        eventId,
        name: formData.name,
        email: formData.email,
        about: formData.about,
        profilePic: profilePicUrl || undefined,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        about: '',
        profilePic: '',
      });
      setProfilePicFile(null);
      setProfilePicPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onClose();
    } catch (error) {
      console.error('Error adding speaker:', error);
      // Error is already handled by the mutation's onError
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading && !addSpeakerMutation.isPending) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border-2 border-yellow-500/30 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Speaker</h3>
              <Button
                onClick={handleClose}
                disabled={isUploading || addSpeakerMutation.isPending}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Picture Upload */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Profile Picture
                </label>
                {profilePicPreview ? (
                  <div className="relative mb-2">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-yellow-400/30">
                      <Image
                        src={profilePicPreview}
                        alt="Profile preview"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleRemoveImage}
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-400 hover:text-red-300"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="profile-pic-upload"
                    />
                    <label
                      htmlFor="profile-pic-upload"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 hover:border-yellow-400/50 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </label>
                    <span className="text-gray-400 text-sm">(Optional)</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-white font-medium mb-2">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border-gray-700 text-white focus:border-yellow-400"
                  placeholder="Enter speaker name"
                  required
                  disabled={isUploading || addSpeakerMutation.isPending}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border-gray-700 text-white focus:border-yellow-400"
                  placeholder="Enter speaker email"
                  required
                  disabled={isUploading || addSpeakerMutation.isPending}
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-white font-medium mb-2">About</label>
                <Textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-800 border-gray-700 text-white focus:border-yellow-400 resize-none"
                  placeholder="Enter speaker bio/description"
                  required
                  disabled={isUploading || addSpeakerMutation.isPending}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={handleClose}
                  disabled={isUploading || addSpeakerMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading || addSpeakerMutation.isPending}
                  className="flex-1 px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading || addSpeakerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isUploading ? 'Uploading...' : 'Adding...'}
                    </>
                  ) : (
                    'Add Speaker'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

