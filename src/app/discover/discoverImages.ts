import axios from 'axios';
import type { PostData } from '@/types/global-Interface';

interface DiscoverPostsResponse {
  msg: string;
  posts: PostData[];
}

export type DiscoverPostPreview = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  authorName: string;
  authorAvatar?: string | null;
  clubName: string;
  collegeName: string;
  createdAt?: string;
  likes?: number;
  comments?: number;
};

const backendBaseUrl =
  (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://zynvosocial-be-274792984950.asia-south1.run.app'
  ).replace(/\/$/, '');

export const isUsableDiscoverImage = (image: string | null): image is string =>
  typeof image === 'string' &&
  image.trim().length > 0 &&
  (image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('/'));

export async function fetchDiscoverPosts(page = 1) {
  try {
    const response = await axios.get<DiscoverPostsResponse>(
      `${backendBaseUrl}/api/v1/post/all?page=${page}`,
    );

    return response.data?.posts || [];
  } catch {
    console.warn('Discover posts are unavailable right now; using fallback content.');
    return [];
  }
}

export async function fetchDiscoverImages(limit = 6, page = 1) {
  const posts = await fetchDiscoverPostPreviews(limit, page);

  return posts
    .map((post) => post.image)
    .filter(isUsableDiscoverImage)
    .slice(0, limit);
}

export function toDiscoverPostPreview(post: PostData): DiscoverPostPreview {
  return {
    id: post.id,
    title: post.title || 'Discover post',
    description: post.description || post.title || 'See what is happening on Zynvo.',
    image: isUsableDiscoverImage(post.image) ? post.image : null,
    authorName: post.author?.name || 'Zynvo student',
    authorAvatar: post.author?.profileAvatar || null,
    clubName: post.clubName || '',
    collegeName: post.collegeName || '',
    createdAt: String(post.createdAt || ''),
    likes: post.upvotes?.length ?? 0,
    comments: 0,
  };
}

export async function fetchDiscoverPostPreviews(limit = 6, page = 1) {
  const posts = await fetchDiscoverPosts(page);

  return posts
    .map(toDiscoverPostPreview)
    .slice(0, limit);
}
