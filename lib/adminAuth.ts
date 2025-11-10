import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET!;

export function verifyAdminToken(token: string): { address: string } | null {
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    return decoded as { address: string };
  } catch (error) {
    return null;
  }
}
