
---

# Blockchain Based Voting System

*A Next.js decentralized voting solution powered by Web3*

## Overview

Traditional offline elections often involve huge expenses, logistical complexity, and the constant risk of vote tampering or corruption. Managing polling booths, transporting EVMs, printing ballots, and deploying staff nationwide makes the process slow and costly. On top of that, centralized storage of voting data creates opportunities for manipulation.

A blockchain-based voting system solves these problems by making the process **transparent**, **tamper-proof**, and **verifiable**, while also reducing operational cost.

This project is a **Next.js Web App** that interacts with an **Ethereum smart contract** to enable secure digital voting. Each vote is stored on the blockchain, ensuring immutability and end-to-end trust.

---

## Features

### ✅ Decentralized Voting

Each vote is recorded on-chain. Nobody can modify, forge, or delete votes.

### ✅ Voter Authentication

Wallet-based login (MetaMask etc). Prevents duplicate votes and ensures only eligible users can vote.

### ✅ Transparent & Verifiable

Users can verify election results directly from the blockchain.

### ✅ Admin Panel

Admin can create elections, add candidates, and end the voting session.

### ✅ Real-time Updates

Results and candidate vote counts update instantly as transactions confirm.

---

## Tech Stack

* **Next.js 14** – frontend framework
* **Solidity** – smart contract
* **Ethers.js** – connect frontend to blockchain
* **MetaMask** – wallet authentication
* **Sepolia Testnet** – blockchain network

---

## Architecture

```
User Wallet (MetaMask)
        |
        | Ethers.js
        v
Next.js Frontend  --->  Smart Contract (Solidity)
        |
        | Fetches data from Blockchain
        v
     UI/UX for Voters & Admin
```

---

## Smart Contract Responsibilities

* Create election
* Add candidates
* Track votes
* Prevent double voting
* Close election
* Expose results publicly

---

## Folder Structure

```
project/
├── contracts/
│   └── Voting.sol
├── scripts/
│   └── deploy.js
├── app/
│   ├── vote/
│   ├── admin/
│   └── results/
├── components/
├── pages/
└── utils/
```

---

## How It Works

### 1. Admin creates an election

Admin deploys the contract and initializes candidates.

### 2. User connects wallet

The voter authenticates using MetaMask or any Web3 wallet.

### 3. User casts a vote

The transaction is sent to the smart contract.

### 4. Contract validates

* Checks if the voter already voted
* Increments candidate vote count
* Writes the action permanently to the blockchain

### 5. Everyone can verify results

Since data is on-chain, results are publicly visible and trustless.

---

## Why Blockchain Voting?

### ✅ Zero vote corruption

Blockchain’s immutability ensures no vote can be altered.

### ✅ Publicly auditable

Anyone can verify election results independently.

### ✅ Lower cost

No polling booths, travel, or paper ballots required.

### ✅ Faster & global

People can vote from anywhere using a wallet.

---

