'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Full-page loading shell for event detail — matches hero + content layout.
 */
export function EventDetailSkeleton() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Skeleton className="h-5 w-40 mb-6 rounded-md bg-gray-800" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-[21/9] w-full rounded-xl bg-gray-800" />
            <div className="space-y-3">
              <Skeleton className="h-9 w-4/5 max-w-xl rounded-md bg-gray-800" />
              <Skeleton className="h-4 w-full max-w-2xl rounded-md bg-gray-800" />
              <Skeleton className="h-4 w-3/4 max-w-xl rounded-md bg-gray-800" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-11 w-36 rounded-lg bg-gray-800" />
              <Skeleton className="h-11 w-40 rounded-lg bg-gray-800" />
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full rounded-md bg-gray-800" />
              <Skeleton className="h-4 w-full rounded-md bg-gray-800" />
              <Skeleton className="h-4 w-2/3 rounded-md bg-gray-800" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl bg-gray-800" />
            <Skeleton className="h-32 w-full rounded-xl bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
