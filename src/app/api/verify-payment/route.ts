import { NextResponse } from 'next/server';
import { verifyPaymentTransaction, getServerWalletAddress } from '../../../../lib/serverWallet';
import { ballotContract } from '../../../../lib/contract';
import db from '../../../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { txHash, candidateId, fromAddress } = await request.json();

    if (!txHash || candidateId === undefined || candidateId === null || !fromAddress) {
      return NextResponse.json({ error: 'Missing txHash, candidateId, or fromAddress' }, { status: 400 });
    }


    // Check if the address has already voted by checking our DB
    const existingVote = db.prepare('SELECT txHash FROM relayed_votes WHERE voter = ?').get(fromAddress);
    if (existingVote) {
      return NextResponse.json({ error: 'This address has already voted.' }, { status: 403 });
    }

    // 1. Verify the transaction
    const verificationResult = await verifyPaymentTransaction(txHash, fromAddress);
    const verificationResult = await verifyPaymentTransaction(txHash, fromAddress);

    if (!verificationResult.success) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // 2. Record the payment in the payments table
    const insertPaymentStmt = db.prepare(
      'INSERT INTO payments (txHash, "from", "to", amount, timestamp, confirmed) VALUES (?, ?, ?, ?, ?, ?)'
    );
    insertPaymentStmt.run(
      txHash,
      verificationResult.from,
      verificationResult.to,
      verificationResult.amount!.toString(),
      Math.floor(Date.now() / 1000),
      1 // Confirmed
    );

    // 3. Issue a random short authorization token
    const token = uuidv4();
    const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60; // 5 minutes TTL

    const insertTokenStmt = db.prepare(
      'INSERT INTO auth_tokens (token, "from", expires_at, used) VALUES (?, ?, ?, ?)'
    );
    insertTokenStmt.run(token, fromAddress, expiresAt, 0);

    // 4. Return the token to the frontend
    return NextResponse.json({ token, expiresAt });
  } catch (error) {
    console.error('Error in verify-payment API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
