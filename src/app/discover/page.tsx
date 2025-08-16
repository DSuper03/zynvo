'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Share,
  Home,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import CreatePostButton from './components/CreatePostButton';
import CreatePostModal from './components/CreatePostModal';
import { PostData } from '@/types/global-Interface';
import { Button } from '@/components/ui/button';

// Define the API response type
interface ApiResponse {
  msg: string;
  posts: PostData[];
}

export default function Feed() {
  const [activeTab, setActiveTab] = useState<'recents' | 'friends' | 'popular'>(
    'recents'
  );
  const [posts, setPost] = useState<PostData[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Infinite scroll state 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Fetch posts with pagination
  useEffect(() => {
    const postData = async () => {
      try {
        setIsLoading(page === 1);
        setIsFetchingMore(page > 1);
        setError(null);

        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/all?page=${page}`
        );

        const newPosts = response.data?.posts || [];
        if (page === 1) {
          setPost(newPosts);
        } else {
          setPost((prev) => [...prev, ...newPosts]);
        }
        // If less than 10 posts returned, no more data
        setHasMore(newPosts.length === 10);
      } catch (error) {
        setError('Failed to fetch posts');
        if (page === 1) setPost([]);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    };

    postData();
  }, [page]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        hasMore &&
        !isLoading &&
        !isFetchingMore
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, isFetchingMore]);

  return (
    <div className="min-h-screen w-full bg-transparent overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Column 1-2: Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Responsive buttons/actions row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
              <div className="flex sm:hidden items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  {/* Circular Create Post Button for Mobile */}
                  <Button
                    onClick={() => setIsPostModalOpen(true)}
                    className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="h-6 w-6 text-black" />
                  </Button>
                  
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold shadow-md overflow-hidden">
                    
                    <Image
                      src="/api/placeholder/40/40" 
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        
                        e.currentTarget.style.display = 'none';
                        
                      }}
                    />
                    <div className="w-full h-full bg-yellow-500 rounded-full items-center justify-center text-black font-bold text-sm hidden">
                      U 
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop View - Original Create Post Button */}
              <div className="hidden sm:block">
                <CreatePostButton
                  onClick={() => setIsPostModalOpen(true)}
                  className="w-full sm:w-auto"
                />
              </div>

              {/* Tab navigation - Hidden on mobile */}
              <div className="hidden sm:block overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex space-x-2 min-w-max">
                  <button
                    onClick={() => setActiveTab('recents')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                      activeTab === 'recents'
                        ? 'bg-yellow-500 text-black'
                        : 'text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    Recents
                  </button>
                  <button
                    onClick={() => setActiveTab('friends')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                      activeTab === 'friends'
                        ? 'bg-yellow-500 text-black'
                        : 'text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    Friends
                  </button>
                  <button
                    onClick={() => setActiveTab('popular')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                      activeTab === 'popular'
                        ? 'bg-yellow-500 text-black'
                        : 'text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    Popular
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Display */}
            <div className="space-y-4 sm:space-y-6">
              {isLoading ? (
                // Loading state
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  <span className="ml-3 text-yellow-400">Loading posts...</span>
                </div>
              ) : error ? (
                // Error state
                <div className="bg-red-900/20 border border-red-500/30 rounded-md p-4">
                  <p className="text-red-400">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
                  >
                    Try again
                  </button>
                </div>
              ) : posts && posts.length > 0 ? (
               
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-800 p-6 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    {/* Post metadata */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.collegeName && (
                        <span className="text-sm text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                          College Tagged: {post.collegeName}
                        </span>
                      )}
                      {post.id && (
                        <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                          Post #{post.id}
                        </span>
                      )}
                    </div>

                    {/* Post actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-yellow-400 transition-colors group">
                          <Heart size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="text-sm">Like</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-yellow-400 transition-colors group">
                          <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="text-sm">Comment</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-yellow-400 transition-colors group">
                          <Share size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {post.createdAt}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // No posts state
                <div className="text-center py-12">
                  <div className="bg-gray-800 rounded-lg p-8 border border-yellow-500/20">
                    <MessageCircle size={48} className="text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                      No posts yet
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Be the first to share something with your community!
                    </p>
                    <Button
                      onClick={() => setIsPostModalOpen(true)} // Open modal on button click
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-md font-medium transition-colors"
                    >
                      Create Post
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Sidebar (hidden on mobile) */}
       
        </div>
      </div>

      {/* Mobile bottom navigation (visible only on mobile) */}
    

      {/* Modal components */}
      <CreatePostModal
        isOpen={isPostModalOpen} // Pass modal state
        onClose={() => setIsPostModalOpen(false)} // Close modal
      />
    </div>
  );
}