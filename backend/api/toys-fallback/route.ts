import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const toysFilePath = path.join(process.cwd(), 'data', 'toys.json')
    
    if (!fs.existsSync(toysFilePath)) {
      return NextResponse.json({
        success: true,
        toys: [],
        message: 'No toys file found'
      })
    }
    
    const fileContent = fs.readFileSync(toysFilePath, 'utf-8')
    const toys = JSON.parse(fileContent)
    
    return NextResponse.json({
      success: true,
      toys: toys,
      message: 'Toys loaded from JSON file'
    })
    
  } catch (error) {
    console.error('Error reading toys from JSON:', error)
    return NextResponse.json({
      success: false,
      toys: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}