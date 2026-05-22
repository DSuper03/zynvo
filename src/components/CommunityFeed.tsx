"use client";

import { useMemo, useState } from "react";
import { Calendar, Heart, Image, MessageCircle, User } from "lucide-react";
import {
  isUsableDiscoverImage,
  type DiscoverPostPreview,
} from "@/app/discover/discoverImages";

type CommunityFeedProps = {
  posts: DiscoverPostPreview[];
};

function formatDate(value?: string) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function Avatar({ post }: { post: DiscoverPostPreview }) {
  const [failed, setFailed] = useState(false);

  if (post.authorAvatar && !failed) {
    return (
      <img
        src={post.authorAvatar}
        alt={post.authorName}
        className="h-10 w-10 rounded-full object-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
      {post.authorName?.charAt(0).toUpperCase() || "Z"}
    </div>
  );
}

function PostCard({ post }: { post: DiscoverPostPreview }) {
  return (
    <article className="min-w-[20rem] max-w-[22rem] flex-shrink-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_50px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar post={post} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{post.authorName}</p>
            <p className="truncate text-xs text-slate-500">{post.clubName || post.collegeName || "Zenvo community"}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {formatDate(post.createdAt)}
        </span>
      </div>

      {isUsableDiscoverImage(post.image) ? (
        <img
          src={post.image}
          alt={post.title}
          className="h-60 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-60 items-center justify-center bg-slate-100 text-slate-500">
          <Image className="h-12 w-12" aria-hidden="true" />
        </div>
      )}

      <div className="space-y-4 px-4 py-4">
        <div>
          <p className="line-clamp-2 text-base font-semibold text-slate-900">{post.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{post.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
          <div className="inline-flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-900">
              <Heart className="h-4 w-4" aria-hidden="true" />
              {post.likes}
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {post.comments ?? 0}
            </span>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Live</span>
        </div>
      </div>
    </article>
  );
}

export function CommunityFeed({ posts }: CommunityFeedProps) {
  const visiblePosts = useMemo(
    () => posts.filter((post) => isUsableDiscoverImage(post.image)).slice(0, 8),
    [posts],
  );

  if (!visiblePosts.length) return null;

  const marqueePosts = [...visiblePosts, ...visiblePosts];

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-yellow-600">
              Community feed
            </p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Real student posts from ZynvoSocial Discover
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Fresh uploads from clubs, events and student creators — live from the backend.
            </p>
          </div>
        </div>
      </div>

      <div className="relative -mx-6 overflow-hidden px-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white to-transparent" />
        <div className="community-marquee flex w-max gap-6 pb-3">
          {marqueePosts.map((post, index) => (
            <PostCard key={`${post.id}-${index}`} post={post} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes community-feed-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .community-marquee {
          animation: community-feed-scroll 36s linear infinite;
          will-change: transform;
        }
        .community-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
