import { NextResponse } from 'next/server';
import { ballotContract, getServerSigner } from '../../../../../lib/contract';
import { verifyAdminToken } from '../../../../../lib/adminAuth';
import db from '../../../../../lib/db';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    console.log('Admin verified. Attempting to reset election...');

    // 1. Reset the smart contract state
    const signer = getServerSigner();
    const contractWithSigner = ballotContract.connect(signer);
    
    // Assuming the function is named resetElection()
        // @ts-ignore

    const tx = await contractWithSigner.declareWinnerAndReset();
    await tx.wait();
    
    console.log('Contract reset successfully. Tx:', tx.hash);

    // 2. Reset the database tables
    console.log('Resetting database tables...');
    db.prepare('DELETE FROM relayed_votes').run();
    db.prepare('DELETE FROM auth_tokens').run();
    db.prepare('DELETE FROM payments').run();
    console.log('Database tables reset successfully.');

    return NextResponse.json({ 
      message: 'Election and database reset successfully', 
      txHash: tx.hash 
    });

  } catch (error: any) {
    console.error('Error resetting election:', error);
    const reason = error.reason || 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to reset election: ${reason}` }, { status: 500 });
  }
}
