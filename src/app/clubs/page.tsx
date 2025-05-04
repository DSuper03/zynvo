'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Users, Star, TrendingUp, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { clubData } from '@/constants/realclubs';
import CreateClubModal from './createclub';
import JoinClubModal from './joinclub';

const categories = [
  { id: 'all', name: 'All Clubs' },
  { id: 'tech', name: '💻 Tech & Engineering' },
  { id: 'cultural', name: '🎭 Cultural & Arts' },
  { id: 'business', name: '📈 Business & Consulting' },
  { id: 'social', name: '🌱 Social Impact' },
  { id: 'literary', name: '🧠 Literary & Debate' },
  { id: 'design', name: '🎨 Design & Media' }
];

const ClubsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'new', 'trending'
  const [isGridView, setIsGridView] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<{ name: string; image: string } | null>(null);

  // Filter clubs based on active category and search query
  const filteredClubs = clubData.filter(club => {
    const matchesCategory = activeCategory === 'all' || club.category === activeCategory;
    const matchesSearch = 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.college.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort clubs based on sortBy state
  const sortedClubs = [...filteredClubs].sort((a, b) => {
    if (sortBy === 'new') {
      return a.isNew ? -1 : b.isNew ? 1 : 0;
    } else if (sortBy === 'trending') {
      // For demonstration, we'll just prioritize popular clubs for trending
      return a.isPopular ? -1 : b.isPopular ? 1 : 0;
    } else { // popular
      return b.members - a.members;
    }
  });

  const handleJoinClub = (club: any) => {
    setSelectedClub({
      name: club.name,
      image: club.image
    });
    setIsJoinModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-800 text-white w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Search clubs, categories, or colleges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setSortBy('popular')}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  sortBy === 'popular' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300'
                }`}
              >
                <Star className="h-4 w-4 mr-1" />
                <span>Popular</span>
              </button>
              
              <button 
                onClick={() => setSortBy('new')}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  sortBy === 'new' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300'
                }`}
              >
                <Calendar className="h-4 w-4 mr-1" />
                <span>New</span>
              </button>
              
              <button 
                onClick={() => setSortBy('trending')}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  sortBy === 'trending' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300'
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Trending</span>
              </button>
            </div>
            
            <button 
              onClick={() => setIsGridView(!isGridView)} 
              className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isGridView ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="bg-black py-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm ${
                  activeCategory === category.id
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Clubs Grid/List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          {activeCategory === 'all' ? 'All Clubs' : categories.find(c => c.id === activeCategory)?.name}
          <span className="text-gray-400 text-lg ml-2">({sortedClubs.length})</span>
        </h2>
        
        {isGridView ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedClubs.map(club => (
              <div key={club.id} className="block transition-transform hover:scale-[1.02] duration-200">
                <Link 
                  href={`/clubs/${club.id}`} 
                  className="block"
                >
                  <div 
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/20 transition-all"></div>
                      <img 
                        src={club.image} 
                        alt={club.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {club.isNew && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md z-20">
                          NEW
                        </div>
                      )}
                      {club.isPopular && !club.isNew && (
                        <div className="absolute top-2 right-2 bg-gray-900/90 text-yellow-400 text-xs font-bold px-2 py-1 rounded-md z-20 border border-yellow-400/50">
                          POPULAR
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-bold text-lg">{club.name}</h3>
                          <p className="text-gray-400 text-sm">{club.college}</p>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{club.members}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                        {club.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span 
                          className={`text-xs px-2 py-1 rounded-md 
                            ${club.category === 'tech' ? 'bg-blue-900/30 text-blue-300' : ''}
                            ${club.category === 'cultural' ? 'bg-purple-900/30 text-purple-300' : ''}
                            ${club.category === 'business' ? 'bg-green-900/30 text-green-300' : ''}
                            ${club.category === 'social' ? 'bg-amber-900/30 text-amber-300' : ''}
                            ${club.category === 'literary' ? 'bg-red-900/30 text-red-300' : ''}
                            ${club.category === 'design' ? 'bg-pink-900/30 text-pink-300' : ''}
                          `}
                        >
                          {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <button 
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-medium py-2 px-4 rounded-lg mt-2 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    handleJoinClub(club);
                  }}
                >
                  Join Club
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedClubs.map(club => (
              <div key={club.id} className="block transition-transform hover:scale-[1.01] duration-200">
                <Link 
                  href={`/clubs/${club.id}`}
                  className="block"
                >
                  <div 
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group flex"
                  >
                    <div className="w-32 h-32 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/20 transition-all"></div>
                      <img 
                        src={club.image} 
                        alt={club.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-white font-bold text-lg">{club.name}</h3>
                            {club.isNew && (
                              <span className="ml-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-md">
                                NEW
                              </span>
                            )}
                            {club.isPopular && !club.isNew && (
                              <span className="ml-2 bg-gray-900 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-md border border-yellow-400/50">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{club.college}</p>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{club.members}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mt-2">
                        {club.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span 
                          className={`text-xs px-2 py-1 rounded-md 
                            ${club.category === 'tech' ? 'bg-blue-900/30 text-blue-300' : ''}
                            ${club.category === 'cultural' ? 'bg-purple-900/30 text-purple-300' : ''}
                            ${club.category === 'business' ? 'bg-green-900/30 text-green-300' : ''}
                            ${club.category === 'social' ? 'bg-amber-900/30 text-amber-300' : ''}
                            ${club.category === 'literary' ? 'bg-red-900/30 text-red-300' : ''}
                            ${club.category === 'design' ? 'bg-pink-900/30 text-pink-300' : ''}
                          `}
                        >
                          {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
                        </span>
                        
                        <button 
                          className="bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-medium py-1 px-4 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent Link navigation
                            handleJoinClub(club);
                          }}
                        >
                          Join Club
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Floating Create Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          className="bg-yellow-500 hover:bg-yellow-400 text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Create Club Modal */}
      <CreateClubModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {/* Join Club Modal */}
      {selectedClub && (
        <JoinClubModal 
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          clubName={selectedClub.name}
          clubImage={selectedClub.image}
        />
      )}
    </div>
  );
};

export default ClubsPage;