"use client";

import { useMemo, useState, useRef } from "react";
import {
  isUsableDiscoverImage,
  type DiscoverPostPreview,
} from "@/app/discover/discoverImages";

type ParallaxHeroImagesProps = {
  posts: DiscoverPostPreview[];
};

const positions = [
  "left-[5%] top-[10%] h-32 w-28 rotate-[-8deg] sm:h-48 sm:w-40 lg:h-60 lg:w-48",
  "right-[5%] top-[12%] h-32 w-32 rotate-[7deg] sm:h-48 sm:w-48 lg:h-60 lg:w-60",
  "left-[8%] bottom-[10%] h-28 w-40 rotate-[5deg] sm:h-40 sm:w-56 lg:h-48 lg:w-72",
  "right-[8%] bottom-[10%] h-32 w-28 rotate-[-5deg] sm:h-48 sm:w-40 lg:h-60 lg:w-48",
  "left-[38%] top-[5%] hidden h-28 w-40 rotate-[3deg] sm:block sm:h-40 sm:w-56 lg:h-48 lg:w-64",
  "right-[36%] bottom-[5%] hidden h-28 w-40 rotate-[-7deg] sm:block sm:h-40 sm:w-56 lg:h-48 lg:w-64",
];

function FloatingImage({ src, eager }: { src: string; eager: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-yellow-100 p-4 text-center">
        <div>
          <p className="text-3xl font-black text-black">Z</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-black/70">
            Discover
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="h-full w-full object-cover"
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}

export function ParallaxHeroImages({ posts }: ParallaxHeroImagesProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ activeIndex: number; startX: number; startY: number } | null>(null);
  const [dragOffsets, setDragOffsets] = useState<Record<number, { x: number; y: number }>>({});

  const visiblePosts = useMemo(
    () => posts.filter((post) => isUsableDiscoverImage(post.image)).slice(0, positions.length),
    [posts],
  );

  if (!visiblePosts.length) return null;

  return (
    <div
      className="absolute inset-x-0 top-20 bottom-8 mx-auto w-full max-w-7xl overflow-hidden px-3 sm:top-24 sm:px-6"
      onPointerMove={(event) => {
        // update parallax pointer based on pointer position
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        });
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      aria-hidden="true"
    >
      {visiblePosts.map((post, index) => {
        const depth = (index + 1) * 12;

        return (
          <div
            key={`${post.id}-${index}`}
            // allow pointer interactions on each card so users can drag on touch
            className={`pointer-events-auto absolute overflow-hidden rounded-xl border-2 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,0.95)] transition-transform duration-200 ease-out sm:shadow-[8px_8px_0_rgba(0,0,0,0.95)] ${positions[index]}`}
            style={{
              transform: `translate3d(${pointer.x * depth + (dragOffsets[index]?.x || 0)}px, ${pointer.y * depth + (dragOffsets[index]?.y || 0)}px, 0) rotate(var(--tw-rotate))`,
            }}
            onPointerDown={(e) => {
              // begin drag for this card
              try {
                (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
              } catch {}
              dragRef.current = { activeIndex: index, startX: e.clientX, startY: e.clientY };
            }}
            onPointerMove={(e) => {
              // handle dragging for this specific card
              if (dragRef.current?.activeIndex === index) {
                const deltaX = e.clientX - dragRef.current.startX;
                const deltaY = e.clientY - dragRef.current.startY;
                setDragOffsets((prev) => {
                  const prevOff = prev[index] || { x: 0, y: 0 };
                  const newOff = { x: prevOff.x + deltaX, y: prevOff.y + deltaY };
                  return { ...prev, [index]: newOff };
                });
                // update start to avoid accumulating large deltas
                dragRef.current!.startX = e.clientX;
                dragRef.current!.startY = e.clientY;
                e.preventDefault();
              }
            }}
            onPointerUp={(e) => {
              try {
                (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
              } catch {}
              dragRef.current = null;
            }}
            onPointerCancel={() => {
              dragRef.current = null;
            }}
          >
            <FloatingImage src={post.image || ""} eager={index < 2} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-2 text-left text-white sm:p-3">
              <p className="line-clamp-2 text-[10px] font-black leading-tight sm:text-xs">
                {post.title}
              </p>
              <p className="mt-1 truncate text-[9px] font-bold text-yellow-200 sm:text-[10px]">
                {post.authorName}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

