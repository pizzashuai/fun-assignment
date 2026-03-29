import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("loads and shows KPI section", async ({ page }) => {
    await page.goto("/dashboard");
    const kpiSection = page.getByTestId("kpi-section");
    await expect(kpiSection).toBeVisible({ timeout: 10_000 });
  });

  test("filter change updates URL query param", async ({ page }) => {
    await page.goto("/dashboard");

    // Open region select and pick Europe
    const regionTrigger = page.getByRole("combobox", { name: /region/i });
    await regionTrigger.click();
    await page.getByRole("option", { name: /europe/i }).click();

    await expect(page).toHaveURL(/region=europe/);
  });

  test("clicking customer row navigates to detail page", async ({ page }) => {
    await page.goto("/dashboard");

    // Wait for the table to render at least one customer link
    const firstCustomerLink = page.getByRole("link").filter({ hasText: /corp|industries|initech|umbrella|hooli|massive|stark|rekall/i }).first();
    await expect(firstCustomerLink).toBeVisible({ timeout: 10_000 });

    const href = await firstCustomerLink.getAttribute("href");
    await firstCustomerLink.click();

    await expect(page).toHaveURL(/\/customers\//);
    // Confirm we landed on a customer detail page
    await expect(page.getByRole("link", { name: /back to dashboard/i })).toBeVisible();
    void href;
  });
});
