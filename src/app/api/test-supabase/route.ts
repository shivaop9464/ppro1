import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('plans').select('*').limit(1)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed', 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful!',
      data: data || []
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Connection test failed', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}