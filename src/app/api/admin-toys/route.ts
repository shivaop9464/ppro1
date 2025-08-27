import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// For now, use regular client. TODO: Implement proper service role after getting correct key

export async function GET(request: NextRequest) {
  try {
    // Get all toys using admin client (bypasses RLS)
    const { data: toys, error } = await supabase
      .from('toys')
      .select('*')
      .order('created_at', { ascending: false })
    
    return NextResponse.json({
      success: true,
      message: 'Toys retrieved successfully',
      toys: toys || [],
      count: toys?.length || 0,
      error: error
    })
  } catch (error) {
    console.error('Error getting toys:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, toyData, toyId } = await request.json()
    
    switch (action) {
      case 'create':
        // Prepare clean toy data with only valid fields
        const cleanToyData = {
          name: toyData.name,
          description: toyData.description,
          category: toyData.category,
          price: toyData.price,
          age_group: toyData.age_group,
          image_url: toyData.image_url || '',
          stock: toyData.stock || 50
          // Removed brand and is_active as they may not exist in current schema
        }
        
        const { data: newToy, error: createError } = await supabase
          .from('toys')
          .insert([cleanToyData])
          .select()
          .single()
        
        return NextResponse.json({
          success: !createError,
          toy: newToy,
          error: createError
        })
      
      case 'update':
        // Prepare clean update data
        const cleanUpdateData = {
          name: toyData.name,
          description: toyData.description,
          category: toyData.category,
          price: toyData.price,
          age_group: toyData.age_group,
          image_url: toyData.image_url,
          stock: toyData.stock
        }
        
        const { data: updatedToy, error: updateError } = await supabase
          .from('toys')
          .update(cleanUpdateData)
          .eq('id', toyId)
          .select()
          .single()
        
        return NextResponse.json({
          success: !updateError,
          toy: updatedToy,
          error: updateError
        })
      
      case 'delete':
        const { error: deleteError } = await supabase
          .from('toys')
          .delete()
          .eq('id', toyId)
        
        return NextResponse.json({
          success: !deleteError,
          error: deleteError
        })
      
      case 'cleanup':
        // Get toys that might have invalid IDs
        const { data: allToys } = await supabase
          .from('toys')
          .select('id, name')
        
        // Filter for string IDs that start with 'toy_'
        const invalidToys = (allToys || []).filter(toy => 
          typeof toy.id === 'string' && toy.id.startsWith('toy_')
        )
        
        let cleanedCount = 0
        for (const toy of invalidToys) {
          const { error } = await supabase
            .from('toys')
            .delete()
            .eq('id', toy.id)
          
          if (!error) cleanedCount++
        }
        
        return NextResponse.json({
          success: true,
          message: `Cleaned up ${cleanedCount} toys with invalid IDs`,
          foundInvalidToys: invalidToys.length,
          cleanedToys: cleanedCount
        })
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in admin toys API:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}