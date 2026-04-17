'use client';

import { Skeleton } from '@/components/ui/skeleton';

function PostCardSkeleton() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-yellow-500/10">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32 rounded-md bg-gray-700" />
          <Skeleton className="h-3 w-24 rounded-md bg-gray-700" />
        </div>
      </div>
      <Skeleton className="h-4 w-full rounded-md bg-gray-700 mb-2" />
      <Skeleton className="h-4 w-11/12 rounded-md bg-gray-700 mb-2" />
      <Skeleton className="h-4 w-4/5 rounded-md bg-gray-700 mb-4" />
      <Skeleton className="aspect-video w-full max-w-2xl mx-auto rounded-lg bg-gray-700" />
      <div className="flex justify-between pt-4 mt-4 border-t border-gray-700">
        <Skeleton className="h-8 w-24 rounded-md bg-gray-700" />
        <Skeleton className="h-8 w-20 rounded-md bg-gray-700" />
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
