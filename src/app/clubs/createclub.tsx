'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/legacy/image';
import { X, Upload, Camera, Plus, Trash2, ChevronDown, Building } from 'lucide-react';
import { CreateClubModalProps } from '@/types/global-Interface';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { toBase64, uploadImageToImageKit } from '@/lib/imgkit';
import axios from 'axios';
import { fetchClubsByCollege } from '@/app/api/hooks/useClubs';

const CreateClubModal: React.FC<CreateClubModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [img, setImg] = useState<File | null>(null);
  const [clubData, setClubData] = useState({
    name: '',
    description: '',
    type: '',
    FounderEmail: '',
    facultyEmail: '',
    requirements: '',
    clubContact: '',
    wings: [] as string[],
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [newWing, setNewWing] = useState('');
  
  // New state for club selection
  const [userCollege, setUserCollege] = useState<string>('');
  const [existingClubs, setExistingClubs] = useState<string[]>([]);
  const [selectedClubOption, setSelectedClubOption] = useState<'existing' | 'new'>('new');
  const [selectedExistingClub, setSelectedExistingClub] = useState<string>('');
  const [isLoadingClubs, setIsLoadingClubs] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


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

  // Fetch user's college and existing clubs
  useEffect(() => {
    const fetchUserCollegeAndClubs = async () => {
      if (!token) return;
      
      // Debug environment variables
      console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
      console.log('Token available:', !!token);
      
      try {
        // Get user's college information
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        
        const userData = (userResponse.data as any).user;
        console.log('Full user response:', userResponse.data); // Debug log
        console.log('User data:', userData); // Debug log
        
        // Try different possible college field names
        const userCollege = userData?.collegeName || userData?.college || userData?.collegeId;
        console.log('User college (collegeName):', userData?.collegeName);
        console.log('User college (college):', userData?.college);
        console.log('User college (collegeId):', userData?.collegeId);
        console.log('Final user college:', userCollege);
        
        if (userCollege) {
          setUserCollege(userCollege);
          
          // Fetch existing clubs for this college
          setIsLoadingClubs(true);
          console.log('Fetching clubs for college:', userCollege); // Debug log
          
          // Test the API call directly first
          try {
            const testUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/getClubs/${encodeURIComponent(userCollege)}`;
            console.log('Testing API URL:', testUrl);
            
            const testResponse = await fetch(testUrl, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            });
            
            console.log('Test response status:', testResponse.status);
            console.log('Test response headers:', testResponse.headers);
            
            if (testResponse.ok) {
              const testData = await testResponse.json();
              console.log('Test API response data:', testData);
            } else {
              console.log('Test API failed with status:', testResponse.status);
              const errorText = await testResponse.text();
              console.log('Test API error response:', errorText);
            }
          } catch (testError) {
            console.error('Test API call failed:', testError);
          }
          
          const clubs = await fetchClubsByCollege(userCollege, undefined, token);
          console.log('Fetched clubs:', clubs); // Debug log
          
          // If no clubs found, add some sample clubs for testing
          if (clubs.length === 0) {
            console.log('No clubs found, adding sample clubs for testing');
            const sampleClubs = [
              'Computer Science Club',
              'Robotics Club',
              'Debate Society',
              'Photography Club',
              'Music Club'
            ];
            setExistingClubs(sampleClubs);
          } else {
            setExistingClubs(clubs);
          }
        } else {
          console.log('No college found for user');
          // Add sample clubs even if no college is found
          const sampleClubs = [
            'Computer Science Club',
            'Robotics Club',
            'Debate Society',
            'Photography Club',
            'Music Club'
          ];
          setExistingClubs(sampleClubs);
        }
      } catch (error) {
        console.error('Error fetching user college:', error);
      } finally {
        setIsLoadingClubs(false);
      }
    };

    if (token) {
      fetchUserCollegeAndClubs();
    }
  }, [token]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImg(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate club selection
    if (selectedClubOption === 'existing' && !selectedExistingClub) {
      toast('Please select an existing club');
      return;
    }
    
    if (selectedClubOption === 'new' && !clubData.name.trim()) {
      toast('Please enter a club name');
      return;
    }

    if (!token) {
      toast('login please');
      return;
    }

    try {
      let image: string;
      
      if (img) {
        image = await uploadImageToImageKit(await toBase64(img), img.name);
      } else {
        toast('please upload a logo for your club');
        return;
      }

      // Prepare data for submission
      const submitData = {
        ...clubData,
        logo: image,
        collegeName: userCollege, // Add college name to the submission
      };

      const upload = await axios.post<{
        msg: string;
        clubId: string;
      }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/club`, submitData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const msg = upload?.data;
      if (upload.status == 200) {
        toast(`${msg.msg} and your clubID : ${upload?.data.clubId}`);
        onClose();
      } else if(upload.status !== 200) {
        toast(msg.msg);
      }
    } catch (error: any) {
      console.error('Error creating club:', error);
      toast(error.response?.data?.msg || 'Failed to create club');
    }
  };

  const addWing = () => {
    if (newWing.trim() !== '') {
      setClubData((prev) => ({
        ...prev,
        wings: [...prev.wings, newWing.trim()],
      }));
      setNewWing('');
    }
  };

  const removeWing = (index: number) => {
    setClubData((prev) => ({
      ...prev,
      wings: prev.wings.filter((_, i) => i !== index),
    }));
  };

  const handleClubOptionChange = (option: 'existing' | 'new') => {
    setSelectedClubOption(option);
    if (option === 'existing') {
      setClubData(prev => ({ ...prev, name: selectedExistingClub }));
    } else {
      setClubData(prev => ({ ...prev, name: '' }));
    }
  };

  const handleExistingClubSelect = (clubName: string) => {
    setSelectedExistingClub(clubName);
    setClubData(prev => ({ ...prev, name: clubName }));
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center scrollbar-hide">
      <div className="relative bg-gray-900 border border-yellow-500/30 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-yellow-500/30 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create a New Club</h2>
          <Button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={24} />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Logo Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-800 border-2 border-dashed border-yellow-500/50 flex items-center justify-center overflow-hidden relative">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Club logo preview"
                  width={40}
                  height={40}
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

          {/* Club Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-yellow-400">
                Choose Club Option*
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleClubOptionChange('existing')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    selectedClubOption === 'existing'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  Select Existing Club
                </button>
                <button
                  type="button"
                  onClick={() => handleClubOptionChange('new')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    selectedClubOption === 'new'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Create New Club
                </button>
              </div>
            </div>

            {userCollege && (
              <div className="text-sm text-gray-400">
                <span className="text-yellow-400">College:</span> {userCollege}
              </div>
            )}
            
          

            {selectedClubOption === 'existing' ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-yellow-400">
                  Select Existing Club*
                </label>
                <div className="relative dropdown-container">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none flex items-center justify-between"
                  >
                    <span className={selectedExistingClub ? 'text-white' : 'text-gray-400'}>
                      {selectedExistingClub || 'Select a club from your college'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {isLoadingClubs ? (
                        <div className="px-4 py-2 text-gray-400 text-sm">Loading clubs...</div>
                      ) : existingClubs.length > 0 ? (
                        existingClubs.map((club, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleExistingClubSelect(club)}
                            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                          >
                            {club}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400 text-sm">No existing clubs found in your college</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-yellow-400"
                >
                  New Club Name*
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your new club name"
                  value={clubData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* ✅ Wings Section */}
          <div className="space-y-2">
            <label
              htmlFor="wings"
              className="block text-sm font-medium text-yellow-400"
            >
              Club Wings (Departments/Divisions)
            </label>
            <div className="flex space-x-2">
              <input
                id="wings"
                type="text"
                placeholder="Add a wing (e.g. Technical, PR, Events)"
                value={newWing}
                onChange={(e) => setNewWing(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
              />
              <Button
                type="button"
                onClick={addWing}
                className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg px-4"
              >
                <Plus size={18} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {clubData.wings.map((wing, index) => (
                <span
                  key={index}
                  className="flex items-center bg-gray-800 text-yellow-400 px-3 py-1 rounded-lg"
                >
                  {wing}
                  <button
                    type="button"
                    onClick={() => removeWing(index)}
                    className="ml-2 text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>
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
            <Button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-medium transition-colors"
            >
              Zync your Club
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClubModal;
