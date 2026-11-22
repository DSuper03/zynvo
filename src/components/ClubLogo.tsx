'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const BACKEND_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ''
).replace(/\/$/, '');

/** Initials avatar used when a club has no usable logo. */
export const clubFallbackLogo = (clubName?: string | null) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    clubName || 'Club'
  )}&fontSize=42&backgroundColor=111827,facc15,1f2937&textColor=facc15,ffffff`;

/**
 * Turns a stored `profilePicUrl` into something an <img> can load.
 * Empty / "none" / "null" (legacy defaults) fall back to initials; protocol-
 * relative and backend-relative paths are made absolute.
 */
export function clubLogoSrc(url: string | null | undefined, clubName?: string | null): string {
  const value = typeof url === 'string' ? url.trim() : '';
  if (!value || ['none', 'null', 'undefined'].includes(value.toLowerCase())) {
    return clubFallbackLogo(clubName);
  }
  if (/^https?:\/\//i.test(value) || /^(data|blob):/i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  if (value.startsWith('/') && !BACKEND_BASE_URL) return value; // site asset
  if (BACKEND_BASE_URL) return `${BACKEND_BASE_URL}/${value.replace(/^\/+/, '')}`;
  return clubFallbackLogo(clubName);
}

type ClubLogoProps = {
  src: string | null | undefined;
  name: string;
  className?: string;
  priority?: boolean;
} & ({ fill: true; width?: never; height?: never } | { fill?: false; width: number; height: number });

/**
 * Club logo that never shows a broken image: bad values and failed loads fall
 * back to an initials avatar. `unoptimized` because logos can live on any host
 * (older clubs predate ImageKit) and next/image rejects hosts missing from
 * next.config remotePatterns.
 */
export default function ClubLogo({ src, name, className, priority, ...size }: ClubLogoProps) {
  const resolved = clubLogoSrc(src, name);
  const [current, setCurrent] = useState(resolved);

  useEffect(() => setCurrent(resolved), [resolved]);

  return (
    <Image
      src={current}
      alt={name}
      className={className}
      priority={priority}
      unoptimized
      onError={() => {
        const fallback = clubFallbackLogo(name);
        if (current !== fallback) setCurrent(fallback);
      }}
      {...(size.fill ? { fill: true } : { width: size.width, height: size.height })}
    />
  );
}
