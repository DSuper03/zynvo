'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Camera,
  Trash2,
  Send,
  Award,
  School,
  Search,
  X,
  Check,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { collegesWithClubs } from '@/components/colleges/college'; // Import colleges data

export default function CreatePostModal() {
  const [postText, setPostText] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [previewUrls, setPreviewUrls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  // New state variables for searchable dropdown
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = useState(false);
  const [collegeSearchQuery, setCollegeSearchQuery] = useState('');
  const collegeDropdownRef = useRef<HTMLDivElement>(null);

  // Extract college names from the imported data
  const collegeList = collegesWithClubs
    .map((item) => (typeof item === 'string' ? item : item.college))
    .filter(Boolean);

  // Filter colleges based on search query
  const filteredColleges = collegeSearchQuery
    ? collegeList.filter((college) =>
        college.toLowerCase().includes(collegeSearchQuery.toLowerCase())
      )
    : collegeList;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        collegeDropdownRef.current &&
        !collegeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCollegeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleImageUpload = (e: any) => {
    if (images.length >= 4) {
      alert('Maximum 4 images allowed');
      return;
    }

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const MAX_BYTES = 2 * 1024 * 1024;

    (async () => {
      const { compressImageToUnder2MB } = await import('@/lib/imgkit');
      const processed = await Promise.all(
        files.map(async (f: any) => {
          if (f.size > MAX_BYTES) {
            const c = await compressImageToUnder2MB(f);
            return c.size <= MAX_BYTES ? c : null;
          }
          return f;
        })
      );
      const valid = processed.filter(Boolean) as File[];
      if (valid.length === 0) {
        alert('Could not compress images under 2 MB. Try smaller images.');
        return;
      }
      setImages([...images, ...valid]);
      const newPreviewUrls = valid.map((file: any) => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
      e.target.value = '';
    })();
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

    // Simulate API call — DEBUG: console removed for production performance
    setTimeout(() => {
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

  // Group colleges alphabetically
  const alphabeticalColleges = useMemo(() => {
    const grouped: Record<string, string[]> = {};

    // Process all colleges
    collegeList.forEach((college) => {
      if (!college) return;
      // Get first letter and capitalize it
      const firstLetter = college.charAt(0).toUpperCase();
      // Initialize group if it doesn't exist
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      // Add college to its letter group
      grouped[firstLetter].push(college);
    });

    // Sort college names within each group
    Object.keys(grouped).forEach((letter) => {
      grouped[letter].sort((a, b) => a.localeCompare(b));
    });

    return grouped;
  }, [collegeList]);

  // Get all available letters for the alphabet bar
  const availableLetters = useMemo(
    () => Object.keys(alphabeticalColleges).sort(),
    [alphabeticalColleges]
  );

  // Function to filter colleges but keep alphabetical structure
  const getFilteredAlphabeticalColleges = () => {
    if (!collegeSearchQuery) return alphabeticalColleges;

    const filtered: Record<string, string[]> = {};

    // Filter each letter group
    Object.entries(alphabeticalColleges).forEach(([letter, colleges]) => {
      const matchingColleges = colleges.filter((college) =>
        college.toLowerCase().includes(collegeSearchQuery.toLowerCase())
      );

      if (matchingColleges.length > 0) {
        filtered[letter] = matchingColleges;
      }
    });

    return filtered;
  };

  // Get filtered colleges in alphabetical structure
  const filteredAlphabeticalColleges = getFilteredAlphabeticalColleges();
  const hasFilteredResults =
    Object.keys(filteredAlphabeticalColleges).length > 0;

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
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="p-6 space-y-6">
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
            {/* Club dropdown */}
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

            {/* Searchable College Dropdown */}
            <div className="space-y-2" ref={collegeDropdownRef}>
              <label className="flex items-center gap-2 text-yellow-500 font-medium">
                <School size={18} />
                Select College
              </label>
              <div className="relative">
                <div
                  className={`flex items-center w-full bg-gray-800 bg-opacity-70 border rounded-lg p-3 cursor-pointer ${
                    isCollegeDropdownOpen
                      ? 'border-yellow-500 ring-2 ring-yellow-500'
                      : 'border-gray-700'
                  }`}
                  onClick={() =>
                    setIsCollegeDropdownOpen(!isCollegeDropdownOpen)
                  }
                >
                  {selectedCollege ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-white truncate">
                        {selectedCollege}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 p-0 h-auto hover:bg-transparent hover:text-yellow-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCollege('');
                        }}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-400">Select a college</span>
                  )}
                </div>

                {/* Dropdown Panel */}
                {isCollegeDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    {/* Search input */}
                    <div className="sticky top-0 z-20 bg-gray-800 p-2 border-b border-gray-700">
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={collegeSearchQuery}
                          onChange={(e) =>
                            setCollegeSearchQuery(e.target.value)
                          }
                          placeholder="Search colleges..."
                          className="w-full bg-gray-700 border-none rounded-md pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Alphabet quick-jump bar */}
                    <div className="sticky top-[52px] z-10 bg-gray-900 px-2 py-1 border-b border-gray-700 flex flex-wrap gap-1 justify-center">
                      {availableLetters.map((letter) => (
                        <button
                          key={letter}
                          className={`w-6 h-6 text-xs rounded-full flex items-center justify-center
                            ${
                              filteredAlphabeticalColleges[letter]
                                ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                          disabled={!filteredAlphabeticalColleges[letter]}
                          onClick={() => {
                            if (filteredAlphabeticalColleges[letter]) {
                              // Scroll to section
                              document
                                .getElementById(`college-section-${letter}`)
                                ?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>

                    {/* Alphabetical college list */}
                    <div className="py-1">
                      {hasFilteredResults ? (
                        Object.entries(filteredAlphabeticalColleges)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([letter, colleges]) => (
                            <div key={letter} id={`college-section-${letter}`}>
                              {/* Letter header */}
                              <div className="sticky top-[84px] z-10 bg-yellow-500 bg-opacity-10 px-4 py-1 text-yellow-400 font-medium border-b border-yellow-500 border-opacity-30">
                                {letter}
                              </div>

                              {/* Colleges in this section */}
                              {colleges.map((college, index) => (
                                <div
                                  key={`${letter}-${index}`}
                                  className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                                    selectedCollege === college
                                      ? 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                                      : 'text-white'
                                  }`}
                                  onClick={() => {
                                    setSelectedCollege(college);
                                    setIsCollegeDropdownOpen(false);
                                    setCollegeSearchQuery('');
                                  }}
                                >
                                  {selectedCollege === college && (
                                    <Check
                                      size={16}
                                      className="mr-2 text-yellow-500"
                                    />
                                  )}
                                  <span className="truncate">{college}</span>
                                </div>
                              ))}
                            </div>
                          ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 text-center">
                          No colleges match your search
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-yellow-500 font-medium">
                <Camera size={18} />
                Upload Images (max 4)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="imageUpload"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <div className="w-12 h-12 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <Camera size={24} className="text-gray-400" />
                  </div>
                </label>

                {/* Image previews */}
                <div className="flex items-center gap-4 overflow-x-auto">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 flex-shrink-0"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-black bg-opacity-70 rounded-full p-1 hover:bg-red-600 transition-colors"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="text-right">
              <Button
                type="submit"
                disabled={
                  !postText.trim() ||
                  !selectedClub ||
                  !selectedCollege ||
                  isLoading
                }
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Posting...' : 'Post Zynvo'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
