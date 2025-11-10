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
    <div className="p-6 border rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Candidate</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="info" className="block text-sm font-medium text-gray-700">Info</label>
          <input
            type="text"
            id="info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Candidate'}
        </button>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
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
    <div className="p-6 border rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Overseers</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Overseer Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as 'add' | 'remove')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="add">Add Overseer</option>
            <option value="remove">Remove Overseer</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </form>
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
    <div className="p-6 border rounded-lg bg-white shadow-md border-red-200">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Transfer Ownership</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="newOwner" className="block text-sm font-medium text-gray-700">New Owner Address</label>
          <input
            type="text"
            id="newOwner"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Transfer Ownership'}
        </button>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
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
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
          {account ? (
            <div>
              <p className="mb-4">Welcome, {account}. Please sign in to continue.</p>
              <button
                onClick={connectAndLogin}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Login as Admin
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-4">Please connect your wallet to continue.</p>
              <button
                onClick={connectAndLogin}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Connect & Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setToken(null)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AddCandidateForm token={token} />
          <ManageOverseersForm token={token} />
          <TransferOwnershipForm token={token} />
        </div>
      </div>
    </div>
  );
}