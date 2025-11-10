import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function setupDatabase() {
  console.log('Running database migrations...');

  // Payments table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS payments (
      txHash TEXT PRIMARY KEY,
      "from" TEXT NOT NULL,
      "to" TEXT NOT NULL,
      amount TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      confirmed BOOLEAN NOT NULL DEFAULT 0
    )
  `).run();

  // Auth Tokens table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS auth_tokens (
      token TEXT PRIMARY KEY,
      "from" TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used BOOLEAN NOT NULL DEFAULT 0
    )
  `).run();

  // Relayed Votes table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS relayed_votes (
      txHash TEXT PRIMARY KEY,
      voter TEXT NOT NULL,
      candidateId INTEGER NOT NULL,
      timestamp INTEGER NOT NULL
    )
  `).run();

  console.log('Database migrations complete.');
}

export default db;

// This block will run if the script is executed directly
import { pathToFileURL } from 'url';

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log('Running setupDatabase directly...');
  setupDatabase();
  db.close();
  console.log('Database setup complete and connection closed.');
}
