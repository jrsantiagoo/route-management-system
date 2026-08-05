# Requirements Traceability Matrix

**Project:** Route Management System
**Prepared by:** QA Team
**Date:** 2026-07-04
**Jira tracking:** RMS-70 (Test Documents deliverable); execution stories RMS-40–RMS-44 under epic RMS-39

Status legend: **Automated** (runs green) · **Automated (deviation)** (runs, with a noted
spec mismatch) · **Failing (defect marker)** (asserts spec'd behavior; fails until the bug
is fixed) · **Blocked** (feature missing — see design defect).

| Requirement | Case | Jira sub-task | Automated test | Status | Defect ref |
| --- | --- | --- | --- | --- | --- |
| Generate optimized routes from valid inputs | 1-1 | RMS-45 | `routeGeneration.spec.ts` | Automated | — |
| Reject generation with no stops + clear error | 1-2 | RMS-46 | `routeGeneration.spec.ts` | Automated (deviation) | DD-02 / RMS-72 |
| Distribute all stops when stops > drivers | 1-3 | RMS-47 | `routeGeneration.spec.ts` (fixme) | Blocked | DD-01 / RMS-71 |
| Mark excess drivers unassigned when drivers > stops | 1-4 | RMS-48 | `routeGeneration.spec.ts` (fixme) | Blocked | DD-01 / RMS-71 |
| Add stop to existing route, metrics recalculate | 2-1 | RMS-51 | `manualRouteEditing.spec.ts` | Automated | — |
| Remove stop, route updates | 2-2 | RMS-52 | `manualRouteEditing.spec.ts` | Automated | — |
| Reassign stop between drivers on the map | 2-3 | RMS-53 | `manualRouteEditing.spec.ts` (fixme) | Blocked | DD-03 / RMS-73 |
| Save edited route, persists after refresh | 2-4 | RMS-54 | `manualRouteEditing.spec.ts` | Automated (deviation) | Persistence assertion TODO (RMS-67) |
| Reject removing the final stop | 2-5 | RMS-55 | `manualRouteEditing.spec.ts` | Failing (defect marker) | BR-01 / RMS-79 |
| Emergency pickup pings most available driver | 3-1 | RMS-49 | `emergencyDriverPing.spec.ts` (fixme) | Blocked | DD-04 / RMS-74 |
| No-driver-available message at max capacity | 3-2 | RMS-50 | `emergencyDriverPing.spec.ts` (fixme) | Blocked | DD-04 / RMS-74 |
| Daily PDF report with correct metrics/date | 4-1 | RMS-56 | `reportGeneration.spec.ts` (fixme) | Blocked | DD-05 / RMS-75 |
| Weekly PDF report, correct aggregation/range | 4-2 | RMS-57 | `reportGeneration.spec.ts` (fixme) | Blocked | DD-05 / RMS-75 |
| In-app summary readable without download | 4-3 | RMS-58 | `reportGeneration.spec.ts` | Automated | — |
| Zero-value report on empty day, no crash | 4-4 | RMS-59 | `reportGeneration.spec.ts` (fixme) | Blocked | DD-05 / RMS-75 |
| Completed-only metrics; incomplete listed separately | 4-5 | RMS-60 | `reportGeneration.spec.ts` (fixme) | Blocked | DD-05 / RMS-75 |
| Upper management can download recent PDF | 4-6 | RMS-61 | `reportGeneration.spec.ts` (fixme) | Blocked | DD-06 / RMS-76 |
| Dashboard loads with all panels | 5-1 | RMS-62 | `liveDashboard.spec.ts` | Automated | — |
| Metrics update in real time, no refresh | 5-2 | RMS-63 | `liveDashboard.spec.ts` (fixme) | Blocked | DD-08 / RMS-78 |
| All required metrics displayed | 5-3 | RMS-64 | `liveDashboard.spec.ts` | Automated (deviation) | DD-07 / RMS-77 (3 metrics missing) |

## Proposed scripts 06–09 (not yet scheduled)

Scripts 06–09 in [test-scripts.md](test-scripts.md) (Authentication & Profile, Order
Management, Fuel Logging, Trip Assignment — 17 cases) are **proposals**: they have no Jira
execution stories, no case sub-tasks, and no dedicated automation yet. They enter this
matrix once the team schedules them. Partial coverage that already exists:

| Proposed case | Existing coverage |
| --- | --- |
| 6-1 Valid manager login | API level: `auth-api.test.js` (token/profile envelope); UI level: exercised every e2e run by `auth.setup.ts` |
| 6-2 Invalid credentials | API level: `auth-api.test.js` (400, Supabase message) |
| 6-3 Logout | API level: `auth-api.test.js` (sign-out + 401 without token) |
| 6-4 Token refresh | API level: `auth-api.test.js` (new session, 400 on stale token) |
| 6-5 Change password | API level: `auth-api.test.js` (mismatch/wrong-old rejections, success flow) |
| 6-6 Direct API without token | `auth-middleware.test.js` pins the middleware contract; the endpoint-level failure is BR-03 / RMS-37 |
| 8-2 Zero/negative fuel inputs | Divide-by-zero guard unit-tested in `efficiency-service.test.js` |
| 9-2 Double assignment rejected | Covered by `trip-service.test.js` (unit) and `trip-api.test.js` (integration) |

## Supporting automated coverage (not tied to a scripted case)

| Code under test | Test | Tier |
| --- | --- | --- |
| Trip business rules (`trip-service.js`) | `server/tests/unit/trip-service.test.js` | Unit |
| Efficiency score (`efficiency-service.js`) | `server/tests/unit/efficiency-service.test.js` | Unit |
| Order rules + id generation (`order-service.js`) | `server/tests/unit/order-service.test.js` | Unit |
| Route persistence mapping (`route-service.js`) | `server/tests/unit/route-service.test.js` | Unit |
| Fuel analytics (`fuel-log-service.js`) | `server/tests/unit/fuel-log-service.test.js` | Unit |
| Driver listing (`driver-services.js`) | `server/tests/unit/driver-service.test.js` | Unit |
| Manager lookups (`manager-service.js`) | `server/tests/unit/manager-service.test.js` | Unit |
| Route formatters (client) | `client/tests/unit/formatters.test.ts` | Unit |
| Dashboard trend math (client) | `client/tests/unit/trend-compute.test.ts` | Unit |
| Suggest Routes logic (client, script 01) | `client/tests/unit/vehicleLogic.test.ts` | Unit |
| `/api/trips` envelopes + status codes | `server/tests/integration/trip-api.test.js` | Integration |
| `/api/auth/*` endpoints | `server/tests/integration/auth-api.test.js` | Integration |
| `/api/orders` endpoints | `server/tests/integration/order-api.test.js` | Integration |
| `/api/routes`, `/api/drivers` | `server/tests/integration/{route,driver}-api.test.js` | Integration |
| `/api/fuel_logs`, `/api/efficiency` | `server/tests/integration/{fuel-log,efficiency}-api.test.js` | Integration |
| `/api/managers` (+ authenticated `/me`) | `server/tests/integration/manager-api.test.js` | Integration |
| `authenticate` middleware contract | `server/tests/integration/auth-middleware.test.js` | Integration |
| Dashboard date-range preset switching | `liveDashboard.spec.ts` (bonus test) | E2E |
| Full Summary PDF download | `reportGeneration.spec.ts` (bonus test) | E2E |

## Coverage summary

- 21 scripted cases: **6 automated green**, **3 automated with deviations**, **1 failing as
  a deliberate defect marker**, **11 blocked by design defects**.
- The blocked count is the headline for project management: more than half the scripted
  behavior has no implementation to test. Decisions on DD-01, DD-04, DD-05 (build vs
  respecify) unblock 9 of the 11.
