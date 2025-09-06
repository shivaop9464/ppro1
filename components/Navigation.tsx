'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useState, useEffect } from 'react';

// Conditional import of Clerk components
let clerkComponents: {
  useUser?: typeof import('@clerk/nextjs').useUser;
  SignInButton?: typeof import('@clerk/nextjs').SignInButton;
  SignUpButton?: typeof import('@clerk/nextjs').SignUpButton;
  SignOutButton?: typeof import('@clerk/nextjs').SignOutButton;
  SignedIn?: typeof import('@clerk/nextjs').SignedIn;
  SignedOut?: typeof import('@clerk/nextjs').SignedOut;
} = {};

// Check if Clerk is properly configured
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
    !secretKey.includes('sk_test_XXXXXXXX')
  );
};

// Try to import Clerk components only if properly configured
if (isClerkConfigured()) {
  try {
    clerkComponents = require('@clerk/nextjs');
  } catch (error) {
    console.warn('Failed to import Clerk components:', error);
  }
}

const { useUser, SignInButton, SignUpButton, SignOutButton, SignedIn, SignedOut } = clerkComponents;

export default function Navigation() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loading, initialize: initAuth } = useAuthStore();
  const { getCartCount, initialize: initCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clerkUserResult = useUser ? useUser() : null;
  const { isLoaded, isSignedIn, user: clerkUser } = clerkUserResult || {};
  
  // Initialize auth and cart on component mount
  useEffect(() => {
    const initialize = async () => {
      // Only initialize auth store if Clerk is not configured
      if (!isClerkConfigured()) {
        await initAuth();
      }
      await initCart();
      setMounted(true);
    };
    initialize();
  }, [initAuth, initCart]);

  // Re-initialize cart when auth state changes
  useEffect(() => {
    if (mounted) {
      initCart();
    }
  }, [isAuthenticated, mounted, initCart]);

  // Base navigation links
  const baseNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/toys', label: 'Toys' },
    { href: '/plans', label: 'Plans' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  // Add admin link if user is admin
  const navLinks = (user?.isAdmin || (clerkUserResult?.isLoaded && clerkUserResult?.user?.publicMetadata?.isAdmin)) 
    ? [...baseNavLinks, { href: '/admin', label: 'Admin' }]
    : baseNavLinks;

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <Image src="/images/playpro-logo.svg" alt="PlayPro Logo" width={240} height={72} priority className="hover:opacity-90 transition-opacity hidden md:block" />
              <Image src="/images/playpro-logo.svg" alt="PlayPro Logo" width={140} height={42} priority className="hover:opacity-90 transition-opacity md:hidden" />
            </div>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Main Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="text-gray-700 hover:text-indigo-600">
              <ShoppingCart className="h-6 w-6" />
            </Link>

            {/* Auth Links */}
            <div className="flex items-center space-x-2">
              {/* Clerk Authentication - Only if properly configured */}
              {isClerkConfigured() && isLoaded && (
                <>
                  <SignedIn>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700 text-sm">
                        {clerkUser?.fullName || clerkUser?.emailAddresses[0]?.emailAddress}
                      </span>
                      <SignOutButton>
                        <button 
                          className="text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium"
                          onClick={async () => {
                            // Refresh the page after logout to ensure state is clean
                            window.location.href = '/';
                          }}
                        >
                          Logout
                        </button>
                      </SignOutButton>
                    </div>
                  </SignedIn>
                  
                  <SignedOut>
                    <div className="flex items-center space-x-2">
                      <SignInButton 
                        mode="modal"
                        signUpForceRedirectUrl="/"
                        signInForceRedirectUrl="/"
                        fallbackRedirectUrl="/"
                      >
                        <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium">
                          Login
                        </button>
                      </SignInButton>
                      <SignUpButton 
                        mode="modal"
                        signUpForceRedirectUrl="/"
                        signInForceRedirectUrl="/"
                        fallbackRedirectUrl="/"
                      >
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700">
                          Sign Up
                        </button>
                      </SignUpButton>
                    </div>
                  </SignedOut>
                </>
              )}
              
              {/* Fallback to existing auth system for demo users or when Clerk is not configured */}
              {(!isClerkConfigured() || !isLoaded) && (
                <>
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700 text-sm">
                        {user?.name}
                      </span>
                      <button
                        onClick={async () => {
                          await logout();
                          router.push('/');
                        }}
                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-3 border-t">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-indigo-600 py-2 px-1 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              {/* Mobile Cart Link */}
              <Link 
                href="/cart" 
                className="text-gray-700 hover:text-indigo-600 flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
              </Link>
              
              {/* Mobile Auth Links */}
              {(!isClerkConfigured() || !isLoaded) && (
                <>
                  {isAuthenticated ? (
                    <button
                      onClick={async () => {
                        await logout();
                        router.push('/');
                        setMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium"
                    >
                      Logout
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <Link
                        href="/login"
                        className="text-gray-700 hover:text-indigo-600 px-2 py-2 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="bg-indigo-600 text-white px-3 py-2 rounded font-medium hover:bg-indigo-700 text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}