"use client"

import { useState } from 'react';
import { Home, Calendar, BarChart2, Bell, User, Menu, X, Search, MapPin, Clock, Filter, ChevronDown } from 'lucide-react';

export default function ZynvoEventsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample events data
  const events = [
    {
      id: 1,
      title: "Web3 Developer Conference",
      description: "Join leading developers and innovators for the latest in blockchain and decentralized applications.",
      date: "May 15, 2025",
      time: "9:00 AM - 6:00 PM",
      location: "San Francisco, CA",
      image: "/api/placeholder/600/300",
      category: "conference",
      attending: 248,
      isRegistered: true
    },
    {
      id: 2,
      title: "Crypto Investment Summit",
      description: "Learn investment strategies from top crypto analysts and venture capitalists.",
      date: "May 22, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "New York, NY",
      image: "/api/placeholder/600/300",
      category: "summit",
      attending: 175,
      isRegistered: false
    },
    {
      id: 3,
      title: "Blockchain Technology Expo",
      description: "Explore the latest innovations in blockchain technology across various industries.",
      date: "June 5, 2025",
      time: "9:30 AM - 7:00 PM",
      location: "London, UK",
      image: "/api/placeholder/600/300",
      category: "expo",
      attending: 412,
      isRegistered: true
    },
    {
      id: 4,
      title: "NFT Art Gallery Opening",
      description: "Exclusive showcase of digital art and collectibles from renowned NFT artists.",
      date: "June 12, 2025",
      time: "7:00 PM - 10:00 PM",
      location: "Los Angeles, CA",
      image: "/api/placeholder/600/300",
      category: "exhibition",
      attending: 89,
      isRegistered: false
    },
    {
      id: 5,
      title: "DeFi Protocol Launch Party",
      description: "Be among the first to experience the revolutionary new DeFi protocol changing the finance landscape.",
      date: "June 18, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Miami, FL",
      image: "/api/placeholder/600/300",
      category: "launch",
      attending: 134,
      isRegistered: true
    },
    {
      id: 6,
      title: "Smart Contract Security Workshop",
      description: "Hands-on workshop for developers to learn best practices in smart contract security.",
      date: "June 25, 2025",
      time: "1:00 PM - 5:00 PM",
      location: "Austin, TX",
      image: "/api/placeholder/600/300",
      category: "workshop",
      attending: 62,
      isRegistered: false
    }
  ];

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Filter events based on active filter
  const filteredEvents = activeFilter === 'all' 
    ? events 
    : activeFilter === 'registered' 
      ? events.filter(event => event.isRegistered)
      : events.filter(event => !event.isRegistered);

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
                <a href="#" className="flex items-center bg-yellow-400 text-gray-900 px-4 py-2 rounded-md">
                  <Calendar className="w-5 h-5 mr-1" />
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-yellow-400">
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
                  J
                </div>
                <span className="ml-2 text-sm hidden lg:inline">John Doe</span>
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
                <a href="#" className="flex items-center text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-yellow-400">
                  <BarChart2 className="w-5 h-5 mr-2" />
                  Dashboard
                </a>
              </li>
              <li className="pt-4 border-t border-gray-700">
                <a href="#" className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold">
                    J
                  </div>
                  <span className="ml-2">John Doe</span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upcoming Events</h1>
          <p className="text-gray-400">Discover and register for the latest Web3 and blockchain events</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-900 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Search events..."
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
            
            <div className="flex bg-gray-900 rounded-lg">
              <button 
                className={`px-4 py-2 rounded-l-lg ${activeFilter === 'all' ? 'bg-yellow-400 text-gray-900' : 'text-white'}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 ${activeFilter === 'registered' ? 'bg-yellow-400 text-gray-900' : 'text-white'}`}
                onClick={() => setActiveFilter('registered')}
              >
                Registered
              </button>
              <button 
                className={`px-4 py-2 rounded-r-lg ${activeFilter === 'upcoming' ? 'bg-yellow-400 text-gray-900' : 'text-white'}`}
                onClick={() => setActiveFilter('upcoming')}
              >
                Not Registered
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-md">
              <div className="relative">
                <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                {event.isRegistered && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 text-xs font-bold rounded">
                    Registered
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-xl mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{event.attending} attending</span>
                  <button 
                    className={`px-4 py-2 rounded-md font-medium ${
                      event.isRegistered 
                        ? 'bg-gray-800 text-gray-300' 
                        : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                    }`}
                  >
                    {event.isRegistered ? 'Registered' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">Previous</button>
            <button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md">1</button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">2</button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">3</button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}