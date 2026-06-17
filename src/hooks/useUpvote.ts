import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export interface UseUpvoteOptions {
  postId: string;
  initialUpvotes?: number;
  initialIsUpvoted?: boolean;
}

export interface UseUpvoteReturn {
  upvotes: number;
  isUpvoted: boolean;
  loading: boolean;
  error: string | null;
  toggle: () => Promise<void>;
}

/**
 * Custom hook for managing post upvote functionality
 * Implements optimistic updates with automatic rollback on failure
 */
export function useUpvote({
  postId,
  initialUpvotes = 0,
  initialIsUpvoted = false,
}: UseUpvoteOptions): UseUpvoteReturn {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    // Store previous state for potential rollback
    const prevUpvotes = upvotes;
    const prevIsUpvoted = isUpvoted;

    // Calculate new state
    const newIsUpvoted = !prevIsUpvoted;
    const newUpvotes = newIsUpvoted ? prevUpvotes + 1 : Math.max(0, prevUpvotes - 1);

    // Optimistic update
    setIsUpvoted(newIsUpvoted);
    setUpvotes(newUpvotes);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(postId)}/upvote`, {
        method: 'POST',
        headers,
        // no body required for toggle endpoints
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to toggle upvote');
      }

      // If the backend returns updated data, sync with it
      if (data) {
        if (typeof data.upvoteCount === 'number') {
          setUpvotes(data.upvoteCount);
        }
        if (typeof data.isUpvoted === 'boolean') {
          setIsUpvoted(data.isUpvoted);
        }
      }
    } catch (err) {
      // Rollback optimistic update on failure
      setIsUpvoted(prevIsUpvoted);
      setUpvotes(prevUpvotes);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle upvote';
      setError(errorMessage);
      console.error('Failed to toggle upvote:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, upvotes, isUpvoted, loading]);

  return {
    upvotes,
    isUpvoted,
    loading,
    error,
    toggle,
  };
}

export default useUpvote;
