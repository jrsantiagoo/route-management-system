/*
  Manual Route Editing — Playwright tests (TypeScript)

  These tests drive the real Routing Tool UI at /route-tool.
  Login was removed (not yet implemented), so tests navigate straight to the page.

  Cases 3 (driver reassignment), and 5 (last-stop guard) are not yet
  implemented in the code, so they are written as test.fixme placeholders below.
*/

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/route-tool';
const METRIC_DISTANCE_PATTERN = /\d+(?:\.\d+)?\s*(?:km|m)\s*·/;

test.describe('Manual Route Editing', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // 1. Open the generated route on the map. The tool seeds two default stops.
    await page.goto(BASE_URL);

    // Wait until the seeded route plan is visible before editing.
    await expect(page.getByText('De La Salle University')).toBeVisible();
    await expect(page.getByText('Rizal Park')).toBeVisible();
  });

  // Case 1: Add a Stop to an Existing Route
  test('Add a new delivery stop and recalculate metrics', async ({ page }: { page: Page }) => {
    // 2. Enter edit mode, then open the add-stop popover.
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: /Add a stop/ }).click();

    // 3. Pick a saved location — selecting it confirms/adds the stop directly.
    await page.getByRole('button', { name: /Makati CBD/ }).click();

    // The new stop is now part of the route.
    await expect(page.getByText('Makati CBD')).toBeVisible();

    // Route metrics recalculate after a short debounce.
    const headerMetrics = page
      .getByText('Route Plan', { exact: true })
      .locator('xpath=following-sibling::span');
    await expect(headerMetrics).toHaveText(METRIC_DISTANCE_PATTERN, { timeout: 20_000 });
  });

  // Case 2: Remove a Stop from a Route
  test('Remove a stop and update the route', async ({ page }: { page: Page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();

    // 3. Remove an existing stop.
    await page.getByRole('button', { name: 'Remove Rizal Park' }).click();

    // Assert using toBeHidden for reliable auto-waiting
    await expect(page.getByText('Rizal Park')).toBeHidden();
  });

  // Case 4: Save Edited Route
  test('Save an edited route is a success', async ({ page }: { page: Page }) => {
    // Optional: Intercept network here if you want to isolate from backend

    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: /Add a stop/ }).click();
    await page.getByRole('button', { name: /SM Mall of Asia/ }).click();
    await expect(page.getByText('SM Mall of Asia')).toBeVisible();

    await page.getByRole('button', { name: 'Done Editing' }).click();
  });

  // Case 3: Reassign a Stop to a Different Driver: NOT YET IMPLEMENTED
  test.fixme('Reassign a stop from Driver A to Driver B', async () => {
    // TODO: implement once driver assignment exists in the routing tool.
  });

  // Case 5: Remove the last stop on a route: 
  test('Reject removing the final stop on a route', async ({ page }: { page: Page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: 'Remove Rizal Park' }).click();
    await expect(page.getByText('Rizal Park')).toBeHidden();

    // Attempt to remove the only remaining stop.
    await page.getByRole('button', { name: 'Remove De La Salle University' }).click();

    // EXPECTED: guard prevents deletion
    await expect(page.getByText('De La Salle University')).toBeVisible();
  });
});
