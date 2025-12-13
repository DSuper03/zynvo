import { useState, useCallback } from 'react';
import {  useQueryClient, useMutation } from '@tanstack/react-query';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;

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

/**
 * Custom hook for managing post vote functionality (upvote & downvote)
 * Implements optimistic updates with automatic rollback on failure
 */
export function useVote({
  postId,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null,
}: UseVoteOptions): UseVoteReturn {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<VoteType>(initialUserVote);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const score = upvotes - downvotes;

  const vote = useCallback(async (voteType: 'upvote' | 'downvote') => {
    if (loading) return;

    setLoading(true);
    setError(null);

    // Store previous state for potential rollback
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;
    const prevUserVote = userVote;

    // Calculate new state based on vote type
    let newUpvotes = upvotes;
    let newDownvotes = downvotes;
    let newUserVote: VoteType = null;

    if (voteType === 'upvote') {
      if (userVote === 'upvote') {
        // Remove upvote
        newUpvotes = upvotes - 1;
        newUserVote = null;
      } else if (userVote === 'downvote') {
        // Switch from downvote to upvote
        newDownvotes = downvotes - 1;
        newUpvotes = upvotes + 1;
        newUserVote = 'upvote';
      } else {
        // Add upvote
        newUpvotes = upvotes + 1;
        newUserVote = 'upvote';
      }
    } else {
      if (userVote === 'downvote') {
       
        newDownvotes = downvotes - 1;
        newUserVote = null;
      } else if (userVote === 'upvote') {
        // Switch from upvote to downvote
        newUpvotes = upvotes - 1;
        newDownvotes = downvotes + 1;
        newUserVote = 'downvote';
      } else {
        // Add downvote
        newDownvotes = downvotes + 1;
        newUserVote = 'downvote';
      }
    }

    // Ensure non-negative values
    newUpvotes = Math.max(0, newUpvotes);
    newDownvotes = Math.max(0, newDownvotes);

    // Optimistic update
    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);
    setUserVote(newUserVote);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/post/${voteType}/${encodeURIComponent(postId)}`, {
        method: 'POST',
        headers,
        mode: 'cors',
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data.msg || `Failed to ${voteType}`);
      }

      
      if (data) {
        if (typeof data.upvoteCount === 'number') {
          setUpvotes(data.upvoteCount);
        }
        if (typeof data.downvoteCount === 'number') {
          setDownvotes(data.downvoteCount);
        }
        if (data.userVote !== undefined) {
          setUserVote(data.userVote);
        }
      }
    } catch (err) {
      // Rollback optimistic update on failure
      setUpvotes(prevUpvotes);
      setDownvotes(prevDownvotes);
      setUserVote(prevUserVote);
      
      const errorMessage = err instanceof Error ? err.message : `Failed to ${voteType}`;
      setError(errorMessage);
      console.error(`Failed to ${voteType}:`, err);
    } finally {
      setLoading(false);
    }
  }, [postId, upvotes, downvotes, userVote, loading]);

  const upvote = useCallback(() => vote('upvote'), [vote]);
  const downvote = useCallback(() => vote('downvote'), [vote]);

  return {
    upvotes,
    downvotes,
    score,
    userVote,
    loading,
    error,
    upvote,
    downvote,
  };
}

export default useVote;

