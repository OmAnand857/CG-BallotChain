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

    const { address, action } = await request.json();
    if (!address || !action || !['add', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'Address and action (add/remove) are required' }, { status: 400 });
    }

    const signer = getServerSigner();
    const contractWithSigner = ballotContract.connect(signer);

    let tx;
    if (action === 'add') {
      tx = await contractWithSigner.addOverseer(address);
    } else {
      tx = await contractWithSigner.removeOverseer(address);
    }
    await tx.wait();

    return NextResponse.json({ message: `Overseer ${action === 'add' ? 'added' : 'removed'} successfully`, txHash: tx.hash });
  } catch (error: any) {
    console.error(`Error managing overseer:`, error);
    return NextResponse.json({ error: `Failed to manage overseer: ${error.message}` }, { status: 500 });
  }
}
