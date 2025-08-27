import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface CartItem {
  id: string;
  toyId: string;
  quantity: number;
  addedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }
    
    const cartFilePath = path.join(process.cwd(), 'data', `cart_${userId}.json`)
    
    let cartItems: CartItem[] = []
    if (fs.existsSync(cartFilePath)) {
      const fileContent = fs.readFileSync(cartFilePath, 'utf-8')
      cartItems = JSON.parse(fileContent)
    }
    
    // Get toy details for each cart item
    const toysFilePath = path.join(process.cwd(), 'data', 'toys.json')
    let toys = []
    if (fs.existsSync(toysFilePath)) {
      const toysContent = fs.readFileSync(toysFilePath, 'utf-8')
      const toysData = JSON.parse(toysContent)
      toys = Array.isArray(toysData) ? toysData : (toysData.toys || [])
    }
    
    // Enrich cart items with toy details
    const enrichedItems = cartItems.map(cartItem => {
      const toy = toys.find(t => t.id === cartItem.toyId)
      return {
        id: cartItem.id,
        quantity: cartItem.quantity,
        addedAt: cartItem.addedAt,
        toy: toy ? {
          id: toy.id,
          name: toy.name,
          description: toy.description,
          category: toy.category,
          price: toy.price > 100 ? toy.price / 100 : toy.price, // Handle legacy cents format
          age_group: toy.ageGroup || toy.age_group,
          image_url: toy.imageUrl || toy.image_url || '',
          brand: toy.brand || 'PlayPro',
          stock: toy.stock || 50,
          tags: toy.tags || []
        } : null
      }
    }).filter(item => item.toy !== null) // Remove items with missing toys
    
    return NextResponse.json({
      success: true,
      items: enrichedItems,
      count: enrichedItems.length
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
    const { action, userId, toyId, quantity, itemId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }
    
    const cartFilePath = path.join(process.cwd(), 'data', `cart_${userId}.json`)
    
    // Read existing cart
    let cartItems: CartItem[] = []
    if (fs.existsSync(cartFilePath)) {
      const fileContent = fs.readFileSync(cartFilePath, 'utf-8')
      cartItems = JSON.parse(fileContent)
    }
    
    switch (action) {
      case 'add':
        if (!toyId) {
          return NextResponse.json({
            success: false,
            error: 'Toy ID is required'
          }, { status: 400 })
        }
        
        // Check if item already exists
        const existingItemIndex = cartItems.findIndex(item => item.toyId === toyId)
        
        if (existingItemIndex >= 0) {
          // Update quantity
          cartItems[existingItemIndex].quantity += quantity || 1
        } else {
          // Add new item
          const newItem: CartItem = {
            id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            toyId: toyId,
            quantity: quantity || 1,
            addedAt: new Date().toISOString()
          }
          cartItems.push(newItem)
        }
        
        fs.writeFileSync(cartFilePath, JSON.stringify(cartItems, null, 2))
        
        return NextResponse.json({
          success: true,
          message: 'Item added to cart'
        })
      
      case 'update':
        if (!itemId || !quantity) {
          return NextResponse.json({
            success: false,
            error: 'Item ID and quantity are required'
          }, { status: 400 })
        }
        
        const updateIndex = cartItems.findIndex(item => item.id === itemId)
        if (updateIndex >= 0) {
          cartItems[updateIndex].quantity = quantity
          fs.writeFileSync(cartFilePath, JSON.stringify(cartItems, null, 2))
          
          return NextResponse.json({
            success: true,
            message: 'Cart item updated'
          })
        } else {
          return NextResponse.json({
            success: false,
            error: 'Cart item not found'
          }, { status: 404 })
        }
      
      case 'remove':
        if (!itemId && !toyId) {
          return NextResponse.json({
            success: false,
            error: 'Item ID or Toy ID is required'
          }, { status: 400 })
        }
        
        const filteredItems = cartItems.filter(item => 
          itemId ? item.id !== itemId : item.toyId !== toyId
        )
        
        fs.writeFileSync(cartFilePath, JSON.stringify(filteredItems, null, 2))
        
        return NextResponse.json({
          success: true,
          message: 'Item removed from cart'
        })
      
      case 'clear':
        fs.writeFileSync(cartFilePath, JSON.stringify([], null, 2))
        
        return NextResponse.json({
          success: true,
          message: 'Cart cleared'
        })
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in cart admin API:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}