'use client';
import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DecodedToken {
  id?: string;
  email?: string;
  name?: string;
  pfp?: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id?: string;
    email?: string;
    name?: string;
    pfp?: string;
  } | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (tok) setToken(tok);
    }
  }, []);

  const loadUser = useCallback(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
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

  const hardLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('activeSession');
    setUser(null);
    toast('logged out');
  };

  const login = () => {
    if (!token) {
      toast('Please login manually');
      router.push('/auth/signin');
      return;
    }
    sessionStorage.setItem('activeSession', 'true');
    loadUser();
    toast('login success');
    router.push('/dashboard');
  };

  return { user, login, softLogout, hardLogout };
}
