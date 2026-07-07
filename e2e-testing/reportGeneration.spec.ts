import { test, expect } from "@playwright/test";

// Test script 04-ReportGeneration — /dashboard summary and Full Summary PDF.

const BASE_URL = "http://localhost:3000";

test.describe("Report Generation", () => {
    test.setTimeout(60000);

    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await expect(
            page.getByRole("heading", { name: "Dashboard" }),
        ).toBeVisible({ timeout: 30000 });
    });

    // Case 4-3: In-App Summary Report
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

    test("switching date-range preset keeps metrics rendered", async ({
        page,
    }) => {
        await page
            .getByRole("button", { name: /This Week|This Month|Today|All Time/ })
            .first()
            .click();
        await page.getByRole("button", { name: "Today", exact: true }).click();
        await expect(page.getByText("Total Successful Trips")).toBeVisible();
        await expect(page.getByText("Delivered Orders")).toBeVisible();
        await expect(page.getByText("Efficiency")).toBeVisible();
    });

    test.fixme("PDF stat values match the on-screen dashboard values", async ({ page }) => {
            const readCard = async (title: string): Promise<string> => {
                const card = page
                    .locator("div")
                    .filter({ hasText: new RegExp(`^${title}`) })
                    .filter({ has: page.locator("p.text-3xl") })
                    .last();
                const raw = (
                    await card.locator("p.text-3xl").first().innerText()
                ).trim();
                return raw.replace(/[^\d]/g, "");
            };

            const dispTrips = await readCard("Total Successful Trips");
            const dispEff = await readCard("Efficiency");
            const dispDelivered = await readCard("Delivered Orders");

            const downloadPromise = page.waitForEvent("download");
            await page.getByRole("button", { name: "Full Summary" }).click();
            const download = await downloadPromise;

            const fs = await import("node:fs/promises");
            const buf = await fs.readFile(await download.path());
            const raw = buf.toString("latin1");

            const literals: string[] = [];
            const re = /\(((?:\\.|[^\\()])*)\)\s*Tj/g;
            let m: RegExpExecArray | null;
            while ((m = re.exec(raw)) !== null) {
                literals.push(m[1].replace(/\\([()\\])/g, "$1"));
            }
            const pdfText = literals.join(" ");

            expect(pdfText, `PDF missing displayed Total Trips "${dispTrips}"`).toContain(dispTrips);
            expect(pdfText, `PDF missing displayed Efficiency "${dispEff}%"`).toContain(`${dispEff}%`);
            expect(pdfText, `PDF missing displayed Delivered "${dispDelivered}"`).toContain(dispDelivered);
        },
    );

    // Case 4-1
    test.fixme(
        "generates a daily PDF report with correct metrics and date",
        async () => {},
    );

    // Case 4-2
    test.fixme(
        "generates a weekly PDF report with aggregated metrics and correct date range",
        async () => {},
    );

    // Case 4-4: blocked
    test.fixme(
        "generates a report explicitly showing zero values when no trips are completed",
        async () => {},
    );

    // Case 4-5
    test.fixme(
        "reflects only completed trips in metrics and lists incomplete trips separately",
        async () => {},
    );

    // Case 4-6
    test.fixme(
        "upper management can download the PDF report successfully",
        async () => {},
    );
});
