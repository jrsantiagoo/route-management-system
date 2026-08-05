# Test Classes — Automated Test Inventory

**Project:** Route Management System
**Prepared by:** QA Team
**Date:** 2026-07-04
**Jira tracking:** RMS-70 (Test Documents deliverable)

Map of every automated test file ("test class") to the manual test cases and code it covers.
Three tiers:

| Tier | Runner | Location | Run with |
| --- | --- | --- | --- |
| Unit | Vitest | `server/tests/unit/` | `npm run test:unit` (root or `server/`) |
| Integration | Vitest + Supertest | `server/tests/integration/` | `npm run test:integration` |
| End-to-end | Playwright | `e2e-testing/` | `npm run test:e2e` (root; needs client+server or lets Playwright boot them) |

## Unit (server, Prisma mocked)

### `tests/unit/trip-service.test.js` — 15 tests
Covers `server/src/services/trip-service.js`:
- `createTrip`: route-not-found and driver-not-found guards; PENDING/ASSIGNED defaults;
  scheduled-date passthrough
- `assignDriverToTrip`: trip-not-found; **already-assigned rule**; successful assignment
- `updateTripStatus`: rejects statuses outside `VALID_STATUSES` without touching the DB;
  accepts all five valid statuses; trip-not-found
- `deleteTrip`: not-found guard
- `getTripsByDriverAndDay`: grouping into `driverId-day` grid cells

### `tests/unit/efficiency-service.test.js` — 7 tests
Covers `server/src/services/efficiency-service.js` (feeds dashboard Efficiency metric,
manual cases 4-1/5-3):
- zero-data → 0; delivery-only → 50; equal weighting; 100% cap on fuel ratio;
  baseline fallback (10 km/L); 2-decimal rounding; zero-liter division guard

### `tests/unit/order-service.test.js` — 14 tests
Covers `server/src/services/order-service.js` (feeds orders table and dashboard
metrics; proposed script 07):
- order-id generation: `ORD-<date>-000` for the first order of the day, sequence
  increment, per-day prefix scoping
- not-found guards on get/update/delete; trip-orders lookup (trip-not-found)
- date-range queries: end date filtered inclusively to 23:59, no filter without dates,
  `getOrdersRange` matches ordered_on OR delivered_by

### `tests/unit/route-service.test.js` — 2 tests
Covers `server/src/services/route-service.js` (persistence behind Save Route, case 2-4):
- routes fetched with stops included; created stops persist route fields and list order

### `tests/unit/fuel-log-service.test.js` — 10 tests
Covers `server/src/services/fuel-log-service.js` (fuel analytics; proposed script 08):
- `buildDailyPerOrderMetrics`: day bucketing, per-order division with zero-order guard,
  orders on log-less days ignored, date sorting, missing values as 0
- `getLogsRange`: soft-delete exclusion, end-of-day inclusive filter
- `updateFuelLog` not-found guard; `dailyFuelPerOrder` composition

### `tests/unit/driver-service.test.js` — 1 test
Covers `server/src/services/driver-services.js`: drivers ordered by driver_id

### `tests/unit/manager-service.test.js` — 3 tests
Covers `server/src/services/manager-service.js`: lastname ordering; `getMe` not-found
guard and profile lookup

## Unit (client lib, Vitest — `cd client && npm test`)

### `client/tests/unit/formatters.test.ts` — 5 tests
Covers `client/lib/routing/formatters.ts`: m/km cutover, h/min splitting, week-range label

### `client/tests/unit/trend-compute.test.ts` — 3 tests
Covers `client/lib/dashboard/trend-compute.ts`: centered moving average, edge clamping,
1-decimal rounding

### `client/tests/unit/vehicleLogic.test.ts` — 6 tests
Covers `client/lib/routing/vehicleLogic.ts` (Suggest Routes logic, script 01) with OSRM
mocked: vehicle recommendation cutover, unknown-week fleet fallback, <2 stops → no
suggestions, car+motorcycle variants, 3-stop motorcycle cap with fixed endpoints,
failed OSRM variants dropped

## Integration (server, real Express app via Supertest)

### `tests/integration/trip-api.test.js` — 10 tests
Covers route → controller → service for `/api/trips` (supports the trip flows behind
scripts 02/04/05):
- `/health` readiness; success envelope `{ success: true, data }`; error envelope
  `{ message }`; 400 missing-field validation; 400 service errors surfaced; 404 unknown
  trip; status-enum rejection through the full stack; assign already-assigned conflict

### `tests/integration/auth-middleware.test.js` — 5 tests
Covers `server/src/middleware/auth.js` (relates to RMS-37/RMS-36):
- 401 missing header; 401 non-Bearer; 403 invalid token; pass-through with `req.user`;
  500 on Supabase outage

### `tests/integration/auth-api.test.js` — 12 tests (1 todo)
Covers `/api/auth/*` through the real app, Supabase mocked (proposed script 06;
relates to RMS-36):
- login: token/profile envelope, 400 on bad credentials
- register: 400 on Supabase error; success path is `it.todo` — blocked by BR-02/RMS-36
  (controller references name fields never read from the request)
- refresh: new session, 400 on rejected token
- logout and change-password: 401 without a token (authenticate is mounted here);
  confirmation-mismatch and wrong-old-password rejections; successful change verifies
  the old password first

### `tests/integration/order-api.test.js` — 10 tests (1 todo)
Covers `/api/orders` (proposed script 07):
- envelopes, not-found messages, generated order id on create, status uppercasing,
  no-fields and missing-tripId 400s. The "400 does not create the order" assertion is
  `it.todo` — blocked by BR-06/RMS-82 (validation branch missing a `return`)

### `tests/integration/route-api.test.js` — 3 tests
Covers `/api/routes`: envelope with stops, stop order persisted on create, 400 error
envelope on malformed body

### `tests/integration/driver-api.test.js` — 2 tests
Covers `/api/drivers`: envelope; failure path (note: this controller alone returns
500 + `{ error }` instead of 400 + `{ message }`)

### `tests/integration/fuel-log-api.test.js` — 4 tests
Covers `/api/fuel_logs` (proposed script 08): envelopes, create passthrough, unknown-log
400, daily fuel-per-order aggregation through the full stack

### `tests/integration/efficiency-api.test.js` — 2 tests
Covers `/api/efficiency` (dashboard Efficiency metric): 0 with no data; composite score
(delivery 50% + fuel-vs-baseline 100% → 75) through the full stack

### `tests/integration/manager-api.test.js` — 3 tests
Covers `/api/managers`: envelope; `/me` 401 without token (authenticate mounted),
profile lookup by token user, missing-profile 400

## End-to-end (Playwright)

Legend: ✅ runnable · 🟡 runnable with spec deviation noted · ⛔ `test.fixme`, blocked by a
design defect (see [sw-design-defect-report.md](sw-design-defect-report.md)).

**Auth:** `e2e-testing/auth.setup.ts` (a `setup` project every browser project depends on)
logs in once through the UI and saves the session to `playwright/.auth/manager.json`; all
specs load it via `storageState` and start already authenticated. Specs must not drive the
login form themselves — per-spec UI logins race Next.js hydration in dev (`fill()` before
React attaches handlers submits empty state) and flake, always on WebKit and under parallel
load elsewhere. Credentials override: `TEST_MANAGER_EMAIL` / `TEST_MANAGER_PASSWORD`.

### `e2e-testing/routeGeneration.spec.ts` — script 01
| Case | Status | Notes |
| --- | --- | --- |
| 1-1 Valid generation | ✅ | Route cards + Apply button |
| 1-2 Missing stops | 🟡 | Asserts actual copy, not spec copy (DD-02) |
| 1-3 More stops than drivers | ⛔ | DD-01 |
| 1-4 More drivers than stops | ⛔ | DD-01 |

### `e2e-testing/manualRouteEditing.spec.ts` — script 02
| Case | Status | Notes |
| --- | --- | --- |
| 2-1 Add stop | ✅ | Includes metric-recalculation assertion |
| 2-2 Remove stop | ✅ | |
| 2-3 Reassign between drivers | ⛔ | DD-03 |
| 2-4 Save edited route | 🟡 | Persistence-after-refresh assertion still TODO (RMS-67) |
| 2-5 Remove last stop | 🟡 | Asserts spec'd guard; **fails by design** — living marker for BR-01/RMS-79 |

### `e2e-testing/emergencyDriverPing.spec.ts` — script 03
| Case | Status | Notes |
| --- | --- | --- |
| 3-1 Valid emergency pickup | ⛔ | DD-04, whole module missing |
| 3-2 No available driver | ⛔ | DD-04 |

### `e2e-testing/reportGeneration.spec.ts` — script 04
| Case | Status | Notes |
| --- | --- | --- |
| 4-3 In-app summary | ✅ | All five implemented metrics |
| (bonus) PDF download | ✅ | Filename + .pdf check on Full Summary |
| 4-1 Daily PDF | ⛔ | DD-05 |
| 4-2 Weekly PDF | ⛔ | DD-05 |
| 4-4 Zero-trip report | ⛔ | DD-05 |
| 4-5 Partial completion | ⛔ | DD-05 |
| 4-6 Upper management access | ⛔ | DD-06 |

### `e2e-testing/liveDashboard.spec.ts` — script 05
| Case | Status | Notes |
| --- | --- | --- |
| 5-1 Dashboard load | ✅ | Panels, range picker, Full Summary button |
| 5-2 Real-time update | ⛔ | DD-08 |
| 5-3 Required metrics | 🟡 | Five implemented metrics asserted; three time metrics missing (DD-07) |
| (bonus) Date-range preset switch | ✅ | Covers newest dashboard code |

## Conventions for new test classes

- Unit/integration: `*.test.js` under `server/tests/{unit,integration}/`; mock
  `src/lib/prisma.js` (and `src/lib/supabase-client.js` where auth is involved) with
  `vi.mock`; never hit a real database from these tiers.
- E2E: one spec per manual script, named after it; use `test.fixme` + a comment naming the
  blocking Jira issue for unexecutable cases so gaps stay visible in every report.
