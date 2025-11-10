import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { provider } from './contract'; // Removed getServerSigner from here as it uses DEPLOYER_PRIVATE_KEY

dotenv.config();

const SERVER_PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY!; // Use SERVER_PRIVATE_KEY
const SERVER_RECEIVE_ADDRESS = process.env.SERVER_RECEIVE_ADDRESS!;
const FEE_ETHER = process.env.FEE_ETHER!; // Use FEE_ETHER
const CONFIRMATIONS_REQUIRED = parseInt(process.env.CONFIRMATIONS_REQUIRED || '3', 10);

// Function to get a signer wallet for transactions using SERVER_PRIVATE_KEY
export function getRelayerSigner(): ethers.Wallet {
  if (!SERVER_PRIVATE_KEY) {
    throw new Error('SERVER_PRIVATE_KEY is not set in environment variables.');
  }
  return new ethers.Wallet(SERVER_PRIVATE_KEY, provider);
}

export function getServerWalletAddress(): string {
  if (SERVER_RECEIVE_ADDRESS) {
    return SERVER_RECEIVE_ADDRESS;
  }
  // Fallback to deriving from SERVER_PRIVATE_KEY if SERVER_RECEIVE_ADDRESS is not set
  const signer = getRelayerSigner();
  return signer.address;
}

export async function getBalance(address: string): Promise<bigint> {
  return provider.getBalance(address);
}

export async function verifyPaymentTransaction(
  txHash: string,
  fromAddress: string
): Promise<{ success: boolean; amount?: bigint; from?: string; to?: string }> {
  try {
    const txReceipt = await provider.getTransactionReceipt(txHash);

    if (!txReceipt) {
      console.log(`Transaction receipt not found for ${txHash}`);
      return { success: false };
    }

    if (txReceipt.status !== 1) {
      console.log(`Transaction ${txHash} failed on-chain.`);
      return { success: false };
    }

    const confirmations = await txReceipt.getConfirmations();
    if (confirmations < CONFIRMATIONS_REQUIRED) {
      console.log(
        `Transaction ${txHash} has only ${confirmations} confirmations, ${CONFIRMATIONS_REQUIRED} required.`
      );
      return { success: false };
    }

    const tx = await provider.getTransaction(txHash);

    if (!tx) {
      console.log(`Transaction details not found for ${txHash}`);
      return { success: false };
    }

    // Check 'to' address
    if (tx.to?.toLowerCase() !== getServerWalletAddress().toLowerCase()) {
      console.log(
        `Transaction ${txHash} 'to' address mismatch. Expected: ${getServerWalletAddress()}, Got: ${tx.to}`
      );
      return { success: false };
    }

    // Check amount
    const requiredAmount = ethers.parseEther(FEE_ETHER); // Use FEE_ETHER and parse as Ether
    if (tx.value < requiredAmount) {
      console.log(
        `Transaction ${txHash} amount too low. Expected at least: ${requiredAmount}, Got: ${tx.value}`
      );
      return { success: false };
    }

    // Check if from address matches the one provided by the frontend
    if (tx.from.toLowerCase() !== fromAddress.toLowerCase()) {
      console.log(
        `Transaction ${txHash} 'from' address mismatch. Expected: ${fromAddress}, Got: ${tx.from}`
      );
      return { success: false };
    }

    // Basic check for EOA (Externally Owned Account) - contract creation txs have 'to' as null
    // and contract calls have 'data'. Simple ETH transfers from EOAs usually have no data.
    // This is a basic check, more robust checks might involve checking code at 'from' address.
    if (tx.data !== '0x') {
      console.log(`Transaction ${txHash} is not a simple ETH transfer (contains data).`);
      // Depending on requirements, you might want to allow contract interactions that send ETH
      // For now, we'll assume only direct EOA transfers are allowed.
      return { success: false };
    }

    console.log(`Transaction ${txHash} successfully verified.`);
    return { success: true, amount: tx.value, from: tx.from, to: tx.to };
  } catch (error) {
    console.error(`Error verifying transaction ${txHash}:`, error);
    return { success: false };
  }
}
