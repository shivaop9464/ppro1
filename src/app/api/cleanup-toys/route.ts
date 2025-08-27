import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // First, try to select all toys to see what exists
    const { data: allToys, error: selectError } = await supabase
      .from('toys')
      .select('id, name')
    
    console.log('Current toys in database:', allToys)
    console.log('Select error:', selectError)

    // Try to delete any toys with string IDs that look like 'toy_timestamp_randomstring'
    if (allToys && allToys.length > 0) {
      const stringIdToys = allToys.filter(toy => 
        typeof toy.id === 'string' && toy.id.startsWith('toy_')
      )
      
      console.log('Found toys with string IDs:', stringIdToys)
      
      if (stringIdToys.length > 0) {
        for (const toy of stringIdToys) {
          const { error: deleteError } = await supabase
            .from('toys')
            .delete()
            .eq('id', toy.id)
          
          if (deleteError) {
            console.error(`Failed to delete toy ${toy.id}:`, deleteError)
          } else {
            console.log(`Successfully deleted toy ${toy.id}`)
          }
        }
      }
    }

    // Now try to insert a test toy
    const testToy = {
      name: 'Test Toy Clean',
      description: 'Testing clean database insertion',
      category: 'Educational',
      price: 19.99,
      age_group: '2-4'
      // Minimal fields only, let database handle defaults
    }
    
    console.log('Inserting test toy:', testToy)
    
    const { data: insertedToy, error: insertError } = await supabase
      .from('toys')
      .insert([testToy])
      .select()
      .single()
    
    return NextResponse.json({
      success: !insertError,
      message: insertError ? 'Insertion failed' : 'Cleanup and insertion successful',
      existingToys: allToys,
      insertedToy: insertedToy,
      insertError: insertError,
      selectError: selectError
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}