# CLAUDE.md

## Project Overview

**Route Management Tool** — a web application for logistics managers to plan delivery
routes, schedule trips, assign drivers, track orders, and monitor fuel/delivery analytics.
Managers authenticate, build routes on a map, organize stops, assign trips to drivers on a
weekly grid, and review performance on a dashboard.

Monorepo with two independently-installed packages: a Next.js `client/` and an
Express/Prisma `server/`. The root `package.json` only orchestrates the two.

## Tech Stack

**Backend** (`server/`, ESM JavaScript)
- Node.js + Express 5 — REST API under `/api/*` (see `server/src/server.js:26`)
- Prisma ORM 6 over PostgreSQL (hosted on Supabase); client generated to `server/src/generated/prisma`
- Supabase Auth — JWT-based auth, verified in `server/src/middleware/auth.js:4`
- nodemon (dev), dotenv (loaded first via `server/env.js`)

**Frontend** (`client/`, TypeScript)
- Next.js 16 (App Router) + React 19
- Tailwind CSS v4 (PostCSS)
- Leaflet + react-leaflet for maps, OpenStreetMap tiles, OSRM for routing (`client/lib/routing/routingService.ts`)
- recharts (charts), jsPDF + jspdf-autotable (report export), @dnd-kit (drag-and-drop stop ordering)
- Path alias: `@/*` → `client/*` (`client/tsconfig.json`)

## Key Directories

| Path | Purpose |
| --- | --- |
| `server/src/routes/` | Express routers — URL → controller mapping, one file per domain |
| `server/src/controllers/` | HTTP layer — request parsing, validation, response envelopes |
| `server/src/services/` | Business logic + all Prisma queries; the only layer that touches the DB |
| `server/src/lib/` | Shared singletons: `prisma.js`, `supabase-client.js` |
| `server/src/middleware/` | Express middleware (`auth.js` JWT verification) |
| `server/prisma/` | `schema.prisma` + migrations (source of truth for the data model) |
| `client/app/` | Next.js App Router pages; `(protected)/` route group shares a sidebar/topbar layout |
| `client/components/` | React components grouped by feature (`dashboard/`, `routing/`, `assignment/`, `profile/`, `ui/`) |
| `client/lib/api/` | Per-domain API client modules (`auth.ts`, `trips.ts`, `routes.ts`, …) |
| `client/lib/routing/` | Map/route domain logic: OSRM calls, geocoding, formatters, types |
| `client/lib/dashboard/` | Analytics helpers: trend computation, PDF generation |

## Essential Commands

Run from the repo root:

```bash
npm run install-server   # cd server && npm install (postinstall runs `prisma generate`)
npm run install-client   # cd client && npm install
npm run server           # start API with nodemon on :8080
npm run client           # start Next.js dev server on :3000
```

Server (`cd server`): `npm run dev` · `npm start` · `npx prisma migrate dev` · `npx prisma generate`
Client (`cd client`): `npm run dev` · `npm run build` · `npm start` · `npm run lint`

There is no configured backend test runner yet (`server` `test` script is a placeholder);
the README references Vitest and Postman as intended tooling.

## Environment

- `server/.env` — `DATABASE_URL`, `DIRECT_URL` (Postgres), Supabase URL/keys, `PORT`, `ORIGIN_URI` (CORS)
- `client/.env.local` — `NEXT_PUBLIC_API_URL` (base URL of the backend)

## Additional Documentation

Check these when the task touches the relevant area:

- **`.claude/docs/architectural_patterns.md`** — the layered server architecture, controller/service
  conventions, response envelopes, Prisma schema conventions, and the client API/auth patterns.
  **Read this before adding or modifying any API endpoint, service, or frontend data call.**
