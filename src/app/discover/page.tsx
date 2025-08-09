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
    <div className="min-h-screen w-full bg-black overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Column 1-2: Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Responsive buttons/actions row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CreatePostButton
                onClick={() => setIsPostModalOpen(true)} // Open modal on button click
                className="w-full sm:w-auto"
              />

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
                // Display fetched posts
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
                      {post.collegeId && (
                        <span className="text-sm text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                          College ID: {post.collegeId}
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
                        {/* You can add timestamp here if available in your API */}
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
                    <button
                      onClick={() => setIsPostModalOpen(true)} // Open modal on button click
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-md font-medium transition-colors"
                    >
                      Create Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Sidebar (hidden on mobile) */}
       
        </div>
      </div>

      {/* Mobile bottom navigation (visible only on mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 py-2 px-4">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center text-yellow-400">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="flex flex-col items-center text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <Plus className="h-6 w-6" />
            <span className="text-xs mt-1">Create</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Messages</span>
          </button>
        </div>
      </div>

      {/* Modal components */}
      <CreatePostModal
        isOpen={isPostModalOpen} // Pass modal state
        onClose={() => setIsPostModalOpen(false)} // Close modal
      />
    </div>
  );
}