import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PostData } from '@/types/global-Interface';

interface ApiResponse {
  msg: string;
  posts: PostData[];
}

interface UsePostsOptions {
  page: number;
}

interface UsePostsReturn {
  posts: PostData[];
  isLoading: boolean;
  isFetchingMore: boolean;
  error: string | null;
  hasMore: boolean;
  fetchPosts: () => Promise<void>;
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
}

/**
 * Custom hook for fetching posts with authentication
 * Handles pagination and infinite scroll
 */
export function usePosts({ page }: UsePostsOptions): UsePostsReturn {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(page === 1);
      setIsFetchingMore(page > 1);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/all?page=${page}`,
        { headers }
      );

      const newPosts = response.data?.posts || [];
      
      console.log('[usePosts] Fetched posts:', {
        page,
        count: newPosts.length,
        hasVoteData: newPosts.some(p => 'upvoteCount' in p || 'userVote' in p),
        samplePost: newPosts[0] ? {
          id: newPosts[0].id,
          upvoteCount: (newPosts[0] as any).upvoteCount,
          downvoteCount: (newPosts[0] as any).downvoteCount,
          userVote: (newPosts[0] as any).userVote
        } : null
      });
      
      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      
      // If less than 10 posts returned, no more data
      setHasMore(newPosts.length === 10);
    } catch (err) {
      setError('Failed to fetch posts');
      if (page === 1) setPosts([]);
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    isLoading,
    isFetchingMore,
    error,
    hasMore,
    fetchPosts,
    setPosts,
  };
}

export default usePosts;
