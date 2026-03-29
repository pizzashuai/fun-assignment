import { describe, it, expect } from "vitest";
import { buildAnalyticsPayload } from "@/features/dashboard/data/transforms";
import type { DashboardFilters } from "@/features/dashboard/types";

const defaultFilters: DashboardFilters = {
  dateRange: "30d",
  region: "global",
  segment: "enterprise",
  feature: "all",
};

describe("buildAnalyticsPayload", () => {
  it("returns 5 KPI metrics", () => {
    const result = buildAnalyticsPayload(defaultFilters);
    expect(result.kpis).toHaveLength(5);
  });

  it("includes expected KPI ids", () => {
    const result = buildAnalyticsPayload(defaultFilters);
    const ids = result.kpis.map((k) => k.id);
    expect(ids).toContain("mau");
    expect(ids).toContain("dau");
    expect(ids).toContain("retention");
    expect(ids).toContain("conversion");
    expect(ids).toContain("errorRate");
  });

  it("returns 30 trend points for 30d filter", () => {
    const result = buildAnalyticsPayload({ ...defaultFilters, dateRange: "30d" });
    expect(result.usageTrend).toHaveLength(30);
  });

  it("returns 7 trend points for 7d filter", () => {
    const result = buildAnalyticsPayload({ ...defaultFilters, dateRange: "7d" });
    expect(result.usageTrend).toHaveLength(7);
  });

  it("filters topCustomers by region", () => {
    const result = buildAnalyticsPayload({ ...defaultFilters, region: "europe" });
    for (const customer of result.topCustomers) {
      expect(customer.region).toBe("europe");
    }
  });

  it("returns breakdown with dimension and items", () => {
    const result = buildAnalyticsPayload(defaultFilters);
    expect(result.breakdown.dimension).toBeTruthy();
    expect(result.breakdown.items.length).toBeGreaterThan(0);
  });

  it("returns breakdowns for device, browser, and platform", () => {
    const result = buildAnalyticsPayload(defaultFilters);
    expect(result.breakdowns.device.dimension).toBe("Device");
    expect(result.breakdowns.browser.dimension).toBe("Browser");
    expect(result.breakdowns.platform.dimension).toBe("Platform");
    for (const b of [result.breakdowns.device, result.breakdowns.browser, result.breakdowns.platform]) {
      expect(b.items.length).toBeGreaterThan(0);
    }
  });

  it("includes featureAdoption array", () => {
    const result = buildAnalyticsPayload(defaultFilters);
    expect(Array.isArray(result.featureAdoption)).toBe(true);
  });

  it("reflects applied filters in the response", () => {
    const result = buildAnalyticsPayload({ ...defaultFilters, region: "europe" });
    expect(result.filters.region).toBe("europe");
  });
});
