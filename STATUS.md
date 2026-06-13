# Essential Eight - Project Status

## Last Commit
`5bf43fb` — Add audit delete and overall compliance report

## What Was Built

### Core App
- React + TypeScript + Vite + TailwindCSS v4
- 8 Essential Eight controls × 3 maturity levels = 304 requirements
- Each requirement has: purpose, implementation guidance, technical examples, audit evidence
- Dark cyber-themed UI with glassmorphism
- HashRouter for navigation

### Theme System (`src/ThemeContext.tsx`)
- 3 themes: Cyber (default), Spotify Dark, Light
- Theme switcher in header (Palette icon dropdown)
- Persists choice in localStorage
- CSS variables for all colors

### Audit System
- **Backend**: Bun + SQLite (`backend/server.js`, `backend/database.js`)
- **Database**: `data/audit.db` with tables: `audits`, `evidence`, `requirement_status`
- **API endpoints**:
  - `GET/POST /api/audits` — list/create audits
  - `GET /api/audits/summary` — list with compliance counts
  - `GET /api/audits/:id` — single audit
  - `DELETE /api/audits/:id` — delete individual audit
  - `DELETE /api/audits` — delete all audits
  - `PUT /api/audits/:id/status` — update status
  - `GET/PUT /api/audits/:id/requirements/:reqId` — requirement compliance
  - `GET/POST /api/audits/:id/evidence` — evidence CRUD
  - `DELETE /api/evidence/:id` — delete evidence
  - `GET /api/audits/:id/report` — individual audit report
  - `GET /api/audits/overall-report` — overall compliance across all controls
  - `GET /api/uploads/:filename` — serve uploaded files

### Audit Workflow
1. Enter unique identifier → lookup existing or create new
2. Select control + maturity level
3. Step-by-step requirement assessment (Previous/Next navigation)
4. Per requirement: Compliant/Not Compliant toggle, notes, evidence upload
5. Evidence types: screenshot, config export, policy doc, scan report, log export, photo, other
6. File uploads stored in `data/uploads/`
7. Complete audit → generates report

### Reports
- **Individual audit report**: compliance %, non-compliant items with recommendations, compliant items, evidence list
- **Overall compliance report**: aggregate across all 8 controls, per-control breakdown with highest maturity level attained, color-coded progress bars

### Delete Functionality
- Delete individual audit (with confirmation)
- Delete all audits (with confirmation modal)
- Cascading delete: removes evidence files from disk + database records

### Docker
- Multi-stage build: Node 24 (build) → Bun 1.3 (runtime)
- Port mapping: host 5656 → container 4545
- `docker-compose up --build -d`

## Project Structure
```
Essential8/
├── backend/
│   ├── database.js    — SQLite CRUD operations
│   └── server.js      — Bun HTTP server + API routes
├── src/
│   ├── App.tsx        — Main app with all components
│   ├── data.ts        — 304 requirements with guidance data
│   ├── ThemeContext.tsx — Theme provider + switcher
│   ├── index.css      — TailwindCSS + theme variables
│   └── main.tsx       — Entry point
├── data/
│   ├── audit.db       — SQLite database
│   └── uploads/       — Uploaded evidence files
├── Dockerfile
├── docker-compose.yml
└── vite.config.ts
```

## Key Technical Decisions
- **Bun runtime** for backend (native SQLite support)
- **SQLite** for persistence (single file, no external DB needed)
- **CSS variables** for theming (swapped via JS on theme change)
- **loadedRef** pattern to prevent double data fetching on mount
- **useCallback** for stable function references in effects

## Known Issues / Notes
- Audit workflow step is NOT persisted in URL (removed to fix refresh loop)
- Theme choice persists in localStorage
- Version badge at bottom-left: v1.4.0
- Backend serves both API and static frontend files (SPA fallback)

## How to Run
```bash
# Development
cd backend && bun server.js  # API on :3001 (or :4556 with proxy)
npm run dev                  # Frontend on :4545

# Docker
docker-compose up --build -d  # Everything on :5656
```

## GitHub
Repo: https://github.com/8bitsuperCPU/Essential8
