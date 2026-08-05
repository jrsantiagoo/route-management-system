# Test DB — Static Test Data Definition

**Project:** Route Management System
**Prepared by:** QA Team
**Date:** 2026-07-04
**Jira tracking:** RMS-70 (Test Documents deliverable)

The original test scripts cite "static lists of vehicles, drivers, and delivery stops" as
the test data source without defining them. This document is that definition: the canonical
data set every manual execution and automated run assumes. The seeding script
`server/prisma/seed-test.js` loads this set — run `npm run seed:test -- --yes` from
`server/` (RMS-67). It **wipes** orders, trips, routes, fuel logs, and drivers first, and
refuses to run without the `--yes` flag (or `SEED_TEST_CONFIRM=yes`).

## Database

- PostgreSQL on Supabase, accessed via Prisma (`server/prisma/schema.prisma` is the source
  of truth). Models used in testing: `manager`, `agent_profile` (drivers), `route`, `stop`,
  `trip`, `order`, `fuel_log`.
- Enums: `TripStatus` (PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED), `OrderStatus`,
  `TagTypes` (ASSIGNED, …).
- Soft delete convention: rows with non-null `deleted_at` are invisible to the app.
- **Never run tests against the production Supabase project.** Use a dedicated test project
  or local Postgres with the same migrations.

## Test accounts

| Role | Email | Password | Notes |
| --- | --- | --- | --- |
| Logistics manager | `admin@gmail.com` | `admin` | Current fallback in the e2e suite; override with `TEST_MANAGER_EMAIL` / `TEST_MANAGER_PASSWORD` env vars |
| Upper management | — | — | **Does not exist** (design defect DD-06 / RMS-76); placeholder for case 4-6 |

## Drivers (`agent_profile`)

| driver_id | Name | Purpose |
| --- | --- | --- |
| D-01 | Driver A | Reassignment source (case 2-3), grid row 1 |
| D-02 | Driver B | Reassignment target (case 2-3), grid row 2 |
| D-03 | Driver C | Extra capacity for 1-4 (more drivers than stops) |
| D-04 | Driver D | Extra capacity for 1-4 |
| D-05 | Driver E | Extra capacity for 1-4 |

Cases 1-3 / 1-4 use subsets: {D-01, D-02} for 10-stops-2-drivers; all five for
5-drivers-3-stops.

## Delivery stops

Seed stops used by the route tool today:

| Stop | Coordinates (approx.) | Used by |
| --- | --- | --- |
| De La Salle University | 14.5647, 120.9930 | Default seeded stop 1 |
| Rizal Park | 14.5826, 120.9787 | Default seeded stop 2 |
| Makati CBD | 14.5547, 121.0244 | Add-stop case 2-1 (saved location) |
| SM Mall of Asia | 14.5352, 120.9822 | Save-route case 2-4 (saved location) |

The 10-stop list for case 1-3 extends these with six more Metro Manila landmarks (to be
fixed when the seeding script lands): Intramuros, Quezon Memorial Circle, BGC High Street,
Ortigas Center, Cubao Araneta, NAIA Terminal 3.

## Routes and trips

| Entity | Seed | Purpose |
| --- | --- | --- |
| Route "QA Baseline Route" | DLSU → Rizal Park | Pre-generated route for script 02 |
| Route "QA Single-Stop Route" | one stop only | Last-stop guard case 2-5 |
| Trip: COMPLETED, scheduled today | driver D-01, QA Baseline Route | Report cases 4-1, 4-5; dashboard metrics |
| Trip: PENDING, scheduled today | driver D-02 | "incomplete trip" for case 4-5 |
| Trip: unassigned (no driver) | QA Baseline Route | Assignment-grid and 4-5 separation |
| Trips: one COMPLETED per weekday of current week | D-01/D-02 alternating | Weekly report case 4-2 |

## Orders and fuel logs

| Entity | Seed | Purpose |
| --- | --- | --- |
| Orders: 3 COMPLETED, 1 PENDING (current week) | linked to seeded trips | Delivery-success part of the efficiency score; delivered-orders metric |
| Fuel logs: 2 rows, e.g. 50 km / 10 L and 100 km / 8 L | current week | Fuel analytics + efficiency baseline |

Unit tests encode the arithmetic these seeds must satisfy (see
`server/tests/unit/efficiency-service.test.js`): efficiency = 0.5 × delivery success % +
0.5 × min(actual km/L ÷ baseline km/L, 1) × 100, rounded to 2 decimals.

## Empty-state variants

Some cases need the *absence* of data:

- **Case 1-2:** remove both seeded stops before generating.
- **Case 4-4:** a day with zero completed trips — run against a date with no seeds (e.g.
  "Today" preset on a fresh seed dated yesterday).
- **Case 3-2:** all drivers at max capacity — cannot be seeded yet (no capacity model,
  DD-04 / RMS-74).
