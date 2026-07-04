import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware((_auth, req) => {
  if (req.method !== 'GET') return;

  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith('/api') || pathname.startsWith('/trpc')) return;

  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/markdown') && !pathname.startsWith('/_markdown')) {
    const url = req.nextUrl.clone();
    url.pathname = `/_markdown${pathname}`;
    return NextResponse.rewrite(url);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
