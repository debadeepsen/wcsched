import { NextResponse } from 'next/server'
import { getMatches } from '@/utils/api'

export async function GET() {
  try {
    const data = await getMatches()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching World Cup data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch World Cup schedule data' },
      { status: 500 }
    )
  }
}
