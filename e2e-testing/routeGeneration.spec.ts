// Test script 01-RouteGeneration — the Suggest Routes modal on /route-tool.
// 1-3 and 1-4 are fixme: per-driver stop distribution doesn't exist yet.

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// override with TEST_MANAGER_EMAIL / TEST_MANAGER_PASSWORD
const MANAGER_EMAIL    = process.env.TEST_MANAGER_EMAIL    ?? 'admin@gmail.com';
const MANAGER_PASSWORD = process.env.TEST_MANAGER_PASSWORD ?? 'admin';

async function login(page: Page): Promise<void> {
  await page.goto(BASE_URL);
  await page.locator('#email').fill(MANAGER_EMAIL);
  await page.locator('#password').fill(MANAGER_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
  await page.goto(`${BASE_URL}/route-tool`);
}

async function openSuggestModal(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Suggest Routes' }).click();
  await expect(page.getByText('Automated delivery route planning')).toBeVisible();
}

test.describe('Route Generation', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    // Wait for the two default stops (DLSU → Rizal Park) to seed the route.
    await expect(page.getByText('De La Salle University')).toBeVisible();
    await expect(page.getByText('Rizal Park')).toBeVisible();
  });

  // Case 1-1: Valid Route Generation
  test('generates optimised route cards when stops and fleet are available', async ({ page }) => {
    await openSuggestModal(page);

    await expect(page.getByText('Fleet this week:')).toBeVisible();

    await page.getByRole('button', { name: 'Generate' }).click();

    await expect(page.getByText('Route A – Fastest')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('button', { name: 'Apply' }).first()).toBeVisible();
  });

  // Case 1-2: Missing Stops List
  test('shows an empty-state message when there are no stops to route', async ({ page }) => {
    // Remove both default stops so the route is empty.
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: 'Remove Rizal Park' }).click();
    await page.getByRole('button', { name: 'Remove De La Salle University' }).click();

    await openSuggestModal(page);
    await page.getByRole('button', { name: 'Generate' }).click();

    await expect(page.getByText('Route A – Fastest')).toHaveCount(0);

    // spec copy differs: "No stops provided. Please upload a stop list."
    await expect(
      page.getByText(/no routes available for this week/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  // Case 1-3: More Stops Than Drivers (10 stops, 2 drivers)
  test.fixme('distributes all stops across available drivers when stops outnumber drivers', async ({ page }) => {
    await openSuggestModal(page);
    await page.getByRole('button', { name: 'Generate' }).click();

    await expect(page.getByText(/unassigned stop/i)).toHaveCount(0);
    await expect(page.locator('[data-testid="driver-route-card"]')).toHaveCount(2);
  });

  // Case 1-4: More Drivers Than Stops (5 drivers, 3 stops)
  test.fixme('marks excess drivers as unassigned when drivers outnumber stops', async ({ page }) => {
    await openSuggestModal(page);
    await page.getByRole('button', { name: 'Generate' }).click();

    await expect(page.locator('[data-testid="driver-route-card"]')).toHaveCount(3);
    await expect(page.locator('[data-testid="driver-unassigned-card"]')).toHaveCount(2);
  });

});
