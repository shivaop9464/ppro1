import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ReactNode } from 'react'

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
  return (
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
  )
}
