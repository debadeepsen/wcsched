import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://fixturedownload.com/feed/json/fifa-world-cup-2026');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching World Cup data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch World Cup schedule data' },
      { status: 500 }
    );
  }
}
