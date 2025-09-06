import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if localStorage is accessible (it won't be in API routes)
    // This is just to verify the API routes are working
    
    return NextResponse.json({
      success: true,
      message: 'API route is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: 'API route test failed'
    }, { status: 500 });
  }
}