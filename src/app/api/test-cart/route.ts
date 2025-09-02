import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // Test reading the demo user's cart
    const cartFilePath = path.join(process.cwd(), 'data', 'cart_demo-001.json')
    
    let cartItems = []
    if (fs.existsSync(cartFilePath)) {
      const fileContent = fs.readFileSync(cartFilePath, 'utf-8')
      cartItems = JSON.parse(fileContent)
    }
    
    return NextResponse.json({
      success: true,
      cartItems,
      message: 'Cart data retrieved successfully'
    })
  } catch (error) {
    console.error('Error reading cart:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, toyId, quantity } = await request.json()
    
    // Test with demo user ID
    const userId = 'demo-001'
    const cartFilePath = path.join(process.cwd(), 'data', `cart_${userId}.json`)
    
    // Read existing cart
    let cartItems = []
    if (fs.existsSync(cartFilePath)) {
      const fileContent = fs.readFileSync(cartFilePath, 'utf-8')
      cartItems = JSON.parse(fileContent)
    }
    
    if (action === 'add') {
      // Add new item
      const newItem = {
        id: 'cart_' + Date.now() + '_test',
        toyId: toyId || 'test-toy-1',
        quantity: quantity || 1,
        addedAt: new Date().toISOString()
      }
      cartItems.push(newItem)
      
      fs.writeFileSync(cartFilePath, JSON.stringify(cartItems, null, 2))
      
      return NextResponse.json({
        success: true,
        message: 'Item added to cart',
        cartItems
      })
    }
    
    if (action === 'clear') {
      fs.writeFileSync(cartFilePath, JSON.stringify([], null, 2))
      
      return NextResponse.json({
        success: true,
        message: 'Cart cleared',
        cartItems: []
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })
  } catch (error) {
    console.error('Error in test cart API:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}