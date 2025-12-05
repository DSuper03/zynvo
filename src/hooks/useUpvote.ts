import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Local storage key for persisting upvotes (demo mode)
const UPVOTES_STORAGE_KEY = 'zynvo_upvotes';

export interface UseUpvoteOptions {
  postId: string;
  initialUpvotes?: number;
  initialIsUpvoted?: boolean;
  /** If true, upvotes will persist locally even if API fails (for demo/testing) */
  enableLocalPersistence?: boolean;
}

export interface UseUpvoteReturn {
  upvotes: number;
  isUpvoted: boolean;
  loading: boolean;
  error: string | null;
  toggle: () => Promise<void>;
}

interface StoredUpvotes {
  [postId: string]: {
    isUpvoted: boolean;
    upvotesDelta: number; // How many upvotes user added/removed from initial
  };
}

// Helper functions for local storage
const getStoredUpvotes = (): StoredUpvotes => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(UPVOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const setStoredUpvote = (postId: string, isUpvoted: boolean, upvotesDelta: number) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredUpvotes();
    current[postId] = { isUpvoted, upvotesDelta };
    localStorage.setItem(UPVOTES_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Failed to persist upvote to localStorage:', e);
  }
};

const getStoredUpvote = (postId: string) => {
  const stored = getStoredUpvotes();
  return stored[postId] || null;
};

/**
 * Custom hook for managing post upvote functionality
 * Implements optimistic updates with automatic rollback on failure
 * Includes local persistence for demo mode when backend is not ready
 */
export function useUpvote({
  postId,
  initialUpvotes = 0,
  initialIsUpvoted = false,
  enableLocalPersistence = true, // Default to true for demo mode
}: UseUpvoteOptions): UseUpvoteReturn {
  // Initialize from local storage if available
  const [isInitialized, setIsInitialized] = useState(false);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    if (enableLocalPersistence && !isInitialized) {
      const stored = getStoredUpvote(postId);
      if (stored) {
        setIsUpvoted(stored.isUpvoted);
        setUpvotes(initialUpvotes + stored.upvotesDelta);
      }
      setIsInitialized(true);
    }
  }, [postId, initialUpvotes, enableLocalPersistence, isInitialized]);

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

    // Persist locally immediately (for demo mode)
    if (enableLocalPersistence) {
      const delta = newIsUpvoted ? 
        (initialUpvotes === prevUpvotes ? 1 : newUpvotes - initialUpvotes) : 
        (newUpvotes - initialUpvotes);
      setStoredUpvote(postId, newIsUpvoted, delta);
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/post/${postId}/upvote`, {
        method: 'POST',
        headers,
        credentials: token ? 'same-origin' : 'include',
      });

      if (!response.ok) {
        // If API returns error but we have local persistence, keep the local state
        if (enableLocalPersistence) {
          console.warn('API call failed, but keeping local state for demo mode');
          setLoading(false);
          return;
        }
        
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to toggle upvote');
      }

      // If the backend returns updated data, sync with it
      const data = await response.json().catch(() => null);
      if (data) {
        if (typeof data.upvoteCount === 'number') {
          setUpvotes(data.upvoteCount);
          // Update local storage with server truth
          if (enableLocalPersistence) {
            setStoredUpvote(postId, data.isUpvoted ?? newIsUpvoted, data.upvoteCount - initialUpvotes);
          }
        }
        if (typeof data.isUpvoted === 'boolean') {
          setIsUpvoted(data.isUpvoted);
        }
      }
    } catch (err) {
      // If local persistence is enabled, don't rollback - keep the optimistic state
      if (enableLocalPersistence) {
        console.warn('API unavailable, upvote persisted locally:', err);
        setLoading(false);
        return;
      }

      // Rollback optimistic update only if not using local persistence
      setIsUpvoted(prevIsUpvoted);
      setUpvotes(prevUpvotes);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle upvote';
      setError(errorMessage);
      console.error('Failed to toggle upvote:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, upvotes, isUpvoted, loading, initialUpvotes, enableLocalPersistence]);

  return {
    upvotes,
    isUpvoted,
    loading,
    error,
    toggle,
  };
}

export default useUpvote;
