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
    !secretKey.includes('YOUR_SECRET_KEY') &&
    publishableKey !== 'YOUR_PUBLISHABLE_KEY' &&
    secretKey !== 'YOUR_SECRET_KEY' &&
    !publishableKey.includes('pk_test_XXXXXXXX') && 
    !secretKey.includes('sk_test_XXXXXXXX') &&
    publishableKey.startsWith('pk_') &&
    secretKey.startsWith('sk_') &&
    publishableKey.length > 30 && // Valid keys are longer
    secretKey.length > 30
  );
};

// Export a simple middleware that only applies Clerk when properly configured
export default function middleware(req: Request) {
  // Only use Clerk middleware if properly configured
  if (isClerkConfigured()) {
    return clerkMiddleware((auth, req) => {
      if (isProtectedRoute(req)) {
        auth().protect();
      }
    })(req);
  }
  
  // Skip Clerk middleware if not properly configured
  return undefined;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};