'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker, LayerGroup } from 'leaflet';
import { motion } from 'framer-motion';
import {
  Building2,
  Flame,
  LocateFixed,
  MapPin,
  Navigation,
  Radar,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  CLUB_DISCOVERY_RADIUS_METERS,
  KOLKATA_CENTER,
  KolkataCollegeClub,
  kolkataCollegeClubs,
} from '@/data/kolkataCollegeClubs';
import { cn } from '@/lib/utils';

const categoryStyles: Record<KolkataCollegeClub['category'], string> = {
  tech: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/25',
  culture: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/25',
  business: 'bg-amber-500/15 text-amber-200 border-amber-400/25',
  social: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/25',
  media: 'bg-sky-500/15 text-sky-200 border-sky-400/25',
  sports: 'bg-orange-500/15 text-orange-200 border-orange-400/25',
};

const formatRadius = (meters: number) => `${Math.round(meters / 1000)} km`;

const normalize = (value: string) => value.trim().toLowerCase();

const ClubMapPage = () => {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef<Record<string, Marker>>({});
  const heatLayerRef = useRef<LayerGroup | null>(null);
  const [query, setQuery] = useState('');
  const [selectedClubId, setSelectedClubId] = useState(
    kolkataCollegeClubs[0]?.id ?? ''
  );
  const [mapReady, setMapReady] = useState(false);
  const categoryCount = useMemo(
    () => new Set(kolkataCollegeClubs.map((club) => club.category)).size,
    []
  );

  const selectedClub = useMemo(
    () =>
      kolkataCollegeClubs.find((club) => club.id === selectedClubId) ??
      kolkataCollegeClubs[0],
    [selectedClubId]
  );

  const filteredClubs = useMemo(() => {
    const q = normalize(query);

    if (!q) {
      return kolkataCollegeClubs;
    }

    return kolkataCollegeClubs.filter((club) => {
      const searchable = [
        club.clubName,
        club.collegeName,
        club.area,
        club.address,
        club.category,
        club.description,
        ...club.tags,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(q);
    });
  }, [query]);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) {
      return;
    }

    let disposed = false;

    const initializeMap = async () => {
      const L = await import('leaflet');

      if (disposed || !mapNodeRef.current) {
        return;
      }

      const map = L.map(mapNodeRef.current, {
        center: [KOLKATA_CENTER.latitude, KOLKATA_CENTER.longitude],
        zoom: 12,
        minZoom: 10,
        maxZoom: 18,
        zoomControl: false,
        scrollWheelZoom: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.circle([KOLKATA_CENTER.latitude, KOLKATA_CENTER.longitude], {
        radius: CLUB_DISCOVERY_RADIUS_METERS,
        color: '#facc15',
        weight: 1,
        opacity: 0.7,
        fillColor: '#facc15',
        fillOpacity: 0.04,
        dashArray: '8 8',
      }).addTo(map);

      const heatLayer = L.layerGroup().addTo(map);
      heatLayerRef.current = heatLayer;

      kolkataCollegeClubs.forEach((club) => {
        const heatOpacity = Math.min(0.22, 0.06 + club.intensity / 70);

        L.circle([club.latitude, club.longitude], {
          radius: 1800 + club.intensity * 120,
          stroke: false,
          fillColor:
            club.category === 'tech'
              ? '#22d3ee'
              : club.category === 'business'
                ? '#f59e0b'
                : '#e879f9',
          fillOpacity: heatOpacity,
        }).addTo(heatLayer);

        const markerIcon = L.divIcon({
          className: 'zynvo-club-marker',
          html: `<span></span>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([club.latitude, club.longitude], {
          icon: markerIcon,
        })
          .addTo(map)
          .bindPopup(
            `<strong>${club.clubName}</strong><br/><span>${club.collegeName}</span><br/><small>${club.area}</small>`
          );

        marker.on('click', () => setSelectedClubId(club.id));
        markerRefs.current[club.id] = marker;
      });

      const bounds = L.latLngBounds(
        kolkataCollegeClubs.map((club) => [club.latitude, club.longitude])
      );
      map.fitBounds(bounds.pad(0.18));
      mapRef.current = map;
      setMapReady(true);
    };

    initializeMap();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRefs.current = {};
      heatLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!selectedClub || !mapRef.current || !mapReady) {
      return;
    }

    mapRef.current.flyTo([selectedClub.latitude, selectedClub.longitude], 14, {
      duration: 0.7,
    });
    markerRefs.current[selectedClub.id]?.openPopup();
  }, [mapReady, selectedClub]);

  const handleClubSelect = (club: KolkataCollegeClub) => {
    setSelectedClubId(club.id);
  };

  const focusKolkata = () => {
    mapRef.current?.flyTo(
      [KOLKATA_CENTER.latitude, KOLKATA_CENTER.longitude],
      12,
      {
        duration: 0.7,
      }
    );
  };

  return (
    <div className="min-h-full overflow-hidden rounded-2xl border border-zinc-900 bg-[#050505] text-white shadow-2xl">
      <div className="grid min-h-[calc(100vh-3rem)] lg:grid-cols-[390px_1fr]">
        <aside className="flex min-h-[520px] flex-col border-b border-zinc-900 bg-zinc-950/80 lg:border-b-0 lg:border-r">
          <div className="space-y-5 border-b border-zinc-900 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-200 hover:bg-yellow-400/10">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Campus clubs
              </Badge>
              <Badge
                variant="outline"
                className="border-zinc-800 bg-zinc-900/70 text-zinc-300"
              >
                {formatRadius(CLUB_DISCOVERY_RADIUS_METERS)} map radius
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                College Club Map
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                Search college club hubs, compare nearby clusters, and jump
                straight to a campus location on the map.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-zinc-900 bg-black/50 p-3">
                <p className="text-xl font-bold text-white">
                  {kolkataCollegeClubs.length}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-zinc-500">
                  Clubs
                </p>
              </div>
              <div className="rounded-lg border border-zinc-900 bg-black/50 p-3">
                <p className="text-xl font-bold text-white">{categoryCount}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-zinc-500">
                  Types
                </p>
              </div>
              <div className="rounded-lg border border-zinc-900 bg-black/50 p-3">
                <p className="text-xl font-bold text-white">
                  {formatRadius(CLUB_DISCOVERY_RADIUS_METERS)}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-zinc-500">
                  Zone
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search club, college, area, tag..."
                className="h-11 rounded-lg border-zinc-800 bg-black/60 pl-9 pr-10 text-sm text-white placeholder:text-zinc-600 focus-visible:ring-yellow-400/30"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {filteredClubs.length === 0 ? (
              <Card className="border-zinc-900 bg-black/50">
                <CardContent className="p-6 text-center">
                  <MapPin className="mx-auto h-8 w-8 text-zinc-600" />
                  <p className="mt-3 text-sm font-medium text-zinc-200">
                    No matching club found
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Try another college name, area, or tag.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredClubs.map((club, index) => {
                const isSelected = selectedClub?.id === club.id;

                return (
                  <motion.button
                    key={club.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.2) }}
                    type="button"
                    onClick={() => handleClubSelect(club)}
                    className={cn(
                      'w-full rounded-lg border p-3 text-left transition',
                      isSelected
                        ? 'border-yellow-400/50 bg-yellow-400/10 shadow-[0_0_0_1px_rgba(250,204,21,0.08)]'
                        : 'border-zinc-900 bg-black/35 hover:border-zinc-700 hover:bg-zinc-900/60'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-semibold text-white">
                          {club.clubName}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                          {club.collegeName}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'shrink-0 capitalize',
                          categoryStyles[club.category]
                        )}
                      >
                        {club.category}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                      <MapPin className="h-3.5 w-3.5 text-yellow-300" />
                      <span className="line-clamp-1">{club.area}</span>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </aside>

        <section className="relative min-h-[620px] bg-black">
          <div
            ref={mapNodeRef}
            className="h-full min-h-[620px] w-full"
            aria-label="College club map"
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-[400] p-4">
            <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-black/80 p-3 backdrop-blur-md">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-400 text-black">
                  <Radar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {selectedClub?.clubName ?? 'Campus club network'}
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    {selectedClub
                      ? `${selectedClub.area} · ${selectedClub.address}`
                      : 'Explore clubs across campuses'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={focusKolkata}
                className="flex h-10 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-200 transition hover:border-yellow-400/40 hover:text-yellow-200"
              >
                <LocateFixed className="h-4 w-4" />
                Center
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-[400] grid gap-3 md:grid-cols-[1fr_auto]">
            <Card className="pointer-events-auto border-zinc-800 bg-black/85 text-white backdrop-blur-md">
              <CardContent className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-yellow-300" />
                    <p className="text-sm font-semibold">Heatmap intensity</p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    Larger bright areas show dense or high-activity college club
                    zones across the campus map.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400/80" />
                  Culture
                  <span className="ml-2 h-2.5 w-2.5 rounded-full bg-cyan-300/80" />
                  Tech
                  <span className="ml-2 h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  Business
                </div>
              </CardContent>
            </Card>

            <Card className="pointer-events-auto border-zinc-800 bg-black/85 text-white backdrop-blur-md">
              <CardContent className="flex h-full items-center gap-3 p-4">
                <Building2 className="h-5 w-5 text-zinc-400" />
                <div>
                  <p className="text-sm font-semibold">
                    {filteredClubs.length} visible
                  </p>
                  <p className="text-xs text-zinc-500">
                    Search updates map list
                  </p>
                </div>
                <Navigation className="h-4 w-4 text-yellow-300" />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClubMapPage;
