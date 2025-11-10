import { getServerWalletAddress, getBalance } from '../../../../lib/serverWallet';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

export default async function FunderPage() {
  let serverAddress = '';
  let serverBalance = '0';
  let error: string | null = null;

  try {
    serverAddress = getServerWalletAddress();
    const balanceBigInt = await getBalance(serverAddress);
    serverBalance = ethers.formatEther(balanceBigInt);
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Server Funder Page</h1>

      {error ? (
        <div className="text-center p-8 text-red-500">Error: {error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Server Wallet Information</h2>
          <p className="mb-2">
            Server Address: <span className="font-mono">{serverAddress}</span>
          </p>
          <p className="mb-4">
            Server Balance: <span className="font-bold">{serverBalance} ETH</span>
          </p>
          <p className="text-gray-600">
            To fund the server, send Sepolia ETH to the address above.
          </p>
        </div>
      )}
    </div>
  );
}
