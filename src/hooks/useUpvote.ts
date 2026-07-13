/**
 * Legacy upvote hook — requests go through the same-origin proxy.
 * Prefer useVote for new code.
 */
import { useState, useCallback } from 'react';

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

    const prevUpvotes = upvotes;
    const prevIsUpvoted = isUpvoted;
    const newIsUpvoted = !prevIsUpvoted;
    const newUpvotes = newIsUpvoted
      ? prevUpvotes + 1
      : Math.max(0, prevUpvotes - 1);

    setIsUpvoted(newIsUpvoted);
    setUpvotes(newUpvotes);

    try {
      const response = await fetch(
        `/api/v1/posts/${encodeURIComponent(postId)}/upvote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to toggle upvote');
      }

      if (data) {
        if (typeof data.upvoteCount === 'number') setUpvotes(data.upvoteCount);
        if (typeof data.isUpvoted === 'boolean') setIsUpvoted(data.isUpvoted);
      }
    } catch (err) {
      setIsUpvoted(prevIsUpvoted);
      setUpvotes(prevUpvotes);
      setError(err instanceof Error ? err.message : 'Failed to toggle upvote');
    } finally {
      setLoading(false);
    }
  }, [postId, upvotes, isUpvoted, loading]);

  return { upvotes, isUpvoted, loading, error, toggle };
}

export default useUpvote;
