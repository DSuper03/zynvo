/**
 * Posts hook — all requests go through the same-origin proxy (/api/v1/post/*).
 */
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

      // No auth header needed — server-side Clerk token is injected by the proxy
      const response = await axios.get<ApiResponse>(
        `/api/v1/post/all?page=${page}`
      );

      const newPosts = response.data?.posts || [];

      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length === 10);
    } catch {
      setError('Failed to fetch posts');
      if (page === 1) setPosts([]);
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
