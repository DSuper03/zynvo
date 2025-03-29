import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/', // Home page
  '/event(.*)', // Event page and subroutes
  '/feed(.*)', // Feed page and subroutes
  '/sign-in(.*)', // Sign-in page
  '/sign-up(.*)', // Sign-up page
]);

export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for public routes
  if (!isPublicRoute(req)) {
    await auth.protect(); // Protect non-public routes
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};