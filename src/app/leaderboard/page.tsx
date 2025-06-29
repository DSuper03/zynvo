'use client';

import React, { useState, useMemo } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trophy, Filter, Search, TrendingUp, Users, Calendar } from 'lucide-react';

// Mock data for clubs
const clubsData = [
  {
    id: 1,
    name: "CodeCrafters",
    college: "IIT Bombay",
    events: {
      Jan: 3, Feb: 2, Mar: 4, Apr: 3, May: 5, Jun: 2,
      Jul: 3, Aug: 1, Sep: 4, Oct: 2, Nov: 3, Dec: 2
    },
    participants: {
      Jan: 120, Feb: 85, Mar: 150, Apr: 95, May: 210, Jun: 80,
      Jul: 130, Aug: 50, Sep: 175, Oct: 90, Nov: 140, Dec: 75
    }
  },
  {
    id: 2,
    name: "RoboTech Club",
    college: "IIT Delhi",
    events: {
      Jan: 2, Feb: 3, Mar: 2, Apr: 4, May: 3, Jun: 1,
      Jul: 2, Aug: 2, Sep: 3, Oct: 4, Nov: 2, Dec: 1
    },
    participants: {
      Jan: 90, Feb: 120, Mar: 85, Apr: 180, May: 95, Jun: 40,
      Jul: 75, Aug: 90, Sep: 110, Oct: 160, Nov: 95, Dec: 60
    }
  },
  {
    id: 3,
    name: "Entrepreneurship Cell",
    college: "IIM Ahmedabad",
    events: {
      Jan: 5, Feb: 4, Mar: 6, Apr: 4, May: 3, Jun: 5,
      Jul: 4, Aug: 3, Sep: 5, Oct: 6, Nov: 4, Dec: 3
    },
    participants: {
      Jan: 220, Feb: 180, Mar: 250, Apr: 190, May: 150, Jun: 210,
      Jul: 175, Aug: 130, Sep: 220, Oct: 260, Nov: 190, Dec: 140
    }
  },
  {
    id: 4,
    name: "Cultural Society",
    college: "Delhi University",
    events: {
      Jan: 4, Feb: 6, Mar: 3, Apr: 5, May: 7, Jun: 4,
      Jul: 5, Aug: 4, Sep: 6, Oct: 5, Nov: 7, Dec: 5
    },
    participants: {
      Jan: 180, Feb: 250, Mar: 130, Apr: 220, May: 300, Jun: 190,
      Jul: 210, Aug: 170, Sep: 240, Oct: 210, Nov: 320, Dec: 230
    }
  },
  {
    id: 5,
    name: "Literary Club",
    college: "Jadavpur University",
    events: {
      Jan: 3, Feb: 2, Mar: 4, Apr: 2, May: 3, Jun: 2,
      Jul: 3, Aug: 1, Sep: 2, Oct: 3, Nov: 2, Dec: 1
    },
    participants: {
      Jan: 100, Feb: 80, Mar: 150, Apr: 90, May: 120, Jun: 85,
      Jul: 110, Aug: 50, Sep: 95, Oct: 130, Nov: 90, Dec: 60
    }
  },
  {
    id: 6,
    name: "Sports Federation",
    college: "Punjab University",
    events: {
      Jan: 6, Feb: 5, Mar: 7, Apr: 6, May: 8, Jun: 5,
      Jul: 6, Aug: 4, Sep: 7, Oct: 6, Nov: 5, Dec: 4
    },
    participants: {
      Jan: 300, Feb: 250, Mar: 350, Apr: 280, May: 400, Jun: 230,
      Jul: 290, Aug: 200, Sep: 360, Oct: 310, Nov: 270, Dec: 220
    }
  },
  {
    id: 7,
    name: "Dance Crew",
    college: "SRCC Delhi",
    events: {
      Jan: 4, Feb: 3, Mar: 5, Apr: 4, May: 6, Jun: 3,
      Jul: 4, Aug: 2, Sep: 5, Oct: 4, Nov: 3, Dec: 2
    },
    participants: {
      Jan: 160, Feb: 130, Mar: 210, Apr: 170, May: 240, Jun: 120,
      Jul: 150, Aug: 90, Sep: 200, Oct: 160, Nov: 140, Dec: 100
    }
  },
  {
    id: 8,
    name: "Photography Club",
    college: "Symbiosis Pune",
    events: {
      Jan: 2, Feb: 3, Mar: 2, Apr: 3, May: 4, Jun: 2,
      Jul: 3, Aug: 2, Sep: 3, Oct: 2, Nov: 3, Dec: 2
    },
    participants: {
      Jan: 80, Feb: 100, Mar: 75, Apr: 110, May: 140, Jun: 90,
      Jul: 120, Aug: 70, Sep: 110, Oct: 85, Nov: 100, Dec: 70
    }
  },
  {
    id: 9,
    name: "Debating Society",
    college: "St. Stephen's College",
    events: {
      Jan: 3, Feb: 2, Mar: 4, Apr: 3, May: 2, Jun: 3,
      Jul: 2, Aug: 1, Sep: 3, Oct: 2, Nov: 3, Dec: 2
    },
    participants: {
      Jan: 90, Feb: 70, Mar: 120, Apr: 100, May: 80, Jun: 90,
      Jul: 75, Aug: 40, Sep: 110, Oct: 80, Nov: 95, Dec: 70
    }
  },
  {
    id: 10,
    name: "AI Research Group",
    college: "BITS Pilani",
    events: {
      Jan: 2, Feb: 1, Mar: 3, Apr: 2, May: 3, Jun: 1,
      Jul: 2, Aug: 1, Sep: 2, Oct: 3, Nov: 2, Dec: 1
    },
    participants: {
      Jan: 60, Feb: 40, Mar: 80, Apr: 65, May: 90, Jun: 35,
      Jul: 70, Aug: 30, Sep: 60, Oct: 85, Nov: 75, Dec: 40
    }
  }
];

// Define Month type for type safety
type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | 
             "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

// All months for filtering
const months: Month[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function LeaderboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<Month>("Oct");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate scores and sort clubs
  const rankedClubs = useMemo(() => {
    return clubsData
      .map(club => {
        const events = club.events[selectedMonth];
        const participants = club.participants[selectedMonth];
        const score = (events / participants) * 100;
        return {
          ...club,
          eventsCount: events,
          participantsCount: participants,
          score: parseFloat(score.toFixed(2))
        };
      })
      .filter(club => 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.college.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.score - a.score);
  }, [selectedMonth, searchQuery]);

  // Calculate top stats
  const topStats = useMemo(() => {
    if (rankedClubs.length === 0) return { events: 0, participants: 0, avg: 0 };
    
    const topClub = rankedClubs[0];
    const totalEvents = rankedClubs.reduce((sum, club) => sum + club.eventsCount, 0);
    const totalParticipants = rankedClubs.reduce((sum, club) => sum + club.participantsCount, 0);
    const avgScore = rankedClubs.reduce((sum, club) => sum + club.score, 0) / rankedClubs.length;
    
    return {
      topClub,
      totalEvents,
      totalParticipants,
      avgScore: parseFloat(avgScore.toFixed(2))
    };
  }, [rankedClubs]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl text-white">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
        Club Leaderboard
      </h1>
      <p className="text-gray-400 mb-8">
        Ranking the most active clubs based on event-to-participant ratio
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900 border-yellow-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Top Club</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-xl font-bold text-white">{topStats.topClub?.name}</p>
                <p className="text-xs text-gray-400">{topStats.topClub?.college}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-yellow-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <p className="text-xl font-bold text-white">{topStats.totalEvents}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">In {selectedMonth}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-yellow-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <p className="text-xl font-bold text-white">{topStats.totalParticipants}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">Across all clubs</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-yellow-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <p className="text-xl font-bold text-white">{topStats.avgScore}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">Events/Participants * 100</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clubs or colleges..."
              className="bg-gray-800 border-gray-700 pl-10 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value as Month)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectGroup>
                <SelectLabel className="text-gray-400">Month</SelectLabel>
                {months.map(month => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <Card className="bg-gray-900 border-yellow-500/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-800/50">
                <TableHead className="text-gray-400 w-14 text-center">Rank</TableHead>
                <TableHead className="text-gray-400">Club</TableHead>
                <TableHead className="text-gray-400">College</TableHead>
                <TableHead className="text-gray-400 text-center">Events</TableHead>
                <TableHead className="text-gray-400 text-center">Participants</TableHead>
                <TableHead className="text-gray-400 text-center">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedClubs.map((club, index) => (
                <TableRow key={club.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-center">
                    {index < 3 ? (
                      <Badge className={`
                        ${index === 0 ? 'bg-yellow-500 hover:bg-yellow-600' : 
                          index === 1 ? 'bg-gray-400 hover:bg-gray-500' : 
                          'bg-amber-700 hover:bg-amber-800'}
                        text-black font-bold`}
                      >
                        {index + 1}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-white">{club.name}</div>
                  </TableCell>
                  <TableCell className="text-gray-300">{club.college}</TableCell>
                  <TableCell className="text-center text-white">{club.eventsCount}</TableCell>
                  <TableCell className="text-center text-white">{club.participantsCount}</TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                            {club.score}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 border-gray-700 text-white p-2">
                          <p>Events/Participants * 100</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
              {rankedClubs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    No clubs found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
