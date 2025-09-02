import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Debug Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Check if environment variables are set
    if (!supabaseUrl) {
      return NextResponse.json({ 
        success: false, 
        message: 'NEXT_PUBLIC_SUPABASE_URL is not set',
        envVars: {
          NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'SET' : 'NOT SET',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'NOT SET'
        }
      }, { status: 500 })
    }
    
    if (!supabaseAnonKey) {
      return NextResponse.json({ 
        success: false, 
        message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set',
        envVars: {
          NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'SET' : 'NOT SET',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'NOT SET'
        }
      }, { status: 500 })
    }
    
    // Validate URL format
    let isValidUrl = false
    try {
      new URL(supabaseUrl)
      isValidUrl = true
    } catch (urlError) {
      return NextResponse.json({ 
        success: false, 
        message: 'NEXT_PUBLIC_SUPABASE_URL is not a valid URL',
        url: supabaseUrl,
        error: urlError instanceof Error ? urlError.message : 'Invalid URL'
      }, { status: 500 })
    }
    
    // Check if Supabase client is created
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        message: 'Supabase client could not be created',
        envVars: {
          NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'NOT SET'
        },
        urlValid: isValidUrl
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase is properly configured',
      envVars: {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'NOT SET'
      },
      urlValid: isValidUrl,
      clientCreated: !!supabase
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Debug test failed', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}