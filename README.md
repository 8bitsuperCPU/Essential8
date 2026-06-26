# Essential Eight

[![Version](https://img.shields.io/badge/version-2.4.2-blue)](https://github.com/8bitsuperCPU/Essential8)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](docker-compose.yml)

An interactive web application for auditing against the [Australian Cyber Security Centre (ACSC) Essential Eight](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight) maturity model. Built with React, TypeScript, Vite + TailwindCSS on the frontend and Bun + SQLite on the backend.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Development](#development)
- [API Reference](#api-reference)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Version History](#version-history)
- [License](#license)

## Features

- **8 Essential Eight Controls** — Patch Applications, Application Control, Restrict Microsoft Office Macros, User Application Hardening, Patch Operating Systems, Multi-Factor Authentication, Restrict Administrative Privileges, Regular Backups
- **3 Maturity Levels per Control** — 304 total requirements with purpose, implementation guidance, technical examples, and audit evidence criteria
- **Interactive Audit Workflow** — Step-by-step requirement assessment with Previous/Next navigation
- **Compliance Tracking** — Mark requirements as Compliant/Not Compliant with notes
- **Evidence Management** — Upload screenshots, config exports, policy docs, scan reports, log exports, photos. 7 evidence types supported.
- **Audit Groups** — Create and track multi-control audits under a shared identifier
- **Reports** — Individual audit reports with compliance percentage + overall compliance report across all controls with color-coded progress bars
- **Audit Locking** — Password-protect completed audits to prevent modification
- **Real-time Search** — Fuzzy search across all strategies and requirements (press `/` or click the search icon)
- **Theme System** — 5 built-in themes (Cyber, Spotify Dark, Light, Ocean, Paper) with localStorage persistence
- **Training Videos** — Embedded training content for each strategy
- **Responsive Design** — Desktop, tablet, and mobile layouts

## Demo

Run locally — see [Quick Start](#quick-start).

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (React SPA)               │
│  App.tsx — Single-file app with all components      │
│  ThemeContext.tsx — Theme provider + switcher        │
│  data/controls.ts — 304 requirements data            │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (fetch /api/*)
┌──────────────────────┴──────────────────────────────┐
│              Bun Server (server.js)                   │
│  REST API — CRUD for audits, evidence, status        │
│  Static File Server — Serves built frontend (dist/)  │
│  SPA Fallback — index.html for client-side routes    │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────┐
│              SQLite (audit.db)                        │
│  Tables: audits, evidence, requirement_status         │
│  WAL mode, foreign keys, cascading deletes            │
└─────────────────────────────────────────────────────┘
```

**Frontend stack:** React 19 + TypeScript + Vite 8 + TailwindCSS v4 + Fuse.js (fuzzy search) + Lucide React (icons) + jsPDF (PDF export)

**Backend stack:** Bun 1.3 + bun:sqlite (native SQLite driver)

**Build:** Multi-stage Docker build — Node 24 (build) → Bun 1.3 (runtime)

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ or [Bun](https://bun.sh/) 1.3+
- npm or bun

### Local Development

```bash
# Clone the repository
git clone https://github.com/8bitsuperCPU/Essential8.git
cd Essential8

# Install dependencies
npm install

# Start the backend (terminal 1)
cd backend && bun server.js
# API runs on http://localhost:3001

# Start the frontend (terminal 2)
npm run dev
# Frontend runs on http://localhost:4545

# Or run both on one port with Docker:
docker-compose up --build -d
# Everything runs on http://localhost:5656
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4545` | Backend server port |

No API keys or external services required. SQLite database is created automatically on first run.

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

### Adding New Requirements

Requirements are defined in `src/data/controls.ts`. Each control follows this structure:

```typescript
{
  id: 'application-control',
  name: 'Application Control',
  description: '...',
  guidance: '...',
  icon: 'Shield',
  maturityLevels: [
    {
      level: 1,
      title: 'Maturity Level One',
      components: [
        {
          id: 'app-whitelisting',
          title: 'Application Allowlisting',
          summary: '...',
          purpose: '...',
          implementation: '...',
          examples: ['...'],
          evidence: ['...'],
          references: ['https://www.cyber.gov.au/...']
        }
      ]
    }
  ]
}
```

### Tech Stack Details

- **Vite 8** with Rolldown bundler
- **TailwindCSS v4** via `@tailwindcss/vite` plugin
- **React Router v7** with HashRouter
- **TypeScript 6** strict mode
- **Fuse.js** for client-side fuzzy search (threshold: 0.3)

## API Reference

### Audits

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/audits` | List all audits |
| `GET` | `/api/audits?identifier=<id>` | Get audit by identifier |
| `GET` | `/api/audits/summary` | List audits with compliance counts |
| `GET` | `/api/audits/:id` | Get single audit by ID |
| `POST` | `/api/audits` | Create new audit (body: `{ identifier, controlId, maturityLevel }`) |
| `DELETE` | `/api/audits/:id` | Delete audit (cascading) |
| `DELETE` | `/api/audits` | Delete all audits |
| `PUT` | `/api/audits/:id/status` | Update audit status (body: `{ status }`) |
| `GET` | `/api/audits/last` | Get most recently updated audit |

### Audit Groups

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/audits/group` | Create audit group (body: `{ identifier, controlIds, startLevel }`) |
| `GET` | `/api/audits/group/:groupId` | Get audits in a group |
| `GET` | `/api/audits/group/:groupId/progress` | Get group progress with compliance counts |
| `GET` | `/api/audits/group-by-audit?auditId=<id>` | Get group by audit ID |

### Requirements

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/audits/:id/requirements` | Get requirement statuses for audit |
| `PUT` | `/api/audits/:id/requirements/:reqId` | Update requirement (body: `{ compliant, notes }`) |

### Evidence

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/audits/:id/evidence` | Get evidence for audit (optional `?requirementId=<id>`) |
| `POST` | `/api/audits/:id/evidence` | Add evidence (multipart/form-data or JSON) |
| `DELETE` | `/api/evidence/:id` | Delete evidence (removes file from disk) |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/audits/:id/report` | Individual audit report |
| `GET` | `/api/audits/overall-report` | Overall compliance across all completed audits |

### Locking

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/api/audits/:id/lock` | Lock audit (body: `{ password }`) |
| `PUT` | `/api/audits/:id/unlock` | Unlock audit (body: `{ password }`) |

### Static Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/uploads/:filename` | Serve uploaded evidence files |

## Docker Deployment

### Docker Compose (Recommended)

```bash
docker-compose up --build -d
```

- Builds frontend in Node 24 container
- Copies `dist/` + backend into Bun 1.3 runtime container
- Exposes on host port `5656`
- Restart policy: `unless-stopped`

### Manual Docker Build

```bash
docker build -t essential8 .
docker run -p 5656:4545 essential8
```

### Dockerfile Stages

1. **Builder** (`node:24-alpine`): Installs deps, runs `npm run build`
2. **Runtime** (`oven/bun:1.3-alpine`): Copies built assets + backend, serves on port 4545

## Project Structure

```
Essential8/
├── backend/
│   ├── database.js       # SQLite schema + CRUD operations
│   ├── database.ts       # TypeScript source (compiled to .js)
│   └── server.js         # Bun HTTP server + API routes
├── src/
│   ├── App.tsx           # Main application (all components, ~800 lines)
│   ├── App.css           # Component styles
│   ├── data/
│   │   ├── controls.ts   # Essential Eight controls data (304 requirements)
│   │   └── data.ts       # Re-exported strategies data
│   ├── index.css         # TailwindCSS + theme CSS variables
│   ├── main.tsx          # Entry point with React Router + Theme Provider
│   ├── ThemeContext.tsx  # Theme provider, switcher component, 5 themes
│   └── types/
│       └── index.ts      # TypeScript interfaces
├── data/
│   ├── audit.db          # SQLite database (auto-created)
│   └── uploads/          # Uploaded evidence files
├── dist/                 # Production build output
├── public/               # Static assets (videos, etc.)
├── docker-compose.yml
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Database Schema

### `audits` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PK | Auto-increment |
| `identifier` | TEXT | Unique audit identifier (e.g., `client-name_ML1`) |
| `audit_group` | TEXT | UUID linking audits in a group |
| `control_id` | TEXT | Essential Eight control ID |
| `maturity_level` | INTEGER | 1, 2, or 3 |
| `status` | TEXT | `in_progress` or `completed` |
| `locked` | INTEGER | 0 = unlocked, 1 = locked |
| `password_hash` | TEXT | Bun password hash (nullable) |
| `created_at` | TEXT | ISO datetime |
| `updated_at` | TEXT | ISO datetime |

**Indexes:** UNIQUE(identifier, control_id, maturity_level), INDEX(audit_group)

### `evidence` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PK | Auto-increment |
| `audit_id` | INTEGER FK | References audits(id) ON DELETE CASCADE |
| `requirement_id` | TEXT | Requirement identifier |
| `evidence_type` | TEXT | screenshot, config_export, policy_doc, scan_report, log_export, photo, other |
| `description` | TEXT | Optional description |
| `file_path` | TEXT | Path in data/uploads/ (nullable) |
| `file_name` | TEXT | Original filename (nullable) |
| `file_size` | INTEGER | Bytes (nullable) |
| `mime_type` | TEXT | MIME type (nullable) |
| `status` | TEXT | `pending` or `collected` |
| `created_at` | TEXT | ISO datetime |

### `requirement_status` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PK | Auto-increment |
| `audit_id` | INTEGER FK | References audits(id) ON DELETE CASCADE |
| `requirement_id` | TEXT | Requirement identifier |
| `compliant` | INTEGER | 0 = not compliant, 1 = compliant |
| `notes` | TEXT | Optional auditor notes |
| `created_at` | TEXT | ISO datetime |
| `updated_at` | TEXT | ISO datetime |

**Constraints:** UNIQUE(audit_id, requirement_id), FK cascade delete

## Version History

| Version | Changes |
|---------|---------|
| v2.4.2 | Sync training videos, audit workflow fixes, dependency updates |
| v2.4.1 | Move Patch Applications video to strategy page |
| v2.4.0 | Remove Audit/Search buttons from header, add Patch OS training video |
| v1.4.0 | Version badge, backend serves SPA |
| v1.0.0 | Initial release — 8 controls, audit workflow, evidence upload |

Current version: **2.4.2**

## License

MIT License — see [LICENSE](LICENSE) for details.

## Acknowledgements

- [Australian Cyber Security Centre (ACSC)](https://www.cyber.gov.au/) for the Essential Eight framework
- [Andrej Karpathy](https://karpathy.ai/) for AI safety inspiration
