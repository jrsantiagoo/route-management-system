import { test, expect, Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

const MANAGER_EMAIL = process.env.TEST_MANAGER_EMAIL ?? "manager@example.com";
const MANAGER_PASSWORD = process.env.TEST_MANAGER_PASSWORD ?? "password";

async function login(page: Page): Promise<void> {
    await page.goto(BASE_URL);
    await page.locator("#email").fill(MANAGER_EMAIL);
    await page.locator("#password").fill(MANAGER_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL("**/dashboard");
}

test.describe("Emergency Driver Ping", () => {
    test.fixme("identifies most available driver and updates their route for a valid emergency stop", async ({
        page,
    }) => {});

    test.fixme("displays no-driver-available message when all drivers are at max capacity", async ({
        page,
    }) => {});
});
