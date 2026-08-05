# Software Design Defect Report

**Project:** Route Management System
**Prepared by:** QA Team (Ivan Reyes)
**Date:** 2026-07-04
**Jira tracking:** epic [RMS-39](https://route-management-system.atlassian.net/browse/RMS-39), deliverable task RMS-68. Each defect below is filed as a Jira Bug labeled `design-defect`.

## Scope and definition

A **design defect** is a gap between the approved test scripts / requirements and what the
software was designed and built to do — the feature was never designed in, so no amount of
bug-fixing closes it. This is distinct from the runtime defects in the
[Bug Report](bug-report.md), where implemented behavior violates the spec.

Evidence source: authoring the automated e2e suite (`e2e-testing/*.spec.ts`) against test
scripts 01–05. Every `test.fixme` in that suite marks a case that cannot be executed because
of a defect listed here.

## Defects

### DD-01 — Route generation lacks multi-driver stop distribution (RMS-71)

- **Spec:** Script 01, cases 1-3 / 1-4 — "Generate Routes" accepts a driver list and
  distributes stops across drivers (10 stops over 2 drivers, none unassigned; 5 drivers over
  3 stops, 2 shown unassigned).
- **Design as built:** the Suggest Routes modal (`/route-tool`) generates route-card options
  from the delivery week's *vehicle* configuration. There is no driver-list input, no
  per-driver distribution, and no unassigned-driver display.
- **Impact:** cases 1-3 and 1-4 unexecutable (`routeGeneration.spec.ts`, `test.fixme`).
- **Recommendation:** decide whether route generation should be driver-aware (build) or
  vehicle-based (respecify the script). This is the single largest divergence between the
  test scripts and the product.

### DD-02 — Empty-stops error copy mismatch (RMS-72)

- **Spec:** Script 01, case 1-2 — expected message "No stops provided. Please upload a stop list."
- **Design as built:** "No routes available for this week's vehicle configuration."
  Behavior (no routes generated) is correct; only the copy diverges.
- **Impact:** automated test asserts the actual copy with a TODO; manual execution would
  record a cosmetic failure.
- **Recommendation:** low-cost alignment of UI copy or spec text.

### DD-03 — Map editor has no driver concept (RMS-73)

- **Spec:** Script 02, case 2-3 — reassign a stop from Driver A to Driver B on the map.
- **Design as built:** stops in the route tool are a flat list on a single route
  (`client/app/(protected)/route-tool/page.tsx`); drivers only attach later via trip
  assignment on the weekly grid.
- **Impact:** case 2-3 unexecutable (`manualRouteEditing.spec.ts`, `test.fixme`).

### DD-04 — Emergency Driver Ping module missing entirely (RMS-74)

- **Spec:** Script 03 (both cases) — Live Tracking screen, emergency pickup request, most
  available driver selection, driver ping, route update, driver-capacity model with a
  no-driver-available path.
- **Design as built:** none of these exist anywhere in client or server.
- **Impact:** the entire script is blocked (`emergencyDriverPing.spec.ts`, both `test.fixme`).
  This is a pending product feature, not a QA gap.

### DD-05 — No End-of-day / End-of-week report types (RMS-75)

- **Spec:** Script 04, cases 4-1, 4-2, 4-4, 4-5 — a Reports screen offering "End-of-day
  Report" and "End-of-week Report", zero-value reports for empty days, and separation of
  completed vs incomplete trips.
- **Design as built:** a single client-side "Full Summary" PDF export (jsPDF) on the
  dashboard, driven by the selected date range. No report-type selection, no
  completed/incomplete split.
- **Impact:** 4 of 6 cases blocked (`reportGeneration.spec.ts`, `test.fixme`).
- **Recommendation:** the existing date-range presets partially cover daily/weekly ranges —
  either build explicit report types or respecify around the range picker.

### DD-06 — No upper-management role (RMS-76)

- **Spec:** Script 04, case 4-6 — upper management logs in and downloads the most recent PDF.
- **Design as built:** single manager role (Supabase auth + `manager` profile). No role
  hierarchy; PDFs are generated on demand client-side and never persisted, so "most recent
  report" has no meaning.
- **Impact:** case 4-6 unexecutable.

### DD-07 — Dashboard missing spec'd time metrics (RMS-77)

- **Spec:** Script 05, case 5-3 — requires Total Trip Time, Average time per stop, and
  Average travel time per stop alongside the five implemented metrics.
- **Design as built:** dashboard renders five metrics (Total Successful Trips, Efficiency,
  Delivered Orders, Average Distance per Order, Average Fuel Usage per Order). No
  trip-duration data is captured in the Prisma schema, so the missing metrics need
  data-model work, not just UI.
- **Impact:** 5-3 passes only partially.
- **Spec defect within the script itself:** case 5-3 says "all five required metrics" then
  lists eight — corrected in the [revised test scripts](test-scripts.md).

### DD-08 — Dashboard is not real-time (RMS-78)

- **Spec:** Script 05, case 5-2 — metrics update after a delivery completes, with no manual
  refresh.
- **Design as built:** metric fetches run in `useEffect` hooks keyed only on the selected
  date range; no polling, websocket, or Supabase realtime subscription.
- **Impact:** case 5-2 unexecutable (`liveDashboard.spec.ts`, `test.fixme`).
- **Recommendation:** polling is the cheapest path to spec compliance; Supabase realtime
  channels on `trip`/`order` are the robust one.

## Summary table

| ID | Jira | Area | Blocked test cases | Severity* |
| --- | --- | --- | --- | --- |
| DD-01 | RMS-71 | Route generation | 1-3, 1-4 | Major |
| DD-02 | RMS-72 | Route generation | 1-2 (cosmetic) | Minor |
| DD-03 | RMS-73 | Map editor | 2-3 | Major |
| DD-04 | RMS-74 | Live tracking | 3-1, 3-2 | Critical (module absent) |
| DD-05 | RMS-75 | Reports | 4-1, 4-2, 4-4, 4-5 | Major |
| DD-06 | RMS-76 | Auth/roles | 4-6 | Major |
| DD-07 | RMS-77 | Dashboard | 5-3 (partial) | Moderate |
| DD-08 | RMS-78 | Dashboard | 5-2 | Moderate |

\* Severity is relative to spec coverage, not production risk: "Critical" means an entire
scripted module has no implementation to test.
