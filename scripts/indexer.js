import { ballotContract, provider } from '../lib/contract.js';
import db from '../lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting Voted event indexer...');

ballotContract.on('Voted', async (voter, candidateId, event) => {
  console.log(`Caught Voted event: Voter=${voter}, CandidateId=${candidateId}, TxHash=${event.log.transactionHash}`);

  try {
    // Check if the vote is already recorded to prevent duplicates
    const existingVote = db
      .prepare('SELECT txHash FROM relayed_votes WHERE txHash = ?')
      .get(event.log.transactionHash);

    if (existingVote) {
      console.log(`Vote for txHash ${event.log.transactionHash} already recorded. Skipping.`);
      return;
    }

    const insertVoteStmt = db.prepare(
      'INSERT INTO relayed_votes (txHash, voter, candidateId, timestamp) VALUES (?, ?, ?, ?)'
    );
    insertVoteStmt.run(event.log.transactionHash, voter, candidateId.toString(), Math.floor(Date.now() / 1000));
    console.log(`Recorded Voted event for txHash: ${event.log.transactionHash}`);
  } catch (error) {
    console.error(`Error processing Voted event for txHash ${event.log.transactionHash}:`, error);
  }
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Indexer stopping...');
  provider.removeAllListeners('Voted');
  db.close();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Indexer stopping...');
  provider.removeAllListeners('Voted');
  db.close();
  process.exit();
});
