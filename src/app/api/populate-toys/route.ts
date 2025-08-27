import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const sampleToys = [
  {
    name: 'Building Blocks Set',
    description: 'Colorful wooden building blocks to enhance creativity and motor skills',
    category: 'Educational',
    price: 2.99,
    age_group: '0-2',
    image_url: 'https://images.unsplash.com/photo-1572375992532-4a4cd7bb5136?w=400'
  },
  {
    name: 'Soft Plush Bear',
    description: 'Cuddly soft bear perfect for comfort and emotional development',
    category: 'Comfort',
    price: 3.99,
    age_group: '0-2',
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
  },
  {
    name: 'Musical Piano',
    description: 'Colorful piano with lights and sounds to develop musical skills',
    category: 'Musical',
    price: 5.99,
    age_group: '0-2',
    image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'
  },
  {
    name: 'Shape Sorting Cube',
    description: 'Interactive cube with different shapes to enhance problem-solving skills',
    category: 'Educational',
    price: 4.49,
    age_group: '2-4',
    image_url: 'https://images.unsplash.com/photo-1572375992532-4a4cd7bb5136?w=400'
  },
  {
    name: 'LEGO Classic Set',
    description: 'Creative building blocks set with endless possibilities',
    category: 'Construction',
    price: 15.99,
    age_group: '4-6',
    image_url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400'
  },
  {
    name: 'Science Experiment Kit',
    description: 'Safe and fun science experiments for curious young minds',
    category: 'STEM',
    price: 6.49,
    age_group: '4-6',
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'
  }
]

export async function POST(request: NextRequest) {
  try {
    // Check if toys already exist
    const { data: existingToys, error: checkError } = await supabase
      .from('toys')
      .select('id')
      .limit(1)
    
    if (checkError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed', 
        error: checkError.message 
      }, { status: 500 })
    }

    if (existingToys && existingToys.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Toys already exist in database', 
        count: existingToys.length 
      }, { status: 400 })
    }

    // Insert sample toys
    const { data: insertedToys, error: insertError } = await supabase
      .from('toys')
      .insert(sampleToys)
      .select()

    if (insertError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to insert toys', 
        error: insertError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sample toys added successfully!',
      count: insertedToys?.length || 0,
      toys: insertedToys
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to populate database', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data: toys, error } = await supabase
      .from('toys')
      .select('*')
      .eq('is_active', true)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to fetch toys', 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Toys fetched successfully',
      count: toys?.length || 0,
      toys: toys || []
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch toys', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}