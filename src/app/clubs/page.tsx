"use client";

import React, { useState, useEffect } from 'react';
import { ClubCard } from '@/components/clubs/ClubCard';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { clubsData } from '@/utils/constants/clubsData';

const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClubs, setFilteredClubs] = useState(clubsData);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Extract unique categories from club data
  const categories = ['All', ...Array.from(new Set(clubsData.map(club => club.category)))];
  
  useEffect(() => {
    // Filter clubs based on search term and category
    const results = clubsData.filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           club.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' ? true : club.category === selectedCategory;
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
          <motion.div
            key={club.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ClubCard
              id={club.id}
              name={club.name}
              description={club.description}
              memberCount={club.members}
              category={club.category}
              imageUrl={club.bannerImage}
            />
          </motion.div>
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

export default Page;