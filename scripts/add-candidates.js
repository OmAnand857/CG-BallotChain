import { ballotContract, getServerSigner } from '../lib/contract.js';
import dotenv from 'dotenv';

dotenv.config();

const candidatesToAdd = [
  { name: 'Alice', info: 'Candidate for President' },
  { name: 'Bob', info: 'Candidate for Vice President' },
  { name: 'Charlie', info: 'Candidate for Treasurer' },
];

async function addCandidates() {
  try {
    console.log('Adding candidates to the contract...');
    const signer = getServerSigner();
    const contractWithSigner = ballotContract.connect(signer);

    for (const candidate of candidatesToAdd) {
      console.log(`Adding candidate: ${candidate.name}`);
      const tx = await contractWithSigner.addCandidate(candidate.name, candidate.info);
      await tx.wait();
      console.log(`  -> Added ${candidate.name} in tx: ${tx.hash}`);
    }

    console.log('All candidates added successfully.');
  } catch (error) {
    console.error('Error adding candidates:', error);
    console.error('Please ensure DEPLOYER_PRIVATE_KEY is the owner of the contract.');
  }
}

addCandidates();
