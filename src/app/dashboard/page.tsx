"use client"
import { useState } from 'react';
import { Home, Calendar, BarChart2, Bell, User, Menu, X } from 'lucide-react';

export default function ZynvoDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Sample user data
  const userData = {
    name: "John Doe",
    posts: 24,
    events: 12,
    recentPosts: [
      { id: 1, title: "Blockchain Basics", date: "Apr 28, 2025", likes: 42 },
      { id: 2, title: "Future of Web3", date: "Apr 22, 2025", likes: 38 },
      { id: 3, title: "Understanding DeFi", date: "Apr 15, 2025", likes: 29 },
      { id: 4, title: "NFT Marketplace Analysis", date: "Apr 8, 2025", likes: 56 }
    ],
    recentEvents: [
      { id: 1, title: "Web3 Developer Conference", date: "Apr 30, 2025", location: "San Francisco" },
      { id: 2, title: "Crypto Investment Summit", date: "Apr 18, 2025", location: "New York" },
      { id: 3, title: "Blockchain Technology Expo", date: "Mar 25, 2025", location: "London" }
    ]
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="bg-black text-white p-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="text-yellow-400 font-bold text-2xl flex items-center">
            <BarChart2 className="mr-2" />
            Zynvo
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-yellow-400">
                  <Home className="w-5 h-5 mr-1" />
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-yellow-400">
                  <Calendar className="w-5 h-5 mr-1" />
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center bg-yellow-400 text-gray-900 px-4 py-2 rounded-md">
                  <BarChart2 className="w-5 h-5 mr-1" />
                  Dashboard
                </a>
              </li>
            </ul>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-yellow-400">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold">
                  {userData.name.charAt(0)}
                </div>
                <span className="ml-2 text-sm hidden lg:inline">{userData.name}</span>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-yellow-400">
                  <Home className="w-5 h-5 mr-2" />
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-yellow-400">
                  <Calendar className="w-5 h-5 mr-2" />
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-white">
                  <BarChart2 className="w-5 h-5 mr-2" />
                  Dashboard
                </a>
              </li>
              <li className="pt-4 border-t border-gray-700">
                <a href="#" className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold">
                    {userData.name.charAt(0)}
                  </div>
                  <span className="ml-2">{userData.name}</span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Your Dashboard</h1>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-md">
            Create New Post
          </button>
        </div>
        
        {/* Profile Card */}
        <div className="bg-gray-900 rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
          <div className="relative px-6 pb-6">
            <div className="absolute -top-12 left-6">
              <div className="w-24 h-24 rounded-full border-4 border-gray-900 bg-yellow-400 flex items-center justify-center text-gray-900 text-4xl font-bold">
                {userData.name.charAt(0)}
              </div>
            </div>
            <div className="pt-16">
              <h2 className="text-xl font-bold text-white">{userData.name}</h2>
              <p className="text-gray-400 mb-4">Web3 Enthusiast & Developer</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm">Blockchain</span>
                <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm">NFT</span>
                <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm">Smart Contracts</span>
                <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-sm">DeFi</span>
              </div>
              <div className="flex space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>Joined Jan 2025</span>
                </div>
                <div className="flex items-center">
                  <BarChart2 className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>{userData.posts} Posts</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>{userData.events} Events</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Posts</p>
                <h2 className="text-4xl font-bold text-white">{userData.posts}</h2>
                <p className="text-gray-400 mt-2 text-sm">+3 posts this month</p>
              </div>
              <div className="bg-yellow-400 p-3 rounded-full">
                <BarChart2 className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Events Attended</p>
                <h2 className="text-4xl font-bold text-white">{userData.events}</h2>
                <p className="text-gray-400 mt-2 text-sm">+2 events this month</p>
              </div>
              <div className="bg-yellow-400 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts & Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Your Recent Posts</h3>
              <a href="#" className="text-yellow-400 hover:text-yellow-500 text-sm font-medium">
                View All
              </a>
            </div>
            <ul className="divide-y divide-gray-700">
              {userData.recentPosts.map(post => (
                <li key={post.id} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-gray-200 font-medium">{post.title}</h4>
                      <p className="text-gray-400 text-sm">{post.date}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm mr-1">{post.likes}</span>
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 15.585l-7.07-7.07 1.41-1.41L10 12.585l5.66-5.66 1.41 1.41-7.07 7.07z" />
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Events */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Recent Events Attended</h3>
              <a href="#" className="text-yellow-400 hover:text-yellow-500 text-sm font-medium">
                View All
              </a>
            </div>
            <ul className="divide-y divide-gray-700">
              {userData.recentEvents.map(event => (
                <li key={event.id} className="py-4">
                  <h4 className="text-gray-200 font-medium">{event.title}</h4>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <Calendar className="w-4 h-4 mr-1 text-yellow-400" />
                    <span>{event.date}</span>
                    <span className="mx-2">•</span>
                    <span>{event.location}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}