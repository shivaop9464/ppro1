import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const demoUsers = [
      {
        email: 'demo@playpro.com',
        password: 'demo123',
        name: 'Demo User',
        isAdmin: false
      },
      {
        email: 'admin@playpro.com',
        password: 'admin123',
        name: 'Admin User',
        isAdmin: true
      }
    ]

    const results = []

    for (const user of demoUsers) {
      try {
        // First check if user already exists
        // Check if user already exists by listing all users and filtering by email
        const { data: allUsers } = await supabase.auth.admin.listUsers()
        const existingUser = allUsers?.users?.find(u => u.email === user.email)
        
        if (existingUser) {
          results.push({
            email: user.email,
            status: 'already_exists',
            message: 'User already exists'
          })
          continue
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            name: user.name
          }
        })

        if (authError) {
          results.push({
            email: user.email,
            status: 'error',
            message: authError.message
          })
          continue
        }

        // Wait a moment for the trigger to create the user profile
        await new Promise(resolve => setTimeout(resolve, 500))

        // Update the user profile with admin status if needed
        if (user.isAdmin && authData.user) {
          const { error: profileError } = await supabase
            .from('users')
            .update({ is_admin: true })
            .eq('id', authData.user.id)

          if (profileError) {
            console.error('Error updating admin status:', profileError)
          }
        }

        results.push({
          email: user.email,
          status: 'created',
          message: 'User created successfully'
        })

      } catch (error) {
        results.push({
          email: user.email,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo users setup completed',
      results
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to setup demo users',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check current users in database
    const { data: users, error } = await supabase
      .from('users')
      .select('email, name, is_admin, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Users fetched successfully',
      users: users || []
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}