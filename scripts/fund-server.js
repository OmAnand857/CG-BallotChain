import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { getServerWalletAddress } from '../lib/serverWallet.js'; // Assuming .js extension for node execution

dotenv.config();

async function fundServer() {
  const senderPrivateKey = process.env.SENDER_PRIVATE_KEY; // Private key of the account sending funds
  const amountEther = process.env.FUND_AMOUNT_ETHER || '0.1'; // Amount to send in Ether

  if (!senderPrivateKey) {
    console.error('SENDER_PRIVATE_KEY is not set in your .env file.');
    console.error('Please provide the private key of an account with Sepolia ETH to fund the server.');
    return;
  }

  try {
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_RPC);
    const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
    const serverAddress = getServerWalletAddress();

    console.log(`Attempting to fund server address: ${serverAddress}`);
    console.log(`From sender address: ${senderWallet.address}`);
    console.log(`Amount: ${amountEther} ETH`);

    const tx = await senderWallet.sendTransaction({
      to: serverAddress,
      value: ethers.parseEther(amountEther),
    });

    console.log(`Transaction sent: ${tx.hash}`);
    console.log('Waiting for transaction to be mined...');

    const receipt = await tx.wait();

    if (receipt && receipt.status === 1) {
      console.log(`Transaction confirmed! Block: ${receipt.blockNumber}`);
      console.log(`Server funded successfully with ${amountEther} ETH.`);
    } else {
      console.error('Transaction failed or was not confirmed.');
    }
  } catch (error) {
    console.error('Error funding server:', error);
  }
}

fundServer();
