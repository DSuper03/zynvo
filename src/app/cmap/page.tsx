"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { cmapData } from '@/data/cmapData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Building2, AlertCircle, Sparkles, Navigation, Compass } from 'lucide-react';

const CmapPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isTechno, setIsTechno] = useState(false);
  const [query, setQuery] = useState('');

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

  // Perform client-side filtering of the local cmapData as user types
  const filteredResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cmapData;
    return cmapData.filter((item) => {
      return Object.values(item).some((val) =>
        String(val || '').toLowerCase().includes(q)
      );
    });
  }, [query]);

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
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'gate': return 'default';
      case 'canteen': return 'secondary';
      case 'library': return 'outline';
      case 'lab': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <p className="text-gray-400 text-sm">Loading campus data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isTechno ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/20">
                  <Sparkles className="w-4 h-4" />
                  <span>Hi pal</span>
                </div>
                <Badge variant="outline" className="text-gray-300 border-gray-700">
                  Techno Main Salt Lake
                </Badge>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Campus Navigator
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Explore gates, canteens, labs, lifts, and facilities across campus
                </p>
              </div>
            </div>

            {/* Search Section */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, type, or location..."
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20 h-12 text-base"
                  />
                </div>
                {query && (
                  <p className="text-xs text-gray-500 mt-2">
                    Found {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-3">
              {filteredResults.length === 0 ? (
                <Card className="bg-gray-900/30 border-gray-800">
                  <CardContent className="py-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-1">No results found</h3>
                        <p className="text-sm text-gray-500">Try a different search term</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredResults.map((item, i) => (
                    <Card 
                      key={i} 
                      className="bg-gray-900/50 border-gray-800 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 group"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold text-white group-hover:text-yellow-400 transition-colors truncate">
                              {item.name}
                            </CardTitle>
                          </div>
                          <Badge 
                            variant={getTypeBadgeVariant(item.type)}
                            className="flex-shrink-0 capitalize text-xs"
                          >
                            {item.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500" />
                          <span className="line-clamp-2">{item.location}</span>
                        </div>
                        {item.description && (
                          <CardDescription className="text-xs text-gray-500 line-clamp-2">
                            {item.description}
                          </CardDescription>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-lg w-full bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  </div>
                  <CardTitle className="text-xl text-white">Campus Data Unavailable</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300">
                  Your campus data is currently unavailable to us.
                </p>
                <p className="text-sm text-gray-400">
                  Please DM us to add your campus and <strong className="text-yellow-500">win prizes</strong>. 
                  Provide your college name and an official contact email so we can verify.
                </p>
                <div className="pt-2">
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                    Rewards Available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CmapPage;