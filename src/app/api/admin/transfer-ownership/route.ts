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

    const { newOwner } = await request.json();
    if (!newOwner) {
      return NextResponse.json({ error: 'New owner address is required' }, { status: 400 });
    }

    const signer = getServerSigner();
    const contractWithSigner = ballotContract.connect(signer);
    // @ts-ignore

    const tx = await contractWithSigner.transferOwnership(newOwner);
    await tx.wait();

    return NextResponse.json({ message: 'Ownership transfer initiated successfully', txHash: tx.hash });
  } catch (error: any) {
    console.error(`Error transferring ownership:`, error);
    return NextResponse.json({ error: `Failed to transfer ownership: ${error.message}` }, { status: 500 });
  }
}
