import { NextResponse } from 'next/server';
import { ballotContract, getServerSigner } from '../../../../../lib/contract';
import { verifyAdminToken } from '../../../../../lib/adminAuth';

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

    console.log('Admin verified. Attempting to end election...');

    const signer = getServerSigner();
    const contractWithSigner = ballotContract.connect(signer);

    // Assuming the function is named endElection()
    // @ts-ignore
    const tx = await contractWithSigner.endElection();
    await tx.wait();

    console.log('Election ended successfully. Tx:', tx.hash);
    return NextResponse.json({ message: 'Election ended successfully', txHash: tx.hash });
  } catch (error: any) {
    console.error('Error ending election:', error);
    // Check for a more specific contract error message
    const reason = error.reason || 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to end election: ${reason}` }, { status: 500 });
  }
}
