import { NextResponse } from 'next/server';
import { getServerWalletAddress } from '../../../../lib/serverWallet';
import dotenv from 'dotenv';

dotenv.config();

export async function GET() {
  try {
    const serverAddress = getServerWalletAddress();
    const voteFeeEther = process.env.FEE_ETHER || '0'; // Default to '0' if not set

    return NextResponse.json({ serverAddress, voteFeeEther });
  } catch (error) {
    console.error('Error fetching server info:', error);
    return NextResponse.json({ error: 'Failed to fetch server info' }, { status: 500 });
  }
}
