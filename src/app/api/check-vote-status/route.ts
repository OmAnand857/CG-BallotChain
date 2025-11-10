import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address query parameter is required' }, { status: 400 });
  }

  try {
    // Check our local database
    const dbVote = db.prepare('SELECT txHash FROM relayed_votes WHERE voter = ?').get(address);
    
    if (dbVote) {
      return NextResponse.json({ hasVoted: true });
    }

    return NextResponse.json({ hasVoted: false });
  } catch (error) {
    console.error('Error checking vote status:', error);
    return NextResponse.json({ error: 'Failed to check vote status' }, { status: 500 });
  }
}
