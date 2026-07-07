// Test script 02-ManualRouteEditing — routing tool at /route-tool.
// 2-3 is fixme (no driver concept, DD-03); 2-5 asserts the missing
// last-stop guard and fails until it ships (BR-01/RMS-79); 2-4 asserts
// persistence after reload and fails until saved routes load back (BR-07/RMS-83).

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/route-tool';
const METRIC_DISTANCE_PATTERN = /\d+(?:\.\d+)?\s*(?:km|m)\s*·/;

test.describe('Manual Route Editing', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto(BASE_URL);

    // wait for the two seeded default stops before editing
    await expect(page.getByText('De La Salle University')).toBeVisible();
    await expect(page.getByText('Rizal Park')).toBeVisible();
  });

  // Case 2-1: Add a Stop to an Existing Route
  test('Add a new delivery stop and recalculate metrics', async ({ page }: { page: Page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: /Add a stop/ }).click();
    await page.getByRole('button', { name: /Makati CBD/ }).click();

    await expect(page.getByText('Makati CBD')).toBeVisible();

    // metrics recalculate after a short debounce
    const headerMetrics = page
      .getByText('Route Plan', { exact: true })
      .locator('xpath=following-sibling::span');
    await expect(headerMetrics).toHaveText(METRIC_DISTANCE_PATTERN, { timeout: 20_000 });
  });

  // Case 2-2: Remove a Stop from a Route
  test('Remove a stop and update the route', async ({ page }: { page: Page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: 'Remove Rizal Park' }).click();

    await expect(page.getByText('Rizal Park')).toBeHidden();
  });

  // Case 2-4: Save Edited Route — save reports success, but the tool re-seeds
  // from DEFAULT_STOPS on every mount and never loads a saved route back, so
  // the persistence assertion fails by design until BR-07/RMS-83 is fixed.
  test('Save an edited route and persist it across reload', async ({ page }: { page: Page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: /Add a stop/ }).click();
    await page.getByRole('button', { name: /SM Mall of Asia/ }).click();
    await expect(page.getByText('SM Mall of Asia')).toBeVisible();
    await page.getByRole('button', { name: 'Done Editing' }).click();

    // the real save path: toolbar save icon → name modal → Save Route
    // (exact: true keeps the two save buttons apart — aria-label "Save route"
    // on the toolbar vs. the modal's "Save Route")
    await page.getByRole('button', { name: 'Save route', exact: true }).click();
    const routeName = `QA e2e save ${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await page.locator('#route-name').fill(routeName);
    await page.getByRole('button', { name: 'Save Route', exact: true }).click();
    await expect(page.getByText('Route saved successfully.')).toBeVisible();

    // the edit must survive a refresh (test script 02, case 2-4 Expected)
    await page.reload();
    await expect(page.getByText('SM Mall of Asia')).toBeVisible();
  });

  // Case 2-3: blocked — the map editor has no driver concept yet
  test.fixme('Reassign a stop from Driver A to Driver B', async () => {});

  // Case 2-5: known defect — no last-stop guard exists, so this fails until fixed
  test('Reject removing the final stop on a route', async ({ page }: { page: Page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: 'Remove Rizal Park' }).click();
    await expect(page.getByText('Rizal Park')).toBeHidden();

    // removing the only remaining stop should be rejected
    await page.getByRole('button', { name: 'Remove De La Salle University' }).click();
    await expect(page.getByText('De La Salle University')).toBeVisible();
  });
});
