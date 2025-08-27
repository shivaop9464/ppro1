import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database tables...')
    
    // Test if toys table exists by trying to select anything
    const { data: toysData, error: toysError } = await supabase
      .from('toys')
      .select('id')
      .limit(1)
    
    if (toysError) {
      console.error('Toys table error:', toysError)
      return NextResponse.json({ 
        success: false, 
        message: 'Toys table issue',
        error: toysError.message,
        details: toysError
      }, { status: 500 })
    }

    // Test plans table (we know this works)
    const { data: plansData, error: plansError } = await supabase
      .from('plans')
      .select('id')
      .limit(1)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables accessible',
      toysCount: toysData?.length || 0,
      plansCount: plansData?.length || 0
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}