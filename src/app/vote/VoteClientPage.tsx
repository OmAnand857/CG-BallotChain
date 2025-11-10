"use client";

import { useEffect, useState } from 'react';
import { WalletClient } from '../../../lib/walletClient';
import { CopyButton } from '../components/CopyButton';

interface Candidate {
  id: number;
  name: string;
  info: string;
  voteCount: string;
}

interface VoteClientPageProps {
  serverAddress: string;
  voteFeeEther: string;
}

// Helper: Shorten address for display
function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper: Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Helper: Calculate progress percentage
function calculateProgress(voteCount: string, allCandidates: Candidate[]): number {
  const totalVotes = allCandidates.reduce((sum, c) => sum + parseInt(c.voteCount || '0'), 0);
  if (totalVotes === 0) return 0;
  return (parseInt(voteCount || '0') / totalVotes) * 100;
}

export default function VoteClientPage({ serverAddress, voteFeeEther }: VoteClientPageProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [account, setAccount] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [checkingVoteStatus, setCheckingVoteStatus] = useState(false);

  useEffect(() => {
    // This effect runs once to get the candidates and set the time
    async function fetchCandidates() {
      try {
        const candidatesResponse = await fetch('/api/candidates');
        if (!candidatesResponse.ok) {
          throw new Error('Failed to fetch candidates');
        }
        const candidatesData: Candidate[] = await candidatesResponse.json();
        setCandidates(candidatesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
    setCurrentTime(new Date().toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }));
  }, []);

  useEffect(() => {
    // This effect runs when the account changes to check their vote status
    const checkVoteStatus = async () => {
      if (!account) {
        setHasVoted(false);
        return;
      }
      setCheckingVoteStatus(true);
      try {
        const response = await fetch(`/api/check-vote-status?address=${account}`);
        const data = await response.json();
        if (response.ok) {
          setHasVoted(data.hasVoted);
        }
      } catch (err) {
        console.error('Failed to check vote status:', err);
      } finally {
        setCheckingVoteStatus(false);
      }
    };
    checkVoteStatus();
  }, [account]);

  const handleVoteSuccess = (txHash: string) => {
    alert(`Vote successful! Transaction: ${txHash}`);
    setHasVoted(true); // Update state to reflect the new vote
  };

  const handleVoteError = (errorMessage: string) => {
    alert(`Vote failed: ${errorMessage}`);
  };
  
  // This function will be passed to WalletClient to update the account state here
  const handleAccountChange = (newAccount: string | null) => {
    setAccount(newAccount);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Votes</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Network Status Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-300 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-blue-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Sepolia Testnet</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated: {currentTime}</span>
          </div>
        </div>

        {/* Header with Title, Candidate Count, and Server Info */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-white">Cast Your Vote</h1>
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-semibold">
              {candidates.length} {candidates.length === 1 ? 'candidate' : 'candidates'}
            </span>
          </div>
          
          {/* Server Info Pill */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-blue-500/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Server</span>
              <code className="text-sm font-mono text-blue-400">{shortenAddress(serverAddress)}</code>
              <CopyButton text={serverAddress} />
              <a
                href={`https://sepolia.etherscan.io/address/${serverAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="View on Etherscan"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div className="w-px h-6 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Fee</span>
              <span className="text-sm font-bold text-cyan-400">{voteFeeEther} ETH</span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {candidates.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center border border-blue-500/20">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Candidates Yet</h2>
              <p className="text-gray-400 mb-1">The voting hasn't started. Check back soon!</p>
              <p className="text-sm font-mono text-gray-500 mb-6">Count: 0</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label="Refresh page"
                >
                  Refresh
                </button>
                <div className="px-6 py-3 bg-slate-700/50 text-gray-300 font-medium rounded-lg border border-slate-600">
                  Owner: Initialize Candidates
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Candidate Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => {
              const progress = calculateProgress(candidate.voteCount, candidates);
              return (
                <div
                  key={candidate.id}
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 p-6 border border-blue-500/20 hover:border-blue-500/40 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                    <span className="text-white font-bold text-xl">{getInitials(candidate.name)}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{candidate.name}</h2>
                  <p className="text-gray-400 mb-4 line-clamp-2 min-h-[3rem]">
                    {candidate.info}
                  </p>
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{candidate.voteCount}</span>
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">votes</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden border border-slate-600/50">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-500/50"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${progress.toFixed(1)}% of total votes`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% of total</p>
                  </div>
                  {serverAddress && voteFeeEther ? (
                  <div className="mt-4">
                    <WalletClient
                      serverAddress={serverAddress}
                      voteFeeEther={voteFeeEther}
                      candidateId={candidate.id}
                      onVoteSuccess={handleVoteSuccess}
                      onVoteError={handleVoteError}
                      onAccountChange={handleAccountChange} // Pass the handler
                      hasVoted={hasVoted} // Pass the vote status
                      isCheckingVoteStatus={checkingVoteStatus} // Pass loading status
                      account={account} // Pass the account state
                    />
                  </div>
                  ) : (
                    <div className="mt-4 px-4 py-2 bg-slate-700/50 rounded-lg text-gray-400 text-sm text-center border border-slate-600/50">
                      Loading server info...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}