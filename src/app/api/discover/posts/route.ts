import { NextRequest, NextResponse } from 'next/server';
import type { PostData } from '@/types/global-Interface';

interface DiscoverPostsResponse {
  msg: string;
  posts: PostData[];
}

const backendBaseUrl =
  (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://zynvosocial-be-274792984950.asia-south1.run.app'
  ).replace(/\/$/, '');

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page') || '1';

  try {
    const response = await fetch(`${backendBaseUrl}/api/v1/post/all?page=${page}`, {
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { msg: 'Failed to fetch Discover posts', posts: [] },
        { status: response.status },
      );
    }

    const data = (await response.json()) as DiscoverPostsResponse;

    return NextResponse.json({
      msg: data.msg || 'Discover posts fetched',
      posts: data.posts || [],
    });
  } catch (error) {
    console.error('Failed to proxy Discover posts:', error);
    return NextResponse.json(
      { msg: 'Failed to fetch Discover posts', posts: [] },
      { status: 502 },
    );
  }
}
