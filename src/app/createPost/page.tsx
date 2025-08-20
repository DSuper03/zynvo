'use client';

import { useState, useEffect } from 'react';
import { Camera, Trash2, Send, Award, School } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
export default function CreatePostModal() {
  const [postText, setPostText] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [previewUrls, setPreviewUrls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

 
  useEffect(() => {
    // This would normally load an actual image from public folder
    // Here we're just simulating the loading with a timeout
    const timer = setTimeout(() => {
      setBgLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // we will fetch all the clubs and colleges from db in useEffect and list it here.
  const clubs = [
    'Photography Club',
    'Chess Club',
    'Debate Society',
    'Dance Crew',
    'Coding Club',
    'Music Band',
    'Environmental Club',
    'Sports Club',
    'Art Society',
    'Drama Club',
  ];

  const colleges = [
    'Engineering College',
    'Business School',
    'Medical College',
    'Fine Arts Academy',
    'Law School',
    'Science College',
    'Liberal Arts College',
    'Architecture School',
    'Design Institute',
    'Education College',
  ];

  const handleImageUpload = (e: any) => {
    if (images.length >= 4) {
      alert('Maximum 4 images allowed');
      return;
    }

    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages([...images, ...files]);

      // Create preview URLs
      const newPreviewUrls = files.map((file: any) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: any) => {
    const newImages = [...images];
    const newPreviewUrls = [...previewUrls];

    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = (e: any) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log({
        postText,
        selectedClub,
        selectedCollege,
        images,
      });

      // Reset form
      setPostText('');
      setSelectedClub('');
      setSelectedCollege('');
      setImages([]);
      setPreviewUrls([]);
      setIsLoading(false);

      // Success message
      alert('Post created successfully!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-700 ${bgLoaded ? 'opacity-70' : 'opacity-0'}`}
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/7d/5d/0f/7d5d0faf7adb71cf84af74c0ad47afb8.jpg')",
          filter: 'brightness(0.4)',
        }}
      ></div>

      <div className="w-full max-w-2xl bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-xl shadow-lg overflow-hidden z-10 transition-all duration-500 hover:bg-opacity-60">
        {/* Header */}
        <div className="bg-yellow-500 bg-opacity-90 p-4 flex items-center justify-between">
          <h1 className="text-black font-bold text-xl">Create New Zynvo</h1>
          <div className="bg-black bg-opacity-80 rounded-full px-4 py-1 text-yellow-500 text-sm font-semibold">
            Zynvo
          </div>
        </div>

        {/* Post creation area */}
        <div className="p-6 space-y-6">
          {/* Post content textarea */}
          <div>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's happening on campus?"
              className="w-full bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg p-4 h-32 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white resize-none"
            />
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-yellow-500 font-medium">
                <Award size={18} />
                Select Club
              </label>
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="w-full bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white appearance-none"
              >
                <option value="">Select a club</option>
                {clubs.map((club, index) => (
                  <option key={index} value={club}>
                    {club}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-yellow-500 font-medium">
                <School size={18} />
                Select College
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white appearance-none"
              >
                <option value="">Select a college</option>
                {colleges.map((college, index) => (
                  <option key={index} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-yellow-500 font-medium">
               
                Add Photos
              </label>
              <span className="text-sm text-gray-400">
                {images.length}/4 images
              </span>
            </div>

            {/* Image preview area */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      layout="fill"
                      className="object-cover opacity-80"
                    />
                    <Button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-70 rounded-full p-1 hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <div className="flex justify-center">
              <label
                className={`
                flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                ${images.length >= 4 ? 'bg-gray-700 text-gray-500' : 'bg-yellow-500 text-black hover:bg-yellow-400'}
                transition-colors font-medium
              `}
              >
                <Camera size={18} />
                Upload Images
                <input
                  type="file"
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                  disabled={images.length >= 4}
                />
              </label>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                isLoading || !postText || !selectedClub || !selectedCollege
              }
              className={`
                w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold
                ${
                  !postText || !selectedClub || !selectedCollege || isLoading
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-yellow-500 text-black hover:bg-yellow-400'
                }
                transition-all
              `}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Post Now</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-center text-gray-400 text-sm bg-black bg-opacity-30">
          Boost your campus engagement with every post!
        </div>
      </div>
    </div>
  );
}
