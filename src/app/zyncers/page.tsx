'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <div
      onClick={handleClick}
      className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-all duration-500 hover:bg-yellow-400/20 hover:border-yellow-400/30 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10 transform-gpu overflow-hidden"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main card content */}
      <div className="relative p-6">
        <div className="flex items-center space-x-4">
          {/* Profile Picture */}
          <div className="relative">
            {user.profileAvatar ? (
              <img
                src={user.profileAvatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-700 group-hover:border-yellow-400 transition-colors duration-300"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold text-xl border-2 border-gray-700 group-hover:border-yellow-400 transition-colors duration-300">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            {/* Subtle glow around profile pic */}
            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* User Name */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 truncate">
              {user.name}
            </h3>
          </div>

          {/* Expand indicator */}
          <div className="text-gray-600 group-hover:text-yellow-400 transition-all duration-300">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Expanded content */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-4 border-t border-white/10">
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">
                <span className="text-white font-medium">College:</span>{' '}
                {user.collegeName || 'Not specified'}
              </p>
              {user.clubName && (
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">club:</span>{' '}
                  {user.clubName}
                </p>
              )}
              {user.year && (
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">Year:</span>{' '}
                  {user.email}
                </p>
              )}
              {user.course && (
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">Course:</span>{' '}
                  {user.course}
                </p>
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="text-yellow-400 text-sm font-medium">
                Click again to visit profile →
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sparkle effect on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
      </div>
    </div>
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
        <button
          onClick={handleBackToDashboard}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-3 hover:bg-yellow-400/20 hover:border-yellow-400/30 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-colors duration-300" />
        </button>
      </div>

      {/* FIXED: Main content with proper z-index */}
      <div className="relative z-10 pt-24">
        {/* Search Section */}
        <div className="w-full max-w-4xl mx-auto px-6 mb-12">
          {/* Search Bar - Made bigger */}
          <div className="relative mb-8">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/50 via-yellow-400/30 to-yellow-400/50 rounded-2xl blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center">
                <Search className="absolute left-8 w-8 h-8 text-gray-900 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Search for users by name..."
                  className="w-full pl-20 pr-8 py-6 bg-yellow-400 text-gray-900 placeholder-gray-700 rounded-2xl text-xl font-medium focus:outline-none focus:ring-4 focus:ring-yellow-400/30 transition-all duration-300 shadow-2xl backdrop-blur-sm"
                />

                {/* Loading indicator */}
                {isSearching && (
                  <div className="absolute right-8">
                    <div className="w-6 h-6 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search hint */}
          <p className="text-center text-gray-500 text-sm mb-8">
            {searchQuery.trim()
              ? `Showing ${displayUsers.length} search results`
              : 'Search above or browse all users below'}
          </p>
        </div>

        {/* Users Section */}
        <div className="max-w-6xl mx-auto px-6 pb-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {searchQuery.trim() ? 'Search Results' : 'All Users'}
              </h2>
              <p className="text-gray-400">
                {isSearching || isLoadingUsers
                  ? 'Loading...'
                  : `${displayUsers.length} user${displayUsers.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
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

              {/* Pagination Bar - only for all users view */}
              {!searchQuery.trim() && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoadingUsers}
                    className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-4 py-2 hover:bg-yellow-400/20 hover:border-yellow-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg w-10 h-10 hover:bg-yellow-400/20 hover:border-yellow-400/30 transition-all duration-300"
                        >
                          1
                        </button>
                        {currentPage > 4 && (
                          <span className="flex items-center px-2 text-gray-400">
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
                          className={`backdrop-blur-md border rounded-lg w-10 h-10 transition-all duration-300 ${
                            pageNum === currentPage
                              ? 'bg-yellow-400 border-yellow-400 text-gray-900 font-bold'
                              : 'bg-white/10 border-white/20 hover:bg-yellow-400/20 hover:border-yellow-400/30'
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
                          <span className="flex items-center px-2 text-gray-400">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg w-10 h-10 hover:bg-yellow-400/20 hover:border-yellow-400/30 transition-all duration-300"
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
                    className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-4 py-2 hover:bg-yellow-400/20 hover:border-yellow-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>

                  {/* Page info */}
                  <div className="ml-4 text-gray-400 text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {searchQuery.trim() ? 'No users found' : 'No users available'}
              </h3>
              <p className="text-gray-500">
                {searchQuery.trim()
                  ? 'Try searching with a different name or spelling'
                  : 'Check back later for new users'}
              </p>
            </div>
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
