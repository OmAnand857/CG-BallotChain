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

    const { name, info } = await request.json();
    if (!name || !info) {
      return NextResponse.json({ error: 'Name and info are required' }, { status: 400 });
    }

    const signer = getServerSigner();
    const contractWithSigner = ballotContract.connect(signer);
    // @ts-ignore
    const tx = await contractWithSigner.addCandidate(name, info);
    await tx.wait();

    return NextResponse.json({ message: 'Candidate added successfully', txHash: tx.hash });
  } catch (error: any) {
    console.error('Error adding candidate:', error);
    return NextResponse.json({ error: `Failed to add candidate: ${error.message}` }, { status: 500 });
  }
}
