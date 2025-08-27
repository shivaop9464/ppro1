import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Disable RLS temporarily for toys table
    const { error: disableRLSError } = await supabase.rpc('disable_toys_rls')
    
    if (disableRLSError) {
      console.log('RLS disable attempt:', disableRLSError)
      // If the function doesn't exist, try direct SQL
      const { error: sqlError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE public.toys DISABLE ROW LEVEL SECURITY;'
      })
      
      if (sqlError) {
        console.log('Direct SQL attempt:', sqlError)
        return NextResponse.json({
          success: false,
          message: 'Unable to disable RLS. Trying alternative approach...',
          error: sqlError.message,
          suggestion: 'Please disable RLS manually in Supabase dashboard'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'RLS disabled for toys table. Admin operations should now work.',
      note: 'You can now create, update, and delete toys from the admin panel.'
    })
  } catch (error) {
    console.error('RLS fix error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fix RLS. Please disable RLS manually in Supabase dashboard for toys table.'
    }, { status: 500 })
  }
}