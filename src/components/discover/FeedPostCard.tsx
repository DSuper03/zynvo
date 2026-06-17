'use client';

import Image from 'next/image';
import { Building, Calendar, MoreHorizontal, Share, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TextWithLinks from '@/components/TextWithLinks';
import { VoteButtonsCompact } from '@/components/ui/vote-buttons';
import type { PostData } from '@/types/global-Interface';

const MAX_PREVIEW_CHARS = 220;

export type FeedPostCardProps = {
  post: PostData;
  timeLabel: string;
  isDescriptionExpanded: boolean;
  onToggleDescription: (e: React.MouseEvent) => void;
  onOpenPost: () => void;
  onImageClick: (src: string, alt: string) => void;
  onShare: (e: React.MouseEvent) => void;
};

/**
 * Discover feed post — unified spacing, typography, and borders (Zynvo dark theme).
 */
export function FeedPostCard({
  post,
  timeLabel,
  isDescriptionExpanded,
  onToggleDescription,
  onOpenPost,
  onImageClick,
  onShare,
}: FeedPostCardProps) {
  const desc = post.description || '';
  const needsTruncate = desc.length > MAX_PREVIEW_CHARS;
  const visible =
    !needsTruncate || isDescriptionExpanded
      ? desc
      : `${desc.slice(0, MAX_PREVIEW_CHARS)}...`;

  const userVote =
    (post as PostData & { userVote?: 'upvote' | 'downvote' | null }).userVote ||
    null;

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={onOpenPost}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenPost();
        }
      }}
      className="group relative overflow-hidden rounded-xl border border-gray-800/90 bg-[#0c0c0c] shadow-sm shadow-black/30 transition-all duration-200 hover:border-yellow-500/20 hover:bg-[#0e0e0e] hover:shadow-md hover:shadow-black/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-gray-800/70 px-4 pt-4 pb-3 sm:px-5 sm:pt-5">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-700/80">
          {post.author.profileAvatar ? (
            <Image
              src={post.author.profileAvatar}
              alt={post.author.name || 'User'}
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yellow-500 to-amber-500">
              <User className="h-5 w-5 text-black" aria-hidden />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium text-white">
              {post.author.name || 'Anonymous'}
            </span>
            {!post.published && (
              <span className="shrink-0 rounded-full bg-gray-700/80 px-2 py-0.5 text-[11px] font-medium text-gray-300">
                Draft
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3 w-3 shrink-0" aria-hidden />
            <span>{timeLabel}</span>
            {post.createdAt !== post.updatedAt && (
              <span className="text-gray-600">· Edited</span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 sm:px-5">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
          {post.title}
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-gray-300 sm:text-[15px]">
          <TextWithLinks text={visible} />
          {needsTruncate && (
            <button
              type="button"
              className="ml-1.5 inline font-medium text-yellow-400/95 underline-offset-2 hover:text-yellow-300 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDescription(e);
              }}
            >
              {isDescriptionExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {post.image && (
          <div
            className="relative mt-4 w-full max-w-2xl overflow-hidden rounded-lg border border-gray-800/80 bg-gray-900/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="relative block aspect-video w-full cursor-zoom-in"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(post.image!, post.title);
              }}
              aria-label="View image larger"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {post.collegeName && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-200">
              <Building className="h-3.5 w-3.5 shrink-0 opacity-80" />
              {post.collegeName}
            </span>
          )}
          {post.clubName && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-200">
              <Users className="h-3.5 w-3.5 shrink-0 opacity-80" />
              {post.clubName}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between gap-3 border-t border-gray-800/80 bg-black/25 px-4 py-3 sm:px-5">
        <div
          className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <VoteButtonsCompact
            postId={post.id}
            initialUpvotes={post.upvotes?.length || 0}
            initialDownvotes={post.downvotes?.length || 0}
            initialUserVote={userVote}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 shrink-0 gap-1.5 text-gray-400 hover:bg-gray-800/80 hover:text-yellow-400"
            onClick={onShare}
          >
            <Share className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Share</span>
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 text-gray-500 hover:bg-gray-800/80 hover:text-gray-300"
          onClick={(e) => e.stopPropagation()}
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </footer>
    </article>
  );
}
