'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface UserData {
  name: string | null;
  profileAvatar: string | null;
}

interface WarmupContextType {
  userData: UserData;
  loading: boolean;
}

const WarmupContext = createContext<WarmupContextType | undefined>(undefined);

export const useWarmup = () => {
  const context = useContext(WarmupContext);
  if (!context) {
    throw new Error('useWarmup must be used within a WarmupProvider');
  }
  return context;
};

interface WarmupProviderProps {
  children: ReactNode;
}

export const WarmupProvider: React.FC<WarmupProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
    name: null,
    profileAvatar: null,
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      if (sessionStorage.getItem('activeSession') != 'true') {
        toast('login please');
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get<{
          msg: string;
          data: { name: string; profileAvatar: string };
        }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getSidebarUser`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response && response.status === 200) {
          setUserData({
            name: response.data.data.name,
            profileAvatar: response.data.data.profileAvatar,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        toast.error('Session expired, please log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const value = {
    userData,
    loading,
  };

  return (
    <WarmupContext.Provider value={value}>{children}</WarmupContext.Provider>
  );
};
