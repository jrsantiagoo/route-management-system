import { test, expect, Page } from '@playwright/test';

const STORAGE_KEY = 'acesoft_savedRoutes';

const SEED_STOPS = [
  {
    id: 'loc-000',
    name: 'De La Salle University',
    address: '2401 Taft Ave, Malate, Manila 1004',
    lat: 14.5643,
    lng: 120.9938,
  },
  {
    id: 'loc-001',
    name: 'Rizal Park',
    address: 'Roxas Blvd, Ermita, Manila 1000',
    lat: 14.5832,
    lng: 120.9794,
  },
];

function uniqueName(prefix = 'QA route') {
  return `${prefix} ${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

async function writeRoute(page: Page, name: string, archived: boolean) {
  await page.evaluate(
    ({ key, routeName, isArchived, stops }) => {
      const id = `route-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const all = JSON.parse(localStorage.getItem(key) ?? '[]');
      all.push({
        id,
        id_: id,
        name: routeName,
        stops,
        segments: [],
        totalDistanceKm: 5.2,
        totalDurationMinutes: 18,
        vehicleType: 'car',
        assignedWeek: '',
        createdAt: new Date().toISOString(),
        archived: isArchived,
      });
      localStorage.setItem(key, JSON.stringify(all));
    },
    { key: STORAGE_KEY, routeName: name, isArchived: archived, stops: SEED_STOPS },
  );
}

async function seedRoute(page: Page, name: string, archived = false) {
  await writeRoute(page, name, archived);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Route Creation' })).toBeVisible({
    timeout: 30_000,
  });
}

test.describe('Saved Routes', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/route-tool');
    await expect(page.getByRole('heading', { name: 'Route Creation' })).toBeVisible({
      timeout: 30_000,
    });
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Route Creation' })).toBeVisible({
      timeout: 30_000,
    });
  });

  test('SR-01 an empty route list shows the empty-state prompt', async ({ page }) => {
    await expect(page.getByText('No saved routes yet.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create New Route' })).toBeVisible();
  });

  test('SR-02 the saved-routes table renders all four column headers', async ({ page }) => {
    await seedRoute(page, uniqueName());
    for (const header of ['Route Name', 'Stops', 'Tags', 'Date Created']) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }
  });

  test('SR-03 Create New Route opens the editor seeded with the two default stops', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Create New Route' }).click();

    await expect(page.getByRole('heading', { name: 'Create Route' })).toBeVisible();
    await expect(page.getByText('De La Salle University')).toBeVisible();
    await expect(page.getByText('Rizal Park')).toBeVisible();
    await expect(page.getByText('Route Plan', { exact: true })).toBeVisible();
  });

  test('SR-04 the save dialog rejects an empty route name', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Route' }).click();
    await page.getByRole('button', { name: 'Create Route', exact: true }).last().click();

    await expect(page.getByRole('heading', { name: 'Name Your Route' })).toBeVisible();
    await page.locator('#route-name').fill('   ');
    await expect(page.getByText('Route name is required.')).toBeVisible();
  });

  test('SR-05 the save dialog rejects a duplicate name regardless of case', async ({ page }) => {
    const name = uniqueName();
    await seedRoute(page, name);

    await page.getByRole('button', { name: 'Create New Route' }).click();
    await page.getByRole('button', { name: 'Create Route', exact: true }).last().click();
    await page.locator('#route-name').fill(name.toUpperCase());

    await expect(
      page.getByText('A route with this name already exists. Please enter a different name.'),
    ).toBeVisible();
  });

  test('SR-06 creating a route saves it, toasts, and lists it in the table', async ({ page }) => {
    const name = uniqueName();

    await page.getByRole('button', { name: 'Create New Route' }).click();
    await expect(page.getByText('Rizal Park')).toBeVisible();

    await page.getByRole('button', { name: 'Create Route', exact: true }).last().click();
    await page.locator('#route-name').fill(name);
    await page.getByRole('button', { name: 'Create Route', exact: true }).last().click();

    await expect(page.getByText('Successfully Created Route')).toBeVisible();
    await expect(page.getByRole('cell', { name })).toBeVisible();
  });

  test('SR-07 a saved route survives a full page reload', async ({ page }) => {
    const name = uniqueName();
    await seedRoute(page, name);

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Route Creation' })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole('cell', { name })).toBeVisible();
  });

  test('SR-08 editing a route reopens it in the editor and applies the rename', async ({ page }) => {
    const original = uniqueName('QA before');
    const renamed = uniqueName('QA after');
    await seedRoute(page, original);

    await page.getByTitle('Edit route').first().click();
    await expect(page.getByRole('heading', { name: 'Edit Route' })).toBeVisible();

    const save = page.getByRole('button', { name: 'Save Changes', exact: true });
    await expect(save.last()).toBeEnabled();
    await save.last().click();
    await page.locator('#route-name').fill(renamed);
    await save.last().click();

    await expect(page.getByText('Route updated successfully.')).toBeVisible();
    await expect(page.getByRole('cell', { name: renamed })).toBeVisible();
    await expect(page.getByRole('cell', { name: original })).toHaveCount(0);
  });

  test('SR-09 re-saving an edited route under its own name is allowed', async ({ page }) => {
    const name = uniqueName();
    await seedRoute(page, name);

    await page.getByTitle('Edit route').first().click();
    const save = page.getByRole('button', { name: 'Save Changes', exact: true });
    await expect(save.last()).toBeEnabled();
    await save.last().click();
    await expect(page.locator('#route-name')).toHaveValue(name);

    await expect(
      page.getByText('A route with this name already exists. Please enter a different name.'),
    ).toHaveCount(0);
  });

  test('SR-10 archiving a route removes it from the active list', async ({ page }) => {
    const name = uniqueName();
    await seedRoute(page, name);

    await page.getByTitle('Archive route').first().click();
    await expect(page.getByText('Route archived.')).toBeVisible();
    await expect(page.getByRole('cell', { name })).toHaveCount(0);
  });

  test('SR-11 an archived route appears under the archived tab and can be restored', async ({
    page,
  }) => {
    const name = uniqueName();
    await seedRoute(page, name, true);

    await page.getByRole('button', { name: 'archived' }).click();
    await expect(page.getByRole('cell', { name })).toBeVisible();

    await page.getByTitle('Unarchive route').first().click();
    await expect(page.getByText('Route restored.')).toBeVisible();

    await page.getByRole('button', { name: 'active' }).click();
    await expect(page.getByRole('cell', { name })).toBeVisible();
  });

  test('SR-12 the archived tab shows its own empty state when nothing is archived', async ({
    page,
  }) => {
    await seedRoute(page, uniqueName());
    await page.getByRole('button', { name: 'archived' }).click();
    await expect(page.getByText('No archived routes.')).toBeVisible();
  });

  test('SR-13 deleting a route requires confirmation and can be cancelled', async ({ page }) => {
    const name = uniqueName();
    await seedRoute(page, name);

    await page.getByTitle('Delete route').first().click();
    await expect(page.getByText('Delete route?')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('cell', { name })).toBeVisible();
  });

  test('SR-14 a confirmed delete removes the route and it does not return on reload', async ({
    page,
  }) => {
    const name = uniqueName();
    await seedRoute(page, name);

    await page.getByTitle('Delete route').first().click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText('Route deleted.')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Route Creation' })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole('cell', { name })).toHaveCount(0);
  });

  test('SR-15 the search box filters saved routes by name', async ({ page }) => {
    const keep = uniqueName('QA keepme');
    const hide = uniqueName('QA hideme');
    await seedRoute(page, keep);
    await seedRoute(page, hide);

    await page.getByPlaceholder('Search Route Name or Area/s…').fill('keepme');
    await expect(page.getByRole('cell', { name: keep })).toBeVisible();
    await expect(page.getByRole('cell', { name: hide })).toHaveCount(0);
  });

  test('SR-16 a search with no matches shows the no-results message', async ({ page }) => {
    await seedRoute(page, uniqueName());
    await page.getByPlaceholder('Search Route Name or Area/s…').fill('zzz-no-such-route-zzz');
    await expect(page.getByText('No routes match your search.')).toBeVisible();
  });

  test('SR-17 the refresh control re-reads saved routes from storage', async ({ page }) => {
    const name = uniqueName();
    await writeRoute(page, name, false);

    await page.getByRole('button', { name: 'Refresh saved routes' }).click();
    await expect(page.getByRole('cell', { name })).toBeVisible();
  });

  test('SR-18 saving a route persists it to the backend, not just to this browser', async ({
    page,
  }) => {
    const name = uniqueName();
    const postRequest = page
      .waitForRequest(
        (request) => request.url().includes('/api/routes') && request.method() === 'POST',
        { timeout: 10_000 },
      )
      .catch(() => null);

    await page.getByRole('button', { name: 'Create New Route' }).click();
    await expect(page.getByText('Rizal Park')).toBeVisible();
    await page.getByRole('button', { name: 'Create Route', exact: true }).last().click();
    await page.locator('#route-name').fill(name);
    await page.getByRole('button', { name: 'Create Route', exact: true }).last().click();
    await expect(page.getByText('Successfully Created Route')).toBeVisible();

    expect(
      await postRequest,
      'routes are saved to localStorage only and never reach POST /api/routes (RMS-91)',
    ).not.toBeNull();
  });
});
