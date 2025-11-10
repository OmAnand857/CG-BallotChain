"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ethers } from 'ethers';

interface WalletClientProps {
  serverAddress: string;
  voteFeeEther: string;
  candidateId: number;
  onVoteSuccess: (txHash: string) => void;
  onVoteError: (error: string) => void;
  onAccountChange: (account: string | null) => void;
  hasVoted: boolean;
  isCheckingVoteStatus: boolean;
  account: string | null; // Account is now passed as a prop
}

export interface WalletClientHandle {
  startPayment: (candidateId: number) => void;
}

export const WalletClient = forwardRef<WalletClientHandle, WalletClientProps>(({
  serverAddress,
  voteFeeEther,
  candidateId,
  onVoteSuccess,
  onVoteError,
  onAccountChange,
  hasVoted,
  isCheckingVoteStatus,
  account, // Receive account as a prop
}, ref) => {
  const [ethereum, setEthereum] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSepolia, setIsSepolia] = useState(true);

  const SEPOLIA_CHAIN_ID = '0xaa36a7';

  useImperativeHandle(ref, () => ({
    startPayment(candidateId: number) {
      sendPayment(candidateId);
    }
  }));

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      return;
    }

    const eth = (window as any).ethereum;
    setEthereum(eth);

    const handleChainChanged = (chainId: string) => {
      setIsSepolia(chainId === SEPOLIA_CHAIN_ID);
    };

    const handleAccountsChanged = (accounts: string[]) => {
      onAccountChange(accounts[0] || null);
    };

    const checkNetworkAndAccounts = async () => {
      try {
        const provider = new ethers.BrowserProvider(eth);
        const network = await provider.getNetwork();
        setIsSepolia(network.chainId === BigInt(SEPOLIA_CHAIN_ID));

        const accounts = await eth.request({ method: 'eth_accounts' });
        onAccountChange(accounts[0] || null);
      } catch (error) {
        console.error("Error checking network or accounts:", error);
      }
    };

    checkNetworkAndAccounts();

    eth.on('chainChanged', handleChainChanged);
    eth.on('accountsChanged', handleAccountsChanged);

    return () => {
      eth.removeListener('chainChanged', handleChainChanged);
      eth.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [onAccountChange]);

  const switchNetwork = async () => {
    if (!ethereum) return;
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID, chainName: 'Sepolia Testnet', rpcUrls: ['https://sepolia.infura.io/v3/'], nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 }, blockExplorerUrls: ['https://sepolia.etherscan.io'] }],
          });
        } catch (addError) {
          onVoteError('Failed to add Sepolia network to MetaMask.');
        }
      } else {
        onVoteError('Failed to switch to Sepolia network.');
      }
    }
  };

  const connectWallet = async () => {
    if (!ethereum) {
      onVoteError('MetaMask is not installed!');
      return;
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      onAccountChange(accounts[0]);
    } catch (error: any) {
      onVoteError(`Error connecting: ${error.message}`);
    }
  };

  const sendPayment = async (candidateId: number) => {
    if (!isSepolia) {
      onVoteError('Please switch to the Sepolia testnet to vote.');
      return;
    }
    if (!ethereum || !account) {
      onVoteError('Please connect your MetaMask wallet first.');
      return;
    }

    setLoading(true);
    setStatusMessage('Sending payment...');

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: serverAddress,
        value: ethers.parseEther(voteFeeEther),
      });

      setStatusMessage('Confirming payment...');
      const receipt = await tx.wait();

      if (receipt && receipt.status === 1) {
        setStatusMessage('Verifying...');
        await verifyPaymentAndRelayVote(receipt.hash, candidateId);
      } else {
        throw new Error('Payment failed or was not confirmed.');
      }
    } catch (error: any) {
      setStatusMessage('');
      onVoteError(error.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPaymentAndRelayVote = async (txHash: string, candidateId: number) => {
    try {
      const requestBody = { txHash, candidateId, fromAddress: account };
      console.log('[Client Log] Sending to /api/verify-payment:', requestBody);

      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(verifyData.error || 'Payment verification failed');

      setStatusMessage('Relaying vote...');
      const { token } = verifyData;

      const relayResponse = await fetch('/api/relay-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, candidateId }),
      });

      const relayData = await relayResponse.json();
      if (!relayResponse.ok) throw new Error(relayData.error || 'Vote relay failed');
      
      setStatusMessage('Success!');
      onVoteSuccess(relayData.relayTxHash);
    } catch (error: any) {
      setStatusMessage('');
      onVoteError(error.message || 'An unknown error occurred during verification/relay.');
    }
  };

  if (hasVoted) {
    return (
      <div className="w-full px-6 py-3 bg-gray-200 text-gray-500 font-semibold rounded-lg text-center">
        You have already voted
      </div>
    );
  }
  
  if (isCheckingVoteStatus) {
    return (
      <div className="w-full px-6 py-3 bg-gray-100 text-gray-500 font-semibold rounded-lg text-center animate-pulse">
        Checking vote status...
      </div>
    );
  }

  if (!isSepolia) {
    return (
      <button
        onClick={switchNetwork}
        className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md"
      >
        Switch to Sepolia Network
      </button>
    );
  }

  if (!account) {
    return (
      <button
        onClick={connectWallet}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Connect Wallet to Vote
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => sendPayment(candidateId)}
        disabled={loading}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? statusMessage : `Vote for ${voteFeeEther} ETH`}
      </button>
      {statusMessage && loading && (
        <p className="text-xs text-slate-500 mt-2 animate-pulse">{statusMessage}</p>
      )}
    </div>
  );
});
