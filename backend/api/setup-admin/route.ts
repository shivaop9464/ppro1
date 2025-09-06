import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Use provided credentials or defaults
    const adminEmail = email || 'admin@playpro.com'
    const adminPassword = password || 'admin123'
    const adminName = name || 'Admin User'

    console.log('Setting up admin user:', adminEmail)

    // Try to sign up the admin user
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          name: adminName
        }
      }
    })

    console.log('Signup result:', { signupData, signupError })

    if (signupError) {
      // Handle email signups disabled error
      if (signupError.code === 'email_provider_disabled') {
        return NextResponse.json({
          success: false,
          message: 'Email signups are disabled in Supabase',
          error: signupError.message,
          instructions: [
            '1. Go to your Supabase Dashboard: https://app.supabase.com',
            '2. Select your project',
            '3. Go to Authentication → Settings',
            '4. Under "Auth Providers", enable "Email" provider',
            '5. Or manually create the admin user in Authentication → Users',
            '6. Then come back and try again'
          ],
          alternativeStep: 'You can also manually create a user in Supabase Dashboard → Authentication → Users with the email: ' + adminEmail
        }, { status: 400 })
      }
      
      // Check if user already exists
      if (signupError.message?.includes('already registered') || 
          signupError.message?.includes('already exists')) {
        
        console.log('User already exists, checking database...')
        
        // Check if user exists in our users table
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('email', adminEmail)
          .single()

        if (checkError) {
          console.log('User not found in database, but exists in auth')
          return NextResponse.json({
            success: false,
            message: 'User exists in authentication but not in database. Please contact support.',
            error: checkError.message
          }, { status: 400 })
        }

        // Update admin status if needed
        if (!existingUser.is_admin) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ is_admin: true })
            .eq('id', existingUser.id)

          if (updateError) {
            console.error('Error updating admin status:', updateError)
          }
        }

        return NextResponse.json({
          success: true,
          message: 'Admin user already exists',
          admin: {
            email: adminEmail,
            name: existingUser.name,
            status: 'existing',
            isAdmin: existingUser.is_admin
          }
        })
      } else {
        console.error('Signup error:', signupError)
        return NextResponse.json({
          success: false,
          message: 'Failed to create admin user',
          error: signupError.message
        }, { status: 500 })
      }
    }

    if (signupData.user) {
      console.log('User created successfully, user ID:', signupData.user.id)
      
      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully! You can now login.',
        admin: {
          email: adminEmail,
          name: adminName,
          status: 'created',
          userId: signupData.user.id
        }
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Unknown error occurred during admin setup'
    }, { status: 500 })

  } catch (error) {
    console.error('Admin setup error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to setup admin user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if admin user exists and get details
    const { data: adminUsers, error } = await supabase
      .from('users')
      .select('email, name, is_admin, created_at')
      .eq('is_admin', true)

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to check admin users',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin users retrieved',
      admins: adminUsers || [],
      hasAdmin: (adminUsers && adminUsers.length > 0)
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to check admin users',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}