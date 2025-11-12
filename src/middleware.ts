import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/solutions(.*)",
  "/book-demo(.*)",
  "/about",
  "/privacy",
  "/cookies",
]);

export default clerkMiddleware((auth, req) => {
  try {
    // Allow public routes without authentication
    if (isPublicRoute(req)) {
      return;
    }
    
    // Protect all other routes
    auth.protect();
  } catch (error) {
    // Log error but don't crash - allow request to proceed
    console.error('[Middleware] Error in clerkMiddleware:', error)
    // Return NextResponse.next() to allow request to proceed
    // This prevents middleware from crashing the entire app
    return NextResponse.next()
  }
});

// Configure matcher to ignore Next.js internals and static files
// This pattern matches all routes except static files and Next.js internals
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
