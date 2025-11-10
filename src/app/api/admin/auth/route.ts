import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS!;
const TOKEN_SECRET = process.env.TOKEN_SECRET!;

export async function POST(request: Request) {
  try {
    const { address, signature } = await request.json();

    if (!address || !signature) {
      return NextResponse.json({ error: 'Address and signature are required' }, { status: 400 });
    }

    const message = 'I am logging in as admin';
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a JWT
    const token = jwt.sign({ address }, TOKEN_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
