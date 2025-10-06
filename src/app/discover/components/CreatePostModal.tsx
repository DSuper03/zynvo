'use client';
import { collegesWithClubs } from '@/components/colleges/college';
import React, { useState, useRef, useEffect } from 'react';
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
import Image from 'next/legacy/image';
import { MagicCard } from '@/components/magicui/magic-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import dotenv from 'dotenv';
import axios from 'axios';
import { toast } from 'sonner';
import { uploadImageDirectly } from '@/lib/imgkit';
import { fetchClubsByCollege } from '@/app/api/hooks/useClubs';

dotenv.config();

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
  const [clubs, setClubs] = useState<string[]>([]);
  const [settingClubs, setSettingClubs] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>('');
  const [imageLink, setImageLink] = useState<string>('');
  const [title, setTitle] = useState('');
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
  
    async function load() {
      if (!selectedCollege) {
        setClubs([]);
        return;
      }
      try {
        setSettingClubs(true);
        setSelectedClub('');
        const list = await fetchClubsByCollege(selectedCollege, controller.signal);
        if (!cancelled) setClubs(list);
      } catch {
        if (!cancelled) setClubs([]);
      } finally {
        if (!cancelled) setSettingClubs(false);
      }
    }
  
    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedCollege]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (tok) setToken(tok);
      else {
        toast('login please');
        return;
      }
      if (sessionStorage.getItem('activeSession') != 'true') {
        toast('login please');
        return;
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadClubs() {
      try {
        if (!selectedCollege) {
          setClubs([]);
          return;
        }
        setSettingClubs(true);
        setSelectedClub('');
        const list = await fetchClubsByCollege(
          selectedCollege,
          controller.signal
        );
        if (!cancelled) setClubs(list);
      } catch {
        if (!cancelled) setClubs([]);
      } finally {
        if (!cancelled) setSettingClubs(false);
      }
    }

    loadClubs();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedCollege]);

  // College selection modal state
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Image upload handler
  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const maxBytes = 2 * 1024 * 1024; // 2 MB

      // Reject if any selected file exceeds 2 MB
      const hasOversized = filesArray.some((file) => file.size > maxBytes);
      if (hasOversized) {
        toast('Image must be 2 MB or smaller');
        // Clear the input so users can reselect the file
        e.target.value = '';
        return;
      }
      if (images.length + filesArray.length > 1) {
        alert('You can only upload 1 image');
        e.target.value = '';
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

  async function uploadImg(img: File): Promise<string> {
    try {
      console.log('Starting image upload for:', img.name);
      toast('Uploading image...');
      
      const link = await uploadImageDirectly(img);
      console.log('Image uploaded successfully:', link);
      
      setImageLink(link);
      toast('Image uploaded successfully!');
      return link;
    } catch (error) {
      console.error('Image upload failed:', error);
      toast(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  // Remove an image
  const removeImage = (index: number) => {
    // Revoke URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  // Submit post
  const handleSubmit = async () => {
    if (!postText.trim()) return;

    setIsSubmitting(true);

    try {
      // Upload image if exists
      let uploadedImageUrl = '';
      if (images.length > 0) {
        uploadedImageUrl = await uploadImg(images[0]);
      }

      const payload = {
        title,
        description: postText,
        collegeName: selectedCollege,
        clubName: selectedClub,
        image: uploadedImageUrl || imageLink || '', // Use uploaded URL or existing imageLink
      };

      const submit = await axios.post<{
        msg: string;
        id: string;
      }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/create`, payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (submit.status === 200 && submit.data.id) {
        toast(`${submit.data.msg} & here is your post id : ${submit.data.id}`);
        // Reset form on success
        setPostText('');
        setTitle('');
        setSelectedClub('');
        setSelectedCollege('');
        setImages([]);
        setPreviewUrls([]);
        setImageLink('');
        onClose(); // Close modal on success
      } else {
        toast(submit.data.msg);
      }
    } catch (error) {
      console.error('Post creation failed:', error);
      toast('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter colleges based on search
  const filteredColleges = collegesWithClubs.filter((college) =>
    college.college.toLowerCase().includes(searchQuery.toLowerCase())
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
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Enter a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
              />
            </div>

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
                      width={400}
                      height={300}
                      className="object-cover"
                    />
                    <Button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-red-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Controls */}
            <div className="border-t border-b border-gray-700 py-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Add to your post</span>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() =>
                            document.getElementById('image-upload')?.click()
                          }
                          className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-yellow-500/10"
                          disabled={images.length >= 1}
                        >
                          <ImageIcon size={20} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Max file size 2 MB. Only 1 image allowed.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-yellow-500/10">
                    <Camera size={20} />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Max file size 2 MB • Only 1 image can be uploaded
              </p>
            </div>

            {/* Tag Options */}
            <div className="space-y-4">
              {/* College Selection */}
              <div>
                <Label className="text-sm font-medium text-yellow-400 mb-1 flex items-center">
                  <School size={16} className="mr-1" />
                  Select a College
                </Label>
                <Button
                  onClick={openCollegeModal}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none flex justify-between items-center"
                >
                  {selectedCollege ? (
                    <span>{selectedCollege}</span>
                  ) : (
                    <span className="text-gray-400">Select a college</span>
                  )}
                  <Search size={18} className="ml-2 text-yellow-400" />
                </Button>
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
                  disabled={!selectedCollege}
                >
                  <option value="">{settingClubs ? 'Loading clubs...' : 'Post without a club'}</option>
                  {!settingClubs && selectedCollege && clubs.length === 0 && (
                    <option value="" disabled>No clubs associated</option>
                  )}
                  {!settingClubs &&
                    clubs.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-yellow-500/30 p-4 flex justify-end">
            <Button
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
            </Button>
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
                    {filteredColleges.map((collegeWithClubs) => (
                      <li key={collegeWithClubs.college}>
                        <Button
                          onClick={() =>
                            selectCollege(collegeWithClubs.college)
                          }
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors flex items-center"
                        >
                          <span className="line-clamp-1">
                            {collegeWithClubs.college}
                          </span>
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
