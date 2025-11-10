import { ballotContract } from '../lib/contract.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkCandidates() {
  try {
    console.log('Checking candidates from contract...');
    const [names, infos, votes] = await ballotContract.getAllCandidates();

    if (names.length === 0) {
      console.log('No candidates found on the contract.');
    } else {
      console.log('Candidates found:');
      names.forEach((name, index) => {
        console.log(`  ID: ${index}, Name: ${name}, Info: ${infos[index]}, Votes: ${votes[index].toString()}`);
      });
    }
  } catch (error) {
    console.error('Error checking candidates:', error);
    console.error('Please ensure ALCHEMY_SEPOLIA_RPC and CONTRACT_ADDRESS are correctly set in your .env file.');
    console.error('Also, verify that the contract at CONTRACT_ADDRESS has candidates initialized.');
  }
}

checkCandidates();
