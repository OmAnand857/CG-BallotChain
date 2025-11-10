// This is a Server Component
import VoteClientPage from './VoteClientPage';
import { getServerWalletAddress } from '../../../lib/serverWallet';
import dotenv from 'dotenv';

dotenv.config();

async function getServerInfo(): Promise<{ serverAddress: string; voteFeeEther: string }> {
  const serverAddress = getServerWalletAddress();
  const voteFeeEther = process.env.FEE_ETHER || '0';
  console.log('[Server Log] Server Address from .env:', serverAddress); // DEBUG LOG
  return { serverAddress, voteFeeEther };
}

export default async function VotePage() {
  let serverAddress: string = '';
  let voteFeeEther: string = '';
  let error: string | null = null;

  try {
    const info = await getServerInfo();
    serverAddress = info.serverAddress;
    voteFeeEther = info.voteFeeEther;
  } catch (err: any) {
    error = err.message;
  }

  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <VoteClientPage serverAddress={serverAddress} voteFeeEther={voteFeeEther} />
  );
}
