"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { cmapData, campusFloors, FloorEntry } from '@/data/cmapData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Building2, AlertCircle, Sparkles, Navigation, Compass, Layers, DoorOpen, Zap, Grid3x3 } from 'lucide-react';

const CmapPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isTechno, setIsTechno] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'floors'>('all');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getUser`, {
          headers: { authorization: `Bearer ${token}` },
        });

        const userData = (res as any).data?.user as any;
        const userCollege =
          (userData && (userData.college || userData.collegeName || userData.college_name)) ||
          (userData && userData.college?.name);

        if (typeof userCollege === 'string' && userCollege.trim().toLowerCase() === 'techno main salt lake') {
          setIsTechno(true);
        } else {
          setIsTechno(false);
        }
      } catch (err) {
        // ignore errors for now
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  const allSearchableData = React.useMemo(() => {
    const items: Array<{
      id: string;
      name: string;
      type: string;
      location: string;
      description?: string;
      roomNo?: string;
      department?: string | null;
      floor?: string;
    }> = [...cmapData];

    // Add room entries from all floors
    campusFloors.forEach((floorData) => {
      floorData.rooms.forEach((room) => {
        items.push({
          id: `room-${floorData.floor}-${room.roomNo}`,
          name: `Room ${room.roomNo}`,
          type: 'room',
          location: `${floorData.floor}`,
          description: room.description,
          roomNo: room.roomNo,
          department: room.department,
          floor: floorData.floor,
        });
      });
    });

    return items;
  }, []);

  // Perform client-side filtering
  const filteredResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let results = allSearchableData;

    // Filter by selected floor if viewing floors
    if (viewMode === 'floors' && selectedFloor) {
      results = results.filter((item) => item.floor === selectedFloor);
    }

    // Filter by query
    if (q) {
      results = results.filter((item) => {
      return Object.values(item).some((val) =>
        String(val || '').toLowerCase().includes(q)
      );
    });
    }

    return results;
  }, [query, selectedFloor, viewMode, allSearchableData]);

  // Get rooms for selected floor
  const selectedFloorRooms = React.useMemo(() => {
    if (!selectedFloor) return [];
    const floorData = campusFloors.find((f) => f.floor === selectedFloor);
    return floorData?.rooms || [];
  }, [selectedFloor]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gate': return <Navigation className="w-4 h-4" />;
      case 'canteen': return <Building2 className="w-4 h-4" />;
      case 'library': return <Building2 className="w-4 h-4" />;
      case 'lab': return <Building2 className="w-4 h-4" />;
      case 'lift': return <Building2 className="w-4 h-4" />;
      case 'playground': return <Compass className="w-4 h-4" />;
      case 'facility': return <Building2 className="w-4 h-4" />;
      case 'roomSeries': return <Building2 className="w-4 h-4" />;
      case 'room': return <DoorOpen className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'gate': return 'default';
      case 'canteen': return 'secondary';
      case 'library': return 'outline';
      case 'lab': return 'outline';
      case 'room': return 'outline';
      default: return 'secondary';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    hover: {
      scale: 1.02,
      y: -4,
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-full border-4 border-gray-800"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-yellow-500"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm font-medium"
          >
            Loading campus data...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {isTechno ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-semibold shadow-xl shadow-green-500/30 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Hi pal</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge variant="outline" className="text-gray-300 border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
                  Techno Main Salt Lake
                </Badge>
                </motion.div>
              </div>
              
              <div className="space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                >
                  Campus Navigator
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-base sm:text-lg max-w-2xl"
                >
                  Explore gates, canteens, labs, lifts, facilities, and rooms across campus with ease
                </motion.p>
              </div>
              
              {/* View Mode Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 p-1.5 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800/50 w-fit"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setViewMode('all');
                    setSelectedFloor(null);
                    setQuery('');
                  }}
                  className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    viewMode === 'all'
                      ? 'text-black'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {viewMode === 'all' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg shadow-lg shadow-yellow-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4" />
                    All Locations
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setViewMode('floors');
                    setQuery('');
                  }}
                  className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    viewMode === 'floors'
                      ? 'text-black'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {viewMode === 'floors' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg shadow-lg shadow-yellow-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Browse Floors
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Floor Selector (when in floors view) */}
            <AnimatePresence mode="wait">
              {viewMode === 'floors' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-800/50 shadow-2xl">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <Layers className="w-4 h-4" />
                          </motion.div>
                          <span>Select a floor to view rooms</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                          {campusFloors.map((floorData, index) => (
                            <motion.button
                              key={floorData.floor}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedFloor(floorData.floor);
                                setQuery('');
                              }}
                              className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all text-left overflow-hidden ${
                                selectedFloor === floorData.floor
                                  ? 'bg-gradient-to-br from-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-500/30'
                                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                              }`}
                            >
                              {selectedFloor === floorData.floor && (
                                <motion.div
                                  layoutId="selectedFloor"
                                  className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-500"
                                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                              )}
                              <div className="relative z-10">
                                <div className="font-bold text-base">{floorData.floor}</div>
                                <div className={`text-xs mt-0.5 ${selectedFloor === floorData.floor ? 'opacity-80' : 'opacity-60'}`}>
                                  {floorData.phase}
                                </div>
                                <div className={`text-xs mt-1.5 flex items-center gap-1 ${selectedFloor === floorData.floor ? 'opacity-90' : 'opacity-50'}`}>
                                  <Zap className="w-3 h-3" />
                                  {floorData.rooms.length} {floorData.rooms.length === 1 ? 'room' : 'rooms'}
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        {selectedFloor && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedFloor(null)}
                            className="text-xs text-gray-400 hover:text-yellow-400 transition-colors underline flex items-center gap-1"
                          >
                            Clear selection
                          </motion.button>
                        )}
            </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Section */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-800/50 shadow-2xl">
              <CardContent className="pt-6">
                  <div className="relative group">
                    <motion.div
                      animate={{ rotate: query ? [0, 10, -10, 0] : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors z-10" />
                    </motion.div>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                      placeholder={
                        viewMode === 'floors' && selectedFloor
                          ? `Search rooms on ${selectedFloor}...`
                          : "Search by name, type, location, room number, or department..."
                      }
                      className="pl-12 pr-4 bg-gray-800/30 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 h-14 text-base rounded-xl transition-all duration-300"
                    />
                    {query && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        ×
                      </motion.button>
                    )}
                </div>
                  <AnimatePresence>
                {query && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs text-gray-400 mt-3 flex items-center gap-2"
                      >
                        <Zap className="w-3 h-3 text-yellow-500" />
                        Found <span className="font-semibold text-yellow-400">{filteredResults.length}</span> {filteredResults.length === 1 ? 'result' : 'results'}
                      </motion.p>
                    )}
                  </AnimatePresence>
              </CardContent>
            </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Show message when in floors view but no floor selected */}
              <AnimatePresence>
                {viewMode === 'floors' && !selectedFloor && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-800/50 shadow-2xl">
                      <CardContent className="py-16">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center border border-gray-700/50"
                          >
                            <Layers className="w-10 h-10 text-gray-500" />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-200 mb-2">Select a Floor</h3>
                            <p className="text-sm text-gray-500">Choose a floor from above to view its rooms</p>
                          </div>
                      </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Show selected floor header when in floors view */}
              <AnimatePresence>
                {viewMode === 'floors' && selectedFloor && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-between mb-4 p-4 bg-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-800/50">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {selectedFloor}
                        </h2>
                        <p className="text-sm text-gray-400">
                          {selectedFloorRooms.length} {selectedFloorRooms.length === 1 ? 'Room' : 'Rooms'} available
                        </p>
                      </div>
                      <Badge variant="outline" className="text-gray-300 border-gray-700/50 bg-gray-800/50 backdrop-blur-sm px-3 py-1">
                        {campusFloors.find((f) => f.floor === selectedFloor)?.phase}
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {viewMode === 'floors' && !selectedFloor ? null : (
                <AnimatePresence mode="wait">
                  {filteredResults.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-800/50 shadow-2xl">
                        <CardContent className="py-16">
                          <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-700/50"
                            >
                              <AlertCircle className="w-10 h-10 text-gray-600" />
                            </motion.div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-200 mb-2">No results found</h3>
                              <p className="text-sm text-gray-500">
                                {viewMode === 'floors' && selectedFloor
                                  ? 'Try a different search term or select another floor'
                                  : 'Try a different search term'}
                              </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {filteredResults.map((item, i) => {
                        const isRoom = item.type === 'room';
                        const badgeVariant = getTypeBadgeVariant(item.type);
                        return (
                          <motion.div
                            key={item.id || i}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            transition={{ delay: i * 0.05 }}
                          >
                            <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-800/50 hover:border-yellow-500/50 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 group cursor-pointer h-full">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      {getTypeIcon(item.type)}
                                      <CardTitle className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors truncate">
                                        {isRoom && item.roomNo ? `Room ${item.roomNo}` : item.name}
                                      </CardTitle>
                                    </div>
                                  </div>
                                  <Badge 
                                    variant={badgeVariant}
                                    className={`flex-shrink-0 capitalize text-xs border-gray-700/50 ${
                                      badgeVariant === 'default'
                                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                        : badgeVariant === 'secondary'
                                        ? 'bg-gray-700/50 text-gray-200'
                                        : 'bg-gray-800/50 text-gray-200'
                                    }`}
                                  >
                                    {item.type}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-start gap-2 text-sm text-gray-400">
                                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500 group-hover:text-yellow-500 transition-colors" />
                                  <span className="line-clamp-2">{item.location}</span>
                                </div>
                                {item.description && (
                                  <CardDescription className="text-xs text-gray-500 line-clamp-2 group-hover:text-gray-400 transition-colors">
                                    {item.description}
                                  </CardDescription>
                                )}
                                {isRoom && item.department && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs text-gray-300 border-gray-700/50 bg-gray-800/30">
                                      {item.department}
                                    </Badge>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <Card className="max-w-lg w-full bg-gray-900/40 backdrop-blur-xl border-gray-800/50 shadow-2xl">
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center border border-yellow-500/30"
                  >
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                  <CardTitle className="text-xl text-white">Campus Data Unavailable</CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-300"
                >
                  Your campus data is currently unavailable to us.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-gray-400"
                >
                  Please DM us to add your campus and <strong className="text-yellow-500">win prizes</strong>. 
                  Provide your college name and an official contact email so we can verify.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-2"
                >
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm">
                    Rewards Available
                  </Badge>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CmapPage;