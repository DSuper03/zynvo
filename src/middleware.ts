import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

// Configure which paths require authentication
const protectedPaths = [
  '/dashboard',
  '/events/create',
  '/clubs/create',
  '/profile',
  '/messages',
];

// Configure public paths
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/reset-password',
  '/about',
  '/contact',
];

// Configure API rate limiting
const API_RATE_LIMIT = 100; // requests per minute
const apiRateLimitMap = new Map<string, { count: number, lastReset: number }>();

export async function middleware(request: NextRequest) {
  // First update the Supabase session
  const sessionResponse = await updateSession(request);
  
  // Get the pathname 
  const { pathname } = request.nextUrl;
  
  // Apply security headers to all requests
  const response = sessionResponse || NextResponse.next();
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
      
      if (now - data.lastReset > 60000) { // 1 minute
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
  
  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return response;
  }
  
  // Allow public browsing of events and clubs
  if ((pathname.startsWith('/events') || pathname.startsWith('/clubs')) && 
      !pathname.includes('/create')) {
    return response;
  }
  
  // Check if path needs protection
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path) || pathname.startsWith('/(protected)')
  );
  
  if (isProtectedPath) {
    // If Supabase session is already handling authentication, we can rely on that
    // But we can add an additional check for the auth token as a fallback
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      // Redirect to login if no auth token found
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    // Note: In a real app, you'd want to validate the token
    // This is simplified for demonstration
  }
  
  return response;
}

// Configure middleware to run only on specific paths - combining both patterns
export const config = {
  matcher: [
    // Match all request paths except static assets and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};