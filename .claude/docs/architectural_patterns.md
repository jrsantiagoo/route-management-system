# Architectural Patterns

Conventions that recur across the codebase. Follow these when extending it so new code
matches existing code. File:line references point at representative examples.

## Backend: three-layer request flow

Every backend domain follows **route → controller → service → Prisma**, one file per domain
(`trip`, `route`, `order`, `driver`, `manager`, `fuel-log`, `auth`). Layers are wired by plain
ES module imports (no DI container); the service layer is the *only* place that imports Prisma.

1. **Router** — maps URLs to controller functions, nothing else.
   `server/src/routes/trip-routes.js:15`. Mounted under a namespace in `server/src/server.js:26`.
2. **Controller** — parses `req`, validates presence of inputs, calls the service, formats the
   response. No DB access. `server/src/controllers/trip-controller.js:6`.
3. **Service** — business rules + all Prisma queries; throws `Error` on invalid state.
   `server/src/services/trip-service.js:11`.

When adding an endpoint, add a function to each of the three layers in that order; do not
short-circuit by querying Prisma from a controller.

## Controller conventions

- Wrap the whole handler in `try/catch`. `server/src/controllers/trip-controller.js:6`.
- Validate required fields first and return **400** with `{ message }` on failure.
- **Success envelope:** `res.json({ success: true, data: <result> })`.
- **Error envelope:** `res.status(4xx/5xx).json({ message: error.message })`. Use 400 for
  client/validation errors, 404 for not-found, 500 for unexpected failures.
- Auth endpoints are the one exception: they return domain-shaped payloads (tokens/profile)
  and use `{ error }` instead of `{ message }`. `server/src/controllers/auth-controller.js:29`.

## Service conventions

- Fetch-and-check before mutating: look the row up, `throw new Error("... not found")` if
  missing, then act. `server/src/services/trip-service.js:74`.
- Validate enums/domain constraints in the service, not the controller — e.g. `VALID_STATUSES`
  guard in `server/src/services/trip-service.js:113`.
- Prisma reads that cross relations use `include` to hydrate related rows
  (`agent_profile`, `route`). `server/src/services/trip-service.js:39`.
- Prisma is a shared singleton exported from `server/src/lib/prisma.js`; import it, never
  construct `new PrismaClient()` elsewhere.

## Prisma schema conventions

Defined in `server/prisma/schema.prisma`. When adding models/fields, match these:

- Primary keys are named `id_`, typed `String @db.Uuid`, defaulted with
  `dbgenerated("gen_random_uuid()")`. `schema.prisma:81`.
- Foreign keys use the `<relation>_id_` suffix (e.g. `driver_id_`, `route_id_`).
- Columns are `snake_case`; models carry `@@map("...")` to the real table name. `schema.prisma:126`.
- Timestamps: `created_at` / `updated_at` (`@updatedAt`) as `Timestamptz(6)`.
- **Soft delete** via a nullable `deleted_at`; queries that should hide removed rows filter
  `deleted_at: null`. `server/src/services/trip-service.js:142`.
- Status fields are Postgres enums (`TripStatus`, `OrderStatus`, `TagTypes`). `schema.prisma:187`.

## Authentication

- Supabase issues JWT access + refresh tokens on login. `server/src/controllers/auth-controller.js:29`.
- Protected API routes verify the `Authorization: Bearer <token>` header through the
  `authenticate` middleware, which calls `supabase.auth.getUser` and attaches `req.user`.
  `server/src/middleware/auth.js:4`.
- The app's user profile (`manager`) is stored in Postgres via Prisma, keyed by the Supabase
  user id (`id_ = data.user.id`). Supabase owns credentials; Prisma owns profile data.

## Frontend: per-domain API modules

- Each backend domain has a matching client module in `client/lib/api/` exporting one async
  function per endpoint, returning `response.json()`. `client/lib/api/trips.ts:3`.
- Base URL always comes from `process.env.NEXT_PUBLIC_API_URL`; never hardcode the host.
- `client/lib/api/client.ts:3` provides `apiCall`, the authenticated wrapper: it injects the
  bearer token from `localStorage`, and on a **401** transparently refreshes the token via
  `/api/auth/refresh` and retries once. Use `apiCall` for anything that requires auth; the bare
  per-domain functions are for unauthenticated or in-progress endpoints.
- Tokens (`access_token`, `refresh_token`) live in `localStorage`; login writes them, logout
  clears them. `client/lib/api/auth.ts:25`.

## Frontend: App Router structure & client state

- Pages live in `client/app/`. Authenticated pages sit under the `(protected)/` route group,
  which shares one layout wrapping every page in `Sidebar` + `Topbar`.
  `client/app/(protected)/layout.tsx:10`.
- Interactive pages/components are Client Components (`"use client"`) using `useState`/`useEffect`.
- UI preferences persist to `localStorage` / `sessionStorage` and rehydrate in a mount effect —
  e.g. sidebar collapse (`layout.tsx:20`) and dark-mode theme (`client/app/page.tsx:19`).
- Components are grouped by feature under `client/components/<feature>/`; shared primitives live
  in `client/components/ui/`.
