import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get the path to the plans.json file
    const filePath = path.join(process.cwd(), 'data', 'plans.json');
    console.log('Reading plans data from:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('Plans file not found at path:', filePath);
      return NextResponse.json(
        { error: 'Plans data file not found' },
        { status: 404 }
      );
    }
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the JSON
    const plansData = JSON.parse(fileContent);
    
    console.log('Plans data:', plansData);
    
    // Return the data
    return NextResponse.json(plansData);
  } catch (error) {
    console.error('Error reading plans data:', error);
    return NextResponse.json(
      { error: 'Failed to load plans data', details: String(error) },
      { status: 500 }
    );
  }
}