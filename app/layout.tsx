import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'

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

export const metadata: Metadata = {
  title: 'PlayPro - Toy Subscription Service',
  description: 'Discover, play, and learn with our curated toy subscription service. Quality toys delivered to your doorstep every month.',
  keywords: 'toys, subscription, children, educational, play, learning',
  // Add Google Fonts link directly in metadata
  other: {
    'google-site-verification': 'google-site-verification',
  },
}

// Add Google Fonts link directly
export const viewport = {
  themeColor: '#667eea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Only wrap with ClerkProvider if properly configured
  const clerkProviderEnabled = isClerkConfigured();
  
  const content = (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" }}>
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );

  // Conditionally wrap with ClerkProvider
  return clerkProviderEnabled ? (
    <ClerkProvider>
      {content}
    </ClerkProvider>
  ) : content;
}