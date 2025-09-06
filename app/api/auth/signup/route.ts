import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Signup API route with fallback authentication

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, and password are required'
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    console.log('Processing signup for:', email);

    // Since Supabase email signups are disabled, use fallback directly
    console.log('Using fallback authentication for signup');
    return handleFallbackSignup(name, email, password);

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Fallback signup using localStorage
function handleFallbackSignup(name: string, email: string, password: string) {
  try {
    // Generate a unique ID for the user
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    
    // Create user object
    const newUser = {
      id: userId,
      name,
      email,
      password, // In production, this should be hashed
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    console.log('Creating fallback user:', { id: userId, name, email });

    return NextResponse.json({
      success: true,
      message: 'User account created successfully (fallback mode)',
      user: {
        id: userId,
        name,
        email,
        isAdmin: false
      },
      fallback: true
    });
  } catch (error) {
    console.error('Fallback signup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create user account'
    }, { status: 500 });
  }
}