'use client';

import React, { useState } from 'react';
import { X, Image as ImageIcon, Camera, Trash2, Send, Award, School } from 'lucide-react';
import Image from 'next/image';
import { MagicCard } from '@/components/magicui/magic-card';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectGroup } from '@radix-ui/react-select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast, Toaster } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [postText, setPostText] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with actual data from your API
  const clubs = [
    'Photography Club',
    'Chess Club',
    'Debate Society',
    'Dance Crew',
    'Coding Club',
  ];

  const colleges = [
    'University of Technology',
    'State University',
    'Engineering College',
    'Arts & Science College',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (images.length + filesArray.length > 1) {
        toast('You can only upload up to 1 image');
        return;
      }

      setImages((prevImages) => [...prevImages, ...filesArray]);

      // Create preview URLs
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!postText.trim()) {
      toast('Please enter some text for your post');
      return;
    }

    setIsSubmitting(true);

    // Create form data
    const formData = new FormData();
    formData.append('text', postText);
    if (selectedClub) formData.append('club', selectedClub);
    if (selectedCollege) formData.append('college', selectedCollege);
    images.forEach((image) => {
      formData.append('images', image);
    });

    // Simulate API call
    setTimeout(() => {
      console.log('Post submitted:', {
        text: postText,
        club: selectedClub,
        college: selectedCollege,
        imageCount: images.length,
      });
      setIsSubmitting(false);
      
      // Reset form
      setPostText('');
      setSelectedClub('');
      setSelectedCollege('');
      setImages([]);
      setPreviewUrls([]);
      
      onClose();
    }, 1000);
  };

  if (!isOpen) { return null; }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70">
      <Card className="flex min-h-full items-center justify-center p-4 bg-transparent border-0 shadow-none">
        <MagicCard 
          className="group relative bg-gray-900 rounded-xl w-full max-w-2xl transition-all duration-300 hover:scale-[1.01] border border-transparent hover:border-transparent"
        >
          <div className="absolute inset-0 rounded-xl -z-10 bg-gray-900" />
          
          {/* Gradient border effect */}
          <div 
            className="absolute -z-10 inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(90deg, #ff5bff 0%, #ff3131 50%, #38ff4c 100%)",
              padding: "1px",
              maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
            }}
          />

          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-gray-900 border-b border-yellow-500/30 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Create Post</h2>
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
              <div className={`grid ${previewUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mb-4`}>
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full"
                      width={300}
                      height={200}
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
                <Button
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-yellow-500/10"
                  disabled={images.length >= 4}
                >
                  <ImageIcon size={20} />
                </Button>
                <Input
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Club Selection */}
              <div>
                <Label className=" text-sm font-medium text-yellow-400 mb-1 flex items-center">
                  <Award size={16} className="mr-1" />
                  Tag a Club
                </Label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                >
                  <option value="">Select club (optional)</option>
                  {clubs.map((club) => (
                    <option key={club} value={club}>
                      {club}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* College Selection */}
              <div>
                <Label className=" text-sm font-medium text-yellow-400 mb-1 flex items-center">
                  <School size={16} className="mr-1" />
                  Tag a College
                </Label>
                <Select
                
                >
               
                <SelectTrigger>

                 <SelectValue placeholder="Select college (optional)" />
                 <SelectGroup>
                   {colleges.map((college) => (
                     <SelectItem key={college} value={college}>
                       {college}
                     </SelectItem>
                   ))}
                 </SelectGroup>
                </SelectTrigger>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-yellow-500/30 p-4 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !postText.trim()}
              className={`px-6 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors flex items-center ${
                isSubmitting || !postText.trim() ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Send size={16} className="mr-2" />
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </MagicCard>
      </Card>
    </div>
  );
};

export default CreatePostModal;