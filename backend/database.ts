// @ts-nocheck
import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";
import { dirname, join } from "path";

const DB_PATH = join(import.meta.dir, "..", "data", "audit.db");

// Ensure data directory exists
mkdirSync(dirname(DB_PATH), { recursive: true });

function getDb() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function initDb() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS audits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL UNIQUE,
      control_id TEXT NOT NULL,
      maturity_level INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_progress',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS evidence (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      audit_id INTEGER NOT NULL,
      requirement_id TEXT NOT NULL,
      evidence_type TEXT NOT NULL,
      description TEXT,
      file_path TEXT,
      file_name TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS requirement_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      audit_id INTEGER NOT NULL,
      requirement_id TEXT NOT NULL,
      compliant INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(audit_id, requirement_id),
      FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_audits_identifier ON audits(identifier);
    CREATE INDEX IF NOT EXISTS idx_audits_control ON audits(control_id, maturity_level);
    CREATE INDEX IF NOT EXISTS idx_evidence_audit ON evidence(audit_id);
    CREATE INDEX IF NOT EXISTS idx_req_status_audit ON requirement_status(audit_id);
  `);
  db.close();
  console.log("Database initialized at", DB_PATH);
}

export { getDb };
