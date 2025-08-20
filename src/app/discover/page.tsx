'use client';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Image from "next/legacy/image";
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
import { Card } from '@/components/ui/card';

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

  // Slider events data
  const sliderEvents = [
    {
      img: "/posters/1.png",
      title: "Tech Conference",
      desc: "Join the latest in tech innovation.",
    },
    {
      img: "/posters/2.png",
      title: "Music Festival",
      desc: "Experience live music and fun.",
    },
    {
      img: "/posters/4.png",
      title: "Art Expo",
      desc: "Explore creative artworks.",
    },
  ];
  const [slideIdx, setSlideIdx] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-slide effect for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx((idx) => (idx + 1) % sliderEvents.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [sliderEvents.length]);

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
                  <Button
                    onClick={() => setActiveTab('recents')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                      activeTab === 'recents'
                        ? 'bg-yellow-500 text-black'
                        : 'text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    Recents
                  </Button>
                  <Button
                    onClick={() => setActiveTab('friends')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                      activeTab === 'friends'
                        ? 'bg-yellow-500 text-black'
                        : 'text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    Friends
                  </Button>
                  <Button
                    onClick={() => setActiveTab('popular')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                      activeTab === 'popular'
                        ? 'bg-yellow-500 text-black'
                        : 'text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    Popular
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile slider: now placed above posts */}
            <div className="lg:hidden mt-2">
              <div className="relative w-full overflow-hidden" ref={sliderRef}>
                <div className="flex transition-transform duration-700"
                  style={{ transform: `translateX(-${slideIdx * 100}%)` }}>
                  {sliderEvents.map((ev, i) => (
                    <div key={i} className="min-w-full px-2">
                      <Card className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg mb-2">
                          <div className="aspect-[3/4] bg-gray-700 rounded-lg overflow-hidden">
                            <Image
                              src={ev.img}
                              alt={ev.title}
                              layout="fill"
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <span className="text-black text-xs font-medium px-2 py-1 rounded-full">{ev.title}</span>
                          </div>
                        </div>
                        <h4 className="font-medium text-white transition-colors">{ev.title}</h4>
                        <p className="text-xs text-gray-400">{ev.desc}</p>
                      </Card>
                    </div>
                  ))}
                </div>
                {/* Dots indicator */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {sliderEvents.map((_, i) => (
                    <span
                      key={i}
                      className={`inline-block w-2 h-2 rounded-full ${slideIdx === i ? 'bg-yellow-400' : 'bg-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Posts Display */}
            <div className="space-y-4 sm:space-y-6">
              {isLoading ? (
                // Loading state
                (<div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  <span className="ml-3 text-yellow-400">Loading posts...</span>
                </div>)
              ) : error ? (
                // Error state
                (<div className="bg-red-900/20 border border-red-500/30 rounded-md p-4">
                  <p className="text-red-400">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
                  >
                    Try again
                  </Button>
                </div>)
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
                    {/* <div className="flex items-center justify-between pt-3 border-t border-gray-700">
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
                    </div> */}
                  </div>
                ))
              ) : (
                // No posts state
                (<div className="text-center py-12">
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
                </div>)
              )}
            </div>
          </div>

          {/* Column 3: Sidebar (hidden on mobile) */}
          <div>
            {/* Desktop sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-4">
                <div className="bg-gray-800 rounded-lg border border-yellow-500/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 px-4 py-3">
                    <h3 className="text-black font-semibold">Powered by Zynvo</h3>
                  </div>
                  <div className="space-y-4">
                    {sliderEvents.map((ev, i) => (
                      <Card key={i} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg mb-2">
                          <div className="aspect-[3/4] bg-gray-700 rounded-lg overflow-hidden">
                            <Image
                              src={ev.img}
                              alt={ev.title}
                              layout="fill"
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <span className="text-black text-xs font-medium px-2 py-1 rounded-full">{ev.title}</span>
                          </div>
                        </div>
                        <h4 className="font-medium text-white transition-colors">{ev.title}</h4>
                        <p className="text-xs text-gray-400">{ev.desc}</p>
                      </Card>
                    ))}
                    <Button className="w-full py-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                      View all events →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile slider */}
            <div className="lg:hidden mt-4">
              <div className="relative w-full overflow-hidden" ref={sliderRef}>
                <div className="flex transition-transform duration-700"
                  style={{ transform: `translateX(-${slideIdx * 100}%)` }}>
                  {sliderEvents.map((ev, i) => (
                    <div key={i} className="min-w-full px-2">
                      <Card className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg mb-2">
                          <div className="aspect-[3/4] bg-gray-700 rounded-lg overflow-hidden">
                            <Image
                              src={ev.img}
                              alt={ev.title}
                              layout="fill"
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <span className="text-black text-xs font-medium px-2 py-1 rounded-full">{ev.title}</span>
                          </div>
                        </div>
                        <h4 className="font-medium text-white transition-colors">{ev.title}</h4>
                        <p className="text-xs text-gray-400">{ev.desc}</p>
                      </Card>
                    </div>
                  ))}
                </div>
                {/* Dots indicator */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {sliderEvents.map((_, i) => (
                    <span
                      key={i}
                      className={`inline-block w-2 h-2 rounded-full ${slideIdx === i ? 'bg-yellow-400' : 'bg-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
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