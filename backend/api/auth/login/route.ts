import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Sign in user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Supabase auth login error:', authError);
      return NextResponse.json({
        success: false,
        error: authError.message
      }, { status: 401 });
    }

    if (!authData.user) {
      return NextResponse.json({
        success: false,
        error: 'Login failed'
      }, { status: 401 });
    }

    // Get user profile from the users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profileData) {
      console.error('Error fetching user profile:', profileError);
      // Return basic user info even if profile fetch fails
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: authData.user.id,
          name: authData.user.user_metadata?.name || 'User',
          email: authData.user.email,
          isAdmin: false
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        isAdmin: profileData.is_admin
      }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}