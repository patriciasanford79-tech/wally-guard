# SPECTRE

**Your Data. Your AI. Your Rules.**

Big Tech locked your data. SPECTRE is giving it back. Free, open guides and
tools to help anyone export their personal data from the major platforms —
ChatGPT, Apple, Google, Meta — so they can own it, move it, and use it on
their own terms.

This repo contains a small full-stack web app:

- **Frontend** — React (Vite) + TailwindCSS, dark-themed, single-CTA landing
  page plus a step-by-step data export guide.
- **Backend** — Node.js / Express API with a few endpoints for platform
  metadata, contact intake, and a healthcheck.

## Project layout

```
spectre/
├── frontend/   # React + Vite + Tailwind
└── backend/    # Node.js + Express API
```

## Quick start

You'll need Node.js 18+ and npm.

### 1. Backend

```bash
cd backend
npm install
npm run dev    # http://localhost:4000
```

Endpoints:

| Method | Path                  | Description                         |
| ------ | --------------------- | ----------------------------------- |
| GET    | `/api/health`         | Liveness probe                      |
| GET    | `/api/platforms`      | List of supported export platforms  |
| GET    | `/api/platforms/:id`  | Step-by-step export guide for one   |
| POST   | `/api/contact`        | Anti-corporate fan mail / requests  |

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend on `:4000`.

### 3. Production build

```bash
cd frontend && npm run build      # outputs frontend/dist
cd ../backend && NODE_ENV=production npm start
```

The Express server will serve the built frontend from `frontend/dist`
when `NODE_ENV=production`.

## Environment variables

Create `backend/.env` (optional):

```
PORT=4000
NODE_ENV=development
```

## License

MIT. Use it. Fork it. Mirror it. Share it. The whole point is your data
shouldn't be locked up.
