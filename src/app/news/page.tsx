/**

 @author SwarnenduG07,
 @description: The main page the /new route here we are showing all the news in a beautiful grid layout with modals on hover
 @todo Need to create agentic backend for the news app where we will fetch the news and the categories 
 */

'use client';



import React, { useState, useEffect } from 'react';
import { Search, Calendar, TrendingUp, Clock, ExternalLink, Grid3X3, List, Bookmark, Share2, Eye, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews, NewsItem } from '@/api/hooks/useNews';

const CATEGORY_STYLES: Record<string, string> = {
  General: 'bg-yellow-500 text-black',
  Fun: 'bg-pink-500 text-white',
  Controversial: 'bg-red-500 text-white',
  Insider: 'bg-blue-500 text-white',
  default: 'bg-gray-700 text-white',
};

const NEWS_CATEGORIES = [
  { id: 'all', name: 'All', icon: <Search /> },
  { id: 'General', name: 'General', icon: <Calendar /> },
  { id: 'Fun', name: 'Fun', icon: <TrendingUp /> },
  { id: 'Controversial', name: 'Controversial', icon: <TrendingUp /> },
  { id: 'Insider', name: 'Insider', icon: <TrendingUp /> },
];

const NewsPage: React.FC = () => {
  // Use the custom hook instead of local state and useEffect
  const { newsData, loading, error } = useNews();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);

  const filteredNews = newsData.filter(article => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-3">CollegeBuzz News</h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Stay updated with the latest stories from Indian college campuses
            </p>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-900 p-4 rounded-xl">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              className="w-full h-12 bg-gray-800 border-none text-white pl-10 pr-4 rounded-xl"
              placeholder="Search news..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1">
            {NEWS_CATEGORIES.map(category => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium ${
                  activeCategory === category.id
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="text-center py-8 text-red-400 bg-red-900/20 rounded-xl">
            <p className="text-lg font-semibold">Error loading news</p>
            <p className="text-sm mt-2">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-yellow-500 text-black hover:bg-yellow-400"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-yellow-400 text-xl">Loading news...</p>
          </div>
        ) : !error && filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map(article => (
              <motion.div
                key={article.id}
                className="relative bg-gray-900 border border-yellow-500/30 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                onMouseEnter={() => setHoveredArticle(article.id)}
                onMouseLeave={() => setHoveredArticle(null)}
                onClick={() => setSelectedArticle(article)}
              >
                {/* Top colored bar based on category */}
                <div 
                  className={`h-1.5 w-full ${CATEGORY_STYLES[article.category] || CATEGORY_STYLES.default}`}
                />
                
                <div className="p-5">
                  {/* Category Badge */}
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_STYLES[article.category] || CATEGORY_STYLES.default}`}>
                      {article.category}
                    </span>
                    <span className="text-gray-400 text-xs">{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-lg font-bold text-yellow-300 mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  
                  {/* Summary - truncated */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  
                  {/* Read More */}
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-800">
                    <span className="text-xs text-gray-400 truncate max-w-[70%]">
                      Source: {article.source.length > 30 ? article.source.substring(0, 30) + '...' : article.source}
                    </span>
                    <span className="text-yellow-400 flex items-center text-sm font-medium">
                      <span className="mr-1">Read</span>
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </div>
                
                {/* Coming Soon Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-2 px-4 text-center">
                 
                </div>

                {/* Hover Preview */}
                <AnimatePresence>
                  {hoveredArticle === article.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 flex items-center justify-center p-5"
                    >
                      <div className="text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${CATEGORY_STYLES[article.category] || CATEGORY_STYLES.default}`}>
                          {article.category}
                        </span>
                        <h3 className="text-lg font-bold text-yellow-300 mb-2">{article.title}</h3>
                        <p className="text-white text-sm mb-4 line-clamp-3">{article.summary}</p>
                        <button className="px-4 py-2 bg-yellow-500 text-black rounded-full text-sm font-medium hover:bg-yellow-400 transition-colors">
                          Read Full Story
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : !error && filteredNews.length === 0 && newsData.length > 0 ? (
          <div className="text-center py-16 text-gray-400 text-xl">
            <Info size={36} className="mx-auto mb-4 text-gray-500" />
            No news matches your search criteria.
          </div>
        ) : !error ? (
          <div className="text-center py-16 text-gray-400 text-xl">
            <Info size={36} className="mx-auto mb-4 text-gray-500" />
            No news available at the moment.
          </div>
        ) : null}
      </div>

      {/* Modal for Selected Article */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Top colored bar based on category */}
              <div 
                className={`h-2 w-full ${CATEGORY_STYLES[selectedArticle.category] || CATEGORY_STYLES.default}`}
              />
              
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_STYLES[selectedArticle.category] || CATEGORY_STYLES.default}`}>
                      {selectedArticle.category}
                    </span>
                    <h2 className="text-2xl font-bold text-yellow-300 mt-4">
                      {selectedArticle.title}
                    </h2>
                    <p className="text-gray-400 text-sm mt-2">
                      {new Date(selectedArticle.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setSelectedArticle(null)}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-200 leading-relaxed mb-6">
                    {selectedArticle.summary}
                  </p>
                  <div className="border-t border-gray-800 pt-4 text-sm text-gray-400">
                    <strong>Source:</strong> {selectedArticle.source}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsPage;