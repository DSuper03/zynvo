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

const DEFAULT_CLUB_IMAGE = 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=800&q=80';

const fallbackClubs: TopClub[] = kolkataCollegeClubs.slice(0, 8).map((club) => ({
  id: club.id,
  name: club.clubName,
  collegeName: club.collegeName,
  description: club.description,
  profilePicUrl: DEFAULT_CLUB_IMAGE,
}));

export default function TopClubs() {
  const [clubs, setClubs] = useState<TopClub[]>(fallbackClubs);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchClubs = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      try {
        const response = await axios.get<{ resp: TopClub[] }>('/api/v1/clubs/getAll?page=1', {
          headers: token ? { authorization: `Bearer ${token}` } : undefined,
        });

        const fetchedClubs = response.data?.resp || [];
        setClubs(fetchedClubs.slice(0, 8).map((club) => ({
          id: club.id,
          name: club.name,
          collegeName: club.collegeName,
          description: club.description,
          profilePicUrl: club.profilePicUrl || DEFAULT_CLUB_IMAGE,
        })));
      } catch (error) {
        console.warn('Failed to load top clubs from backend, using fallback clubs.', error);
        setClubs(fallbackClubs);
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
                  src={club.profilePicUrl || DEFAULT_CLUB_IMAGE}
                  alt={club.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
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
