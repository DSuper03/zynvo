'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaMicrophone,
  FaGavel,
} from 'react-icons/fa';
import Image from 'next/legacy/image';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import dotenv from 'dotenv';
import { Button } from '@/components/ui/button';

dotenv.config();

interface speakers {
  id: number;
  email: string;
  name: string;
  profilePic: string | null;
  about: string;
  eventId: string;
}

interface speakerResponse {
  msg: string;
  speakers: speakers[];
}

const Speakers = () => {
  const params = useParams();
  const id = params.id as string;

  console.log('Route params:', params); // Debug log to see what's available
  console.log('Extracted ID:', id); // Debug log to verify ID extraction

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const [speakers, setSpeakers] = useState<speakers[]>([]);
  const [founder, setFounder] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [newSpeaker, setNewSpeaker] = useState({
    name: '',
    email: '',
    about: '',
    profilePic: '',
    eventId: id || '',
  });

  // Get token on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      if( sessionStorage.getItem('activeSession') != 'true'){
        toast('login please');
        return;
      }
    }
  }, []);

  // Update eventId when id changes
  useEffect(() => {
    if (id) {
      setNewSpeaker((prev) => ({ ...prev, eventId: id }));
    }
  }, [id]);

  useEffect(() => {
    if (!id || !token) return;

    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch speakers
        const res = await axios.get<speakerResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/getSpeakers?id=${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if user is founder
        const checkFounder = await axios.get<{ msg: string }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/isFounder?id=${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          checkFounder.status === 200 &&
          checkFounder.data.msg === 'identified'
        ) {
          setFounder(true);
          toast('welcome presidento');
        } else if (checkFounder.status === 500) {
          toast('Internal server error checking founder status');
        }

        if (res.status === 200) {
          setSpeakers(res.data.speakers || []);
        } else {
          toast(res.data.msg || 'Failed to fetch speakers');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast('Error loading speakers data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, token]);

  const handleAddSpeaker = async () => {
    if (!token) {
      toast('Please login to add speakers');
      return;
    }

    try {
      const add = await axios.post<{ msg: string }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/addSpeakers`,
        newSpeaker,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (add && add.status === 200) {
        toast(add.data.msg);
        // Refresh speakers list
        const res = await axios.get<speakerResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/getSpeakers?id=${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          setSpeakers(res.data.speakers || []);
        }
      } else {
        toast(`Error: ${add.data.msg}`);
      }
    } catch (error) {
      console.error('Error adding speaker:', error);
      toast('Failed to add speaker');
    }

    setNewSpeaker({
      name: '',
      email: '',
      about: '',
      profilePic: '',
      eventId: id || '',
    });
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewSpeaker((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-yellow-400 text-xl">Loading speakers...</div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-400 text-xl">Invalid event ID</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
            Speakers & Judges
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Learn from industry experts who will also be evaluating your
            projects.
          </p>
        </motion.div>

        {/* Speakers Section */}
        <section className="mb-20">
          <div className="flex items-center mb-10">
            <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center mr-4">
              <FaMicrophone className="text-black text-lg" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              Featured Speakers & Judges
            </h2>
          </div>

          {speakers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No speakers added yet.</p>
              {founder && (
                <p className="text-gray-500 mt-2">
                  Add the first speaker to get started!
                </p>
              )}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {speakers.map((speaker) => (
                <motion.div
                  key={speaker.id}
                  variants={itemVariants}
                  className="bg-black border-2 border-yellow-500/20 rounded-xl overflow-hidden hover:border-yellow-400 transition-all duration-500 group"
                >
                  <div className="h-56 relative overflow-hidden">
                    <div className="absolute inset-0 bg-yellow-400/20 group-hover:bg-yellow-400/10 transition-all duration-500"></div>
                    <Image
                      src={
                        speaker.profilePic || 'https://i.pravatar.cc/300?img=11'
                      }
                      width={400}
                      height={300}
                      alt={speaker.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {speaker.name}
                    </h3>
                    <p className="text-yellow-400 font-medium mb-4">
                      {speaker.email}
                    </p>

                    <p className="text-gray-300 mb-4">{speaker.about}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-gray-800 text-yellow-400 text-xs font-medium px-3 py-1 rounded-full">
                        Speaker & Judge
                      </span>
                    </div>

                    <div className="flex space-x-3">
                      <a
                        href="#"
                        className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedin />
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors"
                        aria-label="Twitter"
                      >
                        <FaTwitter />
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors"
                        aria-label="GitHub"
                      >
                        <FaGithub />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* CTA Section */}
        {founder && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-gradient-to-r from-gray-900 to-black border-2 border-yellow-500/30 rounded-xl p-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Manage Event Speakers
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Add new speakers to your event or manage existing ones. Build your
              expert panel to share knowledge with the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                Add Speaker
              </Button>
              <Button className="px-8 py-3 bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:-translate-y-1">
                Manage Speakers
              </Button>
            </div>
          </motion.section>
        )}

        {/* Add Speaker Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border-2 border-yellow-500/30 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Add New Speaker
                </h3>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddSpeaker();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-white font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newSpeaker.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter speaker name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newSpeaker.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter speaker email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    name="profilePic"
                    value={newSpeaker.profilePic}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter profile picture URL (optional)"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    About
                  </label>
                  <textarea
                    name="about"
                    value={newSpeaker.about}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none resize-none"
                    placeholder="Enter speaker bio/description"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Add Speaker
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>

      {/* Visual elements */}
      <div className="fixed top-1/3 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-1/4 left-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default Speakers;
