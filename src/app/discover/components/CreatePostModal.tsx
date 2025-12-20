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
import { useRouter } from 'next/navigation';

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
  // removed duplicate effect
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (tok) setToken(tok);
      else {
         toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => router.push('/auth/signin'),
          },
        });
        return;
      }
      if (sessionStorage.getItem('activeSession') != 'true') {
         toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => router.push('/auth/signin'),
          },
        });
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
          controller.signal,
          token || undefined
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
  }, [selectedCollege, token]);

  // College selection modal state
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Client-side image compressor to keep files under 2 MB
  async function compressImageToUnder2MB(originalFile: File): Promise<File> {
    const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
    const MAX_DIMENSION = 1920; // cap long edge to 1920px for web posts

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(originalFile);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const imageEl = new window.Image();
      imageEl.onload = () => resolve(imageEl);
      imageEl.onerror = reject as any;
      imageEl.src = dataUrl;
    });

    // Determine target dimensions while preserving aspect ratio
    let targetWidth = img.width;
    let targetHeight = img.height;
    if (Math.max(img.width, img.height) > MAX_DIMENSION) {
      if (img.width >= img.height) {
        targetWidth = MAX_DIMENSION;
        targetHeight = Math.round((img.height / img.width) * targetWidth);
      } else {
        targetHeight = MAX_DIMENSION;
        targetWidth = Math.round((img.width / img.height) * targetHeight);
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, targetWidth);
    canvas.height = Math.max(1, targetHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) return originalFile;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Iteratively reduce JPEG quality until under MAX_BYTES or min quality reached
    let quality = 0.9;
    let blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    while (blob && blob.size > MAX_BYTES && quality > 0.4) {
      quality -= 0.1;
      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    }

    if (!blob) return originalFile;

    // If still too large, attempt a secondary downscale to 1280 on long edge
    if (blob.size > MAX_BYTES) {
      const scale = Math.min(1280 / canvas.width, 1280 / canvas.height, 1);
      if (scale < 1) {
        const tmp = document.createElement('canvas');
        tmp.width = Math.max(1, Math.round(canvas.width * scale));
        tmp.height = Math.max(1, Math.round(canvas.height * scale));
        const tctx = tmp.getContext('2d');
        if (tctx) {
          tctx.drawImage(canvas, 0, 0, tmp.width, tmp.height);
          quality = Math.max(quality, 0.6);
          blob = await new Promise((resolve) => tmp.toBlob(resolve, 'image/jpeg', quality));
        }
      }
    }

    if (!blob || blob.size > MAX_BYTES) {
      return originalFile; // fallback to original if compression unsuccessful
    }

    return new File([blob], originalFile.name.replace(/\.[^.]+$/, '.jpg'), {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  }

  // Image upload handler with compression to <= 2MB
  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
      const filesArray = Array.from(e.target.files);
      const maxBytes = 2 * 1024 * 1024; // 2 MB

    if (images.length + filesArray.length > 1) {
      toast('You can only upload 1 image');
        e.target.value = '';
        return;
      }

    (async () => {
      try {
        const processed = await Promise.all(
          filesArray.map(async (file) => {
            if (file.size > maxBytes) {
              const compressed = await compressImageToUnder2MB(file);
              if (compressed.size > maxBytes) {
                toast('Could not compress image under 2 MB. Try a smaller image.');
                return null;
              }
              return compressed;
            }
            return file;
          })
        );

        const validFiles = processed.filter((f): f is File => !!f);
        if (validFiles.length === 0) {
        e.target.value = '';
        return;
      }

        setImages((prevImages) => [...prevImages, ...validFiles]);
        const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
      } catch {
        toast('Failed to process image. Please try again.');
      } finally {
        // Clear the input so users can select the same file again if needed
        e.target.value = '';
    }
    })();
  };

  async function uploadImg(img: File): Promise<string> {
    try {
      console.log('Starting image upload for:', img.name);
      toast('Uploading image...');
      
      const link = await uploadImageDirectly(img, '/posts');
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
      // Upload image first if provided, then create the post with the URL
      let uploadedImageUrl = '';
      if (images.length > 0) {
        uploadedImageUrl = await uploadImg(images[0]);
      }

      const payload = {
        title,
        description: postText,
        collegeName: selectedCollege,
        clubName: selectedClub,
        image: uploadedImageUrl || imageLink || '',
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
        // Fire a local notification with title, college and club
        try {
          if (typeof window !== 'undefined' && 'Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              const titleText = title || 'New Post';
              const detail = [selectedCollege, selectedClub].filter(Boolean).join(' • ');
              const bodyText = detail || 'A new post was created.';
              if (navigator.serviceWorker) {
                const reg = await navigator.serviceWorker.getRegistration();
                if (reg && 'showNotification' in reg) {
                  reg.showNotification(`New post: ${titleText}`, {
                    body: bodyText,
                    icon: '/icons/icon-192x192.png',
                    badge: '/icons/icon-96x96.png',
                    data: { url: '/discover' },
                  });
                } else {
                  new Notification(`New post: ${titleText}`, {
                    body: bodyText,
                    icon: '/icons/icon-192x192.png',
                  });
                }
              }
            }
          }
        } catch (err) {
          console.warn('Notification error:', err);
        }
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
    } catch (error: any) {
      console.error('Post creation failed:', error);
      const maybeMsg = (error?.response?.data?.msg || error?.message || '').toString().toLowerCase();
      const notInClub = maybeMsg.includes('not a part of any club') || maybeMsg.includes('not part of any club') || error?.response?.status === 403;
      if (notInClub) {
        toast('You need to join or create a club to post.', {
          action: {
            label: 'Explore Clubs',
            onClick: () => router.push('/clubs'),
          },
        });
      } else {
      toast('Failed to create post. Please try again.');
      }
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
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-full justify-center p-4 text-center items-center">
        <MagicCard className="group relative bg-neutral-950 rounded-2xl w-full max-w-lg transition-all duration-300 border border-white/10 shadow-2xl flex flex-col max-h-[85vh]">
          <div className="absolute inset-0 rounded-2xl -z-10 bg-neutral-950" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_-20%,rgba(250,204,21,0.15),transparent)] pointer-events-none" />

          {/* Gradient border effect */}
          <div
            className="absolute -z-10 inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
          <div className="shrink-0 bg-neutral-950/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center rounded-t-2xl z-10">
            <h2 className="text-xl font-bold text-white">Create Post</h2>
            <Button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors bg-transparent hover:bg-white/5"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Modal Body */}
          <div className="p-4 overflow-y-auto flex-1 text-left">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Enter a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-800 focus:border-yellow-500/50 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <Textarea
                className="w-full bg-neutral-900/50 border border-neutral-800 focus:border-yellow-500/50 text-white p-4 rounded-xl focus:outline-none resize-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
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
                    className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-white/10"
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
                      className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 text-red-400 hover:text-red-500 hover:bg-black/90 transition-all"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Controls */}
            <div className="border-t border-b border-white/5 py-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm font-medium">Add to your post</span>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() =>
                            document.getElementById('image-upload')?.click()
                          }
                          className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-yellow-400/10 transition-colors"
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
                  <Button className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-yellow-400/10 transition-colors">
                    <Camera size={20} />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Max file size 2 MB • Only 1 image can be uploaded
              </p>
            </div>

            {/* Tag Options */}
            <div className="space-y-4">
              {/* College Selection */}
              <div>
                <Label className="text-xs font-semibold text-yellow-500/80 mb-1.5 flex items-center uppercase tracking-wider">
                  <School size={14} className="mr-1.5" />
                  Select a College
                </Label>
                <Button
                  onClick={openCollegeModal}
                  className="w-full bg-neutral-900/50 border border-neutral-800 hover:border-yellow-500/30 text-white px-4 py-2.5 rounded-xl focus:outline-none flex justify-between items-center transition-all group"
                >
                  {selectedCollege ? (
                    <span className="font-medium">{selectedCollege}</span>
                  ) : (
                    <span className="text-neutral-500">Select a college</span>
                  )}
                  <Search size={16} className="ml-2 text-neutral-500 group-hover:text-yellow-400 transition-colors" />
                </Button>
              </div>

              {/* Club Selection */}
              <div>
                <Label className="text-xs font-semibold text-yellow-500/80 mb-1.5 flex items-center uppercase tracking-wider">
                  <Award size={14} className="mr-1.5" />
                  Select a Club
                </Label>
                <div className="relative">
                  <select
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full appearance-none bg-neutral-900/50 border border-neutral-800 hover:border-yellow-500/30 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
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
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="shrink-0 bg-neutral-950/90 backdrop-blur-md border-t border-white/10 p-4 flex justify-end rounded-b-2xl z-10">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !postText.trim()}
              className={`px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:shadow-[0_0_25px_rgba(250,204,21,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center ${
                isSubmitting || !postText.trim()
                  ? 'opacity-70 cursor-not-allowed'
                  : ''
              }`}
            >
              <Send size={18} className="mr-2" />
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
