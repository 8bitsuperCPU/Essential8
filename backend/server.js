import { initDb, createAudit, getAuditByIdentifier, getAuditById, getAllAudits, getAuditsSummary, updateAuditStatus, setRequirementStatus, getRequirementStatuses, addEvidence, getEvidenceForAudit, getEvidenceForRequirement, deleteEvidence, getAuditReport, deleteAudit, deleteAllAudits, getOverallComplianceReport } from "./database.js";
import { join } from "path";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";

initDb();

const UPLOAD_DIR = join(import.meta.dir, "..", "data", "uploads");
mkdirSync(UPLOAD_DIR, { recursive: true });

const DIST_DIR = join(import.meta.dir, "..", "dist");

const PORT = 4545;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    if (method === "OPTIONS") {
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
    }

    try {
      // --- Audits ---
      if (path === "/api/audits" && method === "GET") {
        const id = url.searchParams.get("identifier");
        if (id) {
          const audit = getAuditByIdentifier(id);
          if (!audit) return errorResponse("Audit not found", 404);
          return jsonResponse(audit);
        }
        return jsonResponse(getAllAudits());
      }

      if (path === "/api/audits/summary" && method === "GET") return jsonResponse(getAuditsSummary());

      if (path === "/api/audits" && method === "POST") {
        const body = await req.json();
        if (!body.identifier || !body.controlId || !body.maturityLevel) return errorResponse("identifier, controlId, and maturityLevel are required");
        const audit = createAudit(body.identifier, body.controlId, body.maturityLevel);
        if (audit.error) return errorResponse(audit.error, 409);
        return jsonResponse(audit, 201);
      }

      if (path.match(/^\/api\/audits\/\d+$/) && method === "GET") {
        const id = parseInt(path.split("/").pop());
        const audit = getAuditById(id);
        if (!audit) return errorResponse("Audit not found", 404);
        return jsonResponse(audit);
      }

      if (path.match(/^\/api\/audits\/\d+\/status$/) && method === "PUT") {
        const id = parseInt(path.split("/")[3]);
        const body = await req.json();
        if (!body.status) return errorResponse("status is required");
        return jsonResponse(updateAuditStatus(id, body.status));
      }

      // --- Requirement Status ---
      if (path.match(/^\/api\/audits\/\d+\/requirements$/) && method === "GET") {
        return jsonResponse(getRequirementStatuses(parseInt(path.split("/")[3])));
      }

      if (path.match(/^\/api\/audits\/\d+\/requirements\/[\w-]+$/) && method === "PUT") {
        const parts = path.split("/");
        const body = await req.json();
        return jsonResponse(setRequirementStatus(parseInt(parts[3]), parts[5], body.compliant, body.notes));
      }

      // --- Evidence ---
      if (path.match(/^\/api\/audits\/\d+\/evidence$/) && method === "GET") {
        const auditId = parseInt(path.split("/")[3]);
        const reqId = url.searchParams.get("requirementId");
        return jsonResponse(reqId ? getEvidenceForRequirement(auditId, reqId) : getEvidenceForAudit(auditId));
      }

      if (path.match(/^\/api\/audits\/\d+\/evidence$/) && method === "POST") {
        const auditId = parseInt(path.split("/")[3]);
        const contentType = req.headers.get("content-type") || "";
        if (contentType.includes("multipart/form-data")) {
          const formData = await req.formData();
          const requirementId = formData.get("requirementId");
          const evidenceType = formData.get("evidenceType");
          const description = formData.get("description");
          const file = formData.get("file");
          if (!requirementId || !evidenceType) return errorResponse("requirementId and evidenceType are required");
          let filePath = null, fileName = null, fileSize = null, mimeType = null;
          if (file && file instanceof File) {
            const ext = file.name.split(".").pop();
            const safeName = `${auditId}_${requirementId}_${Date.now()}.${ext}`;
            filePath = join(UPLOAD_DIR, safeName);
            fileName = file.name;
            fileSize = file.size;
            mimeType = file.type;
            await Bun.write(filePath, file);
          }
          return jsonResponse(addEvidence(auditId, requirementId, evidenceType, description, filePath, fileName, fileSize, mimeType), 201);
        } else {
          const body = await req.json();
          if (!body.requirementId || !body.evidenceType) return errorResponse("requirementId and evidenceType are required");
          return jsonResponse(addEvidence(auditId, body.requirementId, body.evidenceType, body.description, null, null, null, null), 201);
        }
      }

      if (path.match(/^\/api\/evidence\/\d+$/) && method === "DELETE") {
        return jsonResponse(deleteEvidence(parseInt(path.split("/").pop())));
      }

      // --- Delete Individual Audit ---
      if (path.match(/^\/api\/audits\/\d+$/) && method === "DELETE") {
        return jsonResponse(deleteAudit(parseInt(path.split("/").pop())));
      }

      // --- Delete All Audits ---
      if (path === "/api/audits" && method === "DELETE") {
        return jsonResponse(deleteAllAudits());
      }

      // --- Individual Audit Report ---
      if (path.match(/^\/api\/audits\/\d+\/report$/) && method === "GET") {
        const report = getAuditReport(parseInt(path.split("/")[3]));
        if (!report) return errorResponse("Audit not found", 404);
        return jsonResponse(report);
      }

      // --- Overall Compliance Report ---
      if (path === "/api/audits/overall-report" && method === "GET") {
        return jsonResponse(getOverallComplianceReport());
      }

      // --- Serve uploaded files ---
      if (path.startsWith("/api/uploads/")) {
        const file = Bun.file(join(UPLOAD_DIR, path.replace("/api/uploads/", "")));
        if (await file.exists()) return new Response(file);
        return errorResponse("File not found", 404);
      }

      // --- Serve frontend (SPA fallback) ---
      let filePath = join(DIST_DIR, path === "/" ? "index.html" : path);
      let file = Bun.file(filePath);
      if (!(await file.exists())) {
        file = Bun.file(join(DIST_DIR, "index.html"));
      }
      return new Response(file);

    } catch (e) {
      console.error(e);
      return errorResponse(e.message || "Internal server error", 500);
    }
  }
});

console.log(`Essential Eight server running on http://localhost:${PORT}`);
