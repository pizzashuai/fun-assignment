import { defineConfig, devices } from "@playwright/test";

/** Dedicated port so `next dev` on 3000 does not block e2e (see webServer below). */
const e2eBaseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3002";
const useLocalWebServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: e2eBaseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Production server: Radix Select + Playwright do not open the menu reliably under `next dev` (Turbopack/HMR).
  ...(useLocalWebServer
    ? {
        webServer: {
          command: "npm run build && npx next start -p 3002",
          url: e2eBaseURL,
          reuseExistingServer: false,
          timeout: 300 * 1000,
        },
      }
    : {}),
});
