// Simple in-memory cache for client-side post data
// Used to avoid backend fetch when navigating from a posts list to the post detail page

import type { PostData } from '@/types/global-Interface';

const postMap = new Map<string, PostData>();

export function setPostCache(id: string, post: PostData) {
  if (!id || !post) return;
  postMap.set(id, post);
}

export function getPostCache(id: string): PostData | undefined {
  return postMap.get(id);
}

export function hasPostCache(id: string): boolean {
  return postMap.has(id);
}

export function clearPostCache(id?: string) {
  if (id) postMap.delete(id);
  else postMap.clear();
}
