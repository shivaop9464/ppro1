'use client';

import Link from 'next/link';

interface LoginButtonProps {
  className?: string;
}

export default function LoginButton({ className = '' }: LoginButtonProps) {
  return (
    <Link
      href="/login"
      className={`bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 ${className}`}
    >
      Go to Login
    </Link>
  );
}