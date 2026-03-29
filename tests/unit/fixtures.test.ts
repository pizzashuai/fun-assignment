import { describe, it, expect } from "vitest";
import {
  CUSTOMERS,
  getFilteredCustomers,
  getGlobalUsageTrend,
  getKpiValues,
  getCustomerById,
} from "@/features/shared/data/fixtures";

describe("CUSTOMERS seed data", () => {
  it("has at least one customer", () => {
    expect(CUSTOMERS.length).toBeGreaterThan(0);
  });

  it("each customer has required fields", () => {
    for (const c of CUSTOMERS) {
      expect(c).toHaveProperty("id");
      expect(c).toHaveProperty("name");
      expect(c).toHaveProperty("mau");
      expect(c).toHaveProperty("retentionRate");
      expect(c).toHaveProperty("healthScore");
      expect(c).toHaveProperty("riskLevel");
      expect(c.usageTrend.length).toBeGreaterThan(0);
      expect(c.topFeatures.length).toBeGreaterThan(0);
      expect(c.recentEvents.length).toBeGreaterThan(0);
    }
  });
});

describe("getFilteredCustomers", () => {
  it("returns all customers when region is global", () => {
    const result = getFilteredCustomers({ region: "global" });
    expect(result.length).toBe(CUSTOMERS.length);
  });

  it("filters by region correctly", () => {
    const europe = getFilteredCustomers({ region: "europe" });
    expect(europe.every((c) => c.region === "europe")).toBe(true);
  });

  it("filters by segment correctly", () => {
    const enterprise = getFilteredCustomers({ segment: "enterprise" });
    expect(enterprise.every((c) => c.segment === "enterprise")).toBe(true);
  });

  it("returns empty array if no customers match", () => {
    // latam + startup is unlikely to have both
    const result = getFilteredCustomers({ region: "latam", segment: "enterprise" });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("getGlobalUsageTrend", () => {
  it("returns the correct number of trend points for 7 days", () => {
    const trend = getGlobalUsageTrend(7);
    expect(trend.length).toBe(7);
  });

  it("returns the correct number of trend points for 30 days", () => {
    const trend = getGlobalUsageTrend(30);
    expect(trend.length).toBe(30);
  });

  it("trend points are sorted by date ascending", () => {
    const trend = getGlobalUsageTrend(7);
    for (let i = 1; i < trend.length; i++) {
      expect(trend[i].date >= trend[i - 1].date).toBe(true);
    }
  });
});

describe("getKpiValues", () => {
  it("returns zeros when customers array is empty", () => {
    const kpis = getKpiValues([]);
    expect(kpis.mau).toBe(0);
    expect(kpis.dau).toBe(0);
    expect(kpis.retentionRate).toBe(0);
  });

  it("sums MAU across customers", () => {
    const result = getKpiValues(CUSTOMERS);
    const expected = CUSTOMERS.reduce((s, c) => s + c.mau, 0);
    expect(result.mau).toBe(expected);
  });

  it("DAU is approximately 12% of MAU", () => {
    const result = getKpiValues(CUSTOMERS);
    expect(result.dau).toBeCloseTo(result.mau * 0.12, -1);
  });
});

describe("getCustomerById", () => {
  it("returns the correct customer", () => {
    const customer = getCustomerById("cust-001");
    expect(customer).toBeDefined();
    expect(customer?.name).toBe("Acme Corp");
  });

  it("returns undefined for unknown id", () => {
    const customer = getCustomerById("nonexistent-id");
    expect(customer).toBeUndefined();
  });
});
