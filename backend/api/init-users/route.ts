import { NextRequest, NextResponse } from 'next/server';

// Default users for fallback authentication
const DEFAULT_USERS = [
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@playpro.com',
    password: 'admin123',
    isAdmin: true
  },
  {
    id: 'demo-001',
    name: 'Demo User',
    email: 'demo@playpro.com',
    password: 'demo123',
    isAdmin: false
  }
];

export async function GET() {
  try {
    // Initialize default users in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('playpro_users', JSON.stringify(DEFAULT_USERS));
      localStorage.removeItem('playpro_current_user');
      console.log('Default users initialized');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Default users initialized successfully',
      users: DEFAULT_USERS
    });
  } catch (error) {
    console.error('Error initializing users:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to initialize users'
    }, { status: 500 });
  }
}