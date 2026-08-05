# Bug Report

**Project:** Route Management System
**Prepared by:** QA Team (Ivan Reyes)
**Date:** 2026-07-04
**Jira tracking:** epic [RMS-39](https://route-management-system.atlassian.net/browse/RMS-39), deliverable task RMS-69. Each bug is filed as a Jira Bug labeled `bug`.

## Scope and definition

A **bug** here is a runtime defect: implemented behavior that violates the test scripts /
requirements when exercised. Design-level gaps (features never built) are in the
[SW Design Defect Report](sw-design-defect-report.md) instead.

This report grows as manual execution of scripts 01–05 records Actual Results; the bugs
below are those already confirmed by automation or code inspection.

## Bugs

### BR-01 — Route editor allows removing the final stop (RMS-79)

- **Found by:** Script 02, case 2-5 (Jira sub-task RMS-55)
- **Severity:** Major — produces an invalid domain state (zero-stop route)
- **Expected:** removing the only remaining stop is rejected; a zero-stop route cannot exist.
- **Actual:** `handleRemoveStop` in `client/app/(protected)/route-tool/page.tsx` filters the
  stop out unconditionally; when fewer than 2 stops remain the map simply clears. No guard,
  no error.
- **Repro:** open `/route-tool` → Edit → Remove Rizal Park → Remove De La Salle University →
  last stop deletes silently.
- **Automation:** the test in `e2e-testing/manualRouteEditing.spec.ts` asserts the spec'd
  behavior and **fails by design** — it is the living defect marker; it goes green when the
  guard ships.

### BR-02 — Register endpoint references undefined name fields (RMS-36)

- **Found by:** code inspection of the auth controller
- **Severity:** Major — registration path crashes/misbehaves
- **Actual:** the register endpoint references name fields that are never defined in the
  request handling, so manager profile creation does not receive the intended values.
- **Status:** previously filed as RMS-36 (To Do). The auth-middleware integration tests
  added under `server/tests/integration/` pin down the surrounding contract.

### BR-03 — Auth middleware not enforced on protected API routes (RMS-37)

- **Found by:** code inspection of `server/src/server.js` / route files
- **Severity:** Critical — security: every `/api/*` endpoint except auth flows is callable
  without a token, because the `authenticate` middleware exists
  (`server/src/middleware/auth.js`) but is not mounted on any router.
- **Expected:** all non-auth API routes require a valid `Authorization: Bearer` token.
- **Status:** previously filed as RMS-37 (To Do). The middleware's own contract is now
  covered by `server/tests/integration/auth-middleware.test.js` (401 missing/malformed
  header, 403 invalid token, pass-through valid, 500 on Supabase failure), so mounting it is
  a low-risk change.

### BR-04 — Client-side auth guard checks token presence only (RMS-80)

- **Found by:** automated e2e run diagnosis, 2026-07-06
- **Severity:** Major — security/auth gap; complements BR-03
- **Expected:** protected pages require a valid session; with an absent *or invalid* token
  the user is redirected to login before protected content is rendered or usable.
- **Actual:** the only client-side guard is the Topbar profile effect
  (`client/components/ui/topbar.tsx:27-33`). It redirects only when
  `localStorage.access_token` is **missing**, and only after the protected page has fully
  rendered. An invalid/expired token never redirects — the profile fetch fails silently and
  the entire protected UI stays usable. Combined with BR-03, auth is effectively decorative
  end-to-end.
- **Repro:** without logging in, `localStorage.setItem("access_token", "garbage")` on
  `localhost:3000` → visit `/dashboard` or `/route-tool` → full UI usable, no redirect.
- **Automation note:** the delayed redirect on the missing-token path is what tore down
  `manualRouteEditing.spec.ts` mid-test before the suite switched to a shared
  `storageState` session.

### BR-05 — Date-range popover stays open after choosing a preset (RMS-81)

- **Found by:** e2e `liveDashboard.spec.ts` strict-mode failure (two "This Month" buttons),
  2026-07-06
- **Severity:** Minor — UX inconsistency
- **Expected:** selecting a preset applies the range and closes the popover, as the
  custom-range Apply button does.
- **Actual:** `handlePresetClick` in `client/components/dashboard/date-range-picker.tsx`
  never calls `setOpen(false)`; the popover closes only on outside click or Apply, leaving
  two identically-named buttons on the page (trigger + selected preset).
- **Repro:** `/dashboard` → click the range trigger ("This Week") → click "This Month" →
  popover remains open.

### BR-06 — Order creation ignores its own validation failure (RMS-82)

- **Found by:** code inspection while writing `order-api.test.js`, 2026-07-06
- **Severity:** Major — invalid orders are persisted despite the client receiving a 400
- **Expected:** missing `client`/`destination`/`packageContent` → 400 and no order created.
- **Actual:** the validation branch in `createOrder`
  (`server/src/controllers/order-controller.js:47-51`) sends the 400 without `return`,
  so the order is still created (with undefined fields) and the second response throws
  "Cannot set headers after they are sent". Message also has a typo ("Fields inclomplete").
- **Automation:** `order-api.test.js` asserts the 400; the no-creation assertion is an
  `it.todo` to enable once fixed. Fix = `return` before the 400 response.

### BR-07 — Saved route edits do not persist across reload (RMS-83)

- **Found by:** Script 02, case 2-4 (persistence assertion added under RMS-67), 2026-07-07
- **Severity:** Major — save reports success but the result is unreachable from the UI
- **Expected:** make an edit → save → refresh; the edit persists after refresh/revisit.
- **Actual:** the save flow works (`handleConfirmSave` writes localStorage and POSTs to
  `/api/routes`, success toast shown), but the route tool seeds its stop list from the
  hardcoded mock (`client/app/(protected)/route-tool/page.tsx:32`, `DEFAULT_STOPS`) on every
  mount and has no way to load a saved route back into the editor.
- **Repro:** `/route-tool` → Edit → Add SM Mall of Asia → Done Editing → save icon → name →
  Save Route → refresh → stop list is back to the two defaults.
- **Automation:** case 2-4 in `e2e-testing/manualRouteEditing.spec.ts` drives the full save
  flow and asserts the stop survives `page.reload()`; it **fails by design** (same living
  defect-marker pattern as BR-01) until saved routes load back.

## Reporting template for new bugs

When manual execution finds a new bug, file a Jira Bug under RMS-39 with label `bug` and add
a row here:

| Field | Content |
| --- | --- |
| Summary | One-line behavior violation |
| Found by | Script / case number + Jira sub-task |
| Severity | Critical / Major / Moderate / Minor |
| Expected | Per test script |
| Actual | Observed behavior, with file:line where known |
| Repro | Numbered steps from a clean seed (see [test-db.md](test-db.md)) |

## Summary table

| ID | Jira | Area | Severity | Status |
| --- | --- | --- | --- | --- |
| BR-01 | RMS-79 | Route editor | Major | Open |
| BR-02 | RMS-36 | Auth/registration | Major | Open (To Do) |
| BR-03 | RMS-37 | API security | Critical | Open (To Do) |
| BR-04 | RMS-80 | Client auth | Major | Open |
| BR-05 | RMS-81 | Dashboard UX | Minor | Open |
| BR-06 | RMS-82 | Orders API | Major | Open |
| BR-07 | RMS-83 | Route editor | Major | Open |
