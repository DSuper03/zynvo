'use client';
import axios from 'axios';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MessageCircle, PenSquare, X } from 'lucide-react';

import CreatePostButton from './components/CreatePostButton';
import CreatePostModal from './components/CreatePostModal';
import { PostData } from '@/types/global-Interface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { setPostCache } from '@/lib/postCache';
import ProfileHeaderCompact from '@/components/ProfileHeaderCompact';
import { NotificationDropdown } from '@/components/notifications';
import { EmptyState, ErrorState, FeedPostSkeleton } from '@/components/feedback';
import { FeedPostCard } from '@/components/discover/FeedPostCard';

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
  const [feedRetryNonce, setFeedRetryNonce] = useState(0);

  // Image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const router = useRouter();

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

  // Function to handle image modal - memoized
  const handleImageClick = useCallback((src: string, alt: string) => {
    setSelectedImage({ src, alt });
    setIsImageModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  }, []);

  // Handle escape key to close modal — PERFORMANCE: cleanup always runs; closeImageModal in deps for stable handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageModalOpen) {
        closeImageModal();
      }
    };

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen, closeImageModal]);


  // Function to handle post sharing - memoized
  const handleSharePost = useCallback(async (postId: string, postTitle: string) => {
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
      // Error already surfaced via toast fallbacks
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
  }, []);

  // Memoize slider events length
  const sliderEventsLength = useMemo(() => sliderEvents.length, [sliderEvents.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx((idx) => (idx + 1) % sliderEventsLength);
    }, 3500);
    return () => clearInterval(interval);
  }, [sliderEventsLength]);

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
  }, [page, feedRetryNonce]);

  // Infinite scroll handler with debouncing
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 200 &&
            hasMore &&
            !isLoading &&
            !isFetchingMore
          ) {
            setPage((prev) => prev + 1);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
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
              {/* Mobile View - Profile Header and Create Post Button */}
              <div className="flex sm:hidden items-center justify-between gap-3 w-full">
                {/* Profile Header Compact - Left side */}
                <div className="flex-1 min-w-0">
                  <ProfileHeaderCompact />
                </div>
                
                {/* Right side actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Notification Dropdown */}
                  <NotificationDropdown />
                  
                  {/* Circular Create Post Button */}
                  <Button
                    onClick={() => setIsPostModalOpen(true)}
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_10px_35px_rgb(0,0,0,0.18)] transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-yellow-500 via-yellow-400 to-amber-300 hover:from-yellow-500 hover:via-yellow-500 hover:to-yellow-400 border border-yellow-300/40 relative overflow-hidden"
                  >
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="absolute -inset-[120%] bg-white/20 rotate-12 translate-x-[-20%] group-hover:translate-x-[60%] transition-transform duration-700 ease-out" />
                    </span>
                    <PenSquare className="h-5 w-5 text-black" />
                  </Button>
                </div>
              </div>

              {/* Desktop View - Create Post Button and Notifications */}
              <div className="hidden sm:flex items-center gap-3">
                <NotificationDropdown />
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
                <FeedPostSkeleton count={3} />
              ) : error ? (
                <ErrorState
                  title="Could not load the feed"
                  message={error}
                  onRetry={() => {
                    setError(null);
                    setPage(1);
                    setFeedRetryNonce((n) => n + 1);
                  }}
                  retryLabel="Try again"
                />
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <FeedPostCard
                    key={post.id}
                    post={post}
                    timeLabel={getTimeAgo(post.createdAt)}
                    isDescriptionExpanded={expandedPosts.has(post.id)}
                    onToggleDescription={(e) => {
                      e.stopPropagation();
                      setExpandedPosts((prev) => {
                        const next = new Set(prev);
                        if (next.has(post.id)) next.delete(post.id);
                        else next.add(post.id);
                        return next;
                      });
                    }}
                    onOpenPost={() => {
                      setPostCache(post.id, post);
                      router.push(`/post/${post.id}`);
                    }}
                    onImageClick={handleImageClick}
                    onShare={(e) => {
                      e.stopPropagation();
                      handleSharePost(post.id, post.title);
                    }}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-yellow-500/15 bg-gray-900/40 p-2 sm:p-4">
                  <EmptyState
                    icon={MessageCircle}
                    title="No posts yet"
                    description="Be the first to share something with your campus — updates, events, or questions."
                  >
                    <Button
                      type="button"
                      onClick={() => setIsPostModalOpen(true)}
                      className="min-h-11 bg-yellow-500 hover:bg-yellow-400 text-black px-6 font-medium"
                    >
                      Create post
                    </Button>
                  </EmptyState>
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
        </div>
      </div>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />

      {/* Image Modal - click backdrop to close */}
      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeImageModal}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div
            className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border border-gray-600 hover:border-gray-500 rounded-full p-2 transition-all duration-200"
              aria-label="Close preview"
            >
              <X className="w-6 h-6" />
            </Button>
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
          </div>
        </div>
      )}
    </div>
  );
}
