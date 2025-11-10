import { NextResponse } from 'next/server';
import { ballotContract } from '../../../../lib/contract';

export async function GET() {
  try {
    // Assuming the function is named getLastWinner() and returns { id: uint256, name: string }
    const [winnerId, winnerName] = await ballotContract.getLastWinner();

    // Check if the winnerName is empty or a default value indicating no winner
    // Assuming an empty string or a specific default value means no winner yet
    if (!winnerName || winnerName.trim() === '' || winnerName === 'No Winner') { // Added 'No Winner' check
      return NextResponse.json({ winner: null });
    }

    return NextResponse.json({ winner: winnerName });
  } catch (error: any) {
    console.error('Error fetching last winner:', error);
    // If the contract reverts because no winner is set, we can handle that gracefully
    // This might happen if getLastWinner() reverts instead of returning default values
    if (error.reason && error.reason.includes("No winner has been declared")) {
      return NextResponse.json({ winner: null });
    }
    return NextResponse.json({ error: 'Failed to fetch last winner' }, { status: 500 });
  }
}
