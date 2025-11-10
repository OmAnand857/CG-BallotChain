import { ethers } from 'ethers';
import deployedBallot from '../public/deployedBallot.json';
import dotenv from 'dotenv';

dotenv.config();

const ALCHEMY_SEPOLIA_RPC = process.env.ALCHEMY_SEPOLIA_RPC!;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || deployedBallot.address;
const CONTRACT_ABI = deployedBallot.abi;

// Setup provider
export const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_RPC);

// Read-only contract instance
export const ballotContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  provider
);

// Function to get a signer wallet for transactions
export function getServerSigner(): ethers.Wallet {
  if (!DEPLOYER_PRIVATE_KEY) {
    throw new Error('DEPLOYER_PRIVATE_KEY is not set in environment variables.');
  }
  return new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
}

// Export contract address and ABI for convenience
export { CONTRACT_ADDRESS, CONTRACT_ABI };
