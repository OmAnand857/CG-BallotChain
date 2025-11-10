"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// --- Admin Action Components ---
const AddCandidateForm = ({ token }: { token: string }) => {
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/add-candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, info }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add candidate');

      setMessage(`Successfully added candidate: ${name}`);
      setName('');
      setInfo('');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm shadow-xl border border-blue-500/20">
      <h2 className="text-2xl font-bold mb-4 text-white">Add Candidate</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Enter candidate name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="info" className="block text-sm font-medium text-gray-300 mb-2">Info</label>
          <input
            type="text"
            id="info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Enter candidate information"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all duration-200"
        >
          {loading ? 'Adding...' : 'Add Candidate'}
        </button>
        {message && (
          <p className={`mt-4 text-sm p-3 rounded-lg ${message.startsWith('Error') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

const ManageOverseersForm = ({ token }: { token: string }) => {
  const [address, setAddress] = useState('');
  const [action, setAction] = useState<'add' | 'remove'>('add');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/manage-overseer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ address, action }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to manage overseer');

      setMessage(`Successfully ${action === 'add' ? 'added' : 'removed'} overseer: ${address}`);
      setAddress('');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm shadow-xl border border-blue-500/20">
      <h2 className="text-2xl font-bold mb-4 text-white">Manage Overseers</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">Overseer Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono text-sm"
            placeholder="0x..."
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as 'add' | 'remove')}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="add">Add Overseer</option>
            <option value="remove">Remove Overseer</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all duration-200"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
        {message && (
          <p className={`mt-4 text-sm p-3 rounded-lg ${message.startsWith('Error') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

const ElectionControls = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [action, setAction] = useState<'end' | 'reset' | null>(null);

  const handleEndElection = async () => {
    if (!window.confirm('Are you sure you want to end the current election? This will determine a winner.')) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    setAction('end');

    try {
      const response = await fetch('/api/admin/end-election', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to end election');
      setMessage(`Success! Election ended. Tx: ${data.txHash}`);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetElection = async () => {
    if (!window.confirm('DANGER: Are you sure you want to reset the election? This will reset the contract and DELETE ALL voting data from the database. This action is irreversible.')) {
      return;
    }

    setLoading(true);
    setMessage('');
    setAction('reset');

    try {
      const response = await fetch('/api/admin/reset-election', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reset election');
      setMessage(`Success! Election and database reset. Tx: ${data.txHash}`);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm shadow-xl border border-blue-500/20 lg:col-span-2">
      <h2 className="text-2xl font-bold mb-4 text-white">Election Controls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* End Election */}
        <div className="p-4 border border-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">End Election</h3>
          <p className="text-sm text-gray-400 mb-4">This will stop the voting and declare a winner based on the current vote counts.</p>
          <button
            onClick={handleEndElection}
            disabled={loading && action === 'end'}
            className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg disabled:opacity-50 shadow-lg shadow-yellow-500/30"
          >
            {loading && action === 'end' ? 'Processing...' : 'End Election'}
          </button>
        </div>

        {/* Reset Election */}
        <div className="p-4 border border-red-500/30 rounded-lg">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Reset Election</h3>
          <p className="text-sm text-gray-400 mb-4">This will reset the contract state and permanently delete all votes from the database.</p>
          <button
            onClick={handleResetElection}
            disabled={loading && action === 'reset'}
            className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg disabled:opacity-50 shadow-lg shadow-red-500/30"
          >
            {loading && action === 'reset' ? 'Processing...' : 'Reset Election & Database'}
          </button>
        </div>
      </div>
      {message && (
        <p className={`mt-4 text-sm p-3 rounded-lg ${message.startsWith('Error') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
          {message}
        </p>
      )}
    </div>
  );
};


const TransferOwnershipForm = ({ token }: { token: string }) => {
  const [newOwner, setNewOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(`Are you sure you want to transfer ownership to ${newOwner}? This action is irreversible.`)) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/transfer-ownership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newOwner }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to transfer ownership');

      setMessage(`Successfully initiated ownership transfer to: ${newOwner}`);
      setNewOwner('');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm shadow-xl border border-red-500/30">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold text-red-400">Transfer Ownership</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="newOwner" className="block text-sm font-medium text-gray-300 mb-2">New Owner Address</label>
          <input
            type="text"
            id="newOwner"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition font-mono text-sm"
            placeholder="0x..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30 transition-all duration-200"
        >
          {loading ? 'Processing...' : 'Transfer Ownership'}
        </button>
        {message && (
          <p className={`mt-4 text-sm p-3 rounded-lg ${message.startsWith('Error') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};
// ---------------------------------------------------------


export default function AdminPage() {
  const [ethereum, setEthereum] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setEthereum((window as any).ethereum);
    }
  }, []);

  useEffect(() => {
    if (ethereum) {
      checkConnection();
      ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [ethereum]);

  const handleAccountsChanged = (accounts: string[]) => {
    setAccount(accounts[0] || null);
    setToken(null); // Reset token on account change
  };

  const checkConnection = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    handleAccountsChanged(accounts);
    setLoading(false);
  };

  const connectAndLogin = async () => {
    if (!ethereum) {
      alert('MetaMask is not installed!');
      return;
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
      if (!userAddress) return;

      setAccount(userAddress);

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const message = 'I am logging in as admin';
      const signature = await signer.signMessage(message);

      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: userAddress, signature }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication failed');

      setToken(data.token);
    } catch (error: any) {
      alert(`Login failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-500/20 max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">Admin Panel</h1>
          {account ? (
            <div>
              <p className="mb-2 text-gray-300">Welcome!</p>
              <p className="mb-6 text-sm text-gray-400 font-mono bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600">
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
              <p className="mb-6 text-gray-400">Please sign in to continue.</p>
              <button
                onClick={connectAndLogin}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200"
              >
                Login as Admin
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-6 text-gray-300">Please connect your wallet to continue.</p>
              <button
                onClick={connectAndLogin}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Connect & Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 shadow-xl">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">Manage your voting platform</p>
          </div>
          <button
            onClick={() => setToken(null)}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg shadow-red-500/30 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AddCandidateForm token={token} />
          <ManageOverseersForm token={token} />
          <TransferOwnershipForm token={token} />
          <ElectionControls token={token} />
        </div>
      </div>
    </div>
  );
}
