import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware((auth, req) => {
  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/markdown') && !req.nextUrl.pathname.startsWith('/_markdown')) {
    const url = req.nextUrl.clone();
    url.pathname = `/_markdown${url.pathname}`;
    return NextResponse.rewrite(url);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
