'use client';
import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useClerk, useAuth as useClerkAuth } from '@clerk/nextjs';

interface DecodedToken {
  id?: string;
  email?: string;
  name?: string;
  pfp?: string;
}

export function useAuth() {
  const router = useRouter();
  const { signOut, session } = useClerk();
  const { isSignedIn } = useClerkAuth();
  const [user, setUser] = useState<{
    id?: string;
    email?: string;
    name?: string;
    pfp?: string;
  } | null>(null);

  const loadUser = useCallback(() => {
    const tok = localStorage.getItem('token');

    if (tok) {
      try {
        const decoded: DecodedToken = jwtDecode(tok);
        if (decoded.id) {
          setUser({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            pfp: decoded.pfp,
          });
        }
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const softLogout = () => {
    sessionStorage.removeItem('activeSession');
    setUser(null);
  };

  const hardLogout = async () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('activeSession');
    setUser(null);
    if (isSignedIn && session) {
      await signOut();
    }
    toast('logged out');
  };

  const login = () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      toast('Please login manually');
      router.push('/auth/signin');
      return;
    }
    sessionStorage.setItem('activeSession', 'true');
    loadUser();
    toast('login success');
    router.push('/dashboard');
  };

  // User is considered logged in if they have a JWT token, an active session, or an OAuth session
  const hasActiveSession = typeof window !== 'undefined' && sessionStorage.getItem('activeSession') === 'true';
  const isLoggedIn = !!(user || hasActiveSession || (isSignedIn && session));

  return { user, login, softLogout, hardLogout, isLoggedIn, isSignedIn: !!(isSignedIn && session) };
}
