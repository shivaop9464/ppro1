import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Try to get table info from information_schema
    const { data: columns, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'toys')
      .eq('table_schema', 'public')
    
    if (schemaError) {
      console.error('Schema query failed:', schemaError)
    }

    // Try a simple select to see what happens
    const { data: toys, error: selectError } = await supabase
      .from('toys')
      .select('*')
      .limit(1)

    // Try just essential fields
    const { data: basicToys, error: basicError } = await supabase
      .from('toys')
      .select('id, name, description, category, price')
      .limit(1)

    return NextResponse.json({
      schema_query: {
        data: columns,
        error: schemaError
      },
      full_select: {
        data: toys,
        error: selectError
      },
      basic_select: {
        data: basicToys,
        error: basicError
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}