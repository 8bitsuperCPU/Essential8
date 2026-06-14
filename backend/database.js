import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";
import { dirname, join } from "path";

const DB_PATH = join(import.meta.dir, "..", "data", "audit.db");
mkdirSync(dirname(DB_PATH), { recursive: true });

function getDb() {
  return new Database(DB_PATH, { create: true });
}

export function initDb() {
  const db = getDb();
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS audits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL UNIQUE,
      control_id TEXT NOT NULL,
      maturity_level INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_progress',
      locked INTEGER NOT NULL DEFAULT 0,
      password_hash TEXT,
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
      file_size INTEGER,
      mime_type TEXT,
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
    CREATE INDEX IF NOT EXISTS idx_evidence_audit ON evidence(audit_id);
    CREATE INDEX IF NOT EXISTS idx_req_status_audit ON requirement_status(audit_id);
  `);
  db.close();
}

export function createAudit(identifier, controlId, maturityLevel) {
  const db = getDb();
  try {
    db.prepare("INSERT INTO audits (identifier, control_id, maturity_level) VALUES (?, ?, ?)").run(identifier, controlId, maturityLevel);
    const audit = db.prepare("SELECT * FROM audits WHERE id = last_insert_rowid()").get();
    db.close();
    return audit;
  } catch (e) {
    db.close();
    if (e.message.includes("UNIQUE")) return { error: "Identifier already exists" };
    throw e;
  }
}

export function getAuditByIdentifier(identifier) {
  const db = getDb();
  const audit = db.prepare("SELECT * FROM audits WHERE identifier = ?").get(identifier);
  db.close();
  return audit;
}

export function getAuditById(id) {
  const db = getDb();
  const audit = db.prepare("SELECT * FROM audits WHERE id = ?").get(id);
  db.close();
  return audit;
}

export function getAllAudits() {
  const db = getDb();
  const audits = db.prepare("SELECT * FROM audits ORDER BY updated_at DESC").all();
  db.close();
  return audits;
}

export function getAuditsSummary() {
  const db = getDb();
  const rows = db.prepare(`
    SELECT a.*, 
      (SELECT COUNT(*) FROM requirement_status rs WHERE rs.audit_id = a.id AND rs.compliant = 1) as compliant_count,
      (SELECT COUNT(*) FROM requirement_status rs WHERE rs.audit_id = a.id) as total_requirements,
      (SELECT COUNT(*) FROM evidence e WHERE e.audit_id = a.id) as evidence_count
    FROM audits a ORDER BY updated_at DESC
  `).all();
  db.close();
  return rows;
}

export function updateAuditStatus(id, status) {
  const db = getDb();
  db.prepare("UPDATE audits SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, id);
  const audit = db.prepare("SELECT * FROM audits WHERE id = ?").get(id);
  db.close();
  return audit;
}

export function setRequirementStatus(auditId, requirementId, compliant, notes) {
  const db = getDb();
  db.prepare(`
    INSERT INTO requirement_status (audit_id, requirement_id, compliant, notes)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(audit_id, requirement_id) DO UPDATE SET compliant = excluded.compliant, notes = excluded.notes, updated_at = datetime('now')
  `).run(auditId, requirementId, compliant ? 1 : 0, notes || null);
  const status = db.prepare("SELECT * FROM requirement_status WHERE audit_id = ? AND requirement_id = ?").get(auditId, requirementId);
  db.close();
  return status;
}

export function getRequirementStatuses(auditId) {
  const db = getDb();
  const statuses = db.prepare("SELECT * FROM requirement_status WHERE audit_id = ?").all(auditId);
  db.close();
  return statuses;
}

export function addEvidence(auditId, requirementId, evidenceType, description, filePath, fileName, fileSize, mimeType) {
  const db = getDb();
  db.prepare(`
    INSERT INTO evidence (audit_id, requirement_id, evidence_type, description, file_path, file_name, file_size, mime_type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'collected')
  `).run(auditId, requirementId, evidenceType, description || null, filePath || null, fileName || null, fileSize || null, mimeType || null);
  const evidence = db.prepare("SELECT * FROM evidence WHERE id = last_insert_rowid()").get();
  db.close();
  return evidence;
}

export function getEvidenceForAudit(auditId) {
  const db = getDb();
  const evidence = db.prepare("SELECT * FROM evidence WHERE audit_id = ? ORDER BY created_at DESC").all(auditId);
  db.close();
  return evidence;
}

export function getEvidenceForRequirement(auditId, requirementId) {
  const db = getDb();
  const evidence = db.prepare("SELECT * FROM evidence WHERE audit_id = ? AND requirement_id = ?").all(auditId, requirementId);
  db.close();
  return evidence;
}

export function deleteEvidence(id) {
  const db = getDb();
  const ev = db.prepare("SELECT * FROM evidence WHERE id = ?").get(id);
  if (ev && ev.file_path) { try { Bun.file(ev.file_path).delete(); } catch {} }
  db.prepare("DELETE FROM evidence WHERE id = ?").run(id);
  db.close();
  return { deleted: true };
}

export function deleteAudit(id) {
  const db = getDb();
  // Delete associated files first
  const evidence = db.prepare("SELECT * FROM evidence WHERE audit_id = ? AND file_path IS NOT NULL").all(id);
  for (const ev of evidence) {
    try { Bun.file(ev.file_path).delete(); } catch {}
  }
  db.prepare("DELETE FROM requirement_status WHERE audit_id = ?").run(id);
  db.prepare("DELETE FROM evidence WHERE audit_id = ?").run(id);
  db.prepare("DELETE FROM audits WHERE id = ?").run(id);
  db.close();
  return { deleted: true };
}

export function deleteAllAudits() {
  const db = getDb();
  // Delete all associated files
  const evidence = db.prepare("SELECT * FROM evidence WHERE file_path IS NOT NULL").all();
  for (const ev of evidence) {
    try { Bun.file(ev.file_path).delete(); } catch {}
  }
  db.prepare("DELETE FROM requirement_status").run();
  db.prepare("DELETE FROM evidence").run();
  db.prepare("DELETE FROM audits").run();
  db.close();
  return { deleted: true };
}

export function getAuditReport(auditId) {
  const db = getDb();
  const audit = db.prepare("SELECT * FROM audits WHERE id = ?").get(auditId);
  if (!audit) { db.close(); return null; }
  const statuses = db.prepare("SELECT rs.*, (SELECT COUNT(*) FROM evidence e WHERE e.audit_id = rs.audit_id AND e.requirement_id = rs.requirement_id AND e.status = 'collected') as evidence_count FROM requirement_status rs WHERE rs.audit_id = ?").all(auditId);
  const evidence = db.prepare("SELECT * FROM evidence WHERE audit_id = ? AND status = 'collected' ORDER BY requirement_id, evidence_type").all(auditId);
  const totalReqs = statuses.length;
  const compliantReqs = statuses.filter(s => s.compliant === 1).length;
  db.close();
  return {
    audit, statuses, evidence,
    summary: {
      totalRequirements: totalReqs,
      compliant: compliantReqs,
      nonCompliant: totalReqs - compliantReqs,
      compliancePercent: totalReqs > 0 ? Math.round((compliantReqs / totalReqs) * 100) : 0,
      evidenceItems: evidence.length
    }
  };
}

export function getOverallComplianceReport() {
  const db = getDb();
  // Get all completed audits with their compliance data
  const audits = db.prepare(`
    SELECT a.id, a.identifier, a.control_id, a.maturity_level, a.status,
      (SELECT COUNT(*) FROM requirement_status rs WHERE rs.audit_id = a.id AND rs.compliant = 1) as compliant_count,
      (SELECT COUNT(*) FROM requirement_status rs WHERE rs.audit_id = a.id) as total_requirements
    FROM audits a
    WHERE a.status = 'completed'
    ORDER BY a.control_id, a.maturity_level DESC
  `).all();

  for (const audit of audits) {
    const nonCompliant = db.prepare(
      "SELECT requirement_id, notes FROM requirement_status WHERE audit_id = ? AND compliant = 0"
    ).all(audit.id);
    audit.nonCompliantReqs = nonCompliant;
  }

  db.close();
  return audits;
}

export function lockAudit(id, passwordHash) {
  const db = getDb();
  db.prepare("UPDATE audits SET locked = 1, password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(passwordHash, id);
  const audit = db.prepare("SELECT * FROM audits WHERE id = ?").get(id);
  db.close();
  return audit;
}

export function unlockAudit(id, passwordHash) {
  const db = getDb();
  const audit = db.prepare("SELECT password_hash FROM audits WHERE id = ?").get(id);
  if (!audit || audit.password_hash !== passwordHash) { db.close(); return { error: "Invalid password" }; }
  db.prepare("UPDATE audits SET locked = 0, password_hash = NULL, updated_at = datetime('now') WHERE id = ?").run(id);
  const updated = db.prepare("SELECT * FROM audits WHERE id = ?").get(id);
  db.close();
  return updated;
}

export function getLastAudit() {
  const db = getDb();
  const audit = db.prepare("SELECT * FROM audits ORDER BY updated_at DESC LIMIT 1").get();
  db.close();
  return audit;
}
