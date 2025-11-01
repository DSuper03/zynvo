'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  Share2,
  ArrowLeft,
  Calendar,
  User,
  Building,
  Users,
  Clock,
} from 'lucide-react';
import { PostData } from '@/types/global-Interface';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TextWithLinks from '@/components/TextWithLinks';
import { Skeleton } from '@/components/ui/skeleton';

interface PostResponse {
  msg?: string;
  post?: PostData;
  response?: PostData;
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Format date function
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get time ago
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

  // Handle post sharing
  const handleSharePost = async () => {
    if (!post) return;

    try {
      const postUrl = `${window.location.origin}/post/${post.id}`;

      // Check if Web Share API is supported (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: `Check out this post: ${post.title}`,
          url: postUrl,
        });
        toast.success('Post shared successfully!');
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(postUrl);
        toast.success('Post link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      // Fallback method for older browsers
      try {
        const postUrl = `${window.location.origin}/post/${post.id}`;
        const textArea = document.createElement('textarea');
        textArea.value = postUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Post link copied to clipboard!');
      } catch (fallbackError) {
        toast.error('Unable to copy link. Please try again.');
      }
    }
  };

  // Fetch token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  // Fetch post data
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try different possible API endpoints
        const endpoints = [
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/${postId}`,
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/get/${postId}`,
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/details/${postId}`,
        ];

        let response: Awaited<ReturnType<typeof axios.get<PostResponse>>> | null = null;
        let lastError: any = null;

        for (const endpoint of endpoints) {
          try {
            response = await axios.get<PostResponse>(endpoint, {
              headers: token
                ? {
                    authorization: `Bearer ${token}`,
                  }
                : {},
            });

            if (response.status === 200 && (response.data.post || response.data.response || response.data)) {
              break;
            }
          } catch (err: any) {
            lastError = err;
            continue;
          }
        }

        if (!response || !response.data) {
          throw lastError || new Error('Post not found');
        }

        const postData =
          response.data.post ||
          response.data.response ||
          (response.data as any as PostData);

        if (!postData || !postData.id) {
          throw new Error('Post not found');
        }

        setPost(postData as PostData);
      } catch (error: any) {
        console.error('Error fetching post:', error);
        if (error.response?.status === 404) {
          setError('Post not found');
        } else {
          setError('Failed to load post. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-yellow-400 hover:text-yellow-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-2">
              {error || 'Post not found'}
            </h2>
            <p className="text-gray-400 mb-4">
              {error || 'The post you are looking for does not exist or has been removed.'}
            </p>
            <Button
              onClick={() => router.push('/discover')}
              className="bg-yellow-500 hover:bg-yellow-400 text-black"
            >
              Browse Posts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-yellow-400 hover:text-yellow-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>

        {/* Post Content */}
        <div className="bg-gray-800 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-colors overflow-hidden">
          {/* Author Info Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14">
                {post.author?.profileAvatar ? (
                  <Image
                    src={post.author.profileAvatar}
                    alt={post.author.name || 'User'}
                    width={56}
                    height={56}
                    className="rounded-full object-cover border-2 border-yellow-500/30"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-500/30">
                    <User className="w-7 h-7 text-black" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold text-white">
                    {post.author?.name || 'Anonymous User'}
                  </h2>
                  {!post.published && (
                    <span className="px-2 py-0.5 bg-gray-600 text-xs rounded-full text-gray-300">
                      Draft
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  {post.createdAt !== post.updatedAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Edited {getTimeAgo(post.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">
              {post.title}
            </h1>

            {/* Metadata Tags */}
            <div className="flex flex-wrap gap-2">
              {post.collegeName && (
                <span className="flex items-center gap-1 text-sm bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full border border-blue-500/20">
                  <Building className="w-3 h-3" />
                  {post.collegeName}
                </span>
              )}
              {post.clubName && (
                <span className="flex items-center gap-1 text-sm bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
                  <Users className="w-3 h-3" />
                  {post.clubName}
                </span>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            {/* Post Description */}
            <div className="text-gray-300 leading-relaxed mb-6 text-lg">
              <TextWithLinks text={post.description} />
            </div>

            {/* Post Image */}
            {post.image && (
              <div className="relative w-full mb-6">
                <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    layout="fill"
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <Button
                onClick={handleSharePost}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Post
              </Button>
              <div className="text-sm text-gray-400">
                Posted {getTimeAgo(post.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Related Content Section (optional) */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => router.push('/discover')}
            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
          >
            Discover More Posts
          </Button>
        </div>
      </div>
    </div>
  );
}

