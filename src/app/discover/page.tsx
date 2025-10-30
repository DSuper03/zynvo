'use client';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import {
  MessageCircle,
  Share,
  MoreHorizontal,
  PenSquare,
  Calendar,
  User,
  Building,
  Users,
  X,
} from 'lucide-react';
import CreatePostButton from './components/CreatePostButton';
import CreatePostModal from './components/CreatePostModal';
import { PostData } from '@/types/global-Interface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AuroraText } from '@/components/magicui/aurora-text';
import { toast } from 'sonner';
import TextWithLinks from '@/components/TextWithLinks';

interface ApiResponse {
  msg: string;
  posts: PostData[];
}

export default function Feed() {
  const [posts, setPost] = useState<PostData[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  
  // Image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  // Slider events data
  const sliderEvents = [
    {
      img: '/posters/1.png',
      title: 'Tech Conference',
      desc: 'Join the latest in tech innovation.',
    },
    {
      img: '/posters/2.png',
      title: 'Music Festival',
      desc: 'Experience live music and fun.',
    },
    {
      img: '/posters/4.png',
      title: 'Art Expo',
      desc: 'Explore creative artworks.',
    },
  ];
  const [slideIdx, setSlideIdx] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  //function to format date
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  //function to get time ago
  const getTimeAgo = (date: Date | string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(date);
  };

  // Function to handle image modal
  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageModalOpen) {
        closeImageModal();
      }
    };

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen]);


  // Function to handle post sharing
  const handleSharePost = async (postId: string, postTitle: string) => {
    try {
      const postUrl = `${window.location.origin}/post/${postId}`;

      // Check if Web Share API is supported (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: postTitle,
          text: `Check out this post: ${postTitle}`,
          url: postUrl,
        });
        toast('Post shared successfully!');
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(postUrl);
        toast('Post link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      // Fallback method for older browsers
      try {
        const postUrl = `${window.location.origin}/post/${postId}`;
        const textArea = document.createElement('textarea');
        textArea.value = postUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast('Post link copied to clipboard!');
      } catch (fallbackError) {
        toast('Unable to copy link. Please try again.');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx((idx) => (idx + 1) % sliderEvents.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [sliderEvents.length]);

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
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200 &&
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
        {/* Page heading */}
        <header className="mb-4 sm:mb-6">
          <h1 className="text-center">
            <AuroraText className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
              Discover
            </AuroraText>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Column 1-2: Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Responsive buttons/actions row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Mobile View - Only Create Post Button */
              }
              <div className="flex sm:hidden items-center justify-end w-full">
                <div className="flex items-center space-x-3">
                  {/* Circular Create Post Button for Mobile */}
                  <Button
                    onClick={() => setIsPostModalOpen(true)}
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_10px_35px_rgb(0,0,0,0.18)] transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-yellow-500 via-yellow-400 to-amber-300 hover:from-yellow-500 hover:via-yellow-500 hover:to-yellow-400 border border-yellow-300/40 relative overflow-hidden"
                  >
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="absolute -inset-[120%] bg-white/20 rotate-12 translate-x-[-20%] group-hover:translate-x-[60%] transition-transform duration-700 ease-out" />
                    </span>
                    <PenSquare className="h-6 w-6 text-black" />
                  </Button>
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
              
            </div>

            {/* Mobile slider: now placed above posts */}
            <div className="lg:hidden mt-2">
              <div className="relative w-full overflow-hidden" ref={sliderRef}>
                <div
                  className="flex transition-transform duration-700"
                  style={{ transform: `translateX(-${slideIdx * 100}%)` }}
                >
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
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"></div>
                        </div>
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
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  <span className="ml-3 text-yellow-400">Loading posts...</span>
                </div>
              ) : error ? (
                // Error state
                <div className="bg-red-900/20 border border-red-500/30 rounded-md p-4">
                  <p className="text-red-400">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
                  >
                    Try again
                  </Button>
                </div>
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-800 p-6 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
                  >
                    {/* Author Info Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-10 h-10">
                        {post.author.profileAvatar ? (
                          <Image
                            src={post.author.profileAvatar}
                            alt={post.author.name || 'User'}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-black" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {post.author.name || 'Anonymous User'}
                          </span>
                          {!post.published && (
                            <span className="px-2 py-0.5 bg-gray-600 text-xs rounded-full text-gray-300">
                              Draft
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{getTimeAgo(post.createdAt)}</span>
                          {post.createdAt !== post.updatedAt && (
                            <span className="text-gray-500">• Edited</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                        {post.title}
                      </h3>
                      {(() => {
                        const maxChars = 220;
                        const isExpanded = expandedPosts.has(post.id);
                        const needsTruncate = (post.description || '').length > maxChars;
                        const visible = !needsTruncate || isExpanded
                          ? post.description
                          : `${post.description.slice(0, maxChars)}...`;
                        return (
                          <div className="text-gray-300 leading-relaxed mb-4">
                            <TextWithLinks text={visible} />
                            {needsTruncate && (
                              <button
                                type="button"
                                className="ml-2 text-yellow-400 hover:text-yellow-300 text-sm underline-offset-2 hover:underline"
                                onClick={() => {
                                  setExpandedPosts((prev) => {
                                    const next = new Set(prev);
                                    if (isExpanded) next.delete(post.id);
                                    else next.add(post.id);
                                    return next;
                                  });
                                }}
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                              </button>
                            )}
                          </div>
                        );
                      })()}

                      {/* Post Image */}
                      {post.image && (
                        <div className="relative w-full max-w-2xl mx-auto mb-4">
                          <div 
                            className="aspect-video bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => post.image && handleImageClick(post.image, post.title)}
                          >
                            <Image
                              src={post.image}
                              alt={post.title}
                              layout="fill"
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Post Metadata */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.collegeName && (
                        <span className="flex items-center gap-1 text-sm bg-blue-500/10 text-blue-300 px-2 py-1 rounded">
                          <Building className="w-3 h-3" />
                          {post.collegeName}
                        </span>
                      )}
                      {post.clubName && (
                        <span className="flex items-center gap-1 text-sm bg-purple-500/10 text-purple-300 px-2 py-1 rounded">
                          <Users className="w-3 h-3" />
                          {post.clubName}
                        </span>
                      )}

                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-yellow-400 hover:bg-black transition-colors"
                          onClick={() => handleSharePost(post.id, post.title)}
                        >
                          <Share className="w-4 h-4 mr-1" />
                          <span className="text-sm">Share</span>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                // No posts state
                <div className="text-center py-12">
                  <div className="bg-gray-800 rounded-lg p-8 border border-yellow-500/20">
                    <MessageCircle
                      size={48}
                      className="text-yellow-500 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                      No posts yet
                    </h3>
                    <AuroraText className="">
                      Be the first to create a post!
                    </AuroraText>
                    <Button
                      onClick={() => setIsPostModalOpen(true)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-md font-medium transition-colors mt-4"
                    >
                      Create Post
                    </Button>
                  </div>
                </div>
              )}

              {/* Loading more indicator */}
              {isFetchingMore && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                  <span className="ml-2 text-yellow-400 text-sm">
                    Loading more posts...
                  </span>
                </div>
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
                           
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button className="w-full py-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                      View all events →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border border-gray-600 hover:border-gray-500 rounded-full p-2 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </Button>
            
            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain rounded-lg"
                priority
              />
            </div>
            
            {/* Click outside to close */}
            <div 
              className="absolute inset-0 -z-10"
              onClick={closeImageModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
