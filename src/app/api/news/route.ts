/**
 * Same-origin proxy for the news scraper.
 *
 * Some mobile carriers block direct connections to Vercel IPs, so browsers must
 * not call zynvo-scrapper.vercel.app directly. The server fetches it instead and
 * the browser only talks to our own domain.
 */
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const NEWS_UPSTREAM =
  process.env.NEWS_SCRAPER_URL ?? 'https://zynvo-scrapper.vercel.app/news';

export async function GET() {
  try {
    const res = await fetch(NEWS_UPSTREAM, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { news: [], error: `Upstream error: ${res.status}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        news: [],
        error: err instanceof Error ? err.message : 'Failed to reach news service',
      },
      { status: 504 },
    );
  }
}
