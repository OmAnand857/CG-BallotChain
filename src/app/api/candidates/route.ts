import { NextResponse } from 'next/server';
import { ballotContract } from '../../../../lib/contract';

export async function GET() {
  try {
    const [names, infos, votes] = await ballotContract.getAllCandidates();

    const candidates = names.map((name: string, index: number) => ({
      id: index,
      name,
      info: infos[index],
      voteCount: votes[index].toString(), // Convert BigInt to string for JSON serialization
    }));

    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}
