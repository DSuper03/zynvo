'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Search,
  User,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

// Floating particles animation component - FIXED Z-INDEX
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
};

// Animated gradient background - FIXED Z-INDEX
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/3 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/2 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: '4s' }}
      />
    </div>
  );
};

const UserCard = ({
  user,
  onClick,
  onNavigate,
}: {
  user: any;
  onClick: () => void;
  onNavigate: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      onClick();
    } else {
      onNavigate();
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-yellow-400/30 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-400/5 transform-gpu overflow-hidden"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main card content */}
      <div className="relative p-5">
        <div className="flex items-center space-x-4">
          {/* Profile Picture */}
          <div className="relative">
            {user.profileAvatar ? (
              <Image
                src={user.profileAvatar}
                alt={user.name || 'User'}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border border-white/20 group-hover:border-yellow-400/50 transition-colors duration-300"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-gray-900 font-semibold text-sm border border-white/20 group-hover:border-yellow-400/50 transition-colors duration-300">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white/20"></div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 truncate">
              {user.name}
            </h3>
            <p className="text-xs text-gray-400 truncate">
              {user.collegeName || 'Student'}
            </p>
          </div>

          {/* Expand indicator */}
          <div className="text-gray-500 group-hover:text-yellow-400 transition-all duration-300">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Expanded content */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-white/10">
            <div className="space-y-2">
              {user.collegeName && (
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  <p className="text-gray-300 text-xs">
                    {user.collegeName}
                  </p>
                </div>
              )}
              {user.clubName && (
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  <p className="text-gray-300 text-xs">
                    {user.clubName}
                  </p>
                </div>
              )}
              {user.course && (
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  <p className="text-gray-300 text-xs">
                    {user.course}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <span className="text-yellow-400 text-xs font-medium bg-yellow-400/10 px-3 py-1 rounded-full">
                View Profile
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle sparkle effect */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </motion.div>
  );
};

export default function UserSearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [token, setToken] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
      if (tok) setToken(tok);
    }
  }, []);

  // Fetch all users with pagination
  const fetchAllUsers = async (page = 1) => {
    try {
      setIsLoadingUsers(true);
      const response = await axios.get<{
        msg: string;
        totalPages: number;
        users: {
          id: string;
          collegeName: string;
          profileAvatar: string | null;
          name: string | null;
          clubName: string | null;
          year: string | null;
          course: string | null;
        }[];
      }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getAllUsers?page=${page}`
      );

      if (response.data) {
        const { users, totalPages: total } = response.data;

        setAllUsers(users || []);
        setTotalPages(total || 1);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchAllUsers(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (
      page !== currentPage &&
      page >= 1 &&
      page <= totalPages &&
      !isLoadingUsers
    ) {
      fetchAllUsers(page);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string;
      const url = new URL('/api/v1/user/SearchUser', baseUrl);
      url.searchParams.set('name', query);

      const headers: HeadersInit = {};
      if (token) {
        headers.authorization = `Bearer ${token}`;
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      } else if (response.status === 404) {
        setSearchResults([]);
        console.log('No users found with that name');
      } else {
        console.log('Error searching users');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      console.log('Network error occurred');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounced search
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleUserClick = (userId: string) => {
    // Just for the expand functionality - no navigation yet
  };

  const handleUserNavigate = (userId: string) => {
    toast(`Navigating to profile`);
    if (typeof window !== 'undefined') {
      window.location.href = `/zyncers/${userId}`;
    }
  };

  const handleBackToDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  const displayUsers = searchQuery.trim() ? searchResults : allUsers;

  return (
    // FIXED: Removed overflow-hidden and adjusted container
    <div className="min-h-screen bg-black text-white relative">
      {/* Animated Background */}
      <AnimatedBackground />
      <FloatingParticles />

      {/* Back button - FIXED Z-INDEX */}
      <div className="absolute top-6 left-6 z-30">
        
      </div>

      {/* FIXED: Main content with proper z-index */}
      <div className="relative z-10 pt-20">
        {/* Header Section */}
        <div className="w-full max-w-6xl mx-auto px-6 mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-yellow-100 to-yellow-400 bg-clip-text text-transparent">
              Discover Zyncers
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Connect with amazing people from your community
            </p>
          </div>

          {/* Elegant Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="relative group">
              {/* Subtle glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/20 via-yellow-400/10 to-yellow-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-gray-400 z-10 group-focus-within:text-yellow-400 transition-colors duration-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Search by name..."
                  className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 rounded-full text-sm font-medium focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all duration-300"
                />

                {/* Loading indicator */}
                {isSearching && (
                  <div className="absolute right-4">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-yellow-400 rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Search results counter */}
            {searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-3"
              >
                <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                  {displayUsers.length} result{displayUsers.length !== 1 ? 's' : ''} found
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Users Section */}
        <div className="max-w-6xl mx-auto px-6 pb-12">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {searchQuery.trim() ? 'Search Results' : 'Community Members'}
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
          </div>

          {/* Users Grid */}
          {displayUsers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayUsers.map((user: any, index) => (
                  <div
                    key={user.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <UserCard
                      user={user}
                      onClick={() => handleUserClick(user.id)}
                      onNavigate={() => handleUserNavigate(user.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Elegant Pagination - only for all users view */}
              {!searchQuery.trim() && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-3 mt-16">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoadingUsers}
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex space-x-1">
                    {/* First page */}
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full w-8 h-8 text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-300"
                        >
                          1
                        </button>
                        {currentPage > 4 && (
                          <span className="flex items-center px-2 text-gray-500 text-sm">
                            ...
                          </span>
                        )}
                      </>
                    )}

                    {/* Visible page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      if (pageNum < 1 || pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isLoadingUsers}
                          className={`backdrop-blur-md border rounded-full w-8 h-8 text-sm font-medium transition-all duration-300 ${
                            pageNum === currentPage
                              ? 'bg-yellow-400 border-yellow-400 text-gray-900'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-yellow-400/30 hover:text-yellow-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="flex items-center px-2 text-gray-500 text-sm">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full w-8 h-8 text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-300"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoadingUsers}
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                {searchQuery.trim() ? 'No users found' : 'No users available'}
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {searchQuery.trim()
                  ? 'Try searching with a different name or spelling'
                  : 'Check back later for new users'}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(-10px) rotate(240deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
