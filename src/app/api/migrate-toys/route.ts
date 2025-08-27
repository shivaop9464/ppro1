import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    // Read toys data from JSON file
    const filePath = join(process.cwd(), 'data', 'toys.json')
    const fileContents = readFileSync(filePath, 'utf8')
    const toysData = JSON.parse(fileContents)
    // First, check if toys already exist in database
    const { data: existingToys, error: checkError } = await supabase
      .from('toys')
      .select('id')
      .limit(1)
    
    if (checkError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to check existing toys', 
        error: checkError.message 
      }, { status: 500 })
    }

    if (existingToys && existingToys.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Toys data already exists in database', 
        count: existingToys.length 
      }, { status: 400 })
    }

    // Transform JSON data to match database schema
    const toysForDatabase = toysData.toys.map(toy => ({
      name: toy.name,
      description: toy.description,
      category: toy.category,
      brand: toy.brand,
      price: toy.price / 100, // Convert from cents to dollars
      age_group: toy.ageGroup, // Convert camelCase to snake_case
      image_url: toy.imageUrl ? toy.imageUrl : `https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400`,
      stock: 50, // Default stock
      tags: [toy.category.toLowerCase(), 'toy'], // Create tags array
      is_active: true
    }))

    // Insert toys data into database
    const { data: insertedToys, error: insertError } = await supabase
      .from('toys')
      .insert(toysForDatabase)
      .select()

    if (insertError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to insert toys data', 
        error: insertError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Toys data migrated successfully!',
      count: insertedToys?.length || 0,
      toys: insertedToys
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Migration failed', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current toys count from database
    const { data: toys, error } = await supabase
      .from('toys')
      .select('*')
      .eq('is_active', true)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to fetch toys from database', 
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