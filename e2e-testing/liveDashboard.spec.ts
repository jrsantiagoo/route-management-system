import { test, expect, Page } from '@playwright/test';

const METRICS = [
  'Total Successful Trips',
  'Efficiency',
  'Delivered Orders',
  'Average Distance per Order (km)',
  'Average Fuel Usage per Order (L)',
] as const;

async function openDateRange(page: Page) {
  await page
    .locator('button')
    .filter({ hasText: /^(Today|This Week|This Month|This Year|All Time)$/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'Date Range' })).toBeVisible();
}

async function dismissPopover(page: Page) {
  await page.getByRole('heading', { name: 'Dashboard' }).click();
  await expect(page.getByRole('heading', { name: 'Date Range' })).toBeHidden();
}

test.describe('Live Dashboard', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
      timeout: 30_000,
    });
  });

  test('5-1 the dashboard loads with its title, controls and every metric panel', async ({
    page,
  }) => {
    await expect(page.getByText('Performance metrics and analytics')).toBeVisible();

    for (const label of METRICS) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }

    await expect(page.getByRole('button', { name: 'Full Summary' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Date Range' })).toHaveCount(0);
  });

  test('5-3 every stat card renders a numeric value', async ({ page }) => {
    const values = page.locator('p.text-3xl');
    await expect(values).toHaveCount(3);

    for (let i = 0; i < 3; i += 1) {
      await expect(values.nth(i)).toHaveText(/\d/);
    }

  });

  test('5-4 the efficiency card shows a period-over-period comparison', async ({ page }) => {
    await expect(page.getByText(/compared to (yesterday|last week|last month|last year)/)).toBeVisible();
  });

  test('5-5 the comparison subtitle is hidden when the range has no comparable period', async ({
    page,
  }) => {
    await openDateRange(page);
    await page.getByRole('button', { name: 'All Time', exact: true }).click();
    await dismissPopover(page);

    await expect(page.getByText(/compared to/)).toHaveCount(0);
    await expect(page.getByText('Efficiency', { exact: true })).toBeVisible();
  });

  test('5-6 switching the date-range preset updates the active range label', async ({ page }) => {
    await openDateRange(page);
    await page.getByRole('button', { name: 'This Month', exact: true }).click();
    await dismissPopover(page);

    await expect(
      page
        .locator('button')
        .filter({ hasText: /^This Month$/ })
        .first(),
    ).toBeVisible();
    await expect(page.getByText('Total Successful Trips', { exact: true })).toBeVisible();
  });

  test('5-7 both analytics charts render with their legends', async ({ page }) => {
    await expect(page.getByText('Average Distance per Order (km)', { exact: true })).toBeVisible();
    await expect(page.getByText('Average Fuel Usage per Order (L)', { exact: true })).toBeVisible();
    await expect(page.locator('.recharts-responsive-container')).toHaveCount(2);
    await expect(page.getByText('Trend (3-day avg)').first()).toBeVisible();
  });

  test('5-8 the orders table renders on the dashboard', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
  });

  test('5-9 the date-range popover closes when clicking outside it', async ({ page }) => {
    await openDateRange(page);
    await page.getByRole('heading', { name: 'Dashboard' }).click();
    await expect(page.getByRole('heading', { name: 'Date Range' })).toBeHidden();
  });

  test('5-10 selecting a preset closes the date-range popover', async ({ page }) => {
    await openDateRange(page);
    await page.getByRole('button', { name: 'Today', exact: true }).click();

    await expect(
      page.getByRole('heading', { name: 'Date Range' }),
      'preset selection leaves the popover open (RMS-81)',
    ).toBeHidden({ timeout: 5_000 });
  });

  test.fixme(
    '5-2 metrics update in real time after a delivery is completed (no manual refresh)',
    async () => {},
  );
});
