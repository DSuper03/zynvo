'use client';
import { collegesWithClubs } from '@/components/colleges/college';
import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Camera,
  Trash2,
  Send,
  Award,
  School,
  Search,
} from 'lucide-react';
import Image from 'next/image';
import { MagicCard } from '@/components/magicui/magic-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Form state
  const [postText, setPostText] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // College selection modal state
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (images.length + filesArray.length > 4) {
        alert('You can only upload up to 4 images');
        return;
      }

      setImages((prevImages) => [...prevImages, ...filesArray]);

      // Create preview URLs for new images
      const newPreviewUrls = filesArray.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    // Revoke URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  // Submit post
  const handleSubmit = () => {
    if (!postText.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log({
        text: postText,
        club: selectedClub,
        college: selectedCollege,
        images,
      });

      setIsSubmitting(false);
      onClose();

      // Reset form
      setPostText('');
      setSelectedClub('');
      setSelectedCollege('');
      setImages([]);
      setPreviewUrls([]);
    }, 1000);
  };

  // Filter colleges based on search
 const filteredColleges = collegesWithClubs.filter((college) =>
  college.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  // Open college modal and focus search input
  const openCollegeModal = () => {
    setIsCollegeModalOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // Select a college and close modal
  const selectCollege = (college: string) => {
    setSelectedCollege(college);
    setIsCollegeModalOpen(false);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70">
      <div className="flex min-h-full justify-center p-4 text-center items-end sm:items-center">
        <MagicCard className="group relative bg-gray-900 rounded-xl w-full max-w-lg transition-all duration-300 hover:scale-[1.01] border border-transparent hover:border-transparent">
          <div className="absolute inset-0 rounded-xl -z-10 bg-gray-900" />

          {/* Gradient border effect */}
          <div
            className="absolute -z-10 inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'linear-gradient(90deg, #ff5bff 0%, #ff3131 50%, #38ff4c 100%)',
              padding: '1px',
              maskImage:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
            }}
          />

          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-gray-900 border-b border-yellow-500/30 p-4 flex justify-between items-center">
            <h2 className="text-2xl font-extrabold text-white">Create Post</h2>
            <Button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Modal Body */}
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {/* Post Content */}
            <div className="mb-4">
              <Textarea
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white p-4 rounded-lg focus:outline-none resize-none"
                placeholder="What's on your mind?"
                rows={5}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              ></Textarea>
            </div>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div
                className={`grid ${previewUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mb-4`}
              >
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-red-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Controls */}
            <div className="flex items-center justify-between border-t border-b border-gray-700 py-3 mb-4">
              <span className="text-gray-400 text-sm">Add to your post</span>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    document.getElementById('image-upload')?.click()
                  }
                  className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-yellow-500/10"
                  disabled={images.length >= 4}
                >
                  <ImageIcon size={20} />
                </button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-yellow-500/10">
                  <Camera size={20} />
                </button>
              </div>
            </div>

            {/* Tag Options */}
            <div className="space-y-4">
              {/* College Selection */}
              <div>
                <Label className="text-sm font-medium text-yellow-400 mb-1 flex items-center">
                  <School size={16} className="mr-1" />
                  Select a College
                </Label>
                <select
                  value={selectedCollege}
                  onChange={(e) => {
                    setSelectedCollege(e.target.value);
                    setSelectedClub(''); // Reset club selection when college changes
                  }}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                >
                  <option value="">Select a college</option>
                  {collegesWithClubs.map((college) => (
                    <option key={college.name} value={college.name}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Club Selection */}
              <div>
                <Label className="text-sm font-medium text-yellow-400 mb-1 flex items-center">
                  <Award size={16} className="mr-1" />
                  Select a Club
                </Label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                  disabled={!selectedCollege} // Disable if no college is selected
                >
                  <option value="">Select a club</option>
                  {selectedCollege &&
                    collegesWithClubs
                      .find((college) => college.name === selectedCollege)
                      ?.clubs.map((club) => (
                        <option key={club} value={club}>
                          {club}
                        </option>
                      ))}
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-yellow-500/30 p-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !postText.trim()}
              className={`px-6 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors flex items-center ${
                isSubmitting || !postText.trim()
                  ? 'opacity-70 cursor-not-allowed'
                  : ''
              }`}
            >
              <Send size={19} className="mr-2" />
              {isSubmitting ? 'Zyncing It...' : 'Zync It'}
            </button>
          </div>
        </MagicCard>
      </div>

      {/* College Selection Modal */}
      {isCollegeModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 border border-yellow-500/30 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-yellow-500/30 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">
                Select a College
              </h3>
              <Button
                onClick={() => {
                  setIsCollegeModalOpen(false);
                  setSearchQuery('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search colleges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                />
              </div>

              <div className="max-h-72 overflow-y-auto pr-1">
                {filteredColleges.length > 0 ? (
                  <ul className="space-y-1">
                    {filteredColleges.map((collegeWithClubs, ) => (
                      <li key={collegeWithClubs.name}>
                        <Button
                          onClick={() => selectCollege(collegeWithClubs.name)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors flex items-center"
                        >
                          <span className="line-clamp-1">{collegeWithClubs.name}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No colleges found matching your search
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostModal;