import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const toysFilePath = path.join(process.cwd(), 'data', 'toys.json')
    
    let toys = []
    if (fs.existsSync(toysFilePath)) {
      const fileContent = fs.readFileSync(toysFilePath, 'utf-8')
      const data = JSON.parse(fileContent)
      toys = Array.isArray(data) ? data : (data.toys || [])
      
      // Convert toys to consistent format for frontend
      toys = toys.map((toy: any) => ({
        ...toy,
        age_group: toy.ageGroup || toy.age_group,
        image_url: toy.imageUrl || toy.image_url || '',
        // Smart price conversion: if price > 100, it's likely in cents, convert to dollars
        // This handles legacy data while preserving new correct prices
        price: (toy.price > 100 && Number.isInteger(toy.price)) ? toy.price / 100 : toy.price
      }))
    }
    
    return NextResponse.json({
      success: true,
      toys: toys,
      count: toys.length
    })
  } catch (error) {
    console.error('Error reading toys:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, toyData, toyId } = await request.json()
    const toysFilePath = path.join(process.cwd(), 'data', 'toys.json')
    
    // Read existing toys
    let toys = []
    if (fs.existsSync(toysFilePath)) {
      const fileContent = fs.readFileSync(toysFilePath, 'utf-8')
      const data = JSON.parse(fileContent)
      toys = Array.isArray(data) ? data : (data.toys || [])
    }
    
    switch (action) {
      case 'create':
        const newToy = {
          id: 'toy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          name: toyData.name,
          description: toyData.description,
          category: toyData.category,
          price: toyData.price, // Store price as-is (no conversion)
          ageGroup: toyData.age_group, // Convert to camelCase
          imageUrl: toyData.image_url || '', // Convert to camelCase
          brand: 'PlayPro',
          stock: 50,
          tags: []
        }
        
        toys.push(newToy)
        fs.writeFileSync(toysFilePath, JSON.stringify(toys, null, 2))
        
        return NextResponse.json({
          success: true,
          toy: {
            ...newToy,
            age_group: newToy.ageGroup, // Convert back for frontend
            image_url: newToy.imageUrl
            // price stays as-is (no conversion back)
          }
        })
      
      case 'update':
        const toyIndex = toys.findIndex((toy: any) => toy.id === toyId)
        if (toyIndex === -1) {
          return NextResponse.json({
            success: false,
            error: { message: 'Toy not found' }
          })
        }
        
        // Update toy with new data
        toys[toyIndex] = {
          ...toys[toyIndex],
          name: toyData.name,
          description: toyData.description,
          category: toyData.category,
          price: toyData.price, // Store price as-is (no conversion)
          ageGroup: toyData.age_group,
          imageUrl: toyData.image_url || toys[toyIndex].imageUrl
        }
        
        fs.writeFileSync(toysFilePath, JSON.stringify(toys, null, 2))
        
        return NextResponse.json({
          success: true,
          toy: {
            ...toys[toyIndex],
            age_group: toys[toyIndex].ageGroup,
            image_url: toys[toyIndex].imageUrl
            // price stays as-is (no conversion back)
          }
        })
      
      case 'delete':
        const filteredToys = toys.filter((toy: any) => toy.id !== toyId)
        if (filteredToys.length === toys.length) {
          return NextResponse.json({
            success: false,
            error: { message: 'Toy not found' }
          })
        }
        
        fs.writeFileSync(toysFilePath, JSON.stringify(filteredToys, null, 2))
        
        return NextResponse.json({
          success: true,
          message: 'Toy deleted successfully'
        })
      
      default:
        return NextResponse.json({
          success: false,
          error: { message: 'Invalid action' }
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in toys admin API:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}