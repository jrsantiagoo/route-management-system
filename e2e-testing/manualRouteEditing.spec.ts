// Test script 02-ManualRouteEditing — routing tool at /route-tool.
// 2-3 is fixme (no driver concept in the editor); 2-5 asserts the missing
// last-stop guard and fails until it ships.

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

  // Case 2-4: Save Edited Route
  test('Save an edited route is a success', async ({ page }: { page: Page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: /Add a stop/ }).click();
    await page.getByRole('button', { name: /SM Mall of Asia/ }).click();
    await expect(page.getByText('SM Mall of Asia')).toBeVisible();

    await page.getByRole('button', { name: 'Done Editing' }).click();
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
