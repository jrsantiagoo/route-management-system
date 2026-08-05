# Test Scripts (Revised)

**Project:** Route Management System
**Revision:** v2, 2026-07-04 (QA) — supersedes the original scripts 01–05
**Jira tracking:** RMS-70; execution stories RMS-40–RMS-44

## Changes from v1

1. **Test data defined.** v1 cited "static lists" without content; all scripts now reference
   the canonical data set in [test-db.md](test-db.md).
2. **5-3 fixed.** v1 said "all five required metrics" then listed eight. The requirement is
   now split: 5-3a (five implemented metrics) and 5-3b (three time metrics — currently a
   design defect, DD-07).
3. **Blocked cases annotated.** Cases that cannot be executed against the current build are
   marked ⛔ with their design-defect reference, so "Actual Results" columns don't silently
   stay empty.
4. **1-2 expected message** — resolved 2026-07-06: the spec was adapted to the implemented
   copy (DD-02/RMS-72 closed by respecification).
5. **New scripts 06–09** for previously unscripted modules: authentication, order
   management, fuel logging, trip assignment.

Execution rule: for each case, record Actual Results, Performed by, and Date in the matching
Jira sub-task (RMS-45–RMS-64), and file deviations per the template in
[bug-report.md](bug-report.md).

---

## 01 — Route Generation (RMS-40)

**Screen:** Route Generation (Suggest Routes modal, `/route-tool`) · **Designed by:** Ivan Reyes
**Objective:** verify optimized route generation from valid vehicle/driver/stop inputs.

| # | Description | Steps | Expected |
| --- | --- | --- | --- |
| 1-1 | Valid route generation | Log in as manager → valid vehicles, drivers, stops ([test-db.md](test-db.md)) → Generate Routes | Optimized route cards produced; routes shown on map after Apply |
| 1-2 | Missing stops list | Valid vehicles + drivers, empty stop list → Generate Routes | No routes generated; error shown: "No routes available for this week's vehicle configuration." (copy respecified to the implementation, DD-02/RMS-72, 2026-07-06) |
| 1-3 ⛔ | More stops than drivers | 2 drivers (D-01, D-02), 10 stops → Generate | All 10 stops distributed across the 2 drivers; none unassigned. **Blocked:** DD-01/RMS-71 |
| 1-4 ⛔ | More drivers than stops | 5 drivers, 3 stops → Generate | 3 drivers assigned; 2 shown as unassigned. **Blocked:** DD-01/RMS-71 |

## 02 — Manual Route Editing (RMS-41)

**Screen:** Route Management / Map Editor (`/route-tool`) · **Designed by:** Benedict Santos
**Objective:** verify manual editing of generated routes — add, remove, reorder, reassign stops.

| # | Description | Steps | Expected |
| --- | --- | --- | --- |
| 2-1 | Add a stop | Open QA Baseline Route → Edit → Add a stop → pick Makati CBD | Stop added; map updates; distance/time/fuel metrics recalculated |
| 2-2 | Remove a stop | Edit → remove Rizal Park | Stop removed; map and metrics update |
| 2-3 ⛔ | Reassign stop to another driver | Select stop on Driver A's route → reassign to Driver B | Stop moves to Driver B; both routes update on map. **Blocked:** DD-03/RMS-73 |
| 2-4 | Save edited route | Make any edit → Done Editing / Save → refresh page | Edit persists after refresh/revisit. Currently FAILS: BR-07/RMS-83 |
| 2-5 | Remove the last stop | Open QA Single-Stop Route → Edit → remove the only stop | **Rejected** — zero-stop route cannot exist. Currently FAILS: BR-01/RMS-79 |

## 03 — Emergency Driver Ping (RMS-42) — module blocked (DD-04/RMS-74)

**Screen:** Route Management / Live Tracking · **Designed by:** Ivan Reyes
**Objective:** verify the most available driver is identified and pinged for an emergency pickup.

| # | Description | Steps | Expected |
| --- | --- | --- | --- |
| 3-1 ⛔ | Valid emergency pickup | ≥1 active route with drivers en route → trigger emergency pickup → enter location → submit | Most available driver identified; ping sent with location; driver's route updated |
| 3-2 ⛔ | No available driver | All drivers at max capacity → trigger emergency pickup → submit | Stop unassigned; manager sees "no driver currently available" message |

## 04 — Report Generation (RMS-43)

**Screen:** Reports / PDF export (dashboard Full Summary today) · **Designed by:** Ivan Christian Narito
**Objective:** verify report metrics are accurate and only completed/valid data is counted.

| # | Description | Steps | Expected |
| --- | --- | --- | --- |
| 4-1 ⛔ | Daily PDF, complete data | ≥1 completed trip today → Reports → End-of-day Report → Generate PDF | PDF with total successful trips, efficiency, orders delivered, avg distance/order, avg fuel/order; correct date in header. **Blocked:** DD-05/RMS-75 |
| 4-2 ⛔ | Weekly PDF, complete data | Reports → End-of-week Report → Generate PDF | Complete weekly data, correctly summed/averaged; date range matches week. **Blocked:** DD-05/RMS-75 |
| 4-3 | In-app summary, no download | Reports/dashboard → view on-screen summary only | All metrics readable and correct in-app |
| 4-4 ⛔ | Report with zero completed trips | Day with no completed trips → attempt daily PDF | Report explicitly states zero values; no crash or malformed PDF. **Blocked:** DD-05/RMS-75 |
| 4-5 ⛔ | Daily PDF, partial completion | ≥1 completed and ≥1 incomplete trip today → End-of-day PDF | Completed trips in metrics; incomplete/unassigned listed separately, excluded from metrics. **Blocked:** DD-05/RMS-75 |
| 4-6 ⛔ | Upper-management access | Log in as upper management → Reports → download latest PDF | Download succeeds; content matches manager's report. **Blocked:** DD-06/RMS-76 |

## 05 — Live Dashboard (RMS-44)

**Screen:** Live Dashboard (`/dashboard`) · **Designed by:** Benedict Santos
**Objective:** verify the dashboard displays and updates delivery metrics.

| # | Description | Steps | Expected |
| --- | --- | --- | --- |
| 5-1 | Dashboard load | Log in → Live Dashboard | Loads without errors; all metric panels, date-range picker, Full Summary visible |
| 5-2 ⛔ | Real-time metric update | Open dashboard → complete a delivery → observe | Metrics update in near real time, no manual refresh. **Blocked:** DD-08/RMS-78 |
| 5-3a | Implemented metrics displayed | Review metric cards | Five metrics present: Total Successful Trips, Efficiency, Delivered Orders, Average Distance per Order (km), Average Fuel Usage per Order (L) |
| 5-3b ⛔ | Time metrics displayed | Review metric cards | Total Trip Time, Average time per stop, Average travel time per stop. **Blocked:** DD-07/RMS-77 |
| 5-4 *(new)* | Date-range preset switch | Change preset This Week → This Month | Range label updates; metrics refetch; no crash/blank state |

---

## New scripts for unscripted modules

### 06 — Authentication & Profile *(proposed)*

**Screen:** Login / Profile · **Objective:** verify login, logout, token refresh, password change.

| # | Description | Steps | Expected |
| --- | --- | --- | --- |
| 6-1 | Valid manager login | Enter valid credentials → Sign In | Redirect to /dashboard; tokens stored |
| 6-2 | Invalid credentials | Wrong password → Sign In | Error shown; no redirect; no tokens stored |
| 6-3 | Logout | Log in → Logout | Tokens cleared; protected pages redirect to login |
| 6-4 | Expired-token refresh | With expired access token, call a protected page | Token silently refreshed via /api/auth/refresh; request retried once |
| 6-5 | Change password | Profile → change password → re-login with new password | Old password rejected; new password accepted |
| 6-6 | Direct API without token | `GET /api/trips` with no Authorization header | 401/403 — currently FAILS (BR-03/RMS-37: middleware not mounted) |

### 07 — Order Management *(proposed)*

| # | Description | Steps | Expected |
| --- | --- | --- | --- |
| 7-1 | Order table loads | Log in → Orders page | Orders from backend displayed with statuses |
| 7-2 | Create order | Create a valid order | Appears in table; persisted after refresh |
| 7-3 | Update order status | Change an order's status through each `OrderStatus` value | Each valid transition accepted; invalid enum rejected with a clear error |
| 7-4 | Soft-deleted orders hidden | Soft-delete an order (deleted_at set) | Order disappears from all lists and metrics |

### 08 — Fuel Logging *(proposed)*

| # | Description | Steps | Expected |
| --- | --- | --- | --- |
| 8-1 | Create fuel log | Add a log with distance and liters | Saved; fuel analytics update |
| 8-2 | Zero/negative inputs | Try 0 or negative liters/distance | Rejected with validation error; no divide-by-zero anywhere (efficiency guard is unit-tested) |
| 8-3 | Fuel analytics aggregation | Seed known logs ([test-db.md](test-db.md)) → check dashboard fuel metrics | Values match hand-computed averages |

### 09 — Trip Assignment *(proposed)*

| # | Description | Steps | Expected |
| --- | --- | --- | --- |
| 9-1 | Assign trip to driver | Assignment grid → assign unassigned trip to D-01 | Trip appears in D-01's day cell; persisted |
| 9-2 | Double assignment rejected | Assign an already-assigned trip to D-02 | Rejected: "Trip is already assigned" (unit/integration tested) |
| 9-3 | Unassign trip | Unassign the trip | Returns to unassigned pool; grid updates |
| 9-4 | Grid grouping | Seed trips per [test-db.md](test-db.md) | Trips grouped by driver × weekday exactly as seeded |
