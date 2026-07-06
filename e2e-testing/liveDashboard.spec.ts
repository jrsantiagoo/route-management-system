import { test, expect } from "@playwright/test";

// Test script 05-LiveDashboard — /dashboard metrics and date-range picker.
// 5-2 is fixme (DD-08); the three time metrics of 5-3 are missing (DD-07).

const BASE_URL = "http://localhost:3000";

// The five metric labels the dashboard renders today.
const EXISTING_METRICS = [
    "Total Successful Trips",
    "Efficiency",
    "Delivered Orders",
    "Average Distance per Order (km)",
    "Average Fuel Usage per Order (L)",
];

test.describe("Live Dashboard", () => {
    test.setTimeout(60000);

    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
    });

    // Case 5-1: Dashboard Load
    test("dashboard loads with title and metric panels visible", async ({
        page,
    }) => {
        await expect(
            page.getByRole("heading", { name: "Dashboard" }),
        ).toBeVisible();

        for (const label of EXISTING_METRICS) {
            await expect(page.getByText(label, { exact: true })).toBeVisible();
        }

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

        // TODO once the DD-07 time metrics ship:
        // await expect(page.getByText("Total Trip Time")).toBeVisible();
        // await expect(page.getByText("Average time per stop")).toBeVisible();
    });

    test("switching the date-range preset updates the active range label", async ({
        page,
    }) => {
        await page.getByRole("button", { name: "This Week" }).click();
        await page.getByRole("button", { name: "This Month" }).click();

        // Preset clicks leave the popover open (RMS-81); dismiss it so only
        // the trigger button matches.
        await page.getByRole("heading", { name: "Dashboard" }).click();

        await expect(
            page.getByRole("button", { name: "This Month" }),
        ).toBeVisible();

        // Metrics survive the refetch.
        await expect(
            page.getByText("Total Successful Trips", { exact: true }),
        ).toBeVisible();
    });

    // Case 5-2: blocked — no polling/websocket (DD-08)
    test.fixme(
        "metrics update in real time after a delivery is completed (no manual refresh)",
        async () => {},
    );
});
