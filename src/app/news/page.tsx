/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, TrendingUp, Clock, ExternalLink, Grid3X3, List, Bookmark, Share2, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from "next/legacy/image";
import Link from 'next/link';

import { NewsArticle, NEWS_CATEGORIES, CATEGORY_STYLES, MOCK_NEWS_DATA } from '@/constants/news';

/**
 * News Page Component - Displays news articles with filtering and search functionality
 */
const NewsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'trending', 'popular'
  const [isGridView, setIsGridView] = useState(true);
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load news data on component mount
   */
  useEffect(() => {
    // Simulate API call
    const loadNews = async () => {
      setLoading(true);
      // Simulate network delay
      setTimeout(() => {
        setNewsData(MOCK_NEWS_DATA);
        setLoading(false);
      }, 1000);
    };

    loadNews();
  }, []);

  /**
   * Filter news articles based on search query and category
   */
  const filteredNews = newsData.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  /**
   * Sort filtered news based on selected sorting criteria
   */
  const sortedNews = [...filteredNews].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'trending':
        // In a real app, this would sort by engagement metrics
        return (b.readTime || 0) - (a.readTime || 0);
      default:
        return 0;
    }
  });

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };


  const getCategoryStyle = (category: string): string => {
    return CATEGORY_STYLES[category] || CATEGORY_STYLES.default;
  };

  return (
    <div className="w-full">
      <div className=" relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-orange-500/10 rounded-2xl blur-xl"></div>
        <div className="relative z-10 text-center ">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center size-16 md:size-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl mb-4 mx-auto bg-yellow-600">
              <Search className="size-7 md:size-10 text-black" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent mb-4 text-white">
            Latest News
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover the most important stories, trending topics, and breaking news from around the world
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400 mb-[30px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Bar */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-black/80 border border-gray-800/50 rounded-2xl p-4 md:p-6 mb-6 shadow-2xl">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:gap-6 md:items-center">
          {/* Advanced Search Input */}
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400 group-focus-within:text-yellow-400 transition-colors" />
            </div>
            <input
              type="text"
              className="bg-gray-900/50 border border-gray-700/50 text-white w-full py-3 pl-12 pr-4 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm"
              placeholder="Search articles, topics, or sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          </div>

          {/* Enhanced Sort Buttons */}
          <div className="flex space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <Button
              onClick={() => setSortBy('latest')}
              className={`flex items-center px-4 md:px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                sortBy === 'latest'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-yellow-500/25 scale-105'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
              }`}
            >
              <Calendar size={16} className="mr-2" />
              <span>Latest</span>
            </Button>

            <Button
              onClick={() => setSortBy('trending')}
              className={`flex items-center px-4 md:px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                sortBy === 'trending'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-yellow-500/25 scale-105'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
              }`}
            >
              <TrendingUp size={16} className="mr-2" />
              <span>Trending</span>
            </Button>
          </div>

          {/* Enhanced View Toggle */}
          <Button
            onClick={() => setIsGridView(!isGridView)}
            className="bg-gray-800/50 border border-gray-700/50 text-white p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center group"
            title={isGridView ? 'Switch to List View' : 'Switch to Grid View'}
          >
            {isGridView ? (
              <List className="h-5 w-5 group-hover:scale-110 transition-transform" />
            ) : (
              <Grid3X3 className="h-5 w-5 group-hover:scale-110 transition-transform" />
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced Categories */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-white">Browse by Category</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex space-x-3 pb-2 scrollbar-hide">
            {NEWS_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`whitespace-nowrap px-4 md:px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-yellow-500/25 scale-105'
                    : 'bg-gray-800/50 text-white hover:bg-gray-700/50 border border-gray-700/30 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10'
                }`}
              >
                <span className="text-lg mr-2 group-hover:scale-110 transition-transform inline-block">{category.icon}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* News Grid/List */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {activeCategory === 'all'
              ? 'All News'
              : NEWS_CATEGORIES.find((c) => c.id === activeCategory)?.name}
          </h2>
          <span className="text-gray-400 text-sm">
            {sortedNews.length} article{sortedNews.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {loading ? (
          // Enhanced Loading skeletons
          <div className="space-y-8">
            {/* Featured Article Skeleton */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
                <div className="relative h-80 md:h-96">
                  <Skeleton className="h-full w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <Skeleton className="h-8 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Articles Skeleton */}
            <div className={isGridView 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              : "space-y-6"
            }>
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 shadow-xl">
                  <Skeleton className="h-48 md:h-56 w-full" />
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-24 rounded-xl" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : sortedNews.length > 0 ? (
          <div className="space-y-8">
            {/* Featured Article */}
            {sortedNews.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400" />
                    Featured Story
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/50 to-transparent"></div>
                </div>
                <article className="relative group cursor-pointer">
                  <Link href={sortedNews[0].url}>
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-500 shadow-2xl group-hover:shadow-yellow-500/10">
                      <div className="relative h-80 md:h-96 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                        <Image
                          src={sortedNews[0].imageUrl}
                          alt={sortedNews[0].title}
                          width={1200}
                          height={600}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${getCategoryStyle(sortedNews[0].category)}`}>
                              {sortedNews[0].category.charAt(0).toUpperCase() + sortedNews[0].category.slice(1)}
                            </span>
                            <span className="text-gray-300 text-sm">{formatDate(sortedNews[0].publishedAt)}</span>
                            <div className="flex items-center gap-1 text-gray-300 text-sm">
                              <Clock size={14} />
                              <span>{sortedNews[0].readTime} min read</span>
                            </div>
                          </div>
                          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 group-hover:text-yellow-100 transition-colors leading-tight">
                            {sortedNews[0].title}
                          </h2>
                          <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-4 line-clamp-2">
                            {sortedNews[0].description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 font-medium">{sortedNews[0].source}</span>
                            <div className="flex items-center gap-3">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 p-2 rounded-lg transition-all backdrop-blur-sm"
                              >
                                <Bookmark size={16} />
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 p-2 rounded-lg transition-all backdrop-blur-sm"
                              >
                                <Share2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              </div>
            )}

            {isGridView ? (
              // Enhanced Grid View
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-xl font-semibold text-white">More Stories</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {sortedNews.slice(1).map((article) => (
                    <article
                      key={article.id}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-500 group flex flex-col shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-1"
                    >
                      <Link href={article.url} className="flex-1">
                        <div className="h-48 md:h-56 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 group-hover:from-black/40 transition-all"></div>
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 z-20">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm ${getCategoryStyle(article.category)}`}>
                              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                            <span>{formatDate(article.publishedAt)}</span>
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{article.readTime} min</span>
                            </div>
                          </div>

                          <h3 className="text-white font-bold text-lg md:text-xl mb-3 line-clamp-2 group-hover:text-yellow-100 transition-colors leading-tight">
                            {article.title}
                          </h3>

                          <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-4 flex-grow leading-relaxed">
                            {article.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm font-medium">{article.source}</span>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white p-1.5 rounded-lg transition-all"
                              >
                                <Bookmark size={14} />
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white p-1.5 rounded-lg transition-all"
                              >
                                <Share2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>

                      <div className="p-6 pt-0">
                        <Button
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black text-sm font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl group"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(article.url, '_blank');
                          }}
                        >
                          <span>Read Full Story</span>
                          <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              // Enhanced List View
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-xl font-semibold text-white">All Stories</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
                </div>
                <div className="space-y-6">
                  {sortedNews.map((article, index) => (
                    <article
                      key={article.id}
                      className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-500 group shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10"
                    >
                      <Link href={article.url} className="flex flex-col md:flex-row">
                        <div className="w-full md:w-64 lg:w-80 h-48 md:h-40 overflow-hidden relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 group-hover:from-black/40 transition-all"></div>
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 z-20">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm ${getCategoryStyle(article.category)}`}>
                              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                            </span>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-4 right-4 z-20">
                              <div className="bg-yellow-500 text-black px-2 py-1 rounded-lg text-xs font-bold">
                                TRENDING
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                              <span>{formatDate(article.publishedAt)}</span>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Clock size={12} />
                                  <span>{article.readTime} min read</span>
                                </div>
                                <span className="font-medium">{article.source}</span>
                              </div>
                            </div>

                            <h3 className="text-white font-bold text-xl md:text-2xl mb-3 line-clamp-2 group-hover:text-yellow-100 transition-colors leading-tight">
                              {article.title}
                            </h3>

                            <p className="text-gray-300 text-base md:text-lg line-clamp-3 mb-4 leading-relaxed">
                              {article.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white p-2 rounded-lg transition-all"
                              >
                                <Bookmark size={16} />
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white p-2 rounded-lg transition-all"
                              >
                                <Share2 size={16} />
                              </Button>
                            </div>
                            <Button
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black text-sm font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center group"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(article.url, '_blank');
                              }}
                            >
                              <span>Read Full Story</span>
                              <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Enhanced No Results
          <div className="text-center py-16 md:py-24">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 via-gray-700/10 to-gray-800/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl p-12 md:p-16 border border-gray-700/50">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">No articles found</h3>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  Try adjusting your search terms or browse different categories to discover amazing stories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Clear Filters
                  </Button>
                  <Button
                    onClick={() => setActiveCategory('trending')}
                    className="bg-gray-700/50 hover:bg-gray-600/50 text-white border border-gray-600/50 hover:border-gray-500/50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Browse Trending
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;