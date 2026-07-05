/**
 * Vote hook — requests go through the same-origin proxy (/api/v1/post/*).
 * No auth tokens are read from localStorage; the proxy handles auth server-side.
 */
import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export type VoteType = 'upvote' | 'downvote' | null;

export interface UseVoteOptions {
  postId: string;
  initialUpvotes?: number;
  initialDownvotes?: number;
  initialUserVote?: VoteType;
}

export interface UseVoteReturn {
  upvotes: number;
  downvotes: number;
  score: number;
  userVote: VoteType;
  loading: boolean;
  error: string | null;
  upvote: () => Promise<void>;
  downvote: () => Promise<void>;
}

export function useVote({
  postId,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null,
}: UseVoteOptions): UseVoteReturn {
  const queryClient = useQueryClient();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<VoteType>(initialUserVote);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const score = upvotes - downvotes;

  // Hydrate from localStorage per-post persistence across reloads
  useEffect(() => {
    if (typeof window === 'undefined' || initialUserVote) return;
    try {
      const stored = window.localStorage.getItem(`post-vote:${postId}`);
      if (stored === 'upvote' || stored === 'downvote') {
        setUserVote(stored as VoteType);
      }
    } catch {
      // Ignore storage errors
    }
  }, [postId, initialUserVote]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `post-vote:${postId}`;
    try {
      if (userVote === 'upvote' || userVote === 'downvote') {
        window.localStorage.setItem(key, userVote);
      } else {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore storage errors
    }
  }, [postId, userVote]);

  const vote = useCallback(
    async (voteType: 'upvote' | 'downvote') => {
      if (loading) return;

      setLoading(true);
      setError(null);

      const prevUpvotes = upvotes;
      const prevDownvotes = downvotes;
      const prevUserVote = userVote;

      let newUpvotes = upvotes;
      let newDownvotes = downvotes;
      let newUserVote: VoteType = null;

      if (voteType === 'upvote') {
        if (userVote === 'upvote') {
          newUpvotes = upvotes - 1;
          newUserVote = null;
        } else if (userVote === 'downvote') {
          newDownvotes = downvotes - 1;
          newUpvotes = upvotes + 1;
          newUserVote = 'upvote';
        } else {
          newUpvotes = upvotes + 1;
          newUserVote = 'upvote';
        }
      } else {
        if (userVote === 'downvote') {
          newDownvotes = downvotes - 1;
          newUserVote = null;
        } else if (userVote === 'upvote') {
          newUpvotes = upvotes - 1;
          newDownvotes = downvotes + 1;
          newUserVote = 'downvote';
        } else {
          newDownvotes = downvotes + 1;
          newUserVote = 'downvote';
        }
      }

      newUpvotes = Math.max(0, newUpvotes);
      newDownvotes = Math.max(0, newDownvotes);

      // Optimistic update
      setUpvotes(newUpvotes);
      setDownvotes(newDownvotes);
      setUserVote(newUserVote);

      queryClient.setQueryData(['post-votes', postId], {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: newUserVote,
      });

      try {
        const response = await fetch(
          `/api/v1/post/${voteType}/${encodeURIComponent(postId)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.msg || `Failed to ${voteType}`);
        }

        if (data) {
          if (typeof data.upvoteCount === 'number') setUpvotes(data.upvoteCount);
          if (typeof data.downvoteCount === 'number') setDownvotes(data.downvoteCount);
          if (data.userVote !== undefined) setUserVote(data.userVote);

          queryClient.setQueryData(['post-votes', postId], {
            upvotes: typeof data.upvoteCount === 'number' ? data.upvoteCount : newUpvotes,
            downvotes: typeof data.downvoteCount === 'number' ? data.downvoteCount : newDownvotes,
            userVote: data.userVote ?? newUserVote,
          });
        }
      } catch (err) {
        setUpvotes(prevUpvotes);
        setDownvotes(prevDownvotes);
        setUserVote(prevUserVote);
        setError(err instanceof Error ? err.message : `Failed to ${voteType}`);
      } finally {
        setLoading(false);
      }
    },
    [postId, upvotes, downvotes, userVote, loading, queryClient]
  );

  const upvote = useCallback(() => vote('upvote'), [vote]);
  const downvote = useCallback(() => vote('downvote'), [vote]);

  return { upvotes, downvotes, score, userVote, loading, error, upvote, downvote };
}

export default useVote;
