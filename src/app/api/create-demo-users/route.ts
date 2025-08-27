import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase-service'

export async function POST(request: NextRequest) {
  try {
    const demoUsers = [
      {
        email: 'demo@playpro.com',
        password: 'demo123',
        name: 'Demo User'
      },
      {
        email: 'admin@playpro.com',
        password: 'admin123',
        name: 'Admin User'
      }
    ]

    const results = []

    for (const user of demoUsers) {
      try {
        // Try to sign up the user using our existing service
        const { data, error } = await supabaseService.signUp(user.email, user.password, user.name)

        if (error) {
          // If error is "User already registered", that's ok
          if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
            results.push({
              email: user.email,
              status: 'already_exists',
              message: 'User already exists'
            })
          } else {
            results.push({
              email: user.email,
              status: 'error',
              message: error.message
            })
          }
        } else {
          results.push({
            email: user.email,
            status: 'created',
            message: 'User created successfully'
          })
        }

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
      message: 'Demo users setup attempt completed',
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