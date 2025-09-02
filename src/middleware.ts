import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only apply auth middleware to protected routes
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/cart(.*)',
]);

// Check if Clerk keys are properly configured
const isClerkConfigured = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  
  // Check if keys exist and are not placeholder values
  return (
    publishableKey && 
    secretKey && 
    !publishableKey.includes('YOUR_PUBLISHABLE_KEY') && 
    !secretKey.includes('YOUR_SECRET_KEY')
  );
};

// Handle missing Clerk keys gracefully
let middleware: ReturnType<typeof clerkMiddleware>;

if (isClerkConfigured()) {
  try {
    middleware = clerkMiddleware((auth, req) => {
      if (isProtectedRoute(req)) auth().protect();
    });
  } catch (error) {
    console.warn('Clerk middleware error, falling back to allow all requests:', error);
    // Fallback middleware that allows all requests when Clerk is not configured properly
    middleware = () => {};
  }
} else {
  console.warn('Clerk not properly configured, falling back to allow all requests');
  // Fallback middleware that allows all requests when Clerk is not configured
  middleware = () => {};
}

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};