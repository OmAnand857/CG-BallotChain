import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { getRelayerSigner } from '../../../../lib/serverWallet';
import { ballotContract } from '../../../../lib/contract';

export async function POST(request: Request) {
  try {
    const { token, candidateId } = await request.json();

    if (!token || candidateId === undefined) {
      return NextResponse.json({ error: 'Missing token or candidateId' }, { status: 400 });
    }

    // 1. Validate the token
    const tokenRecord = db
      .prepare('SELECT * FROM auth_tokens WHERE token = ? AND used = 0 AND expires_at > ?')
      .get(token, Math.floor(Date.now() / 1000));

    if (!tokenRecord) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // 2. Mark the token as used
    db.prepare('UPDATE auth_tokens SET used = 1 WHERE token = ?').run(token);

    // 3. Use getRelayerSigner() to call contract.vote(candidateId)
    const signer = getRelayerSigner();
    const contractWithSigner = ballotContract.connect(signer);

    console.log(`Relaying vote for candidateId ${candidateId} from voter ${tokenRecord.from}`);

    const tx = await contractWithSigner.vote(candidateId);
    const receipt = await tx.wait();

    if (!receipt || receipt.status !== 1) {
      console.error('Transaction failed:', receipt);
      return NextResponse.json({ error: 'Vote transaction failed' }, { status: 500 });
    }

    // 4. Record the relayed vote in DB
    const insertVoteStmt = db.prepare(
      'INSERT INTO relayed_votes (txHash, voter, candidateId, timestamp) VALUES (?, ?, ?, ?)'
    );
    insertVoteStmt.run(receipt.hash, tokenRecord.from, candidateId, Math.floor(Date.now() / 1000));

    // 5. Return the relay tx hash
    return NextResponse.json({ relayTxHash: receipt.hash });
  } catch (error) {
    console.error('Error in relay-vote API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
