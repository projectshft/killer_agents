import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'approvals.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
	fs.mkdirSync(DB_DIR, { recursive: true });
}

// Create database connection
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
const initSchema = () => {
	db.exec(`
    CREATE TABLE IF NOT EXISTS pending_actions (
      id TEXT PRIMARY KEY,
      action_type TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',

      -- What to delete (reference to PostgreSQL)
      influencer_id TEXT NOT NULL,
      influencer_name TEXT NOT NULL,
      influencer_data TEXT,

      -- Context
      reason TEXT NOT NULL,
      agent_query TEXT NOT NULL,
      criteria TEXT,

      -- Audit trail
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TEXT,
      executed_at TEXT,

      -- Error handling
      error_message TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_status ON pending_actions(status);
    CREATE INDEX IF NOT EXISTS idx_influencer_id ON pending_actions(influencer_id);
    CREATE INDEX IF NOT EXISTS idx_created_at ON pending_actions(created_at);
  `);
};

// Initialize schema on startup
initSchema();

export { db };
