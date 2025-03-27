import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configure API rate limiting
const API_RATE_LIMIT = 100; // requests per minute
const apiRateLimitMap = new Map<string, { count: number; lastReset: number }>();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Basic rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() :
              request.headers.get('x-real-ip') ||
              'unknown';
    const now = Date.now();

    if (!apiRateLimitMap.has(ip)) {
      apiRateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
      const data = apiRateLimitMap.get(ip)!;

      if (now - data.lastReset > 60000) {
        data.count = 1;
        data.lastReset = now;
      } else {
        data.count += 1;
      }

      if (data.count > API_RATE_LIMIT) {
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // Return updated response
  return response;
}

export const config = {
  matcher: [
    // Match all request paths except static assets and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};