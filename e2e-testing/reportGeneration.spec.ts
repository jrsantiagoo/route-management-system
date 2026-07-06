// Session comes from auth.setup.ts via storageState.
import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Report Generation", () => {
    test.setTimeout(60000);
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
    });

    test("displays all required metrics on the dashboard without downloading PDF", async ({
        page,
    }) => {
        await expect(page.getByText("Total Successful Trips")).toBeVisible();
        await expect(page.getByText("Efficiency")).toBeVisible();
        await expect(page.getByText("Delivered Orders")).toBeVisible();
        await expect(
            page.getByText("Average Distance per Order (km)"),
        ).toBeVisible();
        await expect(
            page.getByText("Average Fuel Usage per Order (L)"),
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Full Summary" }),
        ).toBeVisible();
    });

    test("Full Summary button triggers a PDF download with correct filename", async ({
        page,
    }) => {
        const downloadPromise = page.waitForEvent("download");
        await page.getByRole("button", { name: "Full Summary" }).click();
        const download = await downloadPromise;
        const filename = download.suggestedFilename();
        expect(filename).toMatch(/\.pdf$/i);
        expect(filename).toContain("Route Management Statistics");
    });

    test.fixme("generates a daily PDF report with correct metrics and date", async () => {});

    test.fixme("generates a weekly PDF report with aggregated metrics and correct date range", async () => {});

    test.fixme("generates a report explicitly showing zero values when no trips are completed", async () => {});

    test.fixme("reflects only completed trips in metrics and lists incomplete trips separately", async () => {});

    test.fixme("upper management can download the PDF report successfully", async () => {});
});
