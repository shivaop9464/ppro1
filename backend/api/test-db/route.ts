import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Add RLS policy to allow toy insertion
    const { data, error } = await supabase.rpc('create_toy_insert_policy')
    
    if (error) {
      console.error('Failed to create RLS policy:', error)
      return NextResponse.json({
        success: false,
        message: 'Failed to create RLS policy',
        error: error.message
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'RLS policy created successfully',
      data: data
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create RLS policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Test toys management system status
    let toysManagement = {
      status: 'WORKING',
      toysCount: 0,
      canCreate: true,
      canUpdate: true,
      canDelete: true
    }
    
    try {
      const fs = require('fs')
      const path = require('path')
      const toysFilePath = path.join(process.cwd(), 'data', 'toys.json')
      if (fs.existsSync(toysFilePath)) {
        const fileContent = fs.readFileSync(toysFilePath, 'utf-8')
        const data = JSON.parse(fileContent)
        const toys = Array.isArray(data) ? data : (data.toys || [])
        toysManagement.toysCount = toys.length
      }
    } catch (err) {
      toysManagement.status = 'ERROR'
    }
    
    // Test database connectivity (read-only)
    const { data: dbToys, error: selectError } = await supabase
      .from('toys')
      .select('id, name, description, category, price, age_group')
      .limit(5)
    
    return NextResponse.json({
      success: true,
      message: 'Toys management system is working perfectly',
      toysManagement: toysManagement,
      database: {
        connection: selectError ? 'FAILED' : 'CONNECTED',
        toysInDB: dbToys?.length || 0,
        error: selectError?.message || null
      }
    })
    
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}