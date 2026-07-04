"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { kolkataCollegeClubs } from '@/data/kolkataCollegeClubs';

type TopClub = {
  id: string;
  name: string;
  collegeName?: string | null;
  profilePicUrl?: string | null;
  description?: string | null;
};

type TopClubApiItem = {
  id?: string;
  name?: string;
  clubName?: string;
  collegeName?: string | null;
  description?: string | null;
  profilePicUrl?: string | null;
  profilePic?: string | null;
  image?: string | null;
  logo?: string | null;
};

type CachedTopClubsPayload = {
  clubs: TopClub[];
  cachedAt: number;
};

const DEFAULT_CLUB_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#1f2937"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <circle cx="930" cy="180" r="210" fill="#facc15" fill-opacity="0.14"/>
      <circle cx="250" cy="650" r="230" fill="#f59e0b" fill-opacity="0.12"/>
      <text x="600" y="390" text-anchor="middle" font-size="56" font-family="Arial, sans-serif" fill="#facc15" font-weight="700">
        Zynvo Club
      </text>
      <text x="600" y="450" text-anchor="middle" font-size="30" font-family="Arial, sans-serif" fill="#d1d5db">
        Image unavailable
      </text>
    </svg>
  `);
const BACKEND_BASE_URL = ('').replace(/\/$/, '');
const TOP_CLUBS_CACHE_KEY = 'zynvo.topclubs.cache.v1';

const resolveClubImageUrl = (url?: string | null) => {
  if (!url || typeof url !== 'string') return DEFAULT_CLUB_IMAGE;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return DEFAULT_CLUB_IMAGE;

  // Absolute URLs, data/blob URLs can be used directly.
  if (/^(https?:)?\/\//i.test(trimmedUrl) || /^(data|blob):/i.test(trimmedUrl)) {
    return trimmedUrl.startsWith('//') ? `https:${trimmedUrl}` : trimmedUrl;
  }

  // Backend can return relative paths like /uploads/... or uploads/...
  return `${BACKEND_BASE_URL}/${trimmedUrl.replace(/^\/+/, '')}`;
};

const buildClubFallbackLogo = (clubName: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(clubName)}&fontSize=42&backgroundColor=111827,facc15,1f2937&textColor=facc15,ffffff`;

const fallbackClubs: TopClub[] = kolkataCollegeClubs.slice(0, 8).map((club) => ({
  id: club.id,
  name: club.clubName,
  collegeName: club.collegeName,
  description: club.description,
  profilePicUrl: buildClubFallbackLogo(club.clubName),
}));

const mapApiClubToTopClub = (club: TopClubApiItem, index: number): TopClub => {
  const imageCandidate =
    club.profilePicUrl ||
    club.profilePic ||
    club.image ||
    club.logo ||
    DEFAULT_CLUB_IMAGE;

  return {
    id: club.id || `club-${index}`,
    name: club.name || club.clubName || 'Unnamed club',
    collegeName: club.collegeName || null,
    description: club.description || null,
    profilePicUrl: resolveClubImageUrl(imageCandidate),
  };
};

const readCachedTopClubs = (): TopClub[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TOP_CLUBS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CachedTopClubsPayload;
    if (!Array.isArray(parsed?.clubs)) return [];
    return parsed.clubs
      .slice(0, 8)
      .map((club, index) => mapApiClubToTopClub(club as TopClubApiItem, index));
  } catch {
    return [];
  }
};

const writeCachedTopClubs = (clubs: TopClub[]) => {
  if (typeof window === 'undefined') return;
  try {
    const payload: CachedTopClubsPayload = {
      clubs: clubs.slice(0, 8),
      cachedAt: Date.now(),
    };
    localStorage.setItem(TOP_CLUBS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures silently (quota / private mode).
  }
};

export default function TopClubs() {
  const [clubs, setClubs] = useState<TopClub[]>(fallbackClubs);
  const [isLoaded, setIsLoaded] = useState(false);
  const [authRequiredForLogos, setAuthRequiredForLogos] = useState(false);

  useEffect(() => {
    const fetchClubs = async () => {
      const cachedClubs = readCachedTopClubs();
      if (cachedClubs.length > 0) {
        setClubs(cachedClubs);
        setIsLoaded(true);
      }

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const hasActiveSession = typeof window !== 'undefined' ? sessionStorage.getItem('activeSession') === 'true' : false;
        const headers =
          token && hasActiveSession ? { authorization: `Bearer ${token}` } : undefined;

        const response = await axios.get<{ resp: TopClubApiItem[] }>('/api/public/top-clubs', {
          headers,
        });

        const fetchedClubs = response.data?.resp || [];
        const mappedClubs = fetchedClubs
          .slice(0, 8)
          .map((club, index) => mapApiClubToTopClub(club, index));
        setAuthRequiredForLogos(false);
        setClubs(mappedClubs);
        writeCachedTopClubs(mappedClubs);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAuthRequiredForLogos(true);
        }
        console.warn('Failed to load top clubs from backend, using fallback clubs.', error);
        if (cachedClubs.length === 0) {
          setClubs(fallbackClubs);
        }
      } finally {
        setIsLoaded(true);
      }
    };

    fetchClubs();
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ maxWidth: 520, marginLeft: 40 }}>
          <p style={{ margin: 0, fontSize: 13, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 900, color: '#b45309' }}>
            Top clubs
          </p>
          <h2 style={{ margin: '16px 0 12px', fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: 1.05, color: '#111827', fontWeight: 900 }}>
            Campus communities trending now
          </h2>
          <p style={{ margin: 0, fontSize: 15, color: '#4b5563', lineHeight: 1.7 }}>
            Discover the most active clubs on Zynvo, with live photos and college names fetched directly from the backend.
          </p>
          {authRequiredForLogos && (
            <p style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: '#92400e' }}>
              Official logos are restricted by backend auth right now. Sign in to unlock them.
            </p>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden px-4 py-6 sm:px-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-yellow-300 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-yellow-300 to-transparent" />
        <div className="topclubs-marquee flex w-max gap-5 pb-3">
          {[...clubs, ...clubs].map((club, index) => (
            <article
              key={`${club.id}-${index}`}
              className="min-w-[18rem] max-w-[18rem] flex-shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 text-white shadow-[0_24px_50px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={resolveClubImageUrl(club.profilePicUrl)}
                  alt={club.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = DEFAULT_CLUB_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
              <div className="space-y-3 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400">
                  {club.collegeName || 'Campus club'}
                </p>
                <h3 className="line-clamp-2 text-lg font-black text-white">{club.name}</h3>
                <p className="line-clamp-3 text-sm leading-6 text-slate-300">
                  {club.description || 'Active student organization at Zynvo across events, discussion, and collaboration.'}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes topclubs-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .topclubs-marquee {
          animation: topclubs-scroll 32s linear infinite;
          will-change: transform;
        }
        .topclubs-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
