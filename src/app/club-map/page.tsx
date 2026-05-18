'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as MapLibreMap, Marker } from 'maplibre-gl';
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

const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

const categoryStyles: Record<KolkataCollegeClub['category'], string> = {
  tech: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/25',
  culture: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/25',
  business: 'bg-amber-500/15 text-amber-200 border-amber-400/25',
  social: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/25',
  media: 'bg-sky-500/15 text-sky-200 border-sky-400/25',
  sports: 'bg-orange-500/15 text-orange-200 border-orange-400/25',
};

/** Heat blobs use the same hues as list badges so categories stay visually consistent. */
const heatFillByCategory: Record<KolkataCollegeClub['category'], string> = {
  tech: '#22d3ee',
  culture: '#e879f9',
  business: '#f59e0b',
  social: '#34d399',
  media: '#38bdf8',
  sports: '#fb923c',
};

const CATEGORY_LEGEND_ORDER: KolkataCollegeClub['category'][] = [
  'tech',
  'culture',
  'media',
  'business',
  'social',
  'sports',
];

const formatRadius = (meters: number) => `${Math.round(meters / 1000)} km`;

const normalize = (value: string) => value.trim().toLowerCase();

/** Google Maps “Directions” in a new tab; destination uses stored campus coordinates. */
function openGoogleDirectionsToClub(club: KolkataCollegeClub): void {
  const dest = `${club.latitude},${club.longitude}`;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** Approximate geodesic circle as GeoJSON for the discovery overlay. */
function discoveryZoneFeature(): GeoJSON.Feature<GeoJSON.Polygon> {
  const lat0 = KOLKATA_CENTER.latitude;
  const lng0 = KOLKATA_CENTER.longitude;
  const r = CLUB_DISCOVERY_RADIUS_METERS;
  const steps = 96;
  const ring: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const θ = (i / steps) * 2 * Math.PI;
    const lat = lat0 + (r * Math.sin(θ)) / 110574;
    const lng =
      lng0 +
      (r * Math.cos(θ)) / (111320 * Math.cos((lat0 * Math.PI) / 180));
    ring.push([lng, lat]);
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [ring],
    },
  };
}

/** Spread pins that share identical coordinates (e.g. multiple TMSL clubs) so each stays clickable. */
function buildClubDisplayLatLng(
  clubs: KolkataCollegeClub[]
): globalThis.Map<string, { lat: number; lng: number }> {
  const precision = 5;
  const buckets = new globalThis.Map<string, KolkataCollegeClub[]>();

  for (const club of clubs) {
    const key = `${club.latitude.toFixed(precision)},${club.longitude.toFixed(precision)}`;
    const group = buckets.get(key);
    if (group) {
      group.push(club);
    } else {
      buckets.set(key, [club]);
    }
  }

  const result = new globalThis.Map<string, { lat: number; lng: number }>();

  for (const group of buckets.values()) {
    if (group.length === 1) {
      const only = group[0];
      result.set(only.id, { lat: only.latitude, lng: only.longitude });
      continue;
    }
    group.forEach((club, i) => {
      const ringRadius =
        group.length <= 4
          ? 0.00014
          : Math.min(0.00034, 0.00015 + group.length * 0.000017);
      const angle = (2 * Math.PI * i) / group.length - Math.PI / 2;
      result.set(club.id, {
        lat: club.latitude + Math.cos(angle) * ringRadius,
        lng: club.longitude + Math.sin(angle) * ringRadius,
      });
    });
  }

  return result;
}

const clubDisplayLatLng = buildClubDisplayLatLng(kolkataCollegeClubs);

function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/** Frame first load on eastern India; Delhi/NCR pins stay on the map via pan/zoom. */
const INITIAL_FIT_MAX_DISTANCE_KM = 520;

function clubsForInitialBounds(clubs: KolkataCollegeClub[]): KolkataCollegeClub[] {
  const near = clubs.filter(
    (c) =>
      haversineDistanceKm(
        c.latitude,
        c.longitude,
        KOLKATA_CENTER.latitude,
        KOLKATA_CENTER.longitude
      ) <= INITIAL_FIT_MAX_DISTANCE_KM
  );
  return near.length ? near : clubs;
}

const ClubMapPage = () => {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRefs = useRef<Record<string, Marker>>({});
  const [query, setQuery] = useState('');
  const [selectedClubId, setSelectedClubId] = useState(
    kolkataCollegeClubs[0]?.id ?? ''
  );
  const [mapReady, setMapReady] = useState(false);
  const categoryCount = useMemo(
    () => new Set(kolkataCollegeClubs.map((club) => club.category)).size,
    []
  );

  const categoriesOnMap = useMemo(() => {
    const present = new Set(kolkataCollegeClubs.map((c) => c.category));
    return CATEGORY_LEGEND_ORDER.filter((c) => present.has(c));
  }, []);

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
    markerRefs.current = {};

    const setup = async () => {
      const maplibregl = (await import('maplibre-gl')).default;

      if (disposed || !mapNodeRef.current) {
        return;
      }

      const map = new maplibregl.Map({
        container: mapNodeRef.current,
        style: OPENFREEMAP_STYLE,
        center: [KOLKATA_CENTER.longitude, KOLKATA_CENTER.latitude],
        zoom: 9,
        minZoom: 3,
        maxZoom: 18,
        pitch: 52,
        bearing: -26,
      });

      map.addControl(
        new maplibregl.NavigationControl({ visualizePitch: true }),
        'bottom-right'
      );

      map.on('load', () => {
        if (disposed) return;

        try {
          if (!map.getSource('zynvo-terrain')) {
            map.addSource('zynvo-terrain', {
              type: 'raster-dem',
              url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
              tileSize: 256,
            });
            map.setTerrain({
              source: 'zynvo-terrain',
              exaggeration: 1.12,
            });
          }
        } catch {
          /* terrain is optional */
        }

        if (map.getLayer('building-3d')) {
          map.setPaintProperty('building-3d', 'fill-extrusion-opacity', 0.9);
        }

        const layers = map.getStyle().layers ?? [];
        const beforeHeat =
          layers.find((l) => l.id === 'building-3d')?.id ??
          layers.find((l) => l.type === 'symbol')?.id;

        map.addSource('discovery-zone', {
          type: 'geojson',
          data: discoveryZoneFeature(),
        });

        map.addLayer(
          {
            id: 'discovery-zone-fill',
            type: 'fill',
            source: 'discovery-zone',
            paint: {
              'fill-color': '#facc15',
              'fill-opacity': 0.04,
            },
          },
          beforeHeat
        );

        map.addLayer(
          {
            id: 'discovery-zone-outline',
            type: 'line',
            source: 'discovery-zone',
            paint: {
              'line-color': '#facc15',
              'line-width': 1,
              'line-dasharray': [4, 3],
              'line-opacity': 0.55,
            },
          },
          beforeHeat
        );

        const heatFeatures: GeoJSON.Feature<GeoJSON.Point>[] =
          kolkataCollegeClubs.map((club) => {
            const pos = clubDisplayLatLng.get(club.id) ?? {
              lat: club.latitude,
              lng: club.longitude,
            };
            return {
              type: 'Feature',
              properties: {
                intensity: club.intensity,
                color: heatFillByCategory[club.category],
              },
              geometry: {
                type: 'Point',
                coordinates: [pos.lng, pos.lat],
              },
            };
          });

        map.addSource('club-heat', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: heatFeatures,
          },
        });

        map.addLayer(
          {
            id: 'club-heat-glow',
            type: 'circle',
            source: 'club-heat',
            paint: {
              'circle-radius': [
                '+',
                26,
                ['*', ['get', 'intensity'], 3.2],
              ],
              'circle-blur': 0.88,
              'circle-opacity': [
                'min',
                0.22,
                ['*', 0.024, ['get', 'intensity']],
              ],
              'circle-color': ['get', 'color'],
            },
          },
          beforeHeat
        );

        kolkataCollegeClubs.forEach((club) => {
          const pos = clubDisplayLatLng.get(club.id) ?? {
            lat: club.latitude,
            lng: club.longitude,
          };

          const el = document.createElement('div');
          el.className = 'zynvo-map-marker';
          el.innerHTML = '<span></span>';
          el.title = `${club.clubName} — Open directions`;

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([pos.lng, pos.lat])
            .addTo(map);

          el.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            setSelectedClubId(club.id);
            openGoogleDirectionsToClub(club);
          });

          markerRefs.current[club.id] = marker;
        });

        const bounds = new maplibregl.LngLatBounds();
        clubsForInitialBounds(kolkataCollegeClubs).forEach((club) => {
          const pos = clubDisplayLatLng.get(club.id) ?? {
            lat: club.latitude,
            lng: club.longitude,
          };
          bounds.extend([pos.lng, pos.lat]);
        });

        map.fitBounds(bounds, {
          padding: { top: 56, bottom: 110, left: 36, right: 36 },
          pitch: 48,
          bearing: -22,
          duration: 0,
          maxZoom: 11,
        });

        mapRef.current = map;
        setMapReady(true);
      });
    };

    setup();

    return () => {
      disposed = true;
      markerRefs.current = {};
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!selectedClub || !mapRef.current || !mapReady) {
      return;
    }

    const map = mapRef.current;
    const pos = clubDisplayLatLng.get(selectedClub.id) ?? {
      lat: selectedClub.latitude,
      lng: selectedClub.longitude,
    };

    map.flyTo({
      center: [pos.lng, pos.lat],
      zoom: 14.8,
      pitch: 58,
      bearing: map.getBearing(),
      duration: 750,
      essential: true,
    });
  }, [mapReady, selectedClub]);

  const handleClubSelect = (club: KolkataCollegeClub) => {
    setSelectedClubId(club.id);
  };

  const focusKolkata = () => {
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center: [KOLKATA_CENTER.longitude, KOLKATA_CENTER.latitude],
      zoom: 11,
      pitch: 52,
      bearing: -26,
      duration: 750,
      essential: true,
    });
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
                straight to a campus location — tilt and drag the map to explore
                campuses in 3D.
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
            className="club-maplibre-container h-full min-h-[620px] w-full"
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
              <div className="flex flex-wrap items-center justify-end gap-2">
                {selectedClub ? (
                  <button
                    type="button"
                    onClick={() => openGoogleDirectionsToClub(selectedClub)}
                    className="flex h-10 items-center gap-2 rounded-lg border border-yellow-400/35 bg-yellow-400/10 px-3 text-xs font-semibold text-yellow-100 transition hover:border-yellow-400/55 hover:bg-yellow-400/15"
                  >
                    <Navigation className="h-4 w-4" />
                    Directions
                  </button>
                ) : null}
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
          </div>

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-[400] grid gap-3 md:grid-cols-[1fr_auto]">
            <Card className="pointer-events-auto border-zinc-800 bg-black/85 text-white backdrop-blur-md">
              <CardContent className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-yellow-300" />
                    <p className="text-sm font-semibold">
                      3D campuses & heat zones
                    </p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    Tap a map pin to open Google Maps directions to that campus
                    in a new tab. Tilt the map to see building outlines in 3D.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                  {categoriesOnMap.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 capitalize"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full opacity-90"
                        style={{
                          backgroundColor: heatFillByCategory[category],
                        }}
                      />
                      {category}
                    </span>
                  ))}
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
