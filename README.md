# ACSC Essential Eight Interactive Website Specification

(See original specification document for full details)

## Quick Start

```bash
npm install
npm run dev    # Starts on http://localhost:5656
npm run build  # Production build to dist/
```

## Project Structure

- `src/App.tsx` — All application code (components, data, types)
- `src/index.css` — TailwindCSS with custom cyber theme
- `src/main.tsx` — Entry point with React Router
- `src/data/controls.ts` — Embedded in App.tsx
- `src/types/index.ts` — Embedded in App.tsx

## Features

- 8 Essential Eight controls as interactive tiles
- 3 maturity levels per control
- Detailed components with implementation guidance
- Real-time search (⌘K)
- Dark cyber-themed UI with glassmorphism
- Responsive design
- Component detail modals
