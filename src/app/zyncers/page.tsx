"use client"
import { useState, useEffect } from 'react';
import { Search, User, ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Floating particles animation component
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

// Animated gradient background
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/2 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
    </div>
  );
};

// User card component with glassmorphism
const UserCard = ({ user, onClick }: { user: any, onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 cursor-pointer transition-all duration-500 hover:bg-yellow-400/20 hover:border-yellow-400/30 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10 transform-gpu"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-center space-x-4">
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

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 truncate">
            {user.name}
          </h3>
          <p className="text-gray-400 text-sm truncate">
            {user.collegeName || 'College not specified'}
          </p>
        </div>

        {/* Arrow indicator */}
        <div className="text-gray-600 group-hover:text-yellow-400 transform group-hover:translate-x-1 transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
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
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem("token");
      if (tok) setToken(tok);
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const baseUrl = 'http://localhost:8000';
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
        setUsers(data.users || []);
      } else if (response.status === 404) {
        setUsers([]);
        console.log("No users found with that name");
      } else {
        console.log("Error searching users");
        setUsers([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      console.log("Network error occurred");
      setUsers([]);
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
    // Navigate to profile page - you'll need to implement navigation logic
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      <FloatingParticles />

      {/* Back button - only show when searching */}
      {hasSearched && (
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={handleBackToDashboard}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-3 hover:bg-yellow-400/20 hover:border-yellow-400/30 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-colors duration-300" />
          </button>
        </div>
      )}

      <div className="relative z-10">
        {/* Search Section */}
        <div className={`transition-all duration-700 ease-in-out ${
          hasSearched 
            ? 'pt-24 pb-8' 
            : 'flex items-center justify-center min-h-screen'
        }`}>
          <div className={`w-full max-w-2xl mx-auto px-6 transition-all duration-700 ${
            hasSearched ? 'transform -translate-y-0' : ''
          }`}>
            
            {/* Greeting - hide when searched */}
            {!hasSearched && (
              <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-400 to-white bg-clip-text text-transparent animate-pulse-slow">
                  Hello
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 mb-2">
                  Who do you seek?
                </p>
                <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full animate-pulse" />
              </div>
            )}

            {/* Search Bar */}
            <div className={`relative transition-all duration-700 ${
              hasSearched ? 'mb-8' : 'mb-0'
            }`}>
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/50 via-yellow-400/30 to-yellow-400/50 rounded-full blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center">
                  <Search className="absolute left-6 w-6 h-6 text-gray-900 z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search for users..."
                    className="w-full pl-16 pr-6 py-4 bg-yellow-400 text-gray-900 placeholder-gray-700 rounded-full text-lg font-medium focus:outline-none focus:ring-4 focus:ring-yellow-400/30 transition-all duration-300 shadow-2xl backdrop-blur-sm"
                  />
                  
                  {/* Loading indicator */}
                  {isSearching && (
                    <div className="absolute right-6">
                      <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search hint - only show when not searched */}
            {!hasSearched && (
              <p className="text-center text-gray-500 text-sm animate-fade-in-delay">
                Start typing to discover amazing people...
              </p>
            )}
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="max-w-4xl mx-auto px-6 pb-12">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Search Results
                </h2>
                <p className="text-gray-400">
                  {isSearching 
                    ? 'Searching...' 
                    : `Found ${users.length} user${users.length !== 1 ? 's' : ''} for "${searchQuery}"`
                  }
                </p>
              </div>
              
              {users.length > 0 && (
                <div className="text-yellow-400 text-sm font-medium">
                  {users.length} result{users.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Users Grid */}
            {users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user: any, index) => (
                  <div
                    key={user.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <UserCard
                      user={user}
                      onClick={() => handleUserClick(user.id)}
                    />
                  </div>
                ))}
              </div>
            ) : searchQuery && !isSearching ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No users found
                </h3>
                <p className="text-gray-500">
                  Try searching with a different name or spelling
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(-10px) rotate(240deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.5s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}