/*
  Manual Route Editing — Playwright tests

  These tests drive the real Routing Tool UI at /route-tool.
  Login was removed (not yet implemented), so tests navigate straight to the page.

  Cases 3 (driver reassignment), and 5 (last-stop guard) are not yet
  implemented in the code, so they are written as test.fixme placeholders below.
*/

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000/route-tool';

test.describe('Manual Route Editing', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Open the generated route on the map. The tool seeds two default stops.
    await page.goto(BASE_URL);

    // Wait until the seeded route plan is visible before editing.
    await expect(page.getByText('De La Salle University')).toBeVisible();
    await expect(page.getByText('Rizal Park')).toBeVisible();
  });

  // Case 1: Add a Stop to an Existing Route
  test('Add a new delivery stop and recalculate metrics', async ({ page }) => {
    // 2. Enter edit mode, then open the add-stop popover.
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: /Add a stop/ }).click();

    // 3. Pick a saved location — selecting it confirms/adds the stop directly.
    //    The saved-location button's accessible name is "<name> <address>".
    await page.getByRole('button', { name: /Makati CBD/ }).click();

    // The new stop is now part of the route (inserted before the final stop).
    await expect(page.getByText('Makati CBD')).toBeVisible();

    // Route metrics (distance · duration) recalculate via OSRM after a short debounce.
    // The panel header shows e.g. "12.3 km · 45 min" once recalculation finishes.
    await expect(page.getByText(/\d+(\.\d+)?\s*(km|m)\s*·/)).toBeVisible({
      timeout: 20_000,
    });
  });

  // Case 2: Remove a Stop from a Route
  test('Remove a stop and update the route', async ({ page }) => {
    // 2. Enter edit mode so remove buttons appear.
    await page.getByRole('button', { name: 'Edit' }).click();

    // 3. Remove an existing stop. Note: removal is immediate — there is no
    //    "Confirm Removal" dialog in the current UI.
    await page.getByRole('button', { name: 'Remove Rizal Park' }).click();

    // The stop is gone from the route plan.
    await expect(page.getByText('Rizal Park')).toHaveCount(0);
  });

  // Case 4: Save Edited Route 
  test('Save an edited route shows a success toast', async ({ page }) => {
    // 1. Make a manual edit: add a stop.
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: /Add a stop/ }).click();
    await page.getByRole('button', { name: /SM Mall of Asia/ }).click();
    await expect(page.getByText('SM Mall of Asia')).toBeVisible();

    // 2. Click Save (requires the backend server to be running).
    await page.getByRole('button', { name: 'Save route' }).click();

    // The edit is saved successfully.
    await expect(page.getByText('Route saved successfully.')).toBeVisible();
  });

  // Case 3: Reassign a Stop to a Different Driver: NOT YET IMPLEMENTED 
  // The app has no concept of drivers or per-driver routes yet — there is no
  // reassignment control in the UI. This is a placeholder for that feature.
  test.fixme('Reassign a stop from Driver A to Driver B', async () => {
    // TODO: implement once driver assignment exists in the routing tool.
  });

  // Case 5: Remove the last stop on a route: NOT YET IMPLEMENTED 
  // The current handleRemoveStop simply filters the stop out with no guard, so
  // a route can be reduced to zero stops; there is no graceful rejection.
  // This test encodes the INTENDED behavior and is skipped until the guard exists.
  test.fixme('Reject removing the final stop on a route', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();

    // Reduce the route down to a single stop.
    await page.getByRole('button', { name: 'Remove Rizal Park' }).click();
    await expect(page.getByText('Rizal Park')).toHaveCount(0);

    // Attempt to remove the only remaining stop.
    await page.getByRole('button', { name: 'Remove De La Salle University' }).click();

    // EXPECTED once a guard exists: removal is rejected and the stop remains.
    await expect(page.getByText('De La Salle University')).toBeVisible();
  });
});
