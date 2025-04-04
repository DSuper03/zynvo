"use client";

import React, { useState, useEffect } from 'react';
import clubs from '@/utils/constants/constants';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

// We'll use client-side metadata handling since this is a client component
const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClubs, setFilteredClubs] = useState([...clubs]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Sample categories - adjust based on your actual data
  const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Technology'];
  
  useEffect(() => {
    // Filter clubs based on search term and category
    const results = Array.from(clubs).filter(club => {
      const matchesSearch = club.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' ? true : club.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
    
    setFilteredClubs(results);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
          Discover Campus Clubs
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with like-minded individuals and pursue your passions through our diverse range of student clubs and organizations.
        </p>
      </motion.div>

      {/* Search and filter section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clubs grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {filteredClubs.map((club, index) => (
          <ClubCard key={club} club={club} index={index} />
        ))}
      </motion.div>

      {/* No results message */}
      {filteredClubs.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="mt-4 text-lg text-gray-600">No clubs found matching your search.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} 
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Club card component with animations
const ClubCard = ({ club, index }) => {
  // Generate random images for the demo - replace with actual club images
  const imageId = Math.floor(Math.random() * 1000) + 100;
  const placeholderImage = `https://source.unsplash.com/random/300x200?club,${imageId}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/clubs/${encodeURIComponent(club)}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={placeholderImage}
            alt={`${club} club`}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70" />
          <div className="absolute bottom-0 left-0 p-4">
            <div className="px-2 py-1 mb-2 bg-indigo-500 text-white text-xs rounded-full inline-block">
              {['Academic', 'Cultural', 'Sports', 'Technology'][Math.floor(Math.random() * 4)]}
            </div>
            <h3 className="text-xl font-bold text-white">{club}</h3>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Join our vibrant community of {Math.floor(Math.random() * 100) + 20} members passionate about {club.toLowerCase()}.
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                +{Math.floor(Math.random() * 20) + 5}
              </div>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Join
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Page;