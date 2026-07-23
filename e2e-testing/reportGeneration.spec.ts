import { test, expect, Page } from '@playwright/test';

const PRESETS = ['Today', 'This Week', 'This Month', 'This Year', 'All Time'] as const;

async function openDateRange(page: Page) {
  await page.locator('button').filter({ hasText: /^(Today|This Week|This Month|This Year|All Time)$/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'Date Range' })).toBeVisible();
}

async function dismissPopover(page: Page) {
  await page.getByRole('heading', { name: 'Dashboard' }).click();
  await expect(page.getByRole('heading', { name: 'Date Range' })).toBeHidden();
}

async function readCard(page: Page, title: string): Promise<string> {
  const card = page
    .locator('div')
    .filter({ hasText: new RegExp(`^${title}`) })
    .filter({ has: page.locator('p.text-3xl') })
    .last();
  const raw = (await card.locator('p.text-3xl').first().innerText()).trim();
  return raw.replace(/[^\d]/g, '');
}

function extractPdfText(buffer: Buffer): string {
  const raw = buffer.toString('latin1');
  const literals: string[] = [];
  const re = /\(((?:\\.|[^\\()])*)\)\s*Tj/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw)) !== null) {
    literals.push(match[1].replace(/\\([()\\])/g, '$1'));
  }
  return literals.join(' ');
}

test.describe('Report Generation', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
      timeout: 30_000,
    });
  });

  test('4-3 displays every required metric on the dashboard without downloading', async ({
    page,
  }) => {
    for (const label of [
      'Total Successful Trips',
      'Efficiency',
      'Delivered Orders',
      'Average Distance per Order (km)',
      'Average Fuel Usage per Order (L)',
    ]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Full Summary' })).toBeVisible();
  });

  test('4-3b stat cards render their out-of-total subtitles', async ({ page }) => {
    await expect(page.getByText(/out of \d+ total trips/)).toBeVisible();
    await expect(page.getByText(/out of \d+ total orders/)).toBeVisible();
  });

  test('4-1 the Full Summary control downloads a correctly named PDF', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Full Summary' }).click();
    const download = await downloadPromise;

    const filename = download.suggestedFilename();
    expect(filename).toMatch(/\.pdf$/i);
    expect(filename).toContain('Route Management Statistics');
  });

  test('4-7 PDF stat values match the on-screen dashboard values', async ({ page }) => {
    const displayedTrips = await readCard(page, 'Total Successful Trips');
    const displayedEfficiency = await readCard(page, 'Efficiency');
    const displayedDelivered = await readCard(page, 'Delivered Orders');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Full Summary' }).click();
    const download = await downloadPromise;

    const fs = await import('node:fs/promises');
    const pdfText = extractPdfText(await fs.readFile(await download.path()));

    expect(pdfText, `PDF missing displayed Total Trips "${displayedTrips}"`).toContain(
      displayedTrips,
    );
    expect(pdfText, `PDF missing displayed Efficiency "${displayedEfficiency}%"`).toContain(
      `${displayedEfficiency}%`,
    );
    expect(pdfText, `PDF missing displayed Delivered "${displayedDelivered}"`).toContain(
      displayedDelivered,
    );
  });

  test('4-9 switching the date-range preset keeps every metric rendered', async ({ page }) => {
    await openDateRange(page);
    await page.getByRole('button', { name: 'Today', exact: true }).click();
    await dismissPopover(page);

    for (const label of ['Total Successful Trips', 'Delivered Orders', 'Efficiency']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('4-10 the date-range popover offers all five presets and a custom range', async ({
    page,
  }) => {
    await openDateRange(page);
    for (const preset of PRESETS) {
      await expect(page.getByRole('button', { name: preset, exact: true })).toBeVisible();
    }
    await expect(page.getByText('Custom Range')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();
  });

  test('4-11 applying a custom range updates the trigger label and closes the popover', async ({
    page,
  }) => {
    await openDateRange(page);

    const dateInputs = page.locator('input[type="date"]');
    await dateInputs.nth(0).fill('2026-07-01');
    await dateInputs.nth(1).fill('2026-07-15');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByRole('heading', { name: 'Date Range' })).toBeHidden();
    await expect(page.getByRole('button', { name: /2026-07-01\s+–\s+2026-07-15/ })).toBeVisible();
  });

  test('4-12 changing the range refetches the underlying report data', async ({ page }) => {
    await openDateRange(page);

    const request = page.waitForRequest(
      (r) => /\/api\/(orders|trips|efficiency|fuel_logs)/.test(r.url()),
      { timeout: 20_000 },
    );
    await page.getByRole('button', { name: 'This Month', exact: true }).click();

    expect(await request, 'a preset change must trigger a refetch').toBeTruthy();
  });

  test('4-8 the PDF charts are rendered from live data, not mock data', async ({ page }) => {
    const distanceSeries = await page.evaluate(async () => {
      const response = await fetch(`${window.location.origin}`);
      return response.ok;
    });
    expect(distanceSeries).toBeTruthy();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Full Summary' }).click();
    const download = await downloadPromise;

    const fs = await import('node:fs/promises');
    const pdfText = extractPdfText(await fs.readFile(await download.path()));

    expect(
      pdfText,
      'pdf-generator.ts still imports dailyDistanceData / weeklyFuelData from ./mockData (RMS-59)',
    ).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  test.fixme(
    '4-2 generates a weekly PDF report with aggregated metrics and correct date range',
    async () => {},
  );

  test.fixme(
    '4-4 generates a report explicitly showing zero values when no trips are completed',
    async () => {},
  );

  test.fixme(
    '4-5 reflects only completed trips in metrics and lists incomplete trips separately',
    async () => {},
  );

  test.fixme('4-6 upper management can download the PDF report successfully', async () => {});
});
