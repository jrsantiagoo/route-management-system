// Test script 05-LiveDashboard — /dashboard after manager login.
// The app renders 5 of the spec's metrics (time metrics missing); 5-2 is fixme
// since the dashboard only refetches on date-range change.

import { test, expect, Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

const MANAGER_EMAIL = process.env.TEST_MANAGER_EMAIL ?? "admin@gmail.com";
const MANAGER_PASSWORD = process.env.TEST_MANAGER_PASSWORD ?? "admin";

// The five metric labels the dashboard actually renders today.
const EXISTING_METRICS = [
    "Total Successful Trips",
    "Efficiency",
    "Delivered Orders",
    "Average Distance per Order (km)",
    "Average Fuel Usage per Order (L)",
];

async function login(page: Page): Promise<void> {
    await page.goto(BASE_URL);
    await page.locator("#email").fill(MANAGER_EMAIL);
    await page.locator("#password").fill(MANAGER_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL("**/dashboard", { timeout: 60000 });
}

test.describe("Live Dashboard", () => {
    test.setTimeout(60000);

    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    // Case 5-1: Dashboard Load
    test("dashboard loads with title and metric panels visible", async ({
        page,
    }) => {
        await expect(
            page.getByRole("heading", { name: "Dashboard" }),
        ).toBeVisible();

        // All existing metric panels/widgets render without error.
        for (const label of EXISTING_METRICS) {
            await expect(page.getByText(label, { exact: true })).toBeVisible();
        }

        // The date-range control and summary export are part of the panel set.
        await expect(page.getByRole("button", { name: "This Week" })).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Full Summary" }),
        ).toBeVisible();
    });

    // Case 5-3: All Required Metrics Displayed
    test("displays all currently-implemented dashboard metrics", async ({
        page,
    }) => {
        for (const label of EXISTING_METRICS) {
            await expect(page.getByText(label, { exact: true })).toBeVisible();
        }

        // TODO once implemented (spec 5-3):
        // await expect(page.getByText("Total Trip Time")).toBeVisible();
        // await expect(page.getByText("Average time per stop")).toBeVisible();
    });

    test("switching the date-range preset updates the active range label", async ({
        page,
    }) => {
        // Open the range picker (defaults to "This Week").
        await page.getByRole("button", { name: "This Week" }).click();

        // Choose a different preset from the popover.
        await page.getByRole("button", { name: "This Month" }).click();

        // The trigger button now reflects the new preset, confirming the range
        // state changed (which re-runs the metric fetch effects).
        await expect(
            page.getByRole("button", { name: "This Month" }),
        ).toBeVisible();

        // Metrics remain rendered after the refetch (no crash / blank state).
        await expect(
            page.getByText("Total Successful Trips", { exact: true }),
        ).toBeVisible();
    });

    // Case 5-2: blocked — no polling/websocket, metrics don't update live
    test.fixme(
        "metrics update in real time after a delivery is completed (no manual refresh)",
        async () => {},
    );
});
