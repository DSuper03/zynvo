'use client';

import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Filter,
  Search,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';

// Mock data for clubs (theme intact)
const clubsData = [
  {
    id: 1,
    name: 'CodeCrafters',
    college: 'IIT Bombay',
    events: {
      Jan: 3,
      Feb: 2,
      Mar: 4,
      Apr: 3,
      May: 5,
      Jun: 2,
      Jul: 3,
      Aug: 1,
      Sep: 4,
      Oct: 2,
      Nov: 3,
      Dec: 2,
    },
    participants: {
      Jan: 120,
      Feb: 85,
      Mar: 150,
      Apr: 95,
      May: 210,
      Jun: 80,
      Jul: 130,
      Aug: 50,
      Sep: 175,
      Oct: 90,
      Nov: 140,
      Dec: 75,
    },
  },
  {
    id: 2,
    name: 'RoboTech Club',
    college: 'IIT Delhi',
    events: {
      Jan: 2,
      Feb: 3,
      Mar: 2,
      Apr: 4,
      May: 3,
      Jun: 1,
      Jul: 2,
      Aug: 2,
      Sep: 3,
      Oct: 4,
      Nov: 2,
      Dec: 1,
    },
    participants: {
      Jan: 90,
      Feb: 120,
      Mar: 85,
      Apr: 180,
      May: 95,
      Jun: 40,
      Jul: 75,
      Aug: 90,
      Sep: 110,
      Oct: 160,
      Nov: 95,
      Dec: 60,
    },
  },
  {
    id: 3,
    name: 'Entrepreneurship Cell',
    college: 'IIM Ahmedabad',
    events: {
      Jan: 5,
      Feb: 4,
      Mar: 6,
      Apr: 4,
      May: 3,
      Jun: 5,
      Jul: 4,
      Aug: 3,
      Sep: 5,
      Oct: 6,
      Nov: 4,
      Dec: 3,
    },
    participants: {
      Jan: 220,
      Feb: 180,
      Mar: 250,
      Apr: 190,
      May: 150,
      Jun: 210,
      Jul: 175,
      Aug: 130,
      Sep: 220,
      Oct: 260,
      Nov: 190,
      Dec: 140,
    },
  },
  {
    id: 4,
    name: 'Cultural Society',
    college: 'Delhi University',
    events: {
      Jan: 4,
      Feb: 6,
      Mar: 3,
      Apr: 5,
      May: 7,
      Jun: 4,
      Jul: 5,
      Aug: 4,
      Sep: 6,
      Oct: 5,
      Nov: 7,
      Dec: 5,
    },
    participants: {
      Jan: 180,
      Feb: 250,
      Mar: 130,
      Apr: 220,
      May: 300,
      Jun: 190,
      Jul: 210,
      Aug: 170,
      Sep: 240,
      Oct: 210,
      Nov: 320,
      Dec: 230,
    },
  },
  {
    id: 5,
    name: 'Literary Club',
    college: 'Jadavpur University',
    events: {
      Jan: 3,
      Feb: 2,
      Mar: 4,
      Apr: 2,
      May: 3,
      Jun: 2,
      Jul: 3,
      Aug: 1,
      Sep: 2,
      Oct: 3,
      Nov: 2,
      Dec: 1,
    },
    participants: {
      Jan: 100,
      Feb: 80,
      Mar: 150,
      Apr: 90,
      May: 120,
      Jun: 85,
      Jul: 110,
      Aug: 50,
      Sep: 95,
      Oct: 130,
      Nov: 90,
      Dec: 60,
    },
  },
  {
    id: 6,
    name: 'Sports Federation',
    college: 'Punjab University',
    events: {
      Jan: 6,
      Feb: 5,
      Mar: 7,
      Apr: 6,
      May: 8,
      Jun: 5,
      Jul: 6,
      Aug: 4,
      Sep: 7,
      Oct: 6,
      Nov: 5,
      Dec: 4,
    },
    participants: {
      Jan: 300,
      Feb: 250,
      Mar: 350,
      Apr: 280,
      May: 400,
      Jun: 230,
      Jul: 290,
      Aug: 200,
      Sep: 360,
      Oct: 310,
      Nov: 270,
      Dec: 220,
    },
  },
  {
    id: 7,
    name: 'Dance Crew',
    college: 'SRCC Delhi',
    events: {
      Jan: 4,
      Feb: 3,
      Mar: 5,
      Apr: 4,
      May: 6,
      Jun: 3,
      Jul: 4,
      Aug: 2,
      Sep: 5,
      Oct: 4,
      Nov: 3,
      Dec: 2,
    },
    participants: {
      Jan: 160,
      Feb: 130,
      Mar: 210,
      Apr: 170,
      May: 240,
      Jun: 120,
      Jul: 150,
      Aug: 90,
      Sep: 200,
      Oct: 160,
      Nov: 140,
      Dec: 100,
    },
  },
  {
    id: 8,
    name: 'Photography Club',
    college: 'Symbiosis Pune',
    events: {
      Jan: 2,
      Feb: 3,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 2,
      Jul: 3,
      Aug: 2,
      Sep: 3,
      Oct: 2,
      Nov: 3,
      Dec: 2,
    },
    participants: {
      Jan: 80,
      Feb: 100,
      Mar: 75,
      Apr: 110,
      May: 140,
      Jun: 90,
      Jul: 120,
      Aug: 70,
      Sep: 110,
      Oct: 85,
      Nov: 100,
      Dec: 70,
    },
  },
  {
    id: 9,
    name: 'Debating Society',
    college: "St. Stephen's College",
    events: {
      Jan: 3,
      Feb: 2,
      Mar: 4,
      Apr: 3,
      May: 2,
      Jun: 3,
      Jul: 2,
      Aug: 1,
      Sep: 3,
      Oct: 2,
      Nov: 3,
      Dec: 2,
    },
    participants: {
      Jan: 90,
      Feb: 70,
      Mar: 120,
      Apr: 100,
      May: 80,
      Jun: 90,
      Jul: 75,
      Aug: 40,
      Sep: 110,
      Oct: 80,
      Nov: 95,
      Dec: 70,
    },
  },
  {
    id: 10,
    name: 'AI Research Group',
    college: 'BITS Pilani',
    events: {
      Jan: 2,
      Feb: 1,
      Mar: 3,
      Apr: 2,
      May: 3,
      Jun: 1,
      Jul: 2,
      Aug: 1,
      Sep: 2,
      Oct: 3,
      Nov: 2,
      Dec: 1,
    },
    participants: {
      Jan: 60,
      Feb: 40,
      Mar: 80,
      Apr: 65,
      May: 90,
      Jun: 35,
      Jul: 70,
      Aug: 30,
      Sep: 60,
      Oct: 85,
      Nov: 75,
      Dec: 40,
    },
  },
];

// Define Month type for type safety
type Month =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec';

// All months for filtering
const months: Month[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Lightweight avatar placeholders per club
const avatars: Record<number, string> = {
  1: 'https://api.dicebear.com/7.x/thumbs/svg?seed=CodeCrafters',
  2: 'https://api.dicebear.com/7.x/thumbs/svg?seed=RoboTech',
  3: 'https://api.dicebear.com/7.x/thumbs/svg?seed=ECell',
  4: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Cultural',
  5: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Literary',
  6: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Sports',
  7: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Dance',
  8: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Photo',
  9: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Debate',
  10: 'https://api.dicebear.com/7.x/thumbs/svg?seed=AI',
};

export default function LeaderboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<Month>('Oct');
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState('Worldwide');

  const rankedClubs = useMemo(() => {
    return clubsData
      .map((club) => {
        const events = club.events[selectedMonth];
        const participants = club.participants[selectedMonth];
        const score = (events / Math.max(participants, 1)) * 100;
        return {
          ...club,
          eventsCount: events,
          participantsCount: participants,
          score: parseFloat(score.toFixed(2)),
        };
      })
      .filter(
        (club) =>
          club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.college.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.score - a.score);
  }, [selectedMonth, searchQuery]);

  const topStats = useMemo(() => {
    if (rankedClubs.length === 0) {
      return { totalEvents: 0, totalParticipants: 0, avgScore: 0 };
    }
    const totalEvents = rankedClubs.reduce((sum, c) => sum + c.eventsCount, 0);
    const totalParticipants = rankedClubs.reduce(
      (sum, c) => sum + c.participantsCount,
      0
    );
    const avgScore =
      rankedClubs.reduce((sum, c) => sum + c.score, 0) / rankedClubs.length;
    return {
      totalEvents,
      totalParticipants,
      avgScore: parseFloat(avgScore.toFixed(2)),
    };
  }, [rankedClubs]);

  const topThree = rankedClubs.slice(0, 3);
  const rest = rankedClubs.slice(3);

  return (
    <div className="mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 max-w-7xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Club Leaderboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Ranking the most active clubs based on event-to-participant ratio
          </p>
        </div>

        {/* Month + Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clubs or colleges..."
              className="bg-gray-800 border-gray-700 pl-10 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-36 sm:w-44">
            <Select
              value={selectedMonth}
              onValueChange={(v) => setSelectedMonth(v as Month)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectGroup>
                  <SelectLabel className="text-gray-400">Month</SelectLabel>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Region chips */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {['Worldwide', 'India', 'Maharashtra', 'Gujrat'].map((r) => (
          <Button
            key={r}
            onClick={() => setRegion(r)}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap border transition-colors ${
              region === r
                ? 'bg-yellow-500 text-black border-yellow-500'
                : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800'
            }`}
          >
            {r}
          </Button>
        ))}
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="bg-gray-900 border-yellow-500/20">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-gray-400">Total Events</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <p className="text-xl font-bold">{topStats.totalEvents}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-yellow-500/20">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-gray-400">Participants</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            <p className="text-xl font-bold">{topStats.totalParticipants}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-yellow-500/20">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-gray-400">Average Score</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <p className="text-xl font-bold">{topStats.avgScore}</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Podium section */}
      <div className="mt-6">
        <Card className="bg-gradient-to-b from-gray-900 to-gray-950 border-yellow-500/20">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Trophy className="h-5 w-5" /> Top Clubs
              </CardTitle>
              <div className="hidden sm:flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4" />
                {region}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Podium layout - mobile first */}
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-3 gap-3 items-end sm:gap-6">
                {/* 2nd */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full ring-2 ring-yellow-500/40 overflow-hidden shadow-lg">
                    <Image
                      alt="2nd"
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                      src={avatars[topThree[1]?.id ?? 0]}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs sm:text-sm text-gray-300 line-clamp-1">
                      {topThree[1]?.name || '-'}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                      {topThree[1]?.college || ''}
                    </div>
                    <Badge className="mt-1 bg-gray-400 text-black font-bold">
                      2
                    </Badge>
                    <div className="text-xs text-purple-300 mt-1">
                      {topThree[1]?.score ?? '--'}
                    </div>
                  </div>
                  <div className="mt-2 w-16 sm:w-24 h-10 sm:h-14 rounded-md bg-gray-800/80 border border-gray-700" />
                </div>

                {/* 1st */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full ring-4 ring-yellow-500 overflow-hidden shadow-yellow-500/30 shadow-[0_10px_25px]">
                    <img
                      alt="1st"
                      className="w-full h-full object-cover"
                      src={avatars[topThree[0]?.id ?? 0]}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm sm:text-base text-yellow-400 font-semibold line-clamp-1">
                      {topThree[0]?.name || '-'}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                      {topThree[0]?.college || ''}
                    </div>
                    <Badge className="mt-1 bg-yellow-500 text-black font-bold">
                      1
                    </Badge>
                    <div className="text-xs text-purple-300 mt-1">
                      {topThree[0]?.score ?? '--'}
                    </div>
                  </div>
                  <div className="mt-2 w-20 sm:w-32 h-12 sm:h-20 rounded-md bg-gray-800 border border-yellow-500/40" />
                </div>

                {/* 3rd */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-2 ring-amber-600/60 overflow-hidden shadow-lg">
                    <img
                      alt="3rd"
                      className="w-full h-full object-cover"
                      src={avatars[topThree[2]?.id ?? 0]}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs sm:text-sm text-gray-300 line-clamp-1">
                      {topThree[2]?.name || '-'}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                      {topThree[2]?.college || ''}
                    </div>
                    <Badge className="mt-1 bg-amber-700 text-black font-bold">
                      3
                    </Badge>
                    <div className="text-xs text-purple-300 mt-1">
                      {topThree[2]?.score ?? '--'}
                    </div>
                  </div>
                  <div className="mt-2 w-14 sm:w-20 h-8 sm:h-12 rounded-md bg-gray-800/70 border border-gray-700" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranked list (4+) - mobile friendly list, table on lg */}
      <div className="mt-6">
        {/* Mobile/List view */}
        <div className="lg:hidden space-y-2">
          {rest.map((club, idx) => (
            <div
              key={club.id}
              className="bg-gray-900 border border-yellow-500/20 rounded-xl px-3 py-3 flex items-center gap-3"
            >
              <div className="w-8 text-center">
                {idx + 4 <= 10 ? (
                  <Badge
                    className={`${
                      idx + 4 === 4
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-800 text-gray-300 border border-gray-700'
                    }`}
                  >
                    {idx + 4}
                  </Badge>
                ) : (
                  <span className="text-gray-400">{idx + 4}</span>
                )}
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-yellow-500/30">
                <Image
                  alt={club.name}
                  src={avatars[club.id]}
                  layout="fill"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {club.name}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {club.college}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Score</div>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                  {club.score}
                </Badge>
              </div>
            </div>
          ))}
          {rest.length === 0 && (
            <div className="text-center text-gray-400 py-6">No clubs found</div>
          )}
        </div>

        {/* Desktop/Table view */}
        <Card className="bg-gray-900 border-yellow-500/20 hidden lg:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 w-14 text-center">
                    Rank
                  </TableHead>
                  <TableHead className="text-gray-400">Club</TableHead>
                  <TableHead className="text-gray-400">College</TableHead>
                  <TableHead className="text-gray-400 text-center">
                    Events
                  </TableHead>
                  <TableHead className="text-gray-400 text-center">
                    Participants
                  </TableHead>
                  <TableHead className="text-gray-400 text-center">
                    Score
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankedClubs.map((club, index) => (
                  <TableRow
                    key={club.id}
                    className="border-gray-800 hover:bg-gray-800/40"
                  >
                    <TableCell className="font-medium text-center">
                      {index < 3 ? (
                        <Badge
                          className={`${
                            index === 0
                              ? 'bg-yellow-500 text-black'
                              : index === 1
                                ? 'bg-gray-400 text-black'
                                : 'bg-amber-700 text-black'
                          } font-bold`}
                        >
                          {index + 1}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">{index + 1}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-yellow-500/30">
                          <Image
                            alt={club.name}
                            src={avatars[club.id]}
                            layout="fill"
                            className="object-cover"
                          />
                        </div>
                        <div className="font-medium text-white">
                          {club.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {club.college}
                    </TableCell>
                    <TableCell className="text-center text-white">
                      {club.eventsCount}
                    </TableCell>
                    <TableCell className="text-center text-white">
                      {club.participantsCount}
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                              {club.score}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 border-gray-700 text-white p-2">
                            <p>Events/Participants × 100</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
                {rankedClubs.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-400"
                    >
                      No clubs found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
