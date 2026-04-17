'use client';

import { Skeleton } from '@/components/ui/skeleton';

function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-800/90 bg-[#0c0c0c] shadow-sm shadow-black/30">
      <div className="flex gap-3 border-b border-gray-800/70 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
        <Skeleton className="h-11 w-11 shrink-0 rounded-full bg-gray-800" />
        <div className="flex-1 space-y-2 pt-0.5">
          <Skeleton className="h-4 w-36 rounded-md bg-gray-800" />
          <Skeleton className="h-3 w-28 rounded-md bg-gray-800" />
        </div>
      </div>
      <div className="space-y-3 px-4 py-4 sm:px-5">
        <Skeleton className="h-6 w-4/5 max-w-md rounded-md bg-gray-800" />
        <Skeleton className="h-4 w-full rounded-md bg-gray-800" />
        <Skeleton className="h-4 w-full rounded-md bg-gray-800" />
        <Skeleton className="h-4 w-2/3 rounded-md bg-gray-800" />
        <Skeleton className="aspect-video w-full max-w-2xl rounded-lg bg-gray-800" />
        <div className="flex flex-wrap gap-2 pt-1">
          <Skeleton className="h-7 w-24 rounded-md bg-gray-800" />
          <Skeleton className="h-7 w-28 rounded-md bg-gray-800" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-800/80 bg-black/25 px-4 py-3 sm:px-5">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-md bg-gray-800" />
          <Skeleton className="h-10 w-20 rounded-md bg-gray-800" />
        </div>
        <Skeleton className="h-10 w-10 rounded-md bg-gray-800" />
      </div>
    </div>
  );
}

type Props = { count?: number };

/** Discover feed initial loading — stacked post-shaped skeletons */
export function FeedPostSkeleton({ count = 3 }: Props) {
  return (
    <div className="space-y-4 sm:space-y-6" aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: count }, (_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
